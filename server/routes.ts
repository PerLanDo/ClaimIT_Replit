import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertItemSchema,
  insertClaimSchema,
  insertMessageSchema,
  insertNotificationSchema,
  insertTurnoverLogSchema,
} from "@shared/schema";
import { WebSocketServer, WebSocket } from "ws";

// WebSocket clients map: userId -> WebSocket
const wsClients = new Map<string, WebSocket>();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup WebSocket server for real-time messaging
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws, req) => {
    const userId = new URL(
      req.url!,
      `http://${req.headers.host}`
    ).searchParams.get("userId");

    if (userId) {
      wsClients.set(userId, ws);

      ws.on("close", () => {
        wsClients.delete(userId);
      });
    }
  });

  // Helper to send real-time notification
  function sendNotification(userId: string, data: any) {
    const ws = wsClients.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  // ===== Authentication Routes =====

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);

      // Check if user already exists
      const existing = await storage.getUserByEmail(userData.email);
      if (existing) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      res.json({ user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const userId = req.headers["x-user-id"] as string;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== User Routes =====

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== Item Routes =====

  app.get("/api/items", async (req, res) => {
    try {
      const { type, status, category, search } = req.query;

      const items = await storage.getItems({
        type: type as any,
        status: status as string,
        category: category as string,
        search: search as string,
      });

      res.json({ items });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/items/:id", async (req, res) => {
    try {
      const item = await storage.getItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json({ item });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/items", async (req, res) => {
    try {
      const itemData = insertItemSchema.parse(req.body);

      // Generate QR code (in real app, use qrcode library)
      const qrCode = `CLAIMIT-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const item = await storage.createItem(itemData);
      await storage.updateItemQRCode(item.id, qrCode);

      // If high-value or turnover to SID, update status
      if (itemData.turnoverToSID) {
        await storage.updateItemStatus(item.id, "surrendered_sid");
      }

      const updatedItem = await storage.getItem(item.id);
      res.json({ item: updatedItem });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/items/:id/status", async (req, res) => {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const item = await storage.updateItemStatus(req.params.id, status);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json({ item });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== Claim Routes =====

  app.get("/api/claims", async (req, res) => {
    try {
      const { itemId, claimantId } = req.query;

      let claims;
      if (itemId) {
        claims = await storage.getClaimsByItem(itemId as string);
      } else if (claimantId) {
        claims = await storage.getClaimsByClaimant(claimantId as string);
      } else {
        return res
          .status(400)
          .json({ message: "itemId or claimantId required" });
      }

      res.json({ claims });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/claims/:id", async (req, res) => {
    try {
      const claim = await storage.getClaim(req.params.id);
      if (!claim) {
        return res.status(404).json({ message: "Claim not found" });
      }
      res.json({ claim });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/claims", async (req, res) => {
    try {
      const claimData = insertClaimSchema.parse(req.body);

      // Check if item exists
      const item = await storage.getItem(claimData.itemId);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      // Prevent self-claim
      if (item.reporterId === claimData.claimantId) {
        return res.status(400).json({ message: "Cannot claim your own item" });
      }

      // Create claim
      const claim = await storage.createClaim(claimData);

      // Update item status
      await storage.updateItemStatus(claimData.itemId, "pending_claim");

      // Notify item reporter
      await storage.createNotification({
        userId: item.reporterId,
        type: "claim_update",
        content: `Someone has claimed your ${item.type} item: ${item.title}`,
        relatedItemId: item.id,
        isRead: false,
      });

      sendNotification(item.reporterId, {
        type: "claim_submitted",
        claimId: claim.id,
        itemId: item.id,
      });

      res.json({ claim });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/claims/:id/approve", async (req, res) => {
    try {
      const { reviewedBy, reviewNotes } = req.body;

      const claim = await storage.getClaim(req.params.id);
      if (!claim) {
        return res.status(404).json({ message: "Claim not found" });
      }

      // Generate handover QR code
      const handoverQR = `HANDOVER-${claim.id}-${Date.now()}`;

      await storage.updateClaimStatus(
        req.params.id,
        "approved",
        reviewedBy,
        reviewNotes
      );
      await storage.updateClaimQRCode(req.params.id, handoverQR);

      // Notify claimant
      await storage.createNotification({
        userId: claim.claimantId,
        type: "claim_update",
        content:
          "Your claim has been approved! You can now coordinate with the finder.",
        relatedItemId: claim.itemId,
        isRead: false,
      });

      sendNotification(claim.claimantId, {
        type: "claim_approved",
        claimId: claim.id,
        handoverQR,
      });

      const updatedClaim = await storage.getClaim(req.params.id);
      res.json({ claim: updatedClaim });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/claims/:id/reject", async (req, res) => {
    try {
      const { reviewedBy, reviewNotes } = req.body;

      const claim = await storage.getClaim(req.params.id);
      if (!claim) {
        return res.status(404).json({ message: "Claim not found" });
      }

      await storage.updateClaimStatus(
        req.params.id,
        "rejected",
        reviewedBy,
        reviewNotes
      );

      // Restore item to open status
      await storage.updateItemStatus(claim.itemId, "open");

      // Notify claimant
      await storage.createNotification({
        userId: claim.claimantId,
        type: "claim_update",
        content: `Your claim was not approved. ${reviewNotes || ""}`,
        relatedItemId: claim.itemId,
        isRead: false,
      });

      sendNotification(claim.claimantId, {
        type: "claim_rejected",
        claimId: claim.id,
      });

      const updatedClaim = await storage.getClaim(req.params.id);
      res.json({ claim: updatedClaim });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/claims/:id/complete", async (req, res) => {
    try {
      const { scannedQR } = req.body;

      const claim = await storage.getClaim(req.params.id);
      if (!claim) {
        return res.status(404).json({ message: "Claim not found" });
      }

      // Validate QR code
      if (claim.handoverQrCode !== scannedQR) {
        return res.status(400).json({ message: "Invalid QR code" });
      }

      // Update claim to completed
      await storage.updateClaimStatus(req.params.id, "completed");

      // Update item to returned
      await storage.updateItemStatus(claim.itemId, "returned");

      // Get item to find reporter
      const item = await storage.getItem(claim.itemId);
      if (item) {
        // Increment reporter's reputation
        await storage.updateUserReputation(item.reporterId, 10);
      }

      // Notify both users
      await storage.createNotification({
        userId: claim.claimantId,
        type: "claim_update",
        content: "Item handover completed successfully!",
        relatedItemId: claim.itemId,
        isRead: false,
      });

      if (item) {
        await storage.createNotification({
          userId: item.reporterId,
          type: "claim_update",
          content: "Item returned successfully! +10 reputation",
          relatedItemId: claim.itemId,
          isRead: false,
        });
      }

      const updatedClaim = await storage.getClaim(req.params.id);
      res.json({ claim: updatedClaim });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== Message Routes =====

  app.get("/api/messages/conversations", async (req, res) => {
    try {
      const userId = req.headers["x-user-id"] as string;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const conversations = await storage.getConversationsByUser(userId);
      res.json({ conversations });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/messages/:itemId/:otherUserId", async (req, res) => {
    try {
      const userId = req.headers["x-user-id"] as string;
      const { itemId, otherUserId } = req.params;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const messages = await storage.getMessagesByConversation(
        itemId,
        userId,
        otherUserId
      );
      res.json({ messages });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);

      const message = await storage.createMessage(messageData);

      // Send real-time notification to receiver
      sendNotification(messageData.receiverId, {
        type: "new_message",
        message,
      });

      // Create notification
      await storage.createNotification({
        userId: messageData.receiverId,
        type: "new_message",
        content: "You have a new message",
        relatedItemId: messageData.itemId,
        isRead: false,
      });

      res.json({ message });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/messages/:id/read", async (req, res) => {
    try {
      const message = await storage.markMessageAsRead(req.params.id);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json({ message });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== Notification Routes =====

  app.get("/api/notifications", async (req, res) => {
    try {
      const userId = req.headers["x-user-id"] as string;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const notifications = await storage.getNotificationsByUser(userId);
      res.json({ notifications });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const notification = await storage.markNotificationAsRead(req.params.id);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json({ notification });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== Turnover Log Routes (SID Admin) =====

  app.get("/api/turnover-logs", async (req, res) => {
    try {
      const officerId = req.query.officerId as string;

      if (!officerId) {
        return res.status(400).json({ message: "officerId required" });
      }

      const logs = await storage.getTurnoverLogsByOfficer(officerId);
      res.json({ logs });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/turnover-logs/item/:itemId", async (req, res) => {
    try {
      const log = await storage.getTurnoverLogByItem(req.params.itemId);
      if (!log) {
        return res.status(404).json({ message: "Turnover log not found" });
      }
      res.json({ log });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/turnover-logs", async (req, res) => {
    try {
      const logData = insertTurnoverLogSchema.parse(req.body);

      const log = await storage.createTurnoverLog(logData);
      res.json({ log });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/turnover-logs/:id/release", async (req, res) => {
    try {
      const { remarks } = req.body;

      const log = await storage.updateTurnoverRelease(req.params.id, remarks);
      if (!log) {
        return res.status(404).json({ message: "Turnover log not found" });
      }

      res.json({ log });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // ===== Admin Analytics Routes =====

  app.get("/api/admin/stats", async (req, res) => {
    try {
      const allItems = await storage.getItems();
      const allClaims = await storage.getItems({ status: "pending_claim" });
      const returnedItems = await storage.getItems({ status: "returned" });

      const totalItems = allItems.length;
      const pendingClaims = allClaims.length;
      const returned = returnedItems.length;
      const recoveryRate =
        totalItems > 0 ? ((returned / totalItems) * 100).toFixed(1) : "0";

      res.json({
        stats: {
          totalItems,
          pendingClaims,
          returned,
          recoveryRate: `${recoveryRate}%`,
        },
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  return httpServer;
}
