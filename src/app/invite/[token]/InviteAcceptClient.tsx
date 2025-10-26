"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { FaCheckCircle } from "react-icons/fa";

// TODO: Replace with backend API integration
// import { createClient } from "@/utils/supabase/client";
import log from "@/utils/logger";
import { AcceptTeamInvitationResult } from "@/types";
import { toast } from "@/utils/toast";
import { useDictionary } from "@/hooks/use-dictionary";

interface InviteAcceptClientProps {
  token: string;
  invitation: {
    email: string;
    role: string;
    teamName: string;
    inviterName: string;
  };
  isPreview?: boolean;
}

export default function InviteAcceptClient({
  token,
  invitation,
  isPreview = false,
}: InviteAcceptClientProps) {
  const router = useRouter();
  const { dictionary: dict } = useDictionary();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const roleLabels = {
    team_mate: dict.team.roles.team_mate.name,
    viewer: dict.team.roles.viewer.name,
  };

  const handleAccept = async () => {
    if (isPreview) {
      // If preview mode, redirect to signup with invitation email and token
      const signupUrl = `/login?mode=signup&email=${encodeURIComponent(invitation.email)}&inviteToken=${token}&returnUrl=${encodeURIComponent(`/invite/${token}`)}`;

      router.push(signupUrl);

      return;
    }

    setIsLoading(true);

    try {
      // TODO: Backend API Integration Required
      // Endpoint: POST /api/invitations/:token/accept
      // Response: { success, team_id, error? }

      log.warn("handleAccept called - backend integration needed", { token });

      // Stub - show error toast
      toast.error({
        title: "Backend Integration Required",
        description: "Please implement POST /api/invitations/:token/accept endpoint.",
      });

      // TODO: The backend should handle:
      // 1. Validate invitation token
      // 2. Check if user is authenticated
      // 3. Accept the invitation (add user to team)
      // 4. Update invitation status to 'accepted'
      // 5. Return success with team_id
    } catch (err) {
      log.error("Error accepting invitation", err as Error);
      toast.error({
        title: dict.team.invite.accept.toast.errorTitle,
        description:
          err instanceof Error
            ? err.message
            : dict.team.invite.accept.toast.errorDescription,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = () => {
    // Just redirect to home
    router.push("/");
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardBody className="text-center py-8">
            <FaCheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {dict.team.invite.accept.success.title}
            </h2>
            <p className="text-default-500">
              {dict.team.invite.accept.success.description}
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
            {dict.team.invite.accept.title}
          </h1>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="text-center">
            <p className="text-lg mb-4">
              {dict.team.invite.accept.invitedBy.replace(
                "{{inviter}}",
                invitation.inviterName,
              )}
            </p>
            <h2 className="text-3xl font-bold mb-4">{invitation.teamName}</h2>
            <div className="text-default-500 mb-4">
              {dict.team.invite.accept.asRole}{" "}
              <Chip color="primary" size="sm" variant="flat">
                {roleLabels[invitation.role as keyof typeof roleLabels] ||
                  invitation.role}
              </Chip>
            </div>
          </div>

          {isPreview && (
            <p className="text-sm text-default-500 text-center">
              {dict.team.invite.accept.needAccount}
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              fullWidth
              color="default"
              isDisabled={isLoading}
              variant="bordered"
              onPress={handleDecline}
            >
              {dict.team.invite.accept.decline}
            </Button>
            <Button
              fullWidth
              color="primary"
              isLoading={isLoading}
              onPress={handleAccept}
            >
              {isPreview
                ? dict.team.invite.accept.createAccount
                : dict.team.invite.accept.acceptInvitation}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
