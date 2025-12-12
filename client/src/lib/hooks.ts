import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "./api";
import type { Item, Claim, Message, Notification } from "./types";

// ===== Item Hooks =====

export function useItems(filters?: {
  type?: "lost" | "found";
  status?: string;
  category?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["items", filters],
    queryFn: () => api.getItems(filters),
  });
}

export function useItem(id: string | undefined) {
  return useQuery({
    queryKey: ["items", id],
    queryFn: () => api.getItem(id!),
    enabled: !!id,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useUpdateItemStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.updateItemStatus(id, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["items", variables.id] });
    },
  });
}

// ===== Claim Hooks =====

export function useClaims(params: { itemId?: string; claimantId?: string }) {
  return useQuery({
    queryKey: ["claims", params],
    queryFn: () => api.getClaims(params),
    enabled: !!(params.itemId || params.claimantId),
  });
}

export function useCreateClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createClaim,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["claims"] });
      queryClient.invalidateQueries({ queryKey: ["items", variables.itemId] });
    },
  });
}

export function useApproveClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reviewNotes }: { id: string; reviewNotes?: string }) =>
      api.approveClaim(id, reviewNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claims"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useRejectClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reviewNotes }: { id: string; reviewNotes?: string }) =>
      api.rejectClaim(id, reviewNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claims"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useCompleteClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, scannedQR }: { id: string; scannedQR: string }) =>
      api.completeClaim(id, scannedQR),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claims"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

// ===== Message Hooks =====

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: api.getConversations,
  });
}

export function useMessages(
  itemId: string | undefined,
  otherUserId: string | undefined
) {
  return useQuery({
    queryKey: ["messages", itemId, otherUserId],
    queryFn: () => api.getMessages(itemId!, otherUserId!),
    enabled: !!(itemId && otherUserId),
    refetchInterval: 3000, // Poll every 3 seconds for new messages
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.sendMessage,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.itemId],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

// ===== Notification Hooks =====

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: api.getNotifications,
    refetchInterval: 10000, // Poll every 10 seconds
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// ===== Admin Hooks =====

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: api.getAdminStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useTurnoverLogs(officerId: string | undefined) {
  return useQuery({
    queryKey: ["turnoverLogs", officerId],
    queryFn: () => api.getTurnoverLogs(officerId!),
    enabled: !!officerId,
  });
}

export function useCreateTurnoverLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createTurnoverLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["turnoverLogs"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}

export function useReleaseTurnover() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, remarks }: { id: string; remarks?: string }) =>
      api.releaseTurnover(id, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["turnoverLogs"] });
    },
  });
}
