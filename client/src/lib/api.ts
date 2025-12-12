import type {
  Item,
  Claim,
  Message,
  Notification,
  Conversation,
  TurnoverLog,
} from "./types";
import * as firebaseService from "./firebaseService";

// Helper to get user ID from localStorage
function getUserId(): string | null {
  return localStorage.getItem("claimit_user_id");
}

// ===== Item API =====

export async function getItems(filters?: {
  type?: "lost" | "found";
  status?: string;
  category?: string;
  search?: string;
}): Promise<Item[]> {
  return await firebaseService.getItems(filters);
}

export async function getItem(id: string): Promise<Item> {
  const item = await firebaseService.getItem(id);
  if (!item) {
    throw new Error("Item not found");
  }
  return item;
}

export async function createItem(data: {
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
  const userId = getUserId();
  if (!userId) throw new Error("User not authenticated");

  return await firebaseService.createItem({
    ...data,
    reporterId: userId,
  });
}

export async function updateItemStatus(
  id: string,
  status: string
): Promise<Item> {
  return await firebaseService.updateItemStatus(id, status);
}

// ===== Claim API =====

export async function getClaims(params: {
  itemId?: string;
  claimantId?: string;
}): Promise<Claim[]> {
  return await firebaseService.getClaims(params);
}

export async function createClaim(data: {
  itemId: string;
  proofDescription: string;
  proofImageUrl?: string;
}): Promise<Claim> {
  const userId = getUserId();
  if (!userId) throw new Error("User not authenticated");

  return await firebaseService.createClaim({
    ...data,
    claimantId: userId,
  });
}

export async function approveClaim(
  id: string,
  reviewNotes?: string
): Promise<Claim> {
  const userId = getUserId();
  if (!userId) throw new Error("User not authenticated");

  return await firebaseService.approveClaim(id, userId, reviewNotes);
}

export async function rejectClaim(
  id: string,
  reviewNotes?: string
): Promise<Claim> {
  const userId = getUserId();
  if (!userId) throw new Error("User not authenticated");

  return await firebaseService.rejectClaim(id, userId, reviewNotes);
}

export async function completeClaim(
  id: string,
  scannedQR: string
): Promise<Claim> {
  return await firebaseService.completeClaim(id, scannedQR);
}

// ===== Message API =====

export async function getConversations(): Promise<Conversation[]> {
  const userId = getUserId();
  if (!userId) throw new Error("User not authenticated");

  return await firebaseService.getConversations(userId);
}

export async function getMessages(
  itemId: string,
  otherUserId: string
): Promise<Message[]> {
  const userId = getUserId();
  if (!userId) throw new Error("User not authenticated");

  return await firebaseService.getMessages(itemId, otherUserId, userId);
}

export async function sendMessage(data: {
  itemId: string;
  receiverId: string;
  content: string;
}): Promise<Message> {
  const userId = getUserId();
  if (!userId) throw new Error("User not authenticated");

  return await firebaseService.sendMessage({
    ...data,
    senderId: userId,
  });
}

export async function markMessageAsRead(id: string): Promise<void> {
  await firebaseService.markMessageAsRead(id);
}

// ===== Notification API =====

export async function getNotifications(): Promise<Notification[]> {
  const userId = getUserId();
  if (!userId) throw new Error("User not authenticated");

  return await firebaseService.getNotifications(userId);
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await firebaseService.markNotificationAsRead(id);
}

// ===== Admin API =====

export async function getAdminStats(): Promise<{
  totalItems: number;
  pendingClaims: number;
  returned: number;
  recoveryRate: string;
}> {
  return await firebaseService.getAdminStats();
}

export async function getTurnoverLogs(
  officerId: string
): Promise<TurnoverLog[]> {
  return await firebaseService.getTurnoverLogs(officerId);
}

export async function createTurnoverLog(data: {
  itemId: string;
  remarks?: string;
}): Promise<TurnoverLog> {
  const userId = getUserId();
  if (!userId) throw new Error("User not authenticated");

  return await firebaseService.createTurnoverLog({
    ...data,
    officerId: userId,
  });
}

export async function releaseTurnover(
  id: string,
  remarks?: string
): Promise<TurnoverLog> {
  return await firebaseService.releaseTurnover(id, remarks);
}
