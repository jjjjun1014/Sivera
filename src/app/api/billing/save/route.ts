import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { fetchAuthSession } from "aws-amplify/auth/server";
import config from "@/amplify_outputs.json";
import type { Schema } from "@/amplify/data/resource";

const cookieBasedClient = generateServerClientUsingCookies<Schema>({
  config,
  cookies,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { billingKey, paymentMethod, planTier, teamSize } = body;

    if (!billingKey || !planTier) {
      return NextResponse.json(
        { error: "Missing required fields: billingKey, planTier" },
        { status: 400 }
      );
    }

    const session = await fetchAuthSession({ cookies });
    const userId = session.userSub;
    const teamId = session.tokens?.idToken?.payload["custom:teamId"] as string | undefined;

    if (!userId || !teamId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // PortOne API로 빌링키 검증
    const billingKeyResponse = await fetch(
      `https://api.portone.io/billing-keys/${billingKey}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `PortOne ${process.env.PORTONE_API_SECRET}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!billingKeyResponse.ok) {
      return NextResponse.json({ error: 'Failed to verify billing key' }, { status: 400 });
    }

    const billingKeyInfo = await billingKeyResponse.json();

    if (!billingKeyInfo.billingKey || billingKeyInfo.status !== 'ISSUED') {
      return NextResponse.json({ error: 'Invalid or inactive billing key' }, { status: 400 });
    }

    // 기존 구독 확인
    const { data: existingSubscriptions } = await cookieBasedClient.models.Subscription.list({
      filter: { teamID: { eq: teamId } },
    });

    if (existingSubscriptions && existingSubscriptions.length > 0) {
      const existing = existingSubscriptions[0];
      const { data: updated } = await cookieBasedClient.models.Subscription.update({
        id: existing.id,
        billingKey,
        planTier: planTier as "free" | "standard" | "pro",
        status: "trialing",
        teamSize: teamSize || existing.teamSize,
      });

      return NextResponse.json({
        success: true,
        subscription: { id: updated?.id, planTier: updated?.planTier, status: updated?.status, paymentMethod },
      });
    }

    const now = new Date();
    const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const { data: subscription, errors } = await cookieBasedClient.models.Subscription.create({
      teamID: teamId,
      planTier: planTier as "free" | "standard" | "pro",
      status: "trialing",
      billingKey,
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: trialEnd.toISOString(),
      trialEnd: trialEnd.toISOString(),
      teamSize: teamSize || 1,
    });

    if (errors || !subscription) {
      return NextResponse.json({ error: "Failed to create subscription", details: errors }, { status: 500 });
    }

    await cookieBasedClient.models.Usage.create({
      subscriptionID: subscription.id,
      teamID: teamId,
      period: now.toISOString().slice(0, 7),
      metrics: JSON.stringify({
        adAccounts: 0,
        teamMembers: teamSize || 1,
        brands: 0,
        apiCalls: 0,
      }),
    });

    return NextResponse.json({
      success: true,
      subscription: { id: subscription.id, planTier: subscription.planTier, status: subscription.status, trialEnd: subscription.trialEnd, paymentMethod },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
