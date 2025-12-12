export type UserRole = 'student' | 'faculty' | 'staff' | 'sid_admin';

export type ItemStatus = 'lost' | 'found' | 'pending_claim' | 'claimed' | 'returned' | 'expired';

export type ItemCategory = 
  | 'electronics' 
  | 'wallet' 
  | 'keys' 
  | 'documents' 
  | 'clothing' 
  | 'accessories' 
  | 'bags' 
  | 'books' 
  | 'other';

export type ClaimStatus = 'pending' | 'approved' | 'rejected';

export type NotificationType = 'claim_submitted' | 'claim_approved' | 'claim_rejected' | 'new_message' | 'item_match';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  reputationScore: number;
  department?: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  status: ItemStatus;
  type: 'lost' | 'found';
  location: string;
  date: Date;
  photos: string[];
  reporterId: string;
  reporterName: string;
  reporterAvatar?: string;
  qrCode?: string;
  turnoverToSID: boolean;
  createdAt: Date;
}

export interface Claim {
  id: string;
  itemId: string;
  claimantId: string;
  claimantName: string;
  claimantAvatar?: string;
  proofDescription: string;
  proofImage?: string;
  status: ClaimStatus;
  reviewNotes?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  itemId: string;
  itemTitle: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  itemId?: string;
  read: boolean;
  createdAt: Date;
}
