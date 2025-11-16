import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import * as PortOne from '@portone/server-sdk';

/**
 * PortOne Webhook 핸들러
 *
 * 처리하는 이벤트:
 * - BillingKeyIssued: 빌링키 발급 완료
 * - BillingKeyDeleted: 빌링키 삭제
 * - PaymentCompleted: 결제 완료
 * - PaymentFailed: 결제 실패
 * - PaymentCancelled: 결제 취소
 */

export async function POST(request: NextRequest) {
  try {
    // 1. Webhook 서명 검증
    const signature = request.headers.get('portone-signature');
    const webhookSecret = process.env.PORTONE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('PORTONE_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // 요청 본문 읽기
    const rawBody = await request.text();

    // 서명 검증 (PortOne V2 방식: HMAC SHA256)
    if (signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('base64');

      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // 2. 이벤트 파싱
    const event = JSON.parse(rawBody);

    console.log('Received webhook event:', {
      type: event.type,
      timestamp: new Date().toISOString(),
      data: event.data,
    });

    // 3. 이벤트 타입별 처리
    switch (event.type) {
      case 'BillingKeyIssued':
        await handleBillingKeyIssued(event.data);
        break;

      case 'BillingKeyDeleted':
        await handleBillingKeyDeleted(event.data);
        break;

      case 'PaymentCompleted':
        await handlePaymentCompleted(event.data);
        break;

      case 'PaymentFailed':
        await handlePaymentFailed(event.data);
        break;

      case 'PaymentCancelled':
        await handlePaymentCancelled(event.data);
        break;

      default:
        console.log('Unhandled webhook event type:', event.type);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * 빌링키 발급 완료 처리
 */
async function handleBillingKeyIssued(data: any) {
  console.log('Processing BillingKeyIssued:', data);

  try {
    // TODO: Amplify GraphQL로 Subscription 업데이트
    // const { data: subscription } = await client.models.Subscription.list({
    //   filter: { billingKey: { eq: data.billingKey } }
    // });
    
    // if (subscription?.[0]) {
    //   await client.models.Subscription.update({
    //     id: subscription[0].id,
    //     status: 'trialing',
    //     billingKey: data.billingKey,
    //   });
    // }

    // TODO: 환영 이메일 발송 (SES)
    // await sendWelcomeEmail(data.customer?.email);
    
    console.log('BillingKeyIssued processed successfully');
  } catch (error) {
    console.error('Error handling BillingKeyIssued:', error);
    throw error;
  }
}

/**
 * 빌링키 삭제 처리
 */
async function handleBillingKeyDeleted(data: any) {
  console.log('Processing BillingKeyDeleted:', data);

  try {
    // TODO: 구독 상태 업데이트
    // const { data: subscription } = await client.models.Subscription.list({
    //   filter: { billingKey: { eq: data.billingKey } }
    // });
    
    // if (subscription?.[0]) {
    //   await client.models.Subscription.update({
    //     id: subscription[0].id,
    //     status: 'canceled',
    //     canceledAt: new Date().toISOString(),
    //   });
    // }

    // TODO: 알림 이메일 발송
    // await sendBillingKeyDeletedEmail(data.customer?.email);
    
    console.log('BillingKeyDeleted processed successfully');
  } catch (error) {
    console.error('Error handling BillingKeyDeleted:', error);
    throw error;
  }
}

/**
 * 결제 완료 처리
 */
async function handlePaymentCompleted(data: any) {
  console.log('Processing PaymentCompleted:', data);

  try {
    // TODO: Payment 레코드 생성
    // const { data: subscription } = await client.models.Subscription.list({
    //   filter: { billingKey: { eq: data.billingKey } }
    // });
    
    // if (subscription?.[0]) {
    //   // 1. Payment 레코드 생성
    //   await client.models.Payment.create({
    //     subscriptionID: subscription[0].id,
    //     teamID: subscription[0].teamID,
    //     amount: data.amount.total,
    //     currency: data.currency,
    //     status: 'completed',
    //     paymentMethod: data.method?.type,
    //     portonePaymentId: data.paymentId,
    //     portoneTransactionId: data.transactionId,
    //     paidAt: new Date().toISOString(),
    //   });
    
    //   // 2. Subscription 상태 업데이트
    //   const nextPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    //   await client.models.Subscription.update({
    //     id: subscription[0].id,
    //     status: 'active',
    //     currentPeriodStart: new Date().toISOString(),
    //     currentPeriodEnd: nextPeriodEnd.toISOString(),
    //   });
    // }

    // TODO: 결제 완료 이메일 발송
    // await sendPaymentSuccessEmail({
    //   email: data.customer?.email,
    //   amount: data.amount.total,
    //   currency: data.currency,
    //   receiptUrl: data.receiptUrl,
    // });
    
    console.log('PaymentCompleted processed successfully');
  } catch (error) {
    console.error('Error handling PaymentCompleted:', error);
    throw error;
  }
}

/**
 * 결제 실패 처리
 */
async function handlePaymentFailed(data: any) {
  console.log('Processing PaymentFailed:', data);

  try {
    // TODO: 구독 상태 업데이트
    // const { data: subscription } = await client.models.Subscription.list({
    //   filter: { billingKey: { eq: data.billingKey } }
    // });
    
    // if (subscription?.[0]) {
    //   // 1. Payment 레코드 생성 (실패)
    //   await client.models.Payment.create({
    //     subscriptionID: subscription[0].id,
    //     teamID: subscription[0].teamID,
    //     amount: data.amount.total,
    //     currency: data.currency,
    //     status: 'failed',
    //     paymentMethod: data.method?.type,
    //     portonePaymentId: data.paymentId,
    //     failureReason: data.failReason,
    //   });
    
    //   // 2. Subscription 상태를 past_due로 변경
    //   await client.models.Subscription.update({
    //     id: subscription[0].id,
    //     status: 'past_due',
    //   });
    // }

    // TODO: 결제 실패 알림 이메일 발송
    // await sendPaymentFailedEmail({
    //   email: data.customer?.email,
    //   failReason: data.failReason,
    //   retryUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    // });

    // TODO: 재시도 로직 (3회까지)
    // if (failedAttempts < 3) {
    //   await scheduleRetryPayment(data.billingKey, data.amount);
    // }
    
    console.log('PaymentFailed processed successfully');
  } catch (error) {
    console.error('Error handling PaymentFailed:', error);
    throw error;
  }
}

/**
 * 결제 취소 처리
 */
async function handlePaymentCancelled(data: any) {
  console.log('Processing PaymentCancelled:', data);

  try {
    // TODO: Payment 레코드 업데이트
    // const { data: payment } = await client.models.Payment.list({
    //   filter: { portonePaymentId: { eq: data.paymentId } }
    // });
    
    // if (payment?.[0]) {
    //   await client.models.Payment.update({
    //     id: payment[0].id,
    //     status: 'canceled',
    //   });
    // }

    // TODO: 환불 처리 (부분 환불 계산)
    // const refundAmount = calculateProRatedRefund(
    //   data.amount.total,
    //   data.cancelledAt,
    //   subscription.currentPeriodEnd
    // );

    // TODO: 환불 완료 이메일 발송
    // await sendRefundEmail({
    //   email: data.customer?.email,
    //   refundAmount,
    //   currency: data.currency,
    // });
    
    console.log('PaymentCancelled processed successfully');
  } catch (error) {
    console.error('Error handling PaymentCancelled:', error);
    throw error;
  }
}
