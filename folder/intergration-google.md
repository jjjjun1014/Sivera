# Google Ads API 연동 통합 설계 및 정책

올애드 플랫폼의 Google Ads API 연동을 위한 종합적인 설계와 정책을 수립하겠습니다. 기존 프로젝트 구조와 요구사항을 모두 반영하여 체계적으로 구성했습니다.

## 1. 전체 아키텍처 개요

Google Ads API 연동은 크게 세 가지 핵심 컴포넌트로 구성됩니다:

### 인증 시스템 (OAuth 2.0)

사용자의 Google Ads 계정에 안전하게 접근하기 위한 OAuth 2.0 기반 인증 시스템입니다. 최대 4단계의 간소화된 프로세스로 사용자 경험을 최적화합니다.

### 데이터 동기화 시스템

배치 처리 방식으로 대규모 계정의 캠페인 데이터를 효율적으로 동기화합니다. 시간당 1회 실행되는 증분 동기화와 일일 전체 동기화를 병행합니다.

### 캠페인 관리 인터페이스

Google의 네이티브 UI를 활용한 캠페인 생성과 직관적인 테이블 형태의 성과 대시보드를 제공합니다.

## 2. 계정 연동 플로우 (최대 4단계)

### Step 1: 연동 시작

```typescript
통합 페이지 구조:

1. Google Ads 로고 및 설명
2. "Google Ads 연동하기" 버튼
3. 연동 절차 안내
4. 보안 정보 표시
```

### Step 2: Google 로그인 (Google 제공 화면)

사용자는 Google의 공식 OAuth 화면에서 로그인하고 권한을 승인합니다.

### Step 3: 계정 선택 및 확인

```typescript
// app/(dashboard)/integrations/google-ads/callback/page.tsx
import { Suspense } from "react";
import { GoogleAdsCallbackHandler } from "@/components/integrations/google-ads/callback-handler";

export default function GoogleAdsCallbackPage() {
  return (
    <Suspense fallback={<div>인증 처리 중...</div>}>
      <GoogleAdsCallbackHandler />
    </Suspense>
  );
}
```

### Step 4: 연동 완료

```typescript
연동 완료 화면:

1. 성공 아이콘 표시
2. 완료 메시지
3. 캠페인 대시보드로 이동 버튼
4. 추가 설정 안내
```

## 3. Server Actions 구현

### OAuth 인증 처리

```typescript
// actions/integrations/google-ads.ts
"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { GoogleOAuthClient } from "@/services/google-ads/auth"
import { logger } from "@/utils/logger"

export async function startGoogleAdsAuth() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const oauth = new GoogleOAuthClient()
  const authUrl = oauth.generateAuthUrl()

  // 상태 저장 (CSRF 방지)
  await supabase.from("oauth_states").insert({
    user_id: user.id,
    provider: "google_ads",
    state: oauth.state,
    expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10분
  })

  redirect(authUrl)
}

OAuth 콜백 처리 흐름:

1. 상태 토큰 검증 (CSRF 보호)
2. 인증 코드로 액세스 토큰 획듍
3. 토큰 암호화 저장
4. Google Ads 계정 정보 조회
5. 계정 정보 데이터베이스에 저장
6. 연동 완료 로깅
```

## 4. 캠페인 관리 서비스

### 서비스 레이어 구현

캠페인 관리 서비스 구조:

**초기화:**
- API 클라이언트 설정
- OAuth 자격 증명 로드
- 개발자 토큰 설정

**캠페인 조회:**
- 고객 ID와 리프레시 토큰으로 인증
- GAQL(Google Ads Query Language) 쿼리 작성
- 캠페인 데이터 및 메트릭 조회
- 30일 간 데이터 필터링
- 삭제되지 않은 캠페인만 포함
- 스트림 기반 데이터 처리
      campaigns.push(this.mapToCampaign(row))
    }

    return campaigns
  }

  async toggleCampaignStatus(
    customerId: string,
    campaignId: string,
    currentStatus: CampaignStatus,
    refreshToken: string
  ): Promise<CampaignStatus> {
    const customer = this.client.Customer({
      customer_id: customerId,
      refresh_token: refreshToken,
    })

    const newStatus = currentStatus === "ENABLED" ? "PAUSED" : "ENABLED"

    await customer.campaigns.update([
      {
        resource_name: `customers/${customerId}/campaigns/${campaignId}`,
        status: newStatus,
      },
    ])

    return newStatus as CampaignStatus
  }

  private mapToCampaign(row: any): Campaign {
    return {
      id: row.campaign.id,
      name: row.campaign.name,
      status: row.campaign.status,
      biddingStrategyType: row.campaign.bidding_strategy_type,
      startDate: row.campaign.start_date,
      endDate: row.campaign.end_date,
      budget: row.campaign_budget?.amount_micros
        ? Number(row.campaign_budget.amount_micros) / 1_000_000
        : 0,
      metrics: {
        clicks: Number(row.metrics?.clicks || 0),
        impressions: Number(row.metrics?.impressions || 0),
        cost: Number(row.metrics?.cost_micros || 0) / 1_000_000,
        conversions: Number(row.metrics?.conversions || 0),
        ctr: Number(row.metrics?.ctr || 0),
        cpc: Number(row.metrics?.average_cpc || 0) / 1_000_000,
      },
    }
  }
}
```

## 5. 캠페인 성과 대시보드

### 테이블 컴포넌트 (정렬 및 수정 가능)

```typescript
캠페인 성과 테이블 구조:

**기능:**
- 캠페인 목록 표시
- 정렬 기능 (이름, 상태, 예산, 성과 지표)
- 상태 토글 (활성/비활성)
- 드롭다운 메뉴 (편집, 상세보기)

**표시 항목:**
- 캠페인 이름
- 상태
- 예산
- 노출수
- 클릭수
- 전환수
- 비용
- 액션 메뉴
```

## 6. 캠페인 생성 (Google UI 활용)

### Google Ads Editor 임베드

```typescript
캠페인 생성 모달:

**기능:**
- 모달 열기/닫기 제어
- Google Ads 네이티브 UI로 리다이렉트
- 고객 ID 파라미터 전달
- 캠페인 생성 후 자동 동기화

**사용자 경험:**
- Google Ads 공식 인터페이스 사용
- 모든 캠페인 설정 옵션 접근
- 일관된 사용자 경험
```

## 7. 데이터 동기화 시스템

### 배치 동기화 서비스

**구조:**

1. **큐 시스템 초기화**
   - 동기화 작업 큐 생성
   - 작업 프로세서 설정
   - 정기 실행 스케줄링

2. **작업 프로세시기**
   - 계정 ID와 동기화 타입 파라미터
   - 증분/전체 동기화 분기 처리
   - 오류 로깅 및 재시도

3. **정기 실행 스케줄**
   - 시간당 증분 동기화 (0 * * * *)
   - 일일 전체 동기화 (0 2 * * *)

4. **증분 동기화 프로세스**
   - 마지막 동기화 시점 조회
   - 24시간 이내 변경된 캠페인만 조회
   - 변경 사항만 데이터베이스 업데이트

   - 동기화 로그 기록 (타입, 시간, 건수)
   - 완료 로깅
```

## 8. 에러 처리 및 모니터링

### 통합 에러 핸들러

**에러 타입 정의:**
- 사용자 친화적 메시지
- 에러 코드
- 상세 정보

**주요 에러 처리:**

1. **UNAUTHENTICATED (인증 만료)**
   - 사용자 메시지: "인증이 만료되었습니다. 다시 연동해주세요."
   - 재인증 필요

2. **PERMISSION_DENIED (권한 부족)**
   - 사용자 메시지: "권한이 없습니다. 계정 권한을 확인해주세요."
   - 계정 권한 확인 필요

3. **UNKNOWN (알 수 없는 오류)**
   - 사용자 메시지: "Google Ads API 오류가 발생했습니다."
   - 상세 오류 로깅

## 9. 데이터베이스 스키마

데이터베이스 스키마는 다음과 같은 주요 테이블로 구성됩니다:

- `ad_accounts`: Google Ads 계정 정보
- `platform_credentials`: 플랫폼 인증 정보
- `oauth_states`: OAuth CSRF 보호를 위한 상태 관리
- `campaigns`: 캠페인 데이터
- `campaign_metrics`: 성과 지표

## 10. 환경 변수 설정

필요한 환경 변수:

- Google OAuth 클라이언트 ID 및 시크릿
- Google Ads API 개발자 토큰
- Google Ads 로그인 고객 ID (MCC 계정용)
- 리다이렉트 URI
- 큐 시스템 설정

## 정책 요약

이 통합 설계는 다음과 같은 핵심 정책을 따릅니다:

### 사용자 경험 최적화

- 계정 연동은 최대 4단계로 간소화
- 직관적인 UI/UX로 복잡한 설정 과정 최소화

### 데이터 관리 효율성

- 배치 처리 방식으로 API 할당량 효율적 사용
- 증분 동기화로 네트워크 부하 최소화

### 확장성과 유지보수성

- 모듈화된 서비스 아키텍처
- 의존성 주입 패턴으로 테스트 용이성 확보
- 타입 안전성을 위한 TypeScript 전면 활용

### 보안 강화

- OAuth 2.0 표준 준수
- 토큰 암호화 저장
- Prisma로 데이터 접근 제어 및 관계 관리

## 12. Google Ads API 연동 정책

올애드 플랫폼의 Google Ads API 연동을 위한 정책과 가이드라인을 체계적으로 정리한 문서입니다. 이 문서는 개발팀이 일관된 방향성을 가지고 구현할 수 있도록 명확한 지침을 제공합니다.

### 12.1 사용자 인증 및 계정 연동 정책

#### 12.1.1 연동 프로세스 간소화 원칙

사용자가 Google Ads 계정을 연동하는 과정은 반드시 4단계 이내로 완료되어야 합니다. 이는 사용자의 이탈을 방지하고 빠른 온보딩을 가능하게 하기 위한 핵심 원칙입니다.

표준 연동 플로우는 다음과 같이 구성됩니다. 첫 번째 단계에서 사용자는 올애드 대시보드에서 'Google Ads 연동하기' 버튼을 클릭합니다. 두 번째 단계에서는 Google의 공식 OAuth 화면으로 이동하여 로그인하고 권한을 승인합니다. 세 번째 단계에서는 여러 Google Ads 계정이 있는 경우 연동할 계정을 선택합니다. 마지막 네 번째 단계에서는 연동 완료 확인 화면을 표시하고 대시보드로 이동합니다.

#### 12.1.2 OAuth 2.0 인증 정책

Google OAuth 2.0 표준을 엄격히 준수하여 사용자의 계정 정보를 안전하게 보호합니다. 인증 과정에서 반드시 'offline' 액세스 타입을 요청하여 리프레시 토큰을 획득해야 하며, 이는 장기적인 API 접근을 위해 필수적입니다.

사용자가 처음 연동할 때는 항상 'consent' 프롬프트를 표시하여 명시적인 동의를 받아야 합니다. 이는 투명성을 보장하고 사용자의 신뢰를 구축하는 데 중요합니다.

#### 12.1.3 계정 타입 관리 정책

올애드는 일반 Google Ads 계정과 MCC(관리자) 계정을 모두 지원합니다. 시스템은 연동된 계정의 타입을 자동으로 감지하고 적절한 기능을 제공해야 합니다.

MCC 계정의 경우, 하위 계정들을 계층적으로 표시하고 각 계정별로 개별 관리가 가능하도록 인터페이스를 구성합니다. 일반 계정의 경우, 해당 계정의 캠페인만 직접 관리할 수 있도록 제한합니다.

### 12.2 데이터 동기화 정책

#### 12.2.1 동기화 주기 및 방식

데이터 동기화는 API 할당량을 효율적으로 사용하면서도 데이터의 신선도를 유지하는 균형점을 찾아야 합니다.

기본 동기화 정책은 시간당 1회 증분 동기화를 실행하여 최근 변경사항만 업데이트합니다. 매일 새벽 2시에는 전체 동기화를 실행하여 데이터 정합성을 보장합니다. 사용자가 수동으로 새로고침을 요청하는 경우, 5분 이내에 다시 요청할 수 없도록 제한하여 API 남용을 방지합니다.

#### 12.2.2 대규모 계정 처리 정책

수천 개의 캠페인을 보유한 대규모 계정을 효율적으로 처리하기 위해 배치 처리 방식을 채택합니다. 한 번의 API 호출로 최대한 많은 데이터를 가져오되, 응답 크기가 너무 커지지 않도록 적절히 페이지네이션을 활용합니다.

동기화 작업은 백그라운드 큐 시스템을 통해 비동기적으로 처리되며, 각 계정의 동기화 상태를 실시간으로 추적할 수 있어야 합니다. 동기화 중 오류가 발생한 경우, 지수 백오프(exponential backoff) 전략으로 최대 3회까지 재시도합니다.

#### 12.2.3 데이터 저장 및 캐싱 정책

Google Ads에서 가져온 데이터는 올애드 데이터베이스에 구조화된 형태로 저장됩니다. 자주 변경되지 않는 메타데이터(캠페인 설정, 광고 그룹 구조 등)는 더 긴 캐시 기간을 적용하고, 성과 지표(클릭, 노출, 비용 등)는 짧은 캐시 기간을 적용합니다.

모든 캐시된 데이터는 마지막 업데이트 시간을 명시적으로 표시하여 사용자가 데이터의 신선도를 인지할 수 있도록 합니다.

### 12.3 캠페인 관리 정책

#### 12.3.1 캠페인 생성 인터페이스 정책

캠페인 생성 기능은 Google Ads의 네이티브 인터페이스를 그대로 활용합니다. 이는 사용자가 이미 익숙한 인터페이스를 제공하여 학습 곡선을 최소화하고, Google의 최신 기능을 즉시 활용할 수 있도록 하기 위함입니다.

올애드는 캠페인 생성 프로세스를 iframe 또는 새 창으로 Google Ads를 열어 처리하며, 생성 완료 후 자동으로 올애드 시스템과 동기화됩니다.

#### 12.3.2 캠페인 상태 관리 정책

캠페인의 활성화/비활성화는 올애드 인터페이스에서 직접 제어할 수 있어야 합니다. 상태 변경은 즉시 Google Ads API를 통해 반영되며, 로컬 데이터베이스도 동시에 업데이트됩니다.

사용자가 실수로 캠페인을 활성화하는 것을 방지하기 위해, 상태 변경 시 확인 대화상자를 표시합니다. 특히 일시 중지된 캠페인을 활성화할 때는 예산 및 입찰가를 함께 표시하여 사용자가 비용 영향을 인지할 수 있도록 합니다.

#### 12.3.3 성과 데이터 표시 정책

캠페인 성과 데이터는 정렬, 필터링, 검색이 가능한 테이블 형태로 제공됩니다. 기본적으로 표시되는 지표는 캠페인명, 상태, 노출수, 클릭수, CTR, 비용, 전환수이며, 사용자가 컬럼을 추가하거나 제거할 수 있도록 커스터마이징 기능을 제공합니다.

모든 금액은 사용자의 통화 설정에 따라 자동으로 변환되어 표시되며, 큰 숫자는 천 단위 구분 기호를 사용하여 가독성을 높입니다.

### 12.4 보안 정책

#### 12.4.1 토큰 관리 및 저장

OAuth 토큰은 반드시 암호화된 상태로 데이터베이스에 저장되어야 합니다. 액세스 토큰과 리프레시 토큰은 서로 다른 암호화 키를 사용하여 이중으로 보호합니다.

토큰의 유효기간을 추적하고, 만료되기 전에 자동으로 갱신합니다. 리프레시 토큰이 만료되거나 무효화된 경우, 사용자에게 재인증을 요청하는 알림을 표시합니다.

#### 12.4.2 API 키 보호

Google Ads 개발자 토큰과 OAuth 클라이언트 시크릿은 환경 변수로 관리되며, 절대 클라이언트 코드나 버전 관리 시스템에 포함되지 않아야 합니다. 프로덕션 환경에서는 안전한 시크릿 관리 서비스를 사용하여 이러한 민감한 정보를 보호합니다.

#### 12.4.3 데이터 접근 제어

Prisma의 관계형 모델과 NextAuth.js 세션을 활용하여 사용자는 자신이 연동한 계정의 데이터만 접근할 수 있도록 제한합니다. 팀 기능을 사용하는 경우, 권한 시스템을 통해 팀원 간 데이터 공유를 제어합니다.

### 12.5 에러 처리 정책

#### 12.5.1 사용자 친화적 에러 메시지

API 에러는 기술적인 내용을 사용자가 이해할 수 있는 메시지로 변환하여 표시합니다. 예를 들어, "PERMISSION_DENIED" 에러는 "이 작업을 수행할 권한이 없습니다. 계정 관리자에게 문의하세요."와 같이 표시합니다.

#### 12.5.2 에러 복구 전략

일시적인 네트워크 오류나 API 제한으로 인한 실패는 자동으로 재시도합니다. 영구적인 오류(권한 부족, 잘못된 요청 등)는 즉시 사용자에게 알리고 해결 방법을 안내합니다.

#### 12.5.3 에러 로깅 및 모니터링

모든 API 에러는 상세한 컨텍스트와 함께 로깅되어야 합니다. 에러 발생 빈도와 패턴을 모니터링하여 시스템 개선에 활용합니다. 중요한 에러는 개발팀에게 실시간으로 알림을 전송합니다.

## 6. 확장성 및 유지보수 정책

### 6.1 모듈화 원칙

Google Ads 통합 기능은 독립적인 모듈로 구성되어야 합니다. 각 모듈은 명확한 책임과 인터페이스를 가지며, 다른 광고 플랫폼 통합 시 재사용할 수 있는 공통 패턴을 따릅니다.

#### 12.6.2 버전 관리 및 업데이트

Google Ads API의 버전 변경에 대응할 수 있도록 API 클라이언트를 추상화합니다. 새로운 API 버전이 출시되면 충분한 테스트를 거친 후 점진적으로 마이그레이션합니다.

#### 12.6.3 성능 최적화

대시보드 로딩 시간을 최소화하기 위해 필수 데이터를 우선 로드하고, 상세 데이터는 필요에 따라 지연 로딩합니다. 자주 접근하는 데이터는 적절한 인덱싱과 캐싱을 통해 응답 시간을 개선합니다.

### 12.7 사용자 경험 정책

#### 12.7.1 일관성 원칙

Google Ads 관련 모든 인터페이스는 올애드의 디자인 시스템을 따라야 합니다. Hero UI 컴포넌트를 우선적으로 사용하여 시각적 일관성을 유지합니다.

#### 12.7.2 피드백 제공

모든 사용자 액션에 대해 즉각적인 피드백을 제공합니다. 시간이 오래 걸리는 작업은 진행 상태를 표시하고, 완료 시 명확한 성공/실패 메시지를 표시합니다.

#### 12.7.3 도움말 및 가이드

복잡한 기능이나 처음 사용하는 사용자를 위해 툴팁, 온보딩 가이드, 문서 링크를 적절히 배치합니다. 에러 발생 시에는 문제 해결을 위한 구체적인 도움말을 제공합니다.

이러한 정책들은 올애드 플랫폼이 안정적이고 사용자 친화적인 Google Ads 통합 기능을 제공하는 데 필요한 기본 원칙과 지침을 제시합니다. 개발 과정에서 이 정책들을 지속적으로 참고하고 필요에 따라 업데이트하여 서비스 품질을 유지해야 합니다.
