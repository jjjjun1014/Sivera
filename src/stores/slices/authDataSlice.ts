// Auth data slice

import { StateCreator } from "zustand";
import type { AuthUser } from "aws-amplify/auth";

export interface AuthDataSlice {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  isInitialized: boolean;
  setIsInitialized: (isInitialized: boolean) => void;
}

export const createAuthDataSlice: StateCreator<
  AuthDataSlice,
  [],
  [],
  AuthDataSlice
> = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isInitialized: false,
  setIsInitialized: (isInitialized) => set({ isInitialized }),
});
