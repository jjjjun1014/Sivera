/**
 * Invite Page
 * 
 * 팀 초대 수락 페이지
 */

import { Suspense } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";

import InviteAcceptForm from "@/components/features/invite/InviteAcceptForm";

export default async function InvitePage({
  searchParams,
}: {
  searchParams: Promise<{
    token?: string;
    email?: string;
  }>;
}) {
  const { token, email } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-col gap-1 px-6 pt-6">
          <h1 className="text-3xl font-bold">팀 초대</h1>
          <p className="text-default-500">
            팀에 초대되었습니다. 초대를 수락하시겠습니까?
          </p>
        </CardHeader>
        <CardBody className="px-6 py-4">
          <Suspense fallback={<div>로딩 중...</div>}>
            <InviteAcceptForm inviteToken={token} defaultEmail={email} />
          </Suspense>
        </CardBody>
      </Card>
    </div>
  );
}
