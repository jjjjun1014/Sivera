/**
 * Dashboard Auth Guard
 * 
 * 대시보드 접근 시 인증 체크
 */

'use client';

import { useRequireAuth } from '@/contexts/auth-context';

export default function DashboardAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useRequireAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-default-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // useRequireAuth가 자동으로 /login으로 리다이렉트
  }

  return <>{children}</>;
}
