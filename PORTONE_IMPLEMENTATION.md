# PortOne 결제 시스템 구현 완료

## 📋 구현 내역

### 1. 환경변수 설정

#### 프론트엔드 (.env.local)
```env
# PortOne Payment Integration
NEXT_PUBLIC_PORTONE_STORE_ID=store-296c41e5-9a37-4616-9052-35a6089dae66
PORTONE_API_SECRET=store-296c41e5-9a37-4616-9052-35a6089dae66
PORTONE_WEBHOOK_SECRET=whsec_CrAGrieeFB2F2+5JBohtLMUEUn/rqG/h+a0/XTfz42w=
NEXT_PUBLIC_PORTONE_CHANNEL_GROUP=channel-key-bb632a22-c8b3-4cc0-8efb-5cd9ecf2ff72
PORTONE_INICIS_CHANNEL_KEY=channel-key-bb632a22-c8b3-4cc0-8efb-5cd9ecf2ff72
PORTONE_INICIS_MID=INIpayTest
PORTONE_PAYPAL_CHANNEL_KEY=channel-key-e1e709a9-9810-4c52-903d-866c5b3368ec
PORTONE_PAYPAL_MID=7WBB3CKT63FRG
```

### 2. 백엔드 스키마 추가 (sivera-backend)

`/amplify/data/resource.ts`에 다음 모델 추가됨:

#### Enums
- `PlanTier`: free, standard, pro
- `SubscriptionStatus`: active, trialing, past_due, canceled, unpaid
- `PaymentStatus`: pending, completed, failed, canceled, refunded

#### Models
- **Plan**: 플랜 정보 (티어, 가격, 기능, 제한)
- **Subscription**: 팀 구독 정보 (플랜, 상태, 빌링키, 기간)
- **Payment**: 결제 내역 (금액, 상태, PortOne ID)
- **Usage**: 사용량 추적 (월별 메트릭)

### 3. 프론트엔드 구현

#### API 엔드포인트

##### `/app/api/billing/save/route.ts`
- 빌링키 저장 및 구독 생성
- PortOne REST API로 빌링키 검증
- 14일 무료 체험 설정
- Subscription 생성 (TODO: Amplify 연동 필요)

##### `/app/api/portone/billing-webhook/route.ts`
- Webhook 서명 검증 (HMAC SHA256)
- 5가지 이벤트 처리:
  - `BillingKeyIssued`: 빌링키 발급 완료
  - `BillingKeyDeleted`: 빌링키 삭제
  - `PaymentCompleted`: 결제 완료
  - `PaymentFailed`: 결제 실패
  - `PaymentCancelled`: 결제 취소
- 각 이벤트별 TODO 구현 가이드 포함

#### 유틸리티

##### `/lib/portone/client.ts`
PortOne REST API 클라이언트 함수:
- `getBillingKey()`: 빌링키 정보 조회
- `payWithBillingKey()`: 빌링키로 결제
- `getPayment()`: 결제 정보 조회
- `cancelPayment()`: 결제 취소/환불
- `deleteBillingKey()`: 빌링키 삭제

##### `/lib/config/plans.ts`
플랜 설정 및 계산 함수:
- `PLANS`: 플랜별 가격 및 기능 정의
- `TEAM_SIZE_TIERS`: 팀 규모별 추가 요금
- `getMonthlyPrice()`: 월 요금 계산
- `canAddTeamMember()`: 팀원 추가 가능 여부
- `canConnectAdAccount()`: 광고 계정 연결 가능 여부

#### 결제 페이지

##### `/app/payment/billing/register/page.tsx`
- 플랜 선택 및 구독 정보 표시
- PortOne 빌링키 발급 위젯 통합
- 스마트 라우팅 (이니시스 + PayPal)
- 14일 무료 체험 안내

### 4. 플랜 구조

#### Free 플랜
- 가격: ₩0
- 팀원: 1명
- 광고 계정: 1개
- 데이터: 3일

#### Standard 플랜
- 기본: ₩129,000/월 (1-5명)
- 광고 계정: 5개
- 데이터: 무제한
- AI 챗봇: 사용 가능
- API: 읽기 전용

#### Pro 플랜
- 기본: ₩389,000/월 (1-5명)
- 광고 계정: 무제한
- 데이터: 무제한
- AI 챗봇: 사용 가능
- API: 읽기/쓰기 전용
- 우선 지원

#### 팀 규모 추가 요금
- 1-5명: 추가 요금 없음
- 6-15명: +₩129,000/월
- 16-30명: +₩259,000/월
- 31-50명: +₩519,000/월

## 🔧 TODO 항목

### 1. Amplify GraphQL 연동
현재 TODO로 표시된 부분:

```typescript
// /app/api/billing/save/route.ts
// TODO: Amplify Auth로 사용자 인증
// TODO: Subscription 생성 (GraphQL mutation)
// TODO: Usage 레코드 초기화

// /app/api/portone/billing-webhook/route.ts
// TODO: 각 이벤트별 Subscription/Payment 업데이트
// TODO: GraphQL mutation 호출
```

### 2. 이메일 발송 (SES)
```typescript
// TODO: 환영 이메일
// TODO: 결제 완료 이메일
// TODO: 결제 실패 알림
// TODO: 구독 취소 확인
```

### 3. 정기 결제 스케줄러
- Lambda EventBridge로 매월 자동 결제
- 14일 무료 체험 종료 시 첫 결제
- 결제 실패 시 재시도 로직 (3회)

### 4. 프론트엔드 UI
- `/dashboard/billing/plans` - 플랜 비교 페이지
- `/dashboard/billing/subscription` - 현재 구독 관리
- 사용량 대시보드 (현재 사용량 vs 제한)
- 업그레이드/다운그레이드 모달

## 📚 참고 문서

- **PortOne V2 SDK**: https://developers.portone.io/sdk/ko/v2-server-sdk/readme
- **PortOne REST API**: https://developers.portone.io/api/rest-v2?v=v2
- **브라우저 SDK**: https://developers.portone.io/sdk/ko/v2-sdk/readme
- **React Native SDK**: https://github.com/portone-io/react-native-sdk

## 🔐 보안 고려사항

1. **API Secret 보호**: 서버 사이드에서만 사용
2. **Webhook 서명 검증**: HMAC SHA256으로 검증
3. **빌링키 암호화**: DynamoDB 저장 시 암호화 권장
4. **HTTPS 필수**: 프로덕션 환경에서 반드시 HTTPS 사용

## 🚀 배포 전 체크리스트

- [ ] 프로덕션 PortOne Store ID 및 API Secret 설정
- [ ] Webhook URL 등록 (https://yourdomain.com/api/portone/billing-webhook)
- [ ] Amplify Subscription/Payment 스키마 배포
- [ ] 정기 결제 스케줄러 Lambda 함수 배포
- [ ] SES 이메일 템플릿 설정
- [ ] 테스트 결제 시나리오 검증
- [ ] 환불 정책 및 프로세스 확인
- [ ] 개인정보 처리방침 업데이트
