import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@heroui/button";

import InviteAcceptClient from "./InviteAcceptClient";
import LogoutButton from "./LogoutButton";

// TODO: Replace with backend API integration
// import { createClient } from "@/utils/supabase/server";
import log from "@/utils/logger";
import { getDictionary, type Locale } from "@/app/dictionaries";

interface InvitePageProps {
  params: Promise<{
    token: string;
  }>;
}

async function getInvitationDetails(token: string) {
  // TODO: Backend API Integration Required
  // Endpoint: GET /api/invitations/:token
  // Response: { invitation: { id, email, role, status, expires_at, team_name, invited_by_email, ... } }

  log.warn("getInvitationDetails called - backend integration needed", { token });

  // Stub response - return null to trigger notFound()
  return { invitation: null, error: new Error("Backend API integration required") };

  // TODO: The backend should handle:
  // 1. Fetch invitation by token
  // 2. Include team name and inviter email
  // 3. Return invitation details or error
}

// Disable caching for this page to ensure fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const dict = await getDictionary("en" as Locale);

  // TODO: Backend API Integration Required
  // Need to check if user is logged in
  // Endpoint: GET /api/auth/me
  // Response: { user: { id, email, ... } } or null

  log.warn("InvitePage - needs backend integration for auth check");

  // For now, show a message that backend integration is needed
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Backend Integration Required
        </h1>
        <p className="text-default-500 mb-4">
          The team invitation system requires backend API integration.
        </p>
        <p className="text-default-500 mb-6">
          Please implement the following endpoints:
        </p>
        <ul className="text-left text-sm text-default-600 mb-6 space-y-2">
          <li>• GET /api/auth/me - Get current user</li>
          <li>• GET /api/invitations/:token - Get invitation details</li>
          <li>• POST /api/invitations/:token/accept - Accept invitation</li>
          <li>• GET /api/profile/:userId - Check if profile exists</li>
        </ul>
        <div className="text-xs text-default-400">
          Token: {token}
        </div>
      </div>
    </div>
  );

  // TODO: Original logic to restore after backend integration:
  // 1. Get invitation details by token
  // 2. Check if user is logged in
  // 3. Validate invitation status and expiration
  // 4. Check if user email matches invitation email
  // 5. Show appropriate UI based on state
}
