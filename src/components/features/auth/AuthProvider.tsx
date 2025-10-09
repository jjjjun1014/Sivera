"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

import { useAuthStore } from "@/stores/useAuthStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setIsLoading, setIsInitialized } = useAuthStore(
    useShallow((state) => ({
      setUser: state.setUser,
      setIsLoading: state.setIsLoading,
      setIsInitialized: state.setIsInitialized,
    })),
  );

  useEffect(() => {
    // Initialize with no user (static UI mode)
    setIsLoading(false);
    setIsInitialized(true);
    setUser(null);
  }, [setUser, setIsLoading, setIsInitialized]);

  return <>{children}</>;
}
