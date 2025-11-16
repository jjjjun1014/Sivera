/**
 * PortOne REST API 클라이언트
 * 
 * 서버 사이드에서만 사용 가능 (API Secret 포함)
 * V2 API hostname: api.portone.io
 */

if (!process.env.NEXT_PUBLIC_PORTONE_STORE_ID) {
  throw new Error('NEXT_PUBLIC_PORTONE_STORE_ID is not configured');
}

if (!process.env.PORTONE_API_SECRET) {
  throw new Error('PORTONE_API_SECRET is not configured');
}

const PORTONE_API_BASE = 'https://api.portone.io';
const PORTONE_API_SECRET = process.env.PORTONE_API_SECRET!;

/**
 * 공통 헤더
 */
const getHeaders = () => ({
  'Authorization': `PortOne ${PORTONE_API_SECRET}`,
  'Content-Type': 'application/json',
});

/**
 * 빌링키 정보 조회
 * GET /billing-keys/{billingKey}
 */
export async function getBillingKey(billingKey: string) {
  try {
    const response = await fetch(
      `${PORTONE_API_BASE}/billing-keys/${encodeURIComponent(billingKey)}`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to get billing key: ${error.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get billing key:', error);
    throw error;
  }
}

/**
 * 빌링키로 결제 요청
 * POST /payments/{paymentId}/billing-key
 */
export async function payWithBillingKey(params: {
  billingKey: string;
  paymentId: string;
  orderName: string;
  amount: number;
  currency: 'KRW' | 'USD';
  customerName?: string;
  customerEmail?: string;
}) {
  try {
    const requestBody: any = {
      storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID,
      billingKey: params.billingKey,
      orderName: params.orderName,
      amount: {
        total: params.amount,
      },
      currency: params.currency,
    };

    if (params.customerName && params.customerEmail) {
      requestBody.customer = {
        name: {
          full: params.customerName,
        },
        email: params.customerEmail,
      };
    }

    const response = await fetch(
      `${PORTONE_API_BASE}/payments/${encodeURIComponent(params.paymentId)}/billing-key`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to pay with billing key: ${error.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to pay with billing key:', error);
    throw error;
  }
}

/**
 * 결제 정보 조회
 * GET /payments/{paymentId}
 */
export async function getPayment(paymentId: string) {
  try {
    const response = await fetch(
      `${PORTONE_API_BASE}/payments/${encodeURIComponent(paymentId)}`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to get payment: ${error.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get payment:', error);
    throw error;
  }
}

/**
 * 결제 취소 (환불)
 * POST /payments/{paymentId}/cancel
 */
export async function cancelPayment(params: {
  paymentId: string;
  amount?: number;
  reason?: string;
}) {
  try {
    const requestBody: any = {
      storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID,
    };

    if (params.amount) {
      requestBody.amount = params.amount;
    }

    if (params.reason) {
      requestBody.reason = params.reason;
    }

    const response = await fetch(
      `${PORTONE_API_BASE}/payments/${encodeURIComponent(params.paymentId)}/cancel`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to cancel payment: ${error.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to cancel payment:', error);
    throw error;
  }
}

/**
 * 빌링키 삭제
 * DELETE /billing-keys/{billingKey}
 */
export async function deleteBillingKey(billingKey: string) {
  try {
    const response = await fetch(
      `${PORTONE_API_BASE}/billing-keys/${encodeURIComponent(billingKey)}?storeId=${encodeURIComponent(process.env.NEXT_PUBLIC_PORTONE_STORE_ID!)}`,
      {
        method: 'DELETE',
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to delete billing key: ${error.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to delete billing key:', error);
    throw error;
  }
}

/**
 * 정기 결제 예약
 * 매월 자동 결제를 위해 사용
 */
export async function schedulePayment(params: {
  billingKey: string;
  paymentId: string;
  orderName: string;
  amount: number;
  currency: 'KRW' | 'USD';
  scheduledAt: Date;
}) {
  try {
    // TODO: PortOne에서 스케줄 API 제공 시 구현
    // 현재는 별도 스케줄러 (Lambda EventBridge 등) 사용 필요
    console.log('Schedule payment:', params);
  } catch (error) {
    console.error('Failed to schedule payment:', error);
    throw error;
  }
}
