# README2 - 중요 개발 상태 및 체크리스트

## 🎯 현재 프로젝트 상태 (2025-11-13)

### ✅ 완료된 작업

#### 1. PayPal 직접 연동 완료
- **인증 성공**: REST API Client ID/Secret 설정 완료
- **구독 플랜 생성 완료**:
  - Standard Plan: $49.99/월 (14일 무료체험) - `P-6LF07206FN2388234NEKBE6A`
  - Pro Plan: $89.99/월 (14일 무료체험) - `P-3S363121WW516915BNEKBE6I`
- **결제 테스트 성공**: Sandbox에서 구독 생성 및 활성화 확인
- **환율 설정**: 1 USD = 1495 KRW

#### 2. 테스트 모드 구축 완료
- **환경변수**: `NEXT_PUBLIC_ENABLE_TEST_MODE=true` (.env.local)
- **자동 로그인**: AuthContext에서 테스트 사용자 자동 설정
- **하드코딩 데이터**: 플랫폼, 캠페인, 팀, 구독 등 모든 테스트 데이터 준비
- **적용 페이지**: TeamPage, SettingsPage 테스트 모드 적용 완료

#### 3. 테이블 편집 버그 수정
- **useTableEditing Hook 수정**: `setEditingCell`, `setTempValues` 함수 추가
- **하위 호환성**: 직접 구조분해 방식과 `state` 객체 방식 모두 지원
- **적용 컴포넌트**: AdGroupTable, AdTable, CampaignTable

---

## 📁 주요 파일 위치

### PayPal 관련
```
/.env.local                                    # PayPal 크레덴셜 및 Plan ID
/src/lib/config/paypal.ts                      # PayPal 설정 및 환율
/src/lib/services/paypal.service.ts            # PayPal REST API 서비스
/test-paypal-api.js                            # API 테스트 스크립트
/test-paypal-payment.js                        # 결제 테스트 스크립트
```

### 테스트 모드 관련
```
/.env.local                                    # NEXT_PUBLIC_ENABLE_TEST_MODE=true
/src/lib/config/test-mode.ts                   # 테스트 데이터 정의
/src/lib/hooks/useTestData.ts                  # 테스트 데이터 Hook
/src/contexts/auth-context.tsx                 # 자동 로그인 로직
/TEST_MODE_GUIDE.md                            # 테스트 모드 사용 가이드
```

### 테이블 컴포넌트
```
/src/hooks/useTableEditing.ts                  # 테이블 편집 상태 관리
/src/components/tables/AdGroupTable.tsx        # 광고그룹 테이블
/src/components/tables/AdTable.tsx             # 광고 테이블
/src/components/tables/CampaignTable.tsx       # 캠페인 테이블
```

---

## 🔐 중요 크레덴셜 (.env.local)

### PayPal Sandbox
```bash
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AWdHs-mvdl1fe_FHs7G8qewN8fLCulrzaxFkhgP4t2YoDCMMvAaV8VkmpXhVUJ-oIuom02hT17ZM4Keh
PAYPAL_CLIENT_SECRET=ECdbGrGwZnn_GNPA6VPYv-QrJP9nc6NDnlyCy9qGt6kUFZmHZU7abwYPKf-1jXdKfVHZup2Mm48Hx887
PAYPAL_MODE=sandbox
PAYPAL_PLAN_ID_STANDARD=P-6LF07206FN2388234NEKBE6A
PAYPAL_PLAN_ID_PRO=P-3S363121WW516915BNEKBE6I
```

### PayPal 테스트 계정
- **비즈니스 계정**: `sb-thru4347414172@business.example.com` / `5AsnxA&4`
- **개인 계정**: PayPal Developer Dashboard에서 생성 필요

---

## 🧪 테스트 모드 사용법

### 활성화
```bash
# .env.local 수정
NEXT_PUBLIC_ENABLE_TEST_MODE=true

# 서버 재시작
pnpm dev
```

### 테스트 가능한 기능
- ✅ 자동 로그인 (인증 우회)
- ✅ 플랫폼 연동 데이터 (Google, Meta, Amazon, TikTok)
- ✅ 캠페인/광고 데이터 (다양한 상태)
- ✅ 분석 데이터 (30일 일별)
- ✅ 구독/결제 상태 (Pro 플랜 활성화)
- ✅ 팀 관리 (팀원 3명, 초대 2건)

### 비활성화
```bash
# .env.local 수정
NEXT_PUBLIC_ENABLE_TEST_MODE=false

# 서버 재시작
pnpm dev
```

---

## 🗑️ 하드코딩 제거 방법

### 1. 테스트 모드 완전 제거

```bash
# 1단계: 환경변수 제거
# .env.local에서 다음 줄 삭제:
NEXT_PUBLIC_ENABLE_TEST_MODE=true

# 2단계: 테스트 모드 파일 삭제
rm /src/lib/config/test-mode.ts
rm /src/lib/hooks/useTestData.ts
rm /TEST_MODE_GUIDE.md

# 3단계: 코드에서 import 제거
```

### 2. 코드 수정 (일괄 삭제)

**src/contexts/auth-context.tsx**
```typescript
// 삭제할 import
import { isTestMode, TEST_USER } from '@/lib/config/test-mode';

// 삭제할 코드 (21-36번째 줄)
    // 테스트 모드: 즉시 테스트 사용자로 로그인
    if (isTestMode) {
      console.log('🧪 TEST MODE: Auto-login as test user');
      setUser({
        id: TEST_USER.id,
        email: TEST_USER.email,
        fullName: TEST_USER.name,
        avatarUrl: undefined,
        role: TEST_USER.role,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as User);
      setLoading(false);
      return;
    }

// 삭제할 코드 (signIn 함수 내)
    // 테스트 모드: 즉시 성공
    if (isTestMode) {
      console.log('🧪 TEST MODE: SignIn bypassed');
      setUser({
        id: TEST_USER.id,
        email: TEST_USER.email,
        fullName: TEST_USER.name,
        avatarUrl: undefined,
        role: TEST_USER.role,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as User);
      return { success: true };
    }
```

**src/app/dashboard/team/page.tsx**
```typescript
// 삭제할 import
import { isTestMode, TEST_USER } from "@/lib/config/test-mode";

// 삭제할 코드 (fetchUser 함수 내)
      if (isTestMode) {
        // 테스트 모드: 하드코딩된 사용자 반환
        setCurrentUser({
          data: {
            id: TEST_USER.id,
            email: TEST_USER.email,
            fullName: TEST_USER.name,
            role: TEST_USER.role,
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as User,
        });
        return;
      }
```

**src/app/dashboard/settings/page.tsx**
```typescript
// 삭제할 import
import { isTestMode, TEST_USER } from "@/lib/config/test-mode";

// 삭제할 코드 (loadUserData 함수 내)
        // 테스트 모드: 하드코딩된 사용자 정보
        if (isTestMode) {
          setProfile({
            name: TEST_USER.name,
            email: TEST_USER.email,
            phone: "010-1234-5678",
            company: "Sivera",
            position: "Admin",
            slackWebhook: "",
            team: TEST_USER.teamName,
          });
          setUserTeams([{ id: TEST_USER.teamId, name: TEST_USER.teamName }]);
          setIsLoadingProfile(false);
          return;
        }
```

**src/components/settings/BillingSection.tsx**
```typescript
// 삭제할 import
import { useSubscription, usePaymentHistory } from '@/lib/hooks/useTestData';

// 위 Hook 사용 부분을 실제 API 호출로 교체
```

### 3. 검색 및 확인

```bash
# 테스트 모드 관련 코드 검색
grep -r "isTestMode" src/
grep -r "TEST_USER" src/
grep -r "test-mode" src/
grep -r "useTestData" src/

# 모든 참조가 제거되었는지 확인
```

---

## 🚨 배포 전 체크리스트

### PayPal
- [ ] `.env.local`에서 `PAYPAL_MODE=production` 변경
- [ ] Production Client ID/Secret 발급 및 교체
- [ ] Production 환경에서 구독 플랜 재생성
- [ ] Plan ID 업데이트
- [ ] Webhook URL 등록 (HTTPS 필수)

### 테스트 모드
- [ ] `NEXT_PUBLIC_ENABLE_TEST_MODE=false` 또는 환경변수 제거
- [ ] 테스트 모드 파일 삭제
- [ ] 모든 import 제거
- [ ] 하드코딩된 로직 제거

### 인증
- [ ] Cognito User Pool 프로덕션 설정 확인
- [ ] 자동 로그아웃 시간 확인 (현재 3시간)
- [ ] 리디렉션 URL 설정

### API/DB
- [ ] DynamoDB 테이블 프로덕션 확인
- [ ] Lambda 함수 배포
- [ ] API Gateway 엔드포인트 확인

---

## 📊 팀 플랜별 가격 (추후 구현 필요)

현재는 2가지 플랜만 있지만, 팀 규모에 따라 가격이 달라져야 함:

```typescript
// 예시 구조 (src/lib/config/plans.ts)
export const TEAM_PRICING = {
  standard: {
    '1-5': 49.99,
    '6-10': 69.99,
    '11-20': 89.99,
    '21+': 109.99,
  },
  pro: {
    '1-5': 89.99,
    '6-10': 119.99,
    '11-20': 149.99,
    '21+': 179.99,
  },
};
```

**TODO**: PayPal 구독 생성 시 팀 규모를 고려한 Plan ID 선택 로직 추가

---

## 🐛 알려진 이슈

### 해결됨
- ✅ `setEditingCell is not defined` - useTableEditing Hook 수정으로 해결
- ✅ `UserUnAuthenticatedException` - 테스트 모드 적용으로 해결

### 남은 작업
- [ ] PayPal 결제 UI 컴포넌트 개발
- [ ] 웹훅 엔드포인트 구현 (`/api/webhooks/paypal`)
- [ ] 팀 규모별 가격 책정 로직
- [ ] 구독 상태 DB 저장 로직
- [ ] 이메일 알림 (결제 성공/실패)

---

## 📝 다음 작업 우선순위

1. **결제 UI 개발** (우선순위 높음)
   - PayPalButtons 컴포넌트 통합
   - 플랜 선택 페이지
   - 결제 성공/실패 페이지

2. **웹훅 구현** (중요)
   - 구독 생성/활성화/취소/결제 실패 이벤트 처리
   - DB 업데이트 로직
   - 이메일 알림

3. **프로덕션 준비**
   - PayPal Production 계정 설정
   - 환경변수 프로덕션 전환
   - 테스트 모드 완전 제거

---

## 🔗 유용한 링크

- **PayPal Developer**: https://developer.paypal.com/dashboard
- **PayPal API Docs**: https://developer.paypal.com/docs/api/subscriptions/v1/
- **Sandbox Accounts**: https://developer.paypal.com/dashboard/accounts
- **Test Card Numbers**: PayPal Sandbox는 실제 카드 불필요

---

## 💡 팁

### PayPal 테스트
```bash
# 구독 플랜 테스트
node test-paypal-api.js

# 결제 테스트
node test-paypal-payment.js

# 구독 상태 확인
node test-paypal-payment.js I-4E0PVYVJ1J8N
```

### 테스트 모드
```bash
# 현재 상태 확인
grep "ENABLE_TEST_MODE" .env.local

# 로그 확인
# 브라우저 콘솔에 "🧪 TEST MODE" 메시지 표시됨
```

### 디버깅
```bash
# PayPal API 에러 확인
# debug_id를 PayPal 지원팀에 전달

# 테이블 편집 에러
# useTableEditing Hook 반환값 확인
```

---

**마지막 업데이트**: 2025-11-13
**작성자**: GitHub Copilot (Claude Sonnet 4.5)
