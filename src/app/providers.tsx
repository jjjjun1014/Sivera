"use client";

import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "@/components/features/auth/AuthProvider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            expand={false}
            duration={4000}
          />
        </AuthProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
