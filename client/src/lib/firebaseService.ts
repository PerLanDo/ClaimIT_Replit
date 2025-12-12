import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch,
  increment,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import type {
  Item,
  Claim,
  Message,
  Notification,
  Conversation,
  TurnoverLog,
} from "./types";

// Collection names
const COLLECTIONS = {
  USERS: "users",
  ITEMS: "items",
  CLAIMS: "claims",
  MESSAGES: "messages",
  NOTIFICATIONS: "notifications",
  TURNOVER_LOGS: "turnoverLogs",
};

// Helper to convert Firestore timestamp to Date
function convertTimestamps(data: DocumentData): any {
  const converted = { ...data };
  Object.keys(converted).forEach((key) => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    }
  });
  return converted;
}

// ===== User Operations =====

export async function getUser(id: string) {
  const docRef = doc(db, COLLECTIONS.USERS, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...convertTimestamps(docSnap.data()) };
  }
  return null;
}

export async function getUserByEmail(email: string) {
  const q = query(
    collection(db, COLLECTIONS.USERS),
    where("email", "==", email)
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...convertTimestamps(doc.data()) };
  }
  return null;
}

export async function createUser(userData: {
  email: string;
  fullName: string;
  role: string;
  department?: string;
}) {
  const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
    ...userData,
    reputationScore: 0,
    createdAt: Timestamp.now(),
  });
  const newDoc = await getDoc(docRef);
  return { id: newDoc.id, ...convertTimestamps(newDoc.data()!) };
}

export async function updateUserReputation(id: string, delta: number) {
  const docRef = doc(db, COLLECTIONS.USERS, id);
  await updateDoc(docRef, {
    reputationScore: increment(delta),
  });
  const updatedDoc = await getDoc(docRef);
  return { id: updatedDoc.id, ...convertTimestamps(updatedDoc.data()!) };
}

// ===== Item Operations =====

export async function getItems(filters?: {
  type?: "lost" | "found";
  status?: string;
  category?: string;
  search?: string;
}): Promise<Item[]> {
  let q = query(collection(db, COLLECTIONS.ITEMS));

  // Apply filters
  if (filters?.type) {
    q = query(q, where("type", "==", filters.type));
  }
  if (filters?.status) {
    q = query(q, where("status", "==", filters.status));
  }
  if (filters?.category) {
    q = query(q, where("category", "==", filters.category));
  }

  // Order by date
  q = query(q, orderBy("dateReported", "desc"));

  const querySnapshot = await getDocs(q);
  let items = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as Item[];

  // Apply search filter client-side (Firestore doesn't support full-text search)
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
    );
  }

  return items;
}

export async function getItem(id: string): Promise<Item | null> {
  const docRef = doc(db, COLLECTIONS.ITEMS, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...convertTimestamps(docSnap.data()) } as Item;
  }
  return null;
}

export async function createItem(itemData: {
  reporterId: string;
  type: "lost" | "found";
  category: string;
  title: string;
  description: string;
  location: string;
  dateLostFound: Date;
  imageUrls: string[];
  isHighValue: boolean;
  turnoverToSID: boolean;
}): Promise<Item> {
  const docRef = await addDoc(collection(db, COLLECTIONS.ITEMS), {
    ...itemData,
    dateLostFound: Timestamp.fromDate(itemData.dateLostFound),
    status: "open",
    dateReported: Timestamp.now(),
    qrCode: null,
  });

  // Generate QR code after creation
  const qrCode = `CLAIMIT-${docRef.id}`;
  await updateDoc(docRef, { qrCode });

  const newDoc = await getDoc(docRef);
  return { id: newDoc.id, ...convertTimestamps(newDoc.data()!) } as Item;
}

export async function updateItemStatus(
  id: string,
  status: string
): Promise<Item> {
  const docRef = doc(db, COLLECTIONS.ITEMS, id);
  await updateDoc(docRef, { status });
  const updatedDoc = await getDoc(docRef);
  return { id: updatedDoc.id, ...convertTimestamps(updatedDoc.data()!) } as Item;
}

// ===== Claim Operations =====

export async function getClaims(params: {
  itemId?: string;
  claimantId?: string;
}): Promise<Claim[]> {
  let q = query(collection(db, COLLECTIONS.CLAIMS));

  if (params.itemId) {
    q = query(q, where("itemId", "==", params.itemId));
  }
  if (params.claimantId) {
    q = query(q, where("claimantId", "==", params.claimantId));
  }

  q = query(q, orderBy("dateFiled", "desc"));

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as Claim[];
}

export async function createClaim(claimData: {
  itemId: string;
  claimantId: string;
  proofDescription: string;
  proofImageUrl?: string;
}): Promise<Claim> {
  const docRef = await addDoc(collection(db, COLLECTIONS.CLAIMS), {
    ...claimData,
    status: "pending",
    dateFiled: Timestamp.now(),
    reviewedBy: null,
    reviewNotes: null,
    handoverQrCode: null,
  });

  const newDoc = await getDoc(docRef);
  return { id: newDoc.id, ...convertTimestamps(newDoc.data()!) } as Claim;
}

export async function approveClaim(
  id: string,
  reviewedBy: string,
  reviewNotes?: string
): Promise<Claim> {
  const docRef = doc(db, COLLECTIONS.CLAIMS, id);
  const handoverQrCode = `HANDOVER-${id}`;
  
  await updateDoc(docRef, {
    status: "approved",
    reviewedBy,
    reviewNotes: reviewNotes || null,
    handoverQrCode,
  });

  const updatedDoc = await getDoc(docRef);
  return { id: updatedDoc.id, ...convertTimestamps(updatedDoc.data()!) } as Claim;
}

export async function rejectClaim(
  id: string,
  reviewedBy: string,
  reviewNotes?: string
): Promise<Claim> {
  const docRef = doc(db, COLLECTIONS.CLAIMS, id);
  
  await updateDoc(docRef, {
    status: "rejected",
    reviewedBy,
    reviewNotes: reviewNotes || null,
  });

  const updatedDoc = await getDoc(docRef);
  return { id: updatedDoc.id, ...convertTimestamps(updatedDoc.data()!) } as Claim;
}

export async function completeClaim(id: string, scannedQR: string): Promise<Claim> {
  const docRef = doc(db, COLLECTIONS.CLAIMS, id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error("Claim not found");
  }

  const claim = docSnap.data();
  if (claim.handoverQrCode !== scannedQR) {
    throw new Error("Invalid QR code");
  }

  await updateDoc(docRef, {
    status: "completed",
  });

  const updatedDoc = await getDoc(docRef);
  return { id: updatedDoc.id, ...convertTimestamps(updatedDoc.data()!) } as Claim;
}

// ===== Message Operations =====

export async function getConversations(userId: string): Promise<Conversation[]> {
  // Get all messages where user is sender or receiver
  const q = query(
    collection(db, COLLECTIONS.MESSAGES),
    where("senderId", "==", userId)
  );
  const q2 = query(
    collection(db, COLLECTIONS.MESSAGES),
    where("receiverId", "==", userId)
  );

  const [senderSnapshot, receiverSnapshot] = await Promise.all([
    getDocs(q),
    getDocs(q2),
  ]);

  const allMessages = [
    ...senderSnapshot.docs.map((doc) => ({ id: doc.id, ...convertTimestamps(doc.data()) })),
    ...receiverSnapshot.docs.map((doc) => ({ id: doc.id, ...convertTimestamps(doc.data()) })),
  ];

  // Group by conversation (itemId + otherUserId)
  const conversationMap = new Map<string, any>();

  allMessages.forEach((msg: any) => {
    const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
    const key = `${msg.itemId}-${otherUserId}`;

    if (!conversationMap.has(key) || conversationMap.get(key).timestamp < msg.timestamp) {
      conversationMap.set(key, {
        itemId: msg.itemId,
        otherUserId,
        lastMessage: msg,
      });
    }
  });

  return Array.from(conversationMap.values()) as Conversation[];
}

export async function getMessages(
  itemId: string,
  otherUserId: string,
  currentUserId: string
): Promise<Message[]> {
  // Get messages between current user and other user for this item
  const q = query(
    collection(db, COLLECTIONS.MESSAGES),
    where("itemId", "==", itemId),
    orderBy("timestamp", "asc")
  );

  const querySnapshot = await getDocs(q);
  const messages = querySnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...convertTimestamps(doc.data()),
    }))
    .filter(
      (msg: any) =>
        (msg.senderId === currentUserId && msg.receiverId === otherUserId) ||
        (msg.senderId === otherUserId && msg.receiverId === currentUserId)
    );

  return messages as Message[];
}

export async function sendMessage(messageData: {
  itemId: string;
  senderId: string;
  receiverId: string;
  content: string;
}): Promise<Message> {
  const docRef = await addDoc(collection(db, COLLECTIONS.MESSAGES), {
    ...messageData,
    timestamp: Timestamp.now(),
    isRead: false,
  });

  const newDoc = await getDoc(docRef);
  return { id: newDoc.id, ...convertTimestamps(newDoc.data()!) } as Message;
}

export async function markMessageAsRead(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.MESSAGES, id);
  await updateDoc(docRef, {
    isRead: true,
  });
}

// ===== Notification Operations =====

export async function getNotifications(userId: string): Promise<Notification[]> {
  const q = query(
    collection(db, COLLECTIONS.NOTIFICATIONS),
    where("userId", "==", userId),
    orderBy("timestamp", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as Notification[];
}

export async function createNotification(notificationData: {
  userId: string;
  type: string;
  content: string;
  relatedItemId?: string;
}): Promise<Notification> {
  const docRef = await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
    ...notificationData,
    timestamp: Timestamp.now(),
    isRead: false,
  });

  const newDoc = await getDoc(docRef);
  return { id: newDoc.id, ...convertTimestamps(newDoc.data()!) } as Notification;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.NOTIFICATIONS, id);
  await updateDoc(docRef, {
    isRead: true,
  });
}

// ===== Admin Operations =====

export async function getAdminStats(): Promise<{
  totalItems: number;
  pendingClaims: number;
  returned: number;
  recoveryRate: string;
}> {
  const [itemsSnapshot, claimsSnapshot] = await Promise.all([
    getDocs(collection(db, COLLECTIONS.ITEMS)),
    getDocs(collection(db, COLLECTIONS.CLAIMS)),
  ]);

  const items = itemsSnapshot.docs.map((doc) => doc.data());
  const claims = claimsSnapshot.docs.map((doc) => doc.data());

  const totalItems = items.length;
  const pendingClaims = claims.filter((c) => c.status === "pending").length;
  const returned = items.filter((i) => i.status === "returned").length;
  const recoveryRate = totalItems > 0 ? ((returned / totalItems) * 100).toFixed(1) : "0";

  return {
    totalItems,
    pendingClaims,
    returned,
    recoveryRate,
  };
}

export async function getTurnoverLogs(officerId?: string): Promise<TurnoverLog[]> {
  let q = query(
    collection(db, COLLECTIONS.TURNOVER_LOGS),
    orderBy("dateReceived", "desc")
  );

  if (officerId) {
    q = query(q, where("officerId", "==", officerId));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...convertTimestamps(doc.data()),
  })) as TurnoverLog[];
}

export async function createTurnoverLog(logData: {
  itemId: string;
  officerId: string;
  remarks?: string;
}): Promise<TurnoverLog> {
  const docRef = await addDoc(collection(db, COLLECTIONS.TURNOVER_LOGS), {
    ...logData,
    dateReceived: Timestamp.now(),
    dateReleased: null,
  });

  const newDoc = await getDoc(docRef);
  return { id: newDoc.id, ...convertTimestamps(newDoc.data()!) } as TurnoverLog;
}

export async function releaseTurnover(
  id: string,
  remarks?: string
): Promise<TurnoverLog> {
  const docRef = doc(db, COLLECTIONS.TURNOVER_LOGS, id);
  
  await updateDoc(docRef, {
    dateReleased: Timestamp.now(),
    ...(remarks && { remarks }),
  });

  const updatedDoc = await getDoc(docRef);
  return { id: updatedDoc.id, ...convertTimestamps(updatedDoc.data()!) } as TurnoverLog;
}
