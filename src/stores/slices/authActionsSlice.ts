// Auth actions slice

import { StateCreator } from "zustand";

import { AuthDataSlice } from "./authDataSlice";
import { LoadingSlice } from "./loadingSlice";

export interface AuthActionsSlice {
  signOut: () => Promise<void>;
}

export const createAuthActionsSlice: StateCreator<
  AuthDataSlice & LoadingSlice & AuthActionsSlice,
  [],
  [],
  AuthActionsSlice
> = (set) => ({
  signOut: async () => {
    set({ isLoading: true });

    try {
      // Static mode - just clear user state
      set({ user: null, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
});
