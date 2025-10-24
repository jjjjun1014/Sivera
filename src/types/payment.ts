/**
 * PortOne V2 결제 타입 정의
 */

export interface PortOnePaymentRequest {
  storeId: string;
  channelKey: string;
  paymentId: string;
  orderName: string;
  totalAmount: number;
  currency: 'KRW' | 'USD';
  payMethod: 'CARD' | 'VIRTUAL_ACCOUNT' | 'TRANSFER' | 'MOBILE' | 'EASY_PAY' | 'PAYPAL';
  customer?: {
    customerId?: string;
    fullName?: string;
    phoneNumber?: string;
    email?: string;
  };
  redirectUrl?: string;
  noticeUrls?: string[];
}

export interface BillingKeyRequest {
  storeId: string;
  channelKey: string;
  billingKeyMethod: 'CARD' | 'PAYPAL';
  customer: {
    customerId: string;
    fullName?: string;
    email?: string;
  };
  redirectUrl?: string;
  noticeUrls?: string[];
}

export interface BillingKeyResponse {
  billingKey: string;
  customerId: string;
  issueId: string;
  issuedAt: string;
  channelKey: string;
  method: {
    type: 'CARD' | 'PAYPAL';
    card?: {
      number: string;
      expiryYear: string;
      expiryMonth: string;
      brand: string;
    };
    paypal?: {
      email: string;
    };
  };
}

export interface SubscriptionPayment {
  subscriptionId: string;
  planType: 'free' | 'standard' | 'pro';
  teamSeats: number;
  monthlyAmount: number;
  currency: 'KRW' | 'USD';
  billingKey?: string;
  customerId: string;
  status: 'active' | 'past_due' | 'canceled' | 'expired';
  startDate: string;
  nextBillingDate: string;
  trialEndDate?: string;
}
