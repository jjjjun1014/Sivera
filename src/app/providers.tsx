'use client';

import { useEffect } from 'react';
import { HeroUIProvider } from '@heroui/system';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';
import { useRouter } from 'next/navigation';
import { Toaster } from 'sonner';

import { configureAmplify } from '@/lib/amplify-client';
import { AuthProvider } from '@/contexts/auth-context';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  // Amplify 설정 (클라이언트 사이드에서 한 번만 실행)
  useEffect(() => {
    configureAmplify();
  }, []);

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider 
        defaultTheme="system"
        attribute="class"
        enableSystem
        {...themeProps}
      >
        <AuthProvider>
          <Toaster position="top-right" richColors />
          {children}
        </AuthProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
