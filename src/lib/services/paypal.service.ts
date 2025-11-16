/**
 * PayPal 직접 연동 서비스
 * REST API 직접 호출 방식
 * @see https://developer.paypal.com/docs/api/orders/v2/
 * @see https://developer.paypal.com/docs/api/subscriptions/v1/
 */

import { PAYPAL_CONFIG, formatPayPalAmount } from '@/lib/config/paypal';

/**
 * PayPal Access Token 가져오기
 */
async function getPayPalAccessToken(): Promise<string> {
  const response = await fetch(`${PAYPAL_CONFIG.apiUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${PAYPAL_CONFIG.clientId}:${PAYPAL_CONFIG.clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Failed to get PayPal access token: ${response.statusText}`);
  }

  const result = await response.json();
  return result.access_token;
}

/**
 * 일회성 결제 주문 생성
 */
export async function createPayPalOrder(params: {
  amount: number;
  description: string;
  userId: string;
  planType: string;
}) {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_CONFIG.apiUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: formatPayPalAmount(params.amount),
            description: params.description,
            custom_id: `${params.userId}-${params.planType}`,
          },
        ],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/paypal/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/paypal/cancel`,
          brand_name: 'Sivera',
          locale: 'ko-KR',
          user_action: 'PAY_NOW',
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`PayPal order creation failed: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      success: true,
      orderId: result.id,
      approvalUrl: result.links?.find((link: any) => link.rel === 'approve')?.href,
    };
  } catch (error) {
    console.error('❌ PayPal order creation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 결제 완료 처리 (주문 캡처)
 */
export async function capturePayPalOrder(orderId: string) {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_CONFIG.apiUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`PayPal order capture failed: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      success: true,
      order: result,
      status: result.status,
      captureId: result.purchase_units?.[0]?.payments?.captures?.[0]?.id,
    };
  } catch (error) {
    console.error('❌ PayPal order capture failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 구독 생성 (정기결제) - REST API 직접 호출
 * 14일 무료 체험 포함
 */
export async function createPayPalSubscription(params: {
  planId: string;
  userId: string;
  teamId: string;
  startImmediately?: boolean; // 즉시 시작 여부 (무료 체험 건너뛰기)
}) {
  try {
    const accessToken = await getPayPalAccessToken();
    
    // 무료 체험 시작 시간 계산 (현재 시간)
    const now = new Date();
    const trialEndDate = new Date(now);
    trialEndDate.setDate(trialEndDate.getDate() + PAYPAL_CONFIG.trialPeriod.days);
    
    const requestBody: any = {
      plan_id: params.planId,
      custom_id: `${params.userId}-${params.teamId}`,
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/paypal/subscription/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/paypal/subscription/cancel`,
        brand_name: 'Sivera',
        locale: 'ko-KR',
        user_action: 'SUBSCRIBE_NOW',
      },
    };

    // 무료 체험 활성화 (즉시 시작이 아닌 경우)
    if (PAYPAL_CONFIG.trialPeriod.enabled && !params.startImmediately) {
      requestBody.start_time = now.toISOString();
      // PayPal은 플랜 레벨에서 무료 체험을 설정해야 함
      // 여기서는 구독 생성 시 start_time만 지정
    }
    
    const response = await fetch(`${PAYPAL_CONFIG.apiUrl}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PayPal subscription creation failed: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();

    return {
      success: true,
      subscriptionId: result.id,
      approvalUrl: result.links?.find((link: any) => link.rel === 'approve')?.href,
      status: result.status,
      trialEndDate: PAYPAL_CONFIG.trialPeriod.enabled && !params.startImmediately 
        ? trialEndDate 
        : null,
    };
  } catch (error) {
    console.error('❌ PayPal subscription creation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 구독 조회
 */
export async function getPayPalSubscription(subscriptionId: string) {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_CONFIG.apiUrl}/v1/billing/subscriptions/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`PayPal subscription fetch failed: ${response.statusText}`);
    }

    const subscription = await response.json();

    return {
      success: true,
      subscription,
    };
  } catch (error) {
    console.error('❌ PayPal subscription fetch failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 구독 취소
 */
export async function cancelPayPalSubscription(subscriptionId: string, reason?: string) {
  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_CONFIG.apiUrl}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        reason: reason || '사용자 요청',
      }),
    });

    if (!response.ok) {
      throw new Error(`PayPal subscription cancellation failed: ${response.statusText}`);
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('❌ PayPal subscription cancellation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 환불 처리
 */
export async function refundPayPalCapture(params: {
  captureId: string;
  amount?: number;
  note?: string;
}) {
  try {
    const response = await fetch(`${PAYPAL_CONFIG.apiUrl}/v2/payments/captures/${params.captureId}/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${PAYPAL_CONFIG.clientId}:${PAYPAL_CONFIG.clientSecret}`).toString('base64')}`,
      },
      body: JSON.stringify({
        amount: params.amount ? formatPayPalAmount(params.amount) : undefined,
        note_to_payer: params.note || '환불 처리',
      }),
    });

    if (!response.ok) {
      throw new Error(`PayPal refund failed: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      success: true,
      refund: result,
    };
  } catch (error) {
    console.error('❌ PayPal refund failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 웹훅 서명 검증
 */
export async function verifyPayPalWebhook(params: {
  webhookId: string;
  headers: Record<string, string>;
  body: any;
}) {
  try {
    const response = await fetch(`${PAYPAL_CONFIG.apiUrl}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${PAYPAL_CONFIG.clientId}:${PAYPAL_CONFIG.clientSecret}`).toString('base64')}`,
      },
      body: JSON.stringify({
        transmission_id: params.headers['paypal-transmission-id'],
        transmission_time: params.headers['paypal-transmission-time'],
        cert_url: params.headers['paypal-cert-url'],
        auth_algo: params.headers['paypal-auth-algo'],
        transmission_sig: params.headers['paypal-transmission-sig'],
        webhook_id: params.webhookId,
        webhook_event: params.body,
      }),
    });

    const result = await response.json();

    return {
      success: result.verification_status === 'SUCCESS',
      status: result.verification_status,
    };
  } catch (error) {
    console.error('❌ PayPal webhook verification failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
