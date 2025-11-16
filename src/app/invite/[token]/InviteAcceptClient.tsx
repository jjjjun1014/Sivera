"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { FaCheckCircle } from "react-icons/fa";

import log from "@/utils/logger";
import { toast } from "@/utils/toast";
import { useDictionary } from "@/hooks/use-dictionary";
import { acceptInvitation } from "@/lib/services/team.service";
import { updateUser } from "@/lib/services/user.service";

interface InviteAcceptClientProps {
  invitation: any;
  currentUser: any;
}

export default function InviteAcceptClient({
  invitation,
  currentUser,
}: InviteAcceptClientProps) {
  const router = useRouter();
  const { dictionary: dict } = useDictionary();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const roleLabels = {
    master: "마스터",
    team_mate: "팀 멤버",
    viewer: "뷰어",
  };

  const handleAccept = async () => {
    setIsLoading(true);

    try {
      // 초대 수락
      const result = await acceptInvitation(invitation.id, currentUser.id);

      if (!result.success) {
        toast.error({
          title: "초대 수락 실패",
          description: result.error || "초대 수락 중 오류가 발생했습니다.",
        });
        return;
      }

      // User의 teamID 업데이트
      await updateUser(currentUser.id, {
        teamID: invitation.teamID,
      });

      toast.success({
        title: "초대 수락 완료",
        description: "팀에 성공적으로 가입되었습니다.",
      });

      setSuccess(true);

      // 대시보드로 리다이렉트
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      log.error("Error accepting invitation", err instanceof Error ? err : new Error(String(err)));
      toast.error({
        title: "초대 수락 실패",
        description:
          err instanceof Error
            ? err.message
            : "초대 수락 중 오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = () => {
    router.push("/");
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardBody className="text-center py-8">
            <FaCheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              초대 수락 완료
            </h2>
            <p className="text-default-500">
              팀에 성공적으로 가입되었습니다. 잠시 후 대시보드로 이동합니다.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center pb-4">
          <h1 className="text-2xl font-bold">
            팀 초대
          </h1>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="text-center">
            <p className="text-lg mb-4">
              팀에 초대되었습니다
            </p>
            <div className="text-default-500 mb-4">
              역할:{" "}
              <Chip color="primary" size="sm" variant="flat">
                {roleLabels[invitation.role as keyof typeof roleLabels] ||
                  invitation.role}
              </Chip>
            </div>
            <p className="text-sm text-default-400">
              초대 이메일: {invitation.email}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              fullWidth
              color="default"
              isDisabled={isLoading}
              variant="bordered"
              onPress={handleDecline}
            >
              거절
            </Button>
            <Button
              fullWidth
              color="primary"
              isLoading={isLoading}
              onPress={handleAccept}
            >
              수락
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
