import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@heroui/button";

import InviteAcceptClient from "./InviteAcceptClient";
import LogoutButton from "./LogoutButton";

import log from "@/utils/logger";
import { getDictionary, type Locale } from "@/app/dictionaries";
import { getInvitation } from "@/lib/services/team.service";
import { getCurrentUser } from "@/lib/services/user.service";

interface InvitePageProps {
  params: Promise<{
    token: string;
  }>;
}

async function getInvitationDetails(token: string) {
  try {
    const result = await getInvitation(token);
    
    if (result.error || !result.data) {
      log.error("Failed to fetch invitation", { token, error: result.error });
      return { invitation: null, error: result.error };
    }

    return { invitation: result.data, error: null };
  } catch (error) {
    log.error("Error in getInvitationDetails", error instanceof Error ? error : new Error(String(error)));
    return { invitation: null, error: "초대 정보를 불러오는데 실패했습니다." };
  }
}

// Disable caching for this page to ensure fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const dict = await getDictionary("ko" as Locale);

  // 1. 현재 사용자 확인
  const currentUser = await getCurrentUser();
  const isLoggedIn = !!currentUser?.data;

  // 2. 초대 정보 조회
  const { invitation, error } = await getInvitationDetails(token);

  if (!invitation) {
    log.warn("Invitation not found", { token });
    return notFound();
  }

  // 3. 초대 상태 확인
  if (invitation.status === "accepted") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">이미 수락된 초대입니다</h1>
          <p className="text-default-500 mb-6">
            이 초대는 이미 수락되었습니다.
          </p>
          <Button
            color="primary"
            onClick={() => (window.location.href = "/dashboard")}
          >
            대시보드로 이동
          </Button>
        </div>
      </div>
    );
  }

  if (invitation.status === "cancelled") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">취소된 초대입니다</h1>
          <p className="text-default-500 mb-6">
            이 초대는 취소되었습니다.
          </p>
        </div>
      </div>
    );
  }

  // 4. 만료 확인
  if (new Date(invitation.expiresAt) < new Date()) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">만료된 초대입니다</h1>
          <p className="text-default-500 mb-6">
            이 초대는 만료되었습니다. 초대를 보낸 사람에게 새 초대를 요청하세요.
          </p>
        </div>
      </div>
    );
  }

  // 5. 로그인 여부에 따른 처리
  if (!isLoggedIn) {
    // 로그인하지 않은 경우 - 회원가입/로그인 유도
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">팀 초대</h1>
          <p className="text-default-500 mb-6">
            {invitation.email}로 초대장이 발송되었습니다.
            <br />
            초대를 수락하려면 로그인하거나 회원가입하세요.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              color="primary"
              onClick={() => (window.location.href = `/login?redirect=/invite/${token}`)}
            >
              로그인
            </Button>
            <Button
              variant="bordered"
              onClick={() => (window.location.href = `/signup?redirect=/invite/${token}`)}
            >
              회원가입
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 6. 이메일 일치 확인
  if (currentUser.data.email?.toLowerCase() !== invitation.email.toLowerCase()) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">이메일 불일치</h1>
          <p className="text-default-500 mb-4">
            이 초대는 <strong>{invitation.email}</strong>으로 발송되었습니다.
          </p>
          <p className="text-default-500 mb-6">
            현재 로그인한 계정: <strong>{currentUser.data.email}</strong>
          </p>
          <p className="text-default-400 text-sm mb-6">
            올바른 계정으로 로그인하여 초대를 수락하세요.
          </p>
          <LogoutButton />
        </div>
      </div>
    );
  }

  // 7. 초대 수락 페이지 표시
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InviteAcceptClient
        invitation={invitation}
        currentUser={currentUser.data}
      />
    </Suspense>
  );
}
