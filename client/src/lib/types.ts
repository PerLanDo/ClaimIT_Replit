export type UserRole = "student" | "faculty" | "staff" | "sid_admin";

export type ItemStatus =
  | "open"
  | "pending_claim"
  | "returned"
  | "surrendered_sid"
  | "archived"
  | "disposed";

export type ItemCategory =
  | "electronics"
  | "wallets"
  | "keys"
  | "ids_cards"
  | "clothing"
  | "bags"
  | "books"
  | "tumblers"
  | "umbrellas"
  | "other";

export type ClaimStatus = "pending" | "approved" | "rejected" | "completed";

export type NotificationType =
  | "claim_update"
  | "new_message"
  | "item_match"
  | "turnover_reminder"
  | "system";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  reputationScore: number;
  department?: string | null;
  createdAt: Date;
}

export interface Item {
  id: string;
  reporterId: string;
  type: "lost" | "found";
  category: ItemCategory;
  status: ItemStatus;
  title: string;
  description: string;
  location: string;
  imageUrls: string[];
  isHighValue: boolean;
  dateReported: Date;
  dateLostFound: Date;
  qrCode?: string | null;
  turnoverToSID: boolean;
}

export interface Claim {
  id: string;
  itemId: string;
  claimantId: string;
  status: ClaimStatus;
  proofDescription: string;
  proofImageUrl?: string | null;
  dateFiled: Date;
  reviewedBy?: string | null;
  reviewNotes?: string | null;
  handoverQrCode?: string | null;
}

export interface Message {
  id: string;
  itemId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Conversation {
  itemId: string;
  otherUserId: string;
  lastMessage: Message;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  content: string;
  relatedItemId?: string | null;
  isRead: boolean;
  timestamp: Date;
}

export interface TurnoverLog {
  id: string;
  itemId: string;
  officerId: string;
  dateReceived: Date;
  dateReleased?: Date | null;
  remarks?: string | null;
}
