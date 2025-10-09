"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { LoadingState } from "./LoadingState";

import { useAuth } from "@/hooks/use-auth";
import { useDictionary } from "@/hooks/use-dictionary";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const { dictionary: dict } = useDictionary();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <LoadingState />;
  }

  if (!user) {
    return null;
  }

  return (
    <div aria-label={dict.common.mainContent} role="main">
      {children}
    </div>
  );
}
