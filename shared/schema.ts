import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", [
  "student",
  "faculty",
  "staff",
  "sid_admin",
]);
export const itemStatusEnum = pgEnum("item_status", [
  "open",
  "pending_claim",
  "returned",
  "surrendered_sid",
  "archived",
  "disposed",
]);
export const itemCategoryEnum = pgEnum("item_category", [
  "electronics",
  "clothing",
  "ids_cards",
  "wallets",
  "books",
  "bags",
  "tumblers",
  "umbrellas",
  "keys",
  "other",
]);
export const claimStatusEnum = pgEnum("claim_status", [
  "pending",
  "approved",
  "rejected",
  "completed",
]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "claim_update",
  "new_message",
  "item_match",
  "turnover_reminder",
  "system",
]);

// Users table
export const users = pgTable("users", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: userRoleEnum("role").notNull().default("student"),
  department: text("department"),
  reputationScore: integer("reputation_score").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Items table
export const items = pgTable("items", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  reporterId: varchar("reporter_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  type: text("type", { enum: ["lost", "found"] }).notNull(),
  category: itemCategoryEnum("category").notNull(),
  status: itemStatusEnum("status").notNull().default("open"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  imageUrls: text("image_urls")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  isHighValue: boolean("is_high_value").notNull().default(false),
  dateReported: timestamp("date_reported").notNull().defaultNow(),
  dateLostFound: timestamp("date_lost_found").notNull(),
  qrCode: text("qr_code"),
  turnoverToSID: boolean("turnover_to_sid").notNull().default(false),
});

// Claims table
export const claims = pgTable("claims", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  itemId: varchar("item_id", { length: 255 })
    .notNull()
    .references(() => items.id),
  claimantId: varchar("claimant_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  status: claimStatusEnum("status").notNull().default("pending"),
  proofDescription: text("proof_description").notNull(),
  proofImageUrl: text("proof_image_url"),
  dateFiled: timestamp("date_filed").notNull().defaultNow(),
  reviewedBy: varchar("reviewed_by", { length: 255 }).references(
    () => users.id
  ),
  reviewNotes: text("review_notes"),
  handoverQrCode: text("handover_qr_code"),
});

// Messages table
export const messages = pgTable("messages", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  itemId: varchar("item_id", { length: 255 })
    .notNull()
    .references(() => items.id),
  senderId: varchar("sender_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  receiverId: varchar("receiver_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  isRead: boolean("is_read").notNull().default(false),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  type: notificationTypeEnum("type").notNull(),
  content: text("content").notNull(),
  relatedItemId: varchar("related_item_id", { length: 255 }).references(
    () => items.id
  ),
  isRead: boolean("is_read").notNull().default(false),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Turnover Logs table
export const turnoverLogs = pgTable("turnover_logs", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  itemId: varchar("item_id", { length: 255 })
    .notNull()
    .references(() => items.id),
  officerId: varchar("officer_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  dateReceived: timestamp("date_received").notNull().defaultNow(),
  dateReleased: timestamp("date_released"),
  remarks: text("remarks"),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  fullName: z.string().min(1),
}).omit({ id: true, createdAt: true });

export const insertItemSchema = createInsertSchema(items, {
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  location: z.string().min(2),
  imageUrls: z.array(z.string().url()).max(5),
}).omit({ id: true, dateReported: true, qrCode: true });

export const insertClaimSchema = createInsertSchema(claims, {
  proofDescription: z.string().min(50),
}).omit({ id: true, dateFiled: true, handoverQrCode: true });

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  timestamp: true,
});

export const insertTurnoverLogSchema = createInsertSchema(turnoverLogs).omit({
  id: true,
  dateReceived: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;

export type Claim = typeof claims.$inferSelect;
export type InsertClaim = z.infer<typeof insertClaimSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type TurnoverLog = typeof turnoverLogs.$inferSelect;
export type InsertTurnoverLog = z.infer<typeof insertTurnoverLogSchema>;
