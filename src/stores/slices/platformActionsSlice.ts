// Platform actions slice

import { StateCreator } from "zustand";

import { LoadingSlice } from "./loadingSlice";
import { ErrorSlice } from "./errorSlice";
import { PlatformDataSlice } from "./platformDataSlice";

import type { PlatformCredential, Json } from "@/types";
import log from "@/utils/logger";

// TODO: Replace with backend API integration
// import { createClient } from "@/utils/supabase/client";

export interface PlatformActionsSlice {
  fetchCredentials: () => Promise<void>;
  addCredential: (
    platform: PlatformType,
    credentials: Record<string, unknown>,
  ) => Promise<void>;
  updateCredential: (
    id: string,
    credentials: Record<string, unknown>,
  ) => Promise<void>;
  toggleCredentialStatus: (id: string) => Promise<void>;
  deleteCredential: (id: string) => Promise<void>;
  syncAllPlatforms: () => Promise<void>;
  syncPlatform: (platform: PlatformType) => Promise<void>;
}

type PlatformStoreSlices = LoadingSlice &
  ErrorSlice &
  PlatformDataSlice &
  PlatformActionsSlice;

export const createPlatformActionsSlice: StateCreator<
  PlatformStoreSlices,
  [],
  [],
  PlatformActionsSlice
> = (set, get) => ({
  fetchCredentials: async () => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Backend API Integration Required
      // Endpoint: GET /api/credentials
      // Response: { credentials: PlatformCredential[] }

      log.warn("fetchCredentials called - backend integration needed");

      // Stub - return empty array
      set({ credentials: [], isLoading: false });

      // TODO: The backend should handle:
      // 1. Get authenticated user from session/token
      // 2. Get user's team
      // 3. Fetch platform credentials for the team
      // 4. Return credentials
    } catch (error) {
      log.error("Failed to fetch credentials", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addCredential: async (platform, credentials) => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Backend API Integration Required
      // Endpoint: POST /api/credentials
      // Body: { platform, credentials }
      // Response: { success, credential }

      log.warn("addCredential called - backend integration needed", { platform });

      throw new Error("Backend API integration required. Please implement POST /api/credentials endpoint.");

      // TODO: The backend should handle:
      // 1. Get authenticated user from session/token
      // 2. Get user's team and verify role (not viewer)
      // 3. Create platform credential
      // 4. Return success
    } catch (error) {
      log.error("Failed to add credential", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateCredential: async (id, credentials) => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Backend API Integration Required
      // Endpoint: PATCH /api/credentials/:id
      // Body: { credentials }
      // Response: { success }

      log.warn("updateCredential called - backend integration needed", { id });

      throw new Error("Backend API integration required. Please implement PATCH /api/credentials/:id endpoint.");
    } catch (error) {
      log.error("Failed to update credential", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  toggleCredentialStatus: async (id) => {
    const credential = get().credentials.find((c) => c.id === id);

    if (!credential) {
      set({ error: "Credential not found" });

      return;
    }

    set({ isLoading: true, error: null });

    try {
      // TODO: Backend API Integration Required
      // Endpoint: PATCH /api/credentials/:id/toggle
      // Response: { success }

      log.warn("toggleCredentialStatus called - backend integration needed", { id });

      throw new Error("Backend API integration required. Please implement PATCH /api/credentials/:id/toggle endpoint.");
    } catch (error) {
      log.error("Failed to toggle credential status", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteCredential: async (id) => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Backend API Integration Required
      // Endpoint: DELETE /api/credentials/:id
      // Response: { success }

      log.warn("deleteCredential called - backend integration needed", { id });

      throw new Error("Backend API integration required. Please implement DELETE /api/credentials/:id endpoint.");
    } catch (error) {
      log.error("Failed to delete credential", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  syncAllPlatforms: async () => {
    const credentials = get().credentials.filter((c) => c.is_active);

    for (const credential of credentials) {
      await get().syncPlatform(credential.platform);
    }
  },

  syncPlatform: async (platform) => {
    set((state) => ({
      syncProgress: { ...state.syncProgress, [platform]: 0 },
    }));

    try {
      const response = await fetch(`/api/sync/${platform}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Failed to sync ${platform}`);
      }

      set((state) => ({
        syncProgress: { ...state.syncProgress, [platform]: 100 },
      }));


      // Reset progress after 2 seconds
      setTimeout(() => {
        set((state) => ({
          syncProgress: { ...state.syncProgress, [platform]: 0 },
        }));
      }, 2000);
    } catch (error) {
      log.error(`Failed to sync ${platform}`, error);
      set({ error: (error as Error).message });
      set((state) => ({
        syncProgress: { ...state.syncProgress, [platform]: 0 },
      }));
    }
  },
});
