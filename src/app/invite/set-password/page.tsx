/**
 * Set Password for Invited User
 * 
 * 초대받은 사용자가 최초 로그인 시 비밀번호 설정
 */

import { Suspense } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";

import SetPasswordForm from "@/components/features/invite/SetPasswordForm";

export default async function SetPasswordPage({
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
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 px-6 pt-6">
          <h1 className="text-3xl font-bold">비밀번호 설정</h1>
          <p className="text-default-500">
            팀에 합류하려면 비밀번호를 설정해주세요
          </p>
        </CardHeader>
        <CardBody className="px-6 py-4">
          <Suspense fallback={<div>로딩 중...</div>}>
            <SetPasswordForm inviteToken={token} email={email} />
          </Suspense>
        </CardBody>
      </Card>
    </div>
  );
}
