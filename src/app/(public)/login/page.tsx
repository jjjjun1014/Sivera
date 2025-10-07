"use client";

import { AuthForm } from "@/components/features/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <AuthForm initialMode="login" />
    </div>
  );
}
