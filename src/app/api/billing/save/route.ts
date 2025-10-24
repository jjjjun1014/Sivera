import { NextRequest, NextResponse } from 'next/server';

/**
 * 빌링키 저장 API
 *
 * 결제 성공 페이지에서 호출하여 빌링키를 서버에 저장합니다.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { billingKey, plan, seats, userId } = body;

    // 필수 파라미터 검증
    if (!billingKey || !plan || !seats) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // TODO: 실제 사용자 인증
    // const session = await getServerSession();
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    // const userId = session.user.id;

    console.log('Saving billing key:', { billingKey, plan, seats, userId });

    // TODO: PortOne API로 빌링키 정보 조회
    // const billingKeyInfo = await fetchBillingKeyInfo(billingKey);

    // TODO: DynamoDB에 빌링키 저장
    // await saveBillingKeyToDynamoDB({
    //   userId,
    //   billingKey,
    //   paymentMethod: billingKeyInfo.method.type,
    //   cardInfo: billingKeyInfo.method.card,
    //   paypalEmail: billingKeyInfo.method.paypal?.email,
    //   isDefault: true,
    //   status: 'ACTIVE',
    //   createdAt: Date.now(),
    // });

    // TODO: 구독 정보 생성/업데이트
    const trialEndDate = Date.now() + 14 * 24 * 60 * 60 * 1000; // 14일 후
    const nextBillingDate = trialEndDate;

    // await createOrUpdateSubscription({
    //   userId,
    //   subscriptionId: `sub_${userId}_${Date.now()}`,
    //   planType: plan,
    //   teamSeats: parseInt(seats),
    //   billingKey,
    //   status: 'trial', // 무료 체험 중
    //   trialEndDate,
    //   nextBillingDate,
    //   startDate: Date.now(),
    //   currency: 'KRW',
    //   monthlyAmount: calculateAmount(plan, parseInt(seats)),
    // });

    // TODO: 환영 이메일 발송
    // await sendWelcomeEmail({
    //   email: session.user.email,
    //   plan,
    //   trialEndDate: new Date(trialEndDate),
    // });

    return NextResponse.json({
      success: true,
      trialEndDate,
      nextBillingDate,
      message: '빌링키가 성공적으로 저장되었습니다.'
    });
  } catch (error) {
    console.error('Billing key save error:', error);
    return NextResponse.json(
      { error: 'Failed to save billing key' },
      { status: 500 }
    );
  }
}

/**
 * PortOne API로 빌링키 정보 조회 (예시)
 */
async function fetchBillingKeyInfo(billingKey: string) {
  const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
  const apiSecret = process.env.PORTONE_API_SECRET;

  const response = await fetch(
    `https://api.portone.io/billing-keys/${billingKey}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `PortOne ${apiSecret}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch billing key info');
  }

  return response.json();
}

/**
 * 플랜별 월 요금 계산 (예시)
 */
function calculateAmount(plan: string, seats: number): number {
  const PLANS = {
    free: { base: 0, tierPrices: [0, 0, 0, 0] },
    standard: { base: 30000, tierPrices: [0, 20000, 40000, 60000] },
    pro: { base: 50000, tierPrices: [0, 30000, 60000, 90000] },
  };

  const planConfig = PLANS[plan as keyof typeof PLANS] || PLANS.free;
  let tierIndex = 0;

  if (seats <= 5) tierIndex = 0;
  else if (seats <= 15) tierIndex = 1;
  else if (seats <= 30) tierIndex = 2;
  else tierIndex = 3;

  return planConfig.base + planConfig.tierPrices[tierIndex];
}
