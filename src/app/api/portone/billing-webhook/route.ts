import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * PortOne Webhook 핸들러
 *
 * 처리하는 이벤트:
 * - BillingKeyIssued: 빌링키 발급 완료
 * - BillingKeyDeleted: 빌링키 삭제
 * - PaymentCompleted: 결제 완료
 * - PaymentFailed: 결제 실패
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

    // 서명 검증 (PortOne V2 방식)
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
    console.log('Received webhook event:', event.type);

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
        console.log('Unhandled event type:', event.type);
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
  console.log('Billing key issued:', data);

  // TODO: DynamoDB에 빌링키 저장
  // const billingKeyData = {
  //   userId: data.customer?.customerId,
  //   billingKey: data.billingKey,
  //   paymentMethod: data.method?.type, // 'CARD' | 'PAYPAL'
  //   cardInfo: data.method?.card, // 카드인 경우
  //   paypalEmail: data.method?.paypal?.email, // PayPal인 경우
  //   isDefault: true,
  //   status: 'ACTIVE',
  //   createdAt: Date.now(),
  //   issueId: data.issueId,
  // };

  // await saveToDynamoDB('BillingKeys', billingKeyData);

  // TODO: 사용자 구독 상태 업데이트
  // - 무료체험 시작일 설정
  // - 다음 결제일 설정 (14일 후)
  // - 플랜 상태를 'trial'로 변경

  // TODO: 환영 이메일 발송
  // await sendWelcomeEmail(data.customer?.email);
}

/**
 * 빌링키 삭제 처리
 */
async function handleBillingKeyDeleted(data: any) {
  console.log('Billing key deleted:', data);

  // TODO: DynamoDB에서 빌링키 상태 업데이트
  // await updateDynamoDB('BillingKeys', {
  //   billingKey: data.billingKey,
  //   status: 'DELETED',
  //   deletedAt: Date.now(),
  // });

  // TODO: 구독 취소 처리
  // - 구독 상태를 'canceled'로 변경
  // - 결제 수단 없음으로 표시

  // TODO: 알림 이메일 발송
  // await sendBillingKeyDeletedEmail(data.customer?.email);
}

/**
 * 결제 완료 처리
 */
async function handlePaymentCompleted(data: any) {
  console.log('Payment completed:', data);

  // TODO: 구독 결제 성공 처리
  // await updateDynamoDB('Subscriptions', {
  //   subscriptionId: data.orderName, // 또는 customData에서
  //   status: 'active',
  //   lastPaymentDate: Date.now(),
  //   nextBillingDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30일 후
  //   lastPaymentAmount: data.amount.total,
  // });

  // TODO: 결제 완료 이메일 발송
  // await sendPaymentSuccessEmail({
  //   email: data.customer?.email,
  //   amount: data.amount.total,
  //   currency: data.amount.currency,
  //   receiptUrl: data.receiptUrl,
  // });

  // TODO: 결제 내역 기록 (송장 생성)
  // await createInvoice(data);
}

/**
 * 결제 실패 처리
 */
async function handlePaymentFailed(data: any) {
  console.log('Payment failed:', data);

  // TODO: 구독 상태 업데이트
  // await updateDynamoDB('Subscriptions', {
  //   subscriptionId: data.orderName,
  //   status: 'past_due', // 결제 연체
  //   failedPaymentCount: increment by 1,
  //   lastFailedAt: Date.now(),
  //   failureReason: data.failureReason,
  // });

  // TODO: 재시도 로직
  // const retryCount = await getRetryCount(subscriptionId);
  // if (retryCount < 3) {
  //   // 3일 후 재시도 예약
  //   await scheduleRetry(subscriptionId, retryCount + 1);
  // } else {
  //   // 3번 실패 시 구독 일시정지
  //   await suspendSubscription(subscriptionId);
  // }

  // TODO: 결제 실패 알림 이메일
  // await sendPaymentFailureEmail({
  //   email: data.customer?.email,
  //   failureReason: data.failureReason,
  //   retryDate: getRetryDate(retryCount),
  // });
}

/**
 * 결제 취소 처리
 */
async function handlePaymentCancelled(data: any) {
  console.log('Payment cancelled:', data);

  // TODO: 환불 처리
  // await updateDynamoDB('Payments', {
  //   paymentId: data.paymentId,
  //   status: 'cancelled',
  //   cancelledAt: Date.now(),
  //   cancelReason: data.cancelReason,
  // });

  // TODO: 부분 환불 계산 (일할 계산)
  // const refundAmount = calculateProRatedRefund(data);

  // TODO: 환불 완료 이메일
  // await sendRefundEmail({
  //   email: data.customer?.email,
  //   refundAmount,
  //   originalAmount: data.amount.total,
  // });
}

/**
 * DynamoDB 저장 헬퍼 (예시)
 */
// async function saveToDynamoDB(tableName: string, item: any) {
//   // AWS SDK를 사용한 DynamoDB 저장 로직
//   // const dynamodb = new DynamoDBClient({ region: 'ap-northeast-2' });
//   // await dynamodb.putItem({
//   //   TableName: tableName,
//   //   Item: marshall(item),
//   // });
// }

/**
 * 이메일 발송 헬퍼 (예시)
 */
// async function sendEmail(to: string, subject: string, html: string) {
//   // AWS SES를 사용한 이메일 발송
//   // const ses = new SESClient({ region: 'ap-northeast-2' });
//   // await ses.sendEmail({
//   //   Source: 'noreply@sivera.io',
//   //   Destination: { ToAddresses: [to] },
//   //   Message: {
//   //     Subject: { Data: subject },
//   //     Body: { Html: { Data: html } },
//   //   },
//   // });
// }
