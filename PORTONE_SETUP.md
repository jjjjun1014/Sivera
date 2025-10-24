# PortOne V2 연동 가이드

> Sivera 프로젝트에서 PortOne V2를 사용한 정기결제 시스템 구축을 위한 가이드입니다.

## 📋 목차
1. [PortOne 설정 필요 정보](#portone-설정-필요-정보)
2. [환경 변수 설정](#환경-변수-설정)
3. [PortOne 관리자 콘솔 설정](#portone-관리자-콘솔-설정)
4. [API 구현 필요 사항](#api-구현-필요-사항)
5. [테스트 방법](#테스트-방법)

---

## PortOne 설정 필요 정보

### 1. 현재 가지고 있는 정보
- ✅ **Store ID**: `store-296c41e5-9a37-4616-9052-35a6089dae66`
- ✅ 환경변수에 이미 설정됨: `.env.local`

### 2. PortOne에서 받아야 하는 추가 정보

#### 🔑 API 키 (필수)
백엔드 API 호출을 위해 필요합니다.

```bash
# .env.local에 추가 필요
PORTONE_API_SECRET=your_api_secret_key_here
```

**받는 방법:**
1. [PortOne 관리자 콘솔](https://admin.portone.io/) 로그인
2. 상점 선택 (`store-296c41e5-9a37-4616-9052-35a6089dae66`)
3. 개발자 센터 → API Keys 메뉴
4. API Secret 키 생성 또는 조회
5. **주의**: Secret Key는 한 번만 표시되므로 안전한 곳에 저장

#### 📡 Channel Keys (필수)
결제 수단별 채널 키입니다. 프론트엔드에서 `requestIssueBillingKey()` 호출 시 사용됩니다.

필요한 채널:
- **PayPal 정기결제 (RT)** 채널 키
- **국내 카드 결제** 채널 키 (토스페이먼츠, KG이니시스 등)

```typescript
// 예시
const paypalChannelKey = "paypal_v2";  // PortOne에서 발급받은 실제 키로 변경
const cardChannelKey = "tosspayments_card";  // 또는 inicis_card 등
```

**받는 방법:**
1. PortOne 관리자 콘솔 로그인
2. 상점 선택
3. 결제 연동 → 채널 관리
4. 각 PG사별 채널 키 확인

---

## 환경 변수 설정

### `.env.local` 파일
```bash
# PortOne V2
NEXT_PUBLIC_PORTONE_STORE_ID=store-296c41e5-9a37-4616-9052-35a6089dae66

# PortOne API Secret (서버사이드에서만 사용)
PORTONE_API_SECRET=your_api_secret_key_here

# PortOne Webhook Secret (웹훅 검증용)
PORTONE_WEBHOOK_SECRET=your_webhook_secret_here

# 결제 수단별 채널 키 (선택사항 - 하드코딩해도 됨)
NEXT_PUBLIC_PORTONE_PAYPAL_CHANNEL=paypal_v2
NEXT_PUBLIC_PORTONE_CARD_CHANNEL=tosspayments_card
```

### `.env.example` 파일 업데이트
```bash
# PortOne V2
NEXT_PUBLIC_PORTONE_STORE_ID=store-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PORTONE_API_SECRET=your_api_secret_key
PORTONE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_PORTONE_PAYPAL_CHANNEL=paypal_channel_key
NEXT_PUBLIC_PORTONE_CARD_CHANNEL=card_channel_key
```

---

## PortOne 관리자 콘솔 설정

### 1. Webhook URL 등록 (필수)
PortOne이 결제 상태 변경을 알려줄 엔드포인트를 등록해야 합니다.

**Webhook URL:**
```
https://yourdomain.com/api/portone/billing-webhook
```

**설정 방법:**
1. PortOne 관리자 콘솔 로그인
2. 상점 선택
3. 개발자 센터 → Webhook
4. Webhook URL 추가
5. 이벤트 선택:
   - `BillingKeyIssued`: 빌링키 발급 완료
   - `BillingKeyDeleted`: 빌링키 삭제
   - `PaymentCompleted`: 결제 완료
   - `PaymentFailed`: 결제 실패
   - `PaymentCancelled`: 결제 취소

### 2. Redirect URLs 허용 목록 (선택)
브라우저 기반 결제 플로우를 위한 리다이렉트 URL을 등록합니다.

**허용할 URL:**
```
https://yourdomain.com/payment/billing/success
https://yourdomain.com/payment/billing/failure
https://localhost:3000/payment/billing/success  # 개발용
https://localhost:3000/payment/billing/failure  # 개발용
```

**설정 방법:**
1. PortOne 관리자 콘솔
2. 상점 설정 → 보안 설정
3. 허용된 Redirect URL 추가

### 3. PG 설정
각 결제 수단(PG)을 설정해야 합니다.

#### PayPal 설정
1. 결제 연동 → PayPal 선택
2. PayPal Business 계정 연동
3. **Reference Transaction (RT) 활성화 필수**
   - PayPal 고객센터에 별도 신청 필요
   - 정기결제를 위해서는 RT 권한이 있어야 함
4. Sandbox/Production 모드 선택

#### 국내 카드 설정 (토스페이먼츠 등)
1. 결제 연동 → 토스페이먼츠 (또는 KG이니시스 등) 선택
2. 사업자 정보 입력
3. 정산 계좌 설정
4. 빌링키 발급 기능 활성화 확인

---

## API 구현 필요 사항

### 1. Webhook 핸들러 (`/api/portone/billing-webhook`)
**파일 위치:** `/src/app/api/portone/billing-webhook/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 1. Webhook 검증
    const signature = request.headers.get('portone-signature');
    const webhookSecret = process.env.PORTONE_WEBHOOK_SECRET;

    // TODO: 서명 검증 로직 구현

    // 2. 이벤트 파싱
    const event = await request.json();

    switch (event.type) {
      case 'BillingKeyIssued':
        // 빌링키 발급 완료
        // DynamoDB에 저장: { userId, billingKey, customerId, method }
        await saveBillingKey(event.data);
        break;

      case 'PaymentCompleted':
        // 결제 성공
        // 구독 상태 업데이트, 이메일 발송
        await handlePaymentSuccess(event.data);
        break;

      case 'PaymentFailed':
        // 결제 실패
        // 재시도 로직, 사용자 알림
        await handlePaymentFailure(event.data);
        break;

      case 'BillingKeyDeleted':
        // 빌링키 삭제됨
        await deleteBillingKey(event.data);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
```

### 2. 결제 성공/실패 페이지
현재 구현 필요:
- `/src/app/payment/billing/success/page.tsx`
- `/src/app/payment/billing/failure/page.tsx`

### 3. 정기결제 실행 API (`/api/portone/charge`)
Lambda 함수 또는 Cron Job에서 호출할 API

```typescript
// POST /api/portone/charge
{
  "subscriptionId": "sub_123",
  "userId": "user_456",
  "amount": 30000,
  "currency": "KRW"
}
```

**구현 로직:**
1. DynamoDB에서 사용자의 빌링키 조회
2. PortOne API로 결제 요청
```typescript
const response = await fetch('https://api.portone.io/payments/billing-key', {
  method: 'POST',
  headers: {
    'Authorization': `PortOne ${process.env.PORTONE_API_SECRET}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID,
    billingKey: billingKeyFromDB,
    orderName: `Sivera ${planName} - ${month}월 구독료`,
    amount: {
      total: amount,
      currency: 'KRW'
    },
    customer: {
      customerId: userId
    }
  })
});
```
3. 결과에 따라 구독 상태 업데이트
4. 실패 시 재시도 로직 (최대 3회)

### 4. DynamoDB 테이블 스키마

#### BillingKeys 테이블
```
Partition Key: userId (String)
Sort Key: createdAt (Number - timestamp)

Attributes:
- billingKey: String (PortOne 빌링키)
- customerId: String (PortOne 커스텀 ID)
- paymentMethod: String (CARD | PAYPAL)
- cardInfo: Map (카드사, 마지막 4자리 등)
- paypalEmail: String (PayPal 이메일)
- isDefault: Boolean
- status: String (ACTIVE | DELETED)
- expiresAt: Number (카드 만료일 - 선택사항)
```

#### Subscriptions 테이블
```
Partition Key: userId (String)
Sort Key: subscriptionId (String)

Attributes:
- planType: String (free | standard | pro)
- status: String (active | past_due | canceled | expired)
- teamSeats: Number
- monthlyAmount: Number
- currency: String
- billingKey: String (BillingKeys 테이블 참조)
- trialEndDate: Number (timestamp)
- nextBillingDate: Number
- startDate: Number
- canceledAt: Number (선택사항)
```

---

## 테스트 방법

### 1. 로컬 환경 테스트
```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 테스트
# http://localhost:3000/dashboard/settings
# → Subscription & Billing 탭 → Standard 업그레이드
```

### 2. Webhook 테스트 (ngrok 사용)
```bash
# ngrok으로 로컬 서버 외부 노출
ngrok http 3000

# ngrok URL을 PortOne Webhook URL에 등록
# https://abcd1234.ngrok.io/api/portone/billing-webhook
```

### 3. 테스트 카드 번호
PortOne 샌드박스 환경에서 사용 가능한 테스트 카드:

| 카드사 | 카드번호 | CVC | 유효기간 |
|--------|----------|-----|----------|
| 신한카드 | 4312-xxxx-xxxx-xxxx | 123 | 12/25 |
| 국민카드 | 9410-xxxx-xxxx-xxxx | 123 | 12/25 |

**주의**: PortOne 문서에서 최신 테스트 카드 정보 확인 필요

### 4. PayPal Sandbox
1. [PayPal Developer](https://developer.paypal.com/) 접속
2. Sandbox 계정 생성
3. 테스트용 Business/Personal 계정으로 테스트

---

## 체크리스트

### PortOne에서 받아야 할 정보
- [ ] API Secret Key
- [ ] Webhook Secret
- [ ] PayPal 채널 키
- [ ] 국내 카드 채널 키
- [ ] PayPal RT 권한 활성화 확인
- [ ] PG 정산 계좌 설정 완료 확인

### 개발 구현 필요
- [ ] `/api/portone/billing-webhook` 구현
- [ ] `/api/portone/charge` 구현 (정기결제 실행)
- [ ] `/payment/billing/success` 페이지 구현
- [ ] `/payment/billing/failure` 페이지 구현
- [ ] DynamoDB 테이블 생성 (BillingKeys, Subscriptions)
- [ ] Lambda 함수 (월 1일 자동 결제)
- [ ] EventBridge 스케줄 설정
- [ ] 이메일 알림 (SES 연동)

### 배포 전 확인
- [ ] Webhook URL 프로덕션 환경에 등록
- [ ] Redirect URLs 프로덕션 도메인 등록
- [ ] 환경변수 프로덕션 서버에 설정
- [ ] PayPal 프로덕션 모드 전환
- [ ] PG사 프로덕션 모드 전환
- [ ] 실제 결제 테스트 (소액)

---

## 참고 문서
- [PortOne V2 공식 문서](https://developers.portone.io/)
- [PortOne V2 Browser SDK](https://github.com/portone-io/browser-sdk)
- [PayPal Reference Transactions](https://developer.paypal.com/docs/api/reference-transactions/)
- [빌링키 발급 가이드](https://developers.portone.io/docs/ko/billing-key/issue)

---

## 문의
PortOne 관련 문의: support@portone.io
