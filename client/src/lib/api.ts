import type {
  Item,
  Claim,
  Message,
  Notification,
  Conversation,
  TurnoverLog,
} from "./types";

const API_BASE = "/api";

// Helper to get user ID from localStorage
function getUserId(): string | null {
  return localStorage.getItem("claimit_user_id");
}

// Helper for authenticated requests
function getHeaders(): HeadersInit {
  const userId = getUserId();
  return {
    "Content-Type": "application/json",
    ...(userId && { "x-user-id": userId }),
  };
}

// ===== Item API =====

export async function getItems(filters?: {
  type?: "lost" | "found";
  status?: string;
  category?: string;
  search?: string;
}): Promise<Item[]> {
  const params = new URLSearchParams();
  if (filters?.type) params.append("type", filters.type);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.category) params.append("category", filters.category);
  if (filters?.search) params.append("search", filters.search);

  const response = await fetch(`${API_BASE}/items?${params}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }

  const { items } = await response.json();
  return items.map((item: any) => ({
    ...item,
    dateReported: new Date(item.dateReported),
    dateLostFound: new Date(item.dateLostFound),
  }));
}

export async function getItem(id: string): Promise<Item> {
  const response = await fetch(`${API_BASE}/items/${id}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch item");
  }

  const { item } = await response.json();
  return {
    ...item,
    dateReported: new Date(item.dateReported),
    dateLostFound: new Date(item.dateLostFound),
  };
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

  const response = await fetch(`${API_BASE}/items`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      ...data,
      reporterId: userId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create item");
  }

  const { item } = await response.json();
  return {
    ...item,
    dateReported: new Date(item.dateReported),
    dateLostFound: new Date(item.dateLostFound),
  };
}

export async function updateItemStatus(
  id: string,
  status: string
): Promise<Item> {
  const response = await fetch(`${API_BASE}/items/${id}/status`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Failed to update item status");
  }

  const { item } = await response.json();
  return {
    ...item,
    dateReported: new Date(item.dateReported),
    dateLostFound: new Date(item.dateLostFound),
  };
}

// ===== Claim API =====

export async function getClaims(params: {
  itemId?: string;
  claimantId?: string;
}): Promise<Claim[]> {
  const queryParams = new URLSearchParams();
  if (params.itemId) queryParams.append("itemId", params.itemId);
  if (params.claimantId) queryParams.append("claimantId", params.claimantId);

  const response = await fetch(`${API_BASE}/claims?${queryParams}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch claims");
  }

  const { claims } = await response.json();
  return claims.map((claim: any) => ({
    ...claim,
    dateFiled: new Date(claim.dateFiled),
  }));
}

export async function createClaim(data: {
  itemId: string;
  proofDescription: string;
  proofImageUrl?: string;
}): Promise<Claim> {
  const userId = getUserId();
  if (!userId) throw new Error("User not authenticated");

  const response = await fetch(`${API_BASE}/claims`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      ...data,
      claimantId: userId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create claim");
  }

  const { claim } = await response.json();
  return {
    ...claim,
    dateFiled: new Date(claim.dateFiled),
  };
}

export async function approveClaim(
  id: string,
  reviewNotes?: string
): Promise<Claim> {
  const userId = getUserId();
  if (!userId) throw new Error("User not authenticated");

  const response = await fetch(`${API_BASE}/claims/${id}/approve`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({
      reviewedBy: userId,
      reviewNotes,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to approve claim");
  }

  const { claim } = await response.json();
  return {
    ...claim,
    dateFiled: new Date(claim.dateFiled),
  };
}

export async function rejectClaim(
  id: string,
  reviewNotes?: string
): Promise<Claim> {
  const userId = getUserId();
  if (!userId) throw new Error("User not authenticated");

  const response = await fetch(`${API_BASE}/claims/${id}/reject`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({
      reviewedBy: userId,
      reviewNotes,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to reject claim");
  }

  const { claim } = await response.json();
  return {
    ...claim,
    dateFiled: new Date(claim.dateFiled),
  };
}

export async function completeClaim(
  id: string,
  scannedQR: string
): Promise<Claim> {
  const response = await fetch(`${API_BASE}/claims/${id}/complete`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ scannedQR }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to complete claim");
  }

  const { claim } = await response.json();
  return {
    ...claim,
    dateFiled: new Date(claim.dateFiled),
  };
}

// ===== Message API =====

export async function getConversations(): Promise<Conversation[]> {
  const response = await fetch(`${API_BASE}/messages/conversations`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch conversations");
  }

  const { conversations } = await response.json();
  return conversations.map((conv: any) => ({
    ...conv,
    lastMessage: {
      ...conv.lastMessage,
      timestamp: new Date(conv.lastMessage.timestamp),
    },
  }));
}

export async function getMessages(
  itemId: string,
  otherUserId: string
): Promise<Message[]> {
  const response = await fetch(
    `${API_BASE}/messages/${itemId}/${otherUserId}`,
    {
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  const { messages } = await response.json();
  return messages.map((msg: any) => ({
    ...msg,
    timestamp: new Date(msg.timestamp),
  }));
}

export async function sendMessage(data: {
  itemId: string;
  receiverId: string;
  content: string;
}): Promise<Message> {
  const userId = getUserId();
  if (!userId) throw new Error("User not authenticated");

  const response = await fetch(`${API_BASE}/messages`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      ...data,
      senderId: userId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  const { message } = await response.json();
  return {
    ...message,
    timestamp: new Date(message.timestamp),
  };
}

export async function markMessageAsRead(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/messages/${id}/read`, {
    method: "PATCH",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to mark message as read");
  }
}

// ===== Notification API =====

export async function getNotifications(): Promise<Notification[]> {
  const response = await fetch(`${API_BASE}/notifications`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  const { notifications } = await response.json();
  return notifications.map((notif: any) => ({
    ...notif,
    timestamp: new Date(notif.timestamp),
  }));
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/notifications/${id}/read`, {
    method: "PATCH",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }
}

// ===== Admin API =====

export async function getAdminStats(): Promise<{
  totalItems: number;
  pendingClaims: number;
  returned: number;
  recoveryRate: string;
}> {
  const response = await fetch(`${API_BASE}/admin/stats`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch admin stats");
  }

  const { stats } = await response.json();
  return stats;
}

export async function getTurnoverLogs(
  officerId: string
): Promise<TurnoverLog[]> {
  const response = await fetch(
    `${API_BASE}/turnover-logs?officerId=${officerId}`,
    {
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch turnover logs");
  }

  const { logs } = await response.json();
  return logs.map((log: any) => ({
    ...log,
    dateReceived: new Date(log.dateReceived),
    dateReleased: log.dateReleased ? new Date(log.dateReleased) : null,
  }));
}

export async function createTurnoverLog(data: {
  itemId: string;
  remarks?: string;
}): Promise<TurnoverLog> {
  const userId = getUserId();
  if (!userId) throw new Error("User not authenticated");

  const response = await fetch(`${API_BASE}/turnover-logs`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      ...data,
      officerId: userId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create turnover log");
  }

  const { log } = await response.json();
  return {
    ...log,
    dateReceived: new Date(log.dateReceived),
    dateReleased: log.dateReleased ? new Date(log.dateReleased) : null,
  };
}

export async function releaseTurnover(
  id: string,
  remarks?: string
): Promise<TurnoverLog> {
  const response = await fetch(`${API_BASE}/turnover-logs/${id}/release`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ remarks }),
  });

  if (!response.ok) {
    throw new Error("Failed to release item");
  }

  const { log } = await response.json();
  return {
    ...log,
    dateReceived: new Date(log.dateReceived),
    dateReleased: log.dateReleased ? new Date(log.dateReleased) : null,
  };
}
