import {
  type User,
  type InsertUser,
  type Item,
  type InsertItem,
  type Claim,
  type InsertClaim,
  type Message,
  type InsertMessage,
  type Notification,
  type InsertNotification,
  type TurnoverLog,
  type InsertTurnoverLog,
} from "@shared/schema";
import { randomUUID } from "crypto";

// Storage interface for ClaimIT
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserReputation(id: string, delta: number): Promise<User | undefined>;

  // Item operations
  getItem(id: string): Promise<Item | undefined>;
  getItems(filters?: {
    type?: "lost" | "found";
    status?: string;
    category?: string;
    search?: string;
  }): Promise<Item[]>;
  createItem(item: InsertItem): Promise<Item>;
  updateItemStatus(id: string, status: string): Promise<Item | undefined>;
  updateItemQRCode(id: string, qrCode: string): Promise<Item | undefined>;

  // Claim operations
  getClaim(id: string): Promise<Claim | undefined>;
  getClaimsByItem(itemId: string): Promise<Claim[]>;
  getClaimsByClaimant(claimantId: string): Promise<Claim[]>;
  getClaimsByReviewer(reviewerId: string): Promise<Claim[]>;
  createClaim(claim: InsertClaim): Promise<Claim>;
  updateClaimStatus(
    id: string,
    status: string,
    reviewedBy?: string,
    reviewNotes?: string
  ): Promise<Claim | undefined>;
  updateClaimQRCode(id: string, qrCode: string): Promise<Claim | undefined>;

  // Message operations
  getMessage(id: string): Promise<Message | undefined>;
  getMessagesByConversation(
    itemId: string,
    user1Id: string,
    user2Id: string
  ): Promise<Message[]>;
  getConversationsByUser(
    userId: string
  ): Promise<{ itemId: string; otherUserId: string; lastMessage: Message }[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: string): Promise<Message | undefined>;

  // Notification operations
  getNotification(id: string): Promise<Notification | undefined>;
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<Notification | undefined>;

  // Turnover Log operations
  getTurnoverLog(id: string): Promise<TurnoverLog | undefined>;
  getTurnoverLogsByOfficer(officerId: string): Promise<TurnoverLog[]>;
  getTurnoverLogByItem(itemId: string): Promise<TurnoverLog | undefined>;
  createTurnoverLog(log: InsertTurnoverLog): Promise<TurnoverLog>;
  updateTurnoverRelease(
    id: string,
    remarks?: string
  ): Promise<TurnoverLog | undefined>;
}

// In-memory storage implementation for development
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private items: Map<string, Item>;
  private claims: Map<string, Claim>;
  private messages: Map<string, Message>;
  private notifications: Map<string, Notification>;
  private turnoverLogs: Map<string, TurnoverLog>;

  constructor() {
    this.users = new Map();
    this.items = new Map();
    this.claims = new Map();
    this.messages = new Map();
    this.notifications = new Map();
    this.turnoverLogs = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((u) => u.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role ?? "student",
      department: insertUser.department ?? null,
      reputationScore: 0,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserReputation(
    id: string,
    delta: number
  ): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    user.reputationScore += delta;
    this.users.set(id, user);
    return user;
  }

  // Item operations
  async getItem(id: string): Promise<Item | undefined> {
    return this.items.get(id);
  }

  async getItems(filters?: {
    type?: "lost" | "found";
    status?: string;
    category?: string;
    search?: string;
  }): Promise<Item[]> {
    let items = Array.from(this.items.values());

    if (filters?.type) {
      items = items.filter((i) => i.type === filters.type);
    }
    if (filters?.status) {
      items = items.filter((i) => i.status === filters.status);
    }
    if (filters?.category) {
      items = items.filter((i) => i.category === filters.category);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(search) ||
          i.description.toLowerCase().includes(search)
      );
    }

    return items.sort(
      (a, b) => b.dateReported.getTime() - a.dateReported.getTime()
    );
  }

  async createItem(insertItem: InsertItem): Promise<Item> {
    const id = randomUUID();
    const item: Item = {
      ...insertItem,
      id,
      status: "open",
      isHighValue: insertItem.isHighValue ?? false,
      turnoverToSID: insertItem.turnoverToSID ?? false,
      imageUrls: insertItem.imageUrls ?? [],
      dateReported: new Date(),
      qrCode: null,
    };
    this.items.set(id, item);
    return item;
  }

  async updateItemStatus(
    id: string,
    status: string
  ): Promise<Item | undefined> {
    const item = this.items.get(id);
    if (!item) return undefined;

    item.status = status as any;
    this.items.set(id, item);
    return item;
  }

  async updateItemQRCode(
    id: string,
    qrCode: string
  ): Promise<Item | undefined> {
    const item = this.items.get(id);
    if (!item) return undefined;

    item.qrCode = qrCode;
    this.items.set(id, item);
    return item;
  }

  // Claim operations
  async getClaim(id: string): Promise<Claim | undefined> {
    return this.claims.get(id);
  }

  async getClaimsByItem(itemId: string): Promise<Claim[]> {
    return Array.from(this.claims.values())
      .filter((c) => c.itemId === itemId)
      .sort((a, b) => b.dateFiled.getTime() - a.dateFiled.getTime());
  }

  async getClaimsByClaimant(claimantId: string): Promise<Claim[]> {
    return Array.from(this.claims.values())
      .filter((c) => c.claimantId === claimantId)
      .sort((a, b) => b.dateFiled.getTime() - a.dateFiled.getTime());
  }

  async getClaimsByReviewer(reviewerId: string): Promise<Claim[]> {
    return Array.from(this.claims.values())
      .filter((c) => c.reviewedBy === reviewerId)
      .sort((a, b) => b.dateFiled.getTime() - a.dateFiled.getTime());
  }

  async createClaim(insertClaim: InsertClaim): Promise<Claim> {
    const id = randomUUID();
    const claim: Claim = {
      ...insertClaim,
      id,
      status: "pending",
      proofImageUrl: insertClaim.proofImageUrl ?? null,
      dateFiled: new Date(),
      reviewedBy: null,
      reviewNotes: null,
      handoverQrCode: null,
    };
    this.claims.set(id, claim);
    return claim;
  }

  async updateClaimStatus(
    id: string,
    status: string,
    reviewedBy?: string,
    reviewNotes?: string
  ): Promise<Claim | undefined> {
    const claim = this.claims.get(id);
    if (!claim) return undefined;

    claim.status = status as any;
    if (reviewedBy) claim.reviewedBy = reviewedBy;
    if (reviewNotes) claim.reviewNotes = reviewNotes;
    this.claims.set(id, claim);
    return claim;
  }

  async updateClaimQRCode(
    id: string,
    qrCode: string
  ): Promise<Claim | undefined> {
    const claim = this.claims.get(id);
    if (!claim) return undefined;

    claim.handoverQrCode = qrCode;
    this.claims.set(id, claim);
    return claim;
  }

  // Message operations
  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesByConversation(
    itemId: string,
    user1Id: string,
    user2Id: string
  ): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(
        (m) =>
          m.itemId === itemId &&
          ((m.senderId === user1Id && m.receiverId === user2Id) ||
            (m.senderId === user2Id && m.receiverId === user1Id))
      )
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async getConversationsByUser(
    userId: string
  ): Promise<{ itemId: string; otherUserId: string; lastMessage: Message }[]> {
    const conversations = new Map<string, Message>();

    Array.from(this.messages.values())
      .filter((m) => m.senderId === userId || m.receiverId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .forEach((m) => {
        const key = `${m.itemId}-${
          m.senderId === userId ? m.receiverId : m.senderId
        }`;
        if (!conversations.has(key)) {
          conversations.set(key, m);
        }
      });

    return Array.from(conversations.values()).map((m) => ({
      itemId: m.itemId,
      otherUserId: m.senderId === userId ? m.receiverId : m.senderId,
      lastMessage: m,
    }));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      timestamp: new Date(),
      isRead: false,
    };
    this.messages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: string): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;

    message.isRead = true;
    this.messages.set(id, message);
    return message;
  }

  // Notification operations
  async getNotification(id: string): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async createNotification(
    insertNotification: InsertNotification
  ): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = {
      ...insertNotification,
      id,
      relatedItemId: insertNotification.relatedItemId ?? null,
      timestamp: new Date(),
      isRead: false,
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;

    notification.isRead = true;
    this.notifications.set(id, notification);
    return notification;
  }

  // Turnover Log operations
  async getTurnoverLog(id: string): Promise<TurnoverLog | undefined> {
    return this.turnoverLogs.get(id);
  }

  async getTurnoverLogsByOfficer(officerId: string): Promise<TurnoverLog[]> {
    return Array.from(this.turnoverLogs.values())
      .filter((t) => t.officerId === officerId)
      .sort((a, b) => b.dateReceived.getTime() - a.dateReceived.getTime());
  }

  async getTurnoverLogByItem(itemId: string): Promise<TurnoverLog | undefined> {
    return Array.from(this.turnoverLogs.values()).find(
      (t) => t.itemId === itemId
    );
  }

  async createTurnoverLog(insertLog: InsertTurnoverLog): Promise<TurnoverLog> {
    const id = randomUUID();
    const log: TurnoverLog = {
      ...insertLog,
      id,
      remarks: insertLog.remarks ?? null,
      dateReceived: new Date(),
      dateReleased: null,
    };
    this.turnoverLogs.set(id, log);
    return log;
  }

  async updateTurnoverRelease(
    id: string,
    remarks?: string
  ): Promise<TurnoverLog | undefined> {
    const log = this.turnoverLogs.get(id);
    if (!log) return undefined;

    log.dateReleased = new Date();
    if (remarks) log.remarks = remarks;
    this.turnoverLogs.set(id, log);
    return log;
  }
}

export const storage = new MemStorage();
