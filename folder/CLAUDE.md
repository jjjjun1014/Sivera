# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

### 작업 전후 (필수!) 작업

- 작업전 테스트 코드를 먼저 생성 또는 수정하여 목적을 확실히 해야해
- 작업 후 타입 검사, 포맷팅, 린팅, 테스트를 통해 문제가 없음을 증명해야해
- 만약 작업후 테스트코드가 잘못된거라면 수정하고 아니면 어플리케이션 코드를 수정해야해
- 작업 후 미사용 코드나 잘못된 코드가 없는지 확인후 리팩토링작업이 이루어져야해 즉 모든 코드는 참조되고 사용되고 있어야만 해

### 로컬 개발 환경 (2025.10 업데이트 - Amplify Gen 2)

- **AWS Amplify Gen 2**: 서버리스 백엔드 (Cognito, AppSync, DynamoDB, S3)
- **TypeScript 전체 스택**: 백엔드부터 프론트엔드까지 완전한 타입 안정성
- **Mock 모드 지원**: Amplify Sandbox 없이도 개발 가능 (프론트엔드 개발 우선)
- **테스트 우선**: Vitest로 단위 테스트, Playwright로 E2E 테스트
- **독립적 테스트**: 각 테스트는 고유 ID를 사용하여 독립적으로 실행

## Project Overview

**Sivera Alpha 2 (AWS Amplify Gen 2)** - Modern serverless multi-domain integration platform that unifies advertising, content management, analytics, commerce, and social media services across Google, Meta, Amazon, and TikTok platforms. Built with AWS Amplify Gen 2, domain-driven design, and OAuth 2.0 integration.

### Working Directory

```
/Users/2309-n0015/Code/Project/Sivera/sivera-alpha-2
```

### Key Architecture Concepts (Amplify Gen 2)

- **Serverless Backend**: AWS Amplify Gen 2 기반 완전 관리형 백엔드
- **GraphQL API**: AppSync를 통한 타입 안전 데이터 액세스
- **Domain-Driven Design**: 각 비즈니스 도메인(Auth, Team, Advertising, Content, Analytics, Commerce, Social)이 독립적으로 동작
- **Multi-Tenancy**: 조직(Team) 기반 데이터 격리 및 권한 관리
- **Role-Based Access Control**: master, team_mate, viewer 역할 기반 권한
- **Plugin Architecture**: 플랫폼 레지스트리를 통한 동적 플랫폼/서비스 등록
- **OAuth 2.0 Integration**: Google, Meta, Amazon, TikTok OAuth 플로우 구현
- **Credential Aliasing**: 플랫폼별 여러 계정 관리 (별칭 지원)
- **Capability-Based Routing**: 플랫폼별 지원 능력(Capabilities)에 따라 자동으로 적절한 어댑터 선택
- **Mock Development Mode**: Amplify 없이도 프론트엔드 개발 가능

### Core Guidelines (Amplify Gen 2)

- **Amplify First**: AWS Amplify Gen 2 패턴 우선 사용 (defineAuth, defineData, defineStorage)
- **GraphQL Schema**: `amplify/data/resource.ts`에서 데이터 모델 정의 (Team, TeamMember, TeamInvitation, PlatformCredential 등)
- **Type Generation**: `npm run ampx:generate`로 GraphQL 타입 자동 생성
- **Dynamic Import**: Amplify 클라이언트는 동적 import 사용: `const { generateClient } = await import('aws-amplify/data')`
- **Error Handling**: Amplify 응답 체크: `if (result.errors || !result.data)`
- **Array Response**: 배열/단일 객체 처리: `const data = Array.isArray(result.data) ? result.data[0] : result.data`
- **아키텍처 문서**: README.md 참조하여 도메인 기반 설계 이해
- **도메인 분리**: 새 기능은 해당 도메인(auth, team, advertising 등) 아래에 배치
- **인증 플로우**: AuthService 사용, 일반 가입 vs 초대 가입 구분
- **팀 관리**: TeamService 사용, 멀티 조직 지원
- **플랫폼 추가**: 플랫폼 레지스트리에 등록 후 도메인별 어댑터 구현
- **OAuth 플로우**: `/api/auth/{platform}` → OAuth → `/api/auth/callback/{platform}` → CredentialStore
- **Credential Storage**: credentialStore.storeCredentials() with alias support
- **API 라우트**: Next.js App Router의 Route Handlers 사용
- **작업 후 검증**: 포맷팅, 린팅, 빌드 필수
- **테스트**: 테스트 코드 최신화 필수, 선택자는 무조건 `data-testid` 사용
- **재사용성**: 공통 로직은 shared 디렉토리에, 도메인 특화 로직은 각 도메인 내부에
- **로깅**: console.log는 개발 중에만 사용, 프로덕션에서는 제거
- **TODO Comments**: 미구현 기능은 명확한 TODO 주석으로 표시

### Internationalization (i18n)

- **Client Components**: 클라이언트 컴포넌트에서 dictionary hook을 사용하여 다국어 텍스트 접근

- **Server Components**: 서버 컴포넌트에서 getDictionary 함수를 사용하여 다국어 텍스트 접근

-

### 기술적 요구사항

- 서버 컴포넌트 우선, Server Actions 활용
- 모듈화 및 재사용성 극대화
- Dependency Injection, Inversion of Control 패턴 적용
- UI는 Hero UI 사용 (HTML/Tailwind 최소화)
- 모든 테이블은 Infinite Scroll 구현
- 중복 코드 제거 및 구조 최적화

### Store Pattern

- 모든 store는 `/stores` 폴더에 위치
- Slice-Store 패턴으로 재사용성 확보

## Development Commands

개발 워크플로우:

**설치 및 설정:**
```bash
npm install                      # 의존성 설치
cp .env.example .env.local      # 환경 변수 설정
```

**개발:**
```bash
npm run dev                      # 개발 서버 실행
npm run build                    # 프로덕션 빌드
npm run lint                     # 코드 린팅
npm run format                   # 코드 포맷팅
npm run type-check               # 타입 검사
```

**Amplify:**
```bash
npm run ampx:sandbox             # Amplify Sandbox 시작 (AWS 리소스 생성)
npm run ampx:generate            # GraphQL 타입 생성
npm run ampx:generate:forms      # Amplify UI 폼 생성
```

**테스트:**
```bash
npm run test                     # 단위 테스트 (Vitest)
npm run test:ui                  # 단위 테스트 UI
npm run test:e2e                 # E2E 테스트 (Playwright)
npm run test:e2e:ui              # E2E 테스트 UI
```

## Testing Guidelines (Updated 2025)

### Testing Philosophy
- **Accessibility First**: All UI tests must validate ARIA attributes and screen reader compatibility
- **Real Component Testing**: Test actual components, not mock HTML structures
- **Independent Tests**: Each test uses unique IDs and runs in isolation
- **Sharding Support**: Tests can be split across multiple workers for faster execution

### Test Structure
```

tests/
├── unit/ # Pure function tests, utility testing
├── components/ # UI component tests with ARIA validation
├── scenarios/ # End-to-end user journey tests
├── fixtures/ # Test data using actual domain types
└── helpers/ # Shared test utilities and mocks

````

### Component Testing Standards
- **HeroUI Components**: All tests must validate HeroUI accessibility features
- **ARIA Requirements**: Test `role`, `aria-label`, `aria-expanded`, etc.
- **Keyboard Navigation**: Tab order, Enter/Space activation, focus management
- **Screen Reader Support**: Proper labeling, grouping, and semantic markup
- **Responsive Behavior**: Mobile and desktop viewport testing

### Component Testing Approaches

**1. Component Testing (isolated)**
격리된 환경에서 실제 컴포넌트 테스트:
- 컴포넌트 마운트
- 가시성 및 접근성 테스트
- 사용자 인터랙션 테스트
- 메뉴/드롭다운 동작 검증

**2. E2E Testing (전체 페이지)**
전체 페이지 통합 테스트:
- 페이지 네비게이션
- 컴포넌트 가시성 확인 (타임아웃 고려)
- 접근성 속성 검증 (ARIA)
- 인터랙티브 요소 확인

### Commands
- 컴포넌트 테스트 실행
- E2E 테스트 실행
- 전체 테스트 실행

### Data Factory Pattern

**올바른 방법:**
- 실제 도메인 타입 사용
- testDataFactory로 캠페인 생성
- 플랫폼 타입 명시

**잘못된 방법:**
- 커스텀 테스트 타입 정의
- 임시 인터페이스 사용

### Test Selectors

- **Required**: Always use `data-testid` attributes
- **Format**: `data-testid="component-action"` (kebab-case)
- **Examples**: `data-testid="user-dropdown"`, `data-testid="campaign-status-toggle"`

### Accessibility Testing Checklist

- [ ] All interactive elements have proper ARIA labels
- [ ] Focus management works correctly
- [ ] Keyboard navigation follows expected patterns
- [ ] Screen reader announcements are descriptive
- [ ] Color contrast meets WCAG standards
- [ ] Images have alt text or are marked decorative

### Mock Data Guidelines

- Use `testDataFactory` for consistent test data generation
- Platform responses should match actual API structures
- Timestamps and IDs must be unique per test run
- Mock only external APIs, not internal application logic


````

## Architecture Patterns

### Server-First Clean Architecture

- **Server Components**: Default for data fetching
- **Server Actions**: All mutations via `actions.ts`
- **Client Components**: Only for interactivity
- **Data Flow**: Server → DataProvider → Client → Zustand

### Key Architectural Decisions

1. **Platform Abstraction**

   - Interface: `/services/platforms/platform-service.interface.ts`
   - Factory: `/services/platforms/platform-service-factory.ts`

2. **Auth & Authorization**

   - Roles: master, team_mate, viewer
   - Middleware handles sessions

3. **State Management**
   - Zustand for client state
   - Server state via Server Components

## Database Schema

Core tables with RLS:

- `profiles`: User profiles (auto-created on signup)
- `teams`: Organizations (auto-created on signup)
- `team_members`: Role-based permissions (master, team_mate, viewer)
- `team_invitations`: Team invitation system
- `platform_credentials`: Encrypted API credentials
- `campaigns`: Unified campaign data
- `campaign_metrics`: Performance metrics
- `activity_logs`: Audit trail

## Common Tasks

### Adding New Domain

1. **Create Domain Structure**:

   ```typescript
   // domains/{domain}/services/{service}.service.ts
   export class YourDomainService implements DomainService {
     async initialize(credentials: PlatformCredentials): Promise<void>

     getRequiredCapabilities(): PlatformCapability[]

     async isAvailable(userId: string, platform: PlatformType): Promise<boolean>
   }
   ```

2. **Create Platform Adapters**:

   ```typescript
   // domains/{domain}/adapters/{platform}.adapter.ts
   export class PlatformYourDomainAdapter {
     async performDomainOperation(params): Promise<Result>
   }
   ```

3. **Register in Platform Registry**:

   ```typescript
   // core/platform-registry/platform-registry.service.ts
   platformDefinition.adapters.push({
     domain: DomainType.YOUR_DOMAIN,
     factory: () => new YourDomainAdapter(),
   })
   ```

4. **Create API Routes**:
   ```typescript
   // app/api/v2/{domain}/route.ts
   export async function POST(req: NextRequest) {
     const service = new YourDomainService()
     return await service.execute()
   }
   ```

### Adding New Platform (Updated Process)

1. **Create Platform Service**:

   ```typescript
   // services/platforms/{platform}-platform.service.ts
   export class YourPlatformService extends BasePlatformService<YourApiClient> {
     platform: PlatformType = "your_platform"

     async testConnection(): Promise<ConnectionTestResult> {
       /* implement */
     }
     async refreshToken(): Promise<TokenRefreshResult> {
       /* implement */
     }
     async getAccountInfo(): Promise<AccountInfo> {
       /* implement */
     }
     // ... other required methods
   }
   ```

2. **Register in Factory**:

   ```typescript
   // services/platforms/platform-service-factory.ts
   this.services.set("your_platform", () => new YourPlatformService())
   ```

3. **Add OAuth Configuration**:

   ```typescript
   // lib/oauth/platform-configs.ts
   your_platform: {
     clientId: process.env.YOUR_PLATFORM_CLIENT_ID,
     clientSecret: process.env.YOUR_PLATFORM_CLIENT_SECRET,
   }
   ```

4. **Update Environment Variables**:
   ```bash
   YOUR_PLATFORM_CLIENT_ID=your_client_id
   YOUR_PLATFORM_CLIENT_SECRET=your_client_secret
   ```

## Korean Platform Integration Guide

### Kakao Moment API

- OAuth2 authentication required
- Access needs official permission
- Rate limits: 5-second intervals
- Max 31 days per report request

### Naver Search Ads

- Direct key authentication
- No official SDK (custom development needed)
- Conservative rate limiting recommended

### Coupang

- No public API
- Manual management only
- Consider automation workarounds

## Platform Integration Architecture (2024.12 Updated)

### Enhanced Platform Service Architecture

All advertising platforms now use a unified service architecture:

1. **Base Platform Service**: `BasePlatformService<T>` - Common error handling, retry logic
2. **Platform-Specific Services**: Extend base service with platform implementations
3. **Unified Interface**: All platforms implement `PlatformService` interface
4. **Factory Pattern**: `PlatformServiceFactory` for service creation and management

### Core Platform Services

#### Google Ads Integration

- **Service**: `GoogleAdsOAuthPlatformService`
- **OAuth Flow**: Simplified with environment variables (no user config needed)
- **Features**: Campaign management, budget control, real-time metrics
- **Environment Variables**: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

#### Meta (Facebook) Ads Integration

- **Service**: `FacebookPlatformService`
- **OAuth Flow**: Simplified with project credentials
- **Features**: Campaign management, batch operations, account insights
- **Environment Variables**: `META_APP_ID`, `META_APP_SECRET`, `META_BUSINESS_ID`

#### Amazon Ads Integration

- **Service**: `AmazonPlatformService`
- **OAuth Flow**: Region-aware authentication
- **Features**: Multi-region support, keyword management, product targets
- **Environment Variables**: `AMAZON_CLIENT_ID`, `AMAZON_CLIENT_SECRET`

### Platform Service Interface

All platform services implement the following standard interface:

```typescript
interface PlatformService {
  // Connection Management
  testConnection(): Promise<ConnectionTestResult>
  validateCredentials(): Promise<boolean>
  refreshToken(): Promise<TokenRefreshResult>
  getAccountInfo(): Promise<AccountInfo>

  // Campaign Operations
  fetchCampaigns(): Promise<Campaign[]>
  fetchCampaignMetrics(
    campaignId: string,
    startDate: Date,
    endDate: Date
  ): Promise<CampaignMetrics[]>
  updateCampaignStatus(campaignId: string, isActive: boolean): Promise<boolean>
  updateCampaignBudget(campaignId: string, budget: number): Promise<boolean>

  // Lifecycle
  cleanup?(): Promise<void>
}
```

### Error Handling & Retry Logic

All platform services use enhanced error handling:

```typescript
// Platform-specific error types
class PlatformError extends Error {
  platform: PlatformType
  code: string
  retryable: boolean
  userMessage: string
}

// Automatic retry with exponential backoff
await service.executeWithErrorHandling(async () => {
  // Platform operation
}, "operationName")
```

### Authentication Flows

1. **Simplified OAuth**: Users only need to authenticate, no app configuration required
2. **Environment-based Credentials**: All platform app credentials from environment variables
3. **Automatic Token Refresh**: Background token management with error handling
4. **Multi-Account Support**: Team-based credential isolation

## Multi-Platform Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   API Gateway   │────▶│ Transformation   │────▶│ Data Warehouse  │
│ (Rate Limiting) │     │     Layer        │     │ (Unified Schema)│
└────────┬────────┘     └──────────────────┘     └─────────┬───────┘
         │                                                   │
┌─────────────────┐                               ┌─────────────────┐
│Platform Adapters│                               │Reporting Dashboard│
└─────────────────┘                               └─────────────────┘
```

## User Workflows

### 1. 일반 회원가입 플로우

1. `/auth` 페이지 접속
2. 이메일, 비밀번호, 조직 이름 입력
3. `AuthService.signUp()` 호출
4. Cognito에 사용자 생성
5. `TeamService.createTeam()` 자동 호출
6. 사용자를 조직의 master로 자동 추가
7. `/dashboard`로 리다이렉트

### 2. 초대 링크 회원가입 플로우

1. 관리자가 팀 설정에서 팀원 초대
2. `TeamService.inviteUser()` 호출
3. TeamInvitation 레코드 생성 (UUID 토큰)
4. 초대 링크: `/auth?token=UUID&email=user@example.com`
5. 초대받은 사용자가 링크 클릭
6. 회원가입 폼에 이메일 자동 입력 (읽기 전용)
7. 비밀번호만 입력하고 가입
8. Cognito에 사용자 생성
9. 기존 조직의 팀원으로 추가
10. TeamInvitation 상태를 'accepted'로 변경

### 3. 기존 회원 팀 초대 플로우

1. 관리자가 기존 사용자 이메일로 초대
2. `TeamService.inviteUser()` 호출
3. 사용자가 로그인 후 초대 수락
4. `TeamService.acceptInvitation()` 호출
5. 사용자의 TeamMember 레코드 추가
6. **결과**: 사용자는 기존 조직과 새 조직 모두에 속함

### 4. 플랫폼 연결 (별칭 사용)

1. 대시보드에서 조직 선택 (TeamSwitcher)
2. 플랫폼 "Connect" 버튼 클릭
3. OAuth 인증 완료
4. Callback에서 `credentialStore.storeCredentials()` 호출
5. alias 옵션으로 계정 구분 (예: "메인 계정", "테스트 계정")
6. 같은 팀이 Google Ads를 여러 개 연결 가능

### 5. 캠페인 관리

- 통합 캠페인 목록에서 ON/OFF 토글
- 확인 모달 → API 상태 변경
- 실시간 피드백

### 6. 팀 협업 (역할별 권한)

- **Master**: 모든 권한, 팀원 초대/제거/역할 변경
- **Team Mate**: 캠페인 관리, 플랫폼 연결, 데이터 읽기/쓰기
- **Viewer**: 읽기 전용

## Pricing Model (V1.0)

- **초기**: 완전 무료
- **지원 플랫폼**: Google Ads, Meta Ads
- **팀원**: 최대 5명
- **API 제한**: 시간당 1회 업데이트

## Security Considerations

- Platform credentials encrypted in DB
- RLS policies enforce team isolation
- Server actions include permission checks
- No client-side external API calls

## Implementation Tips (Updated 2025.10)

### Authentication Service Pattern

```typescript
// src/domains/auth/services/auth.service.ts
import { signUp, signIn, signOut } from 'aws-amplify/auth'

class AuthService {
  async signUp(email: string, password: string, teamName?: string, invitationToken?: string) {
    // 1. Create Cognito user
    const { userId } = await signUp({ username: email, password })
    
    // 2. Check invitation
    if (invitationToken) {
      // Join existing team
      await this.acceptInvitation(invitationToken, userId)
    } else {
      // Create new team
      const client = generateClient()
      const team = await client.models.Team.create({
        name: teamName,
        ownerId: userId,
      })
      
      // Add user as master
      await client.models.TeamMember.create({
        teamId: team.data.id,
        userId,
        role: 'master',
      })
    }
  }
}
```

### Team Service Pattern

```typescript
// src/domains/team/services/team.service.ts
import { v4 as uuidv4 } from 'uuid'

class TeamService {
  async inviteUser(teamId: string, email: string, role: string, invitedBy: string) {
    const client = generateClient()
    const token = uuidv4()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    
    // Create invitation
    await client.models.TeamInvitation.create({
      teamId,
      email,
      role,
      invitedBy,
      token,
      status: 'pending',
      expiresAt,
    })
    
    // Generate invitation URL
    const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth?token=${token}&email=${encodeURIComponent(email)}`
    
    // TODO: Send email with AWS SES/SNS
    console.log('⚠️  TODO: Send invitation email:', invitationUrl)
    
    return { success: true, invitationUrl }
  }
}
```

### Credential Store Pattern with Alias

```typescript
// src/core/auth/credential-store.service.ts
class CredentialStoreService {
  async storeCredentials(
    teamId: string,
    platform: PlatformType,
    accountId: string,
    token: TokenData,
    options?: { accountName?: string; alias?: string; metadata?: any }
  ): Promise<void> {
    const { generateClient } = await import('aws-amplify/data')
    const client = generateClient()
    
    const result = await client.models.PlatformCredential.create({
      teamId,
      platform,
      accountId,
      alias: options?.alias, // 별칭으로 계정 구분
      accountName: options?.accountName,
      accessToken: token.accessToken, // TODO: Encrypt with AWS KMS
      refreshToken: token.refreshToken,
      expiresAt: token.expiresAt.toISOString(),
      scope: token.scope?.join(','),
      metadata: options?.metadata ? JSON.stringify(options.metadata) : null,
    })
    
    if (result.errors || !result.data) {
      throw new Error('Failed to store credentials')
    }
  }
  
  async getCredentials(
    teamId: string,
    platform: PlatformType,
    alias?: string
  ): Promise<TokenData | null> {
    const { generateClient } = await import('aws-amplify/data')
    const client = generateClient()
    
    const filter: any = { teamId: { eq: teamId }, platform: { eq: platform } }
    if (alias) {
      filter.alias = { eq: alias }
    }
    
    const result = await client.models.PlatformCredential.list({ filter })
    // ... return token
  }
}
```

## Implementation Tips (Continued)

### Enhanced Error Handling

```typescript
// Platform-specific error handling with retry logic
class PlatformAuthError extends PlatformError {
  retryable = true // Auth errors are retryable
}

class PlatformRateLimitError extends PlatformError {
  retryable = true // Rate limits are retryable with backoff
}

class PlatformConfigError extends PlatformError {
  retryable = false // Config errors are not retryable
}

// Usage in platform services
await this.executeWithErrorHandling(async () => {
  // Your platform operation
}, "operationName")
```

### Data Normalization & Transformation

```typescript
// Unified metrics interface
interface CampaignMetrics {
  campaign_id: string;
  date: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  revenue?: number;
  ctr?: number;
  cpc?: number;
  cpm?: number;
  roas?: number;
  roi?: number;
  raw_data: unknown;
  created_at: string;
}

// Platform-specific transformation
protected parseMetricsResponse(data: any): CampaignMetrics {
  return {
    campaign_id: data.campaign_id,
    date: data.date,
    impressions: Number(data.impressions) || 0,
    clicks: Number(data.clicks) || 0,
    cost: Number(data.cost) || 0,
    conversions: Number(data.conversions) || 0,
    ctr: data.ctr ? Number(data.ctr) / 100 : 0,
    raw_data: data,
    created_at: new Date().toISOString(),
  };
}
```

### Platform Service Testing

```typescript
// Test connection and credentials
const connectionTest = await service.testConnection()
if (!connectionTest.success) {
  console.error("Connection failed:", connectionTest.error)
}

// Validate credentials before operations
const isValid = await service.validateCredentials()
if (!isValid) {
  // Handle invalid credentials
}
```

## Infinite Scroll Table Pattern

Use the provided infinite scroll implementation with:

- Efficient data fetching
- IntersectionObserver for automatic loading
- UI table components
- Proper error and loading states

## Current Implementation Status (2025.10.07)

### ✅ Completed (88%)

- **Infrastructure**: 100% (Next.js, TypeScript, Amplify, NextUI)
- **Authentication**: 100% (Signup, Login, Password Reset)
- **Team Management**: 100% (Org creation, Invitations, Multi-org support)
- **OAuth Integration**: 90% (Google ✅, Meta ✅, Amazon/TikTok callbacks pending)
- **Core Services**: 100% (Platform Registry, Credential Store)
- **UI Components**: 100% (Auth forms, Team components, Dashboard)

### 🔄 In Progress

- **Advertising Domain**: Structure complete, API integration needed
- **Platform Adapters**: Google Ads, Meta Ads, Amazon Ads, TikTok Ads

### ❌ TODO

1. **Email Sending** (AWS SES/SNS)
   - Team invitation emails
   - Password reset emails
   - Location: `src/domains/team/services/team.service.ts:inviteUser()`

2. **Token Encryption** (AWS KMS)
   - Encrypt accessToken and refreshToken before storage
   - Decrypt when retrieving
   - Location: `src/core/auth/credential-store.service.ts`

3. **OAuth Callback Integration**
   - Call `credentialStore.storeCredentials()` after successful OAuth
   - Pass teamId from URL state
   - Location: `src/app/api/auth/callback/{platform}/route.ts`

4. **Platform API Integration**
   - Google Ads API
   - Meta Graph API
   - Amazon Advertising API
   - TikTok Business API

5. **Automatic Token Refresh**
   - Cron job or Lambda scheduler
   - Check expiring tokens (24 hours before)
   - Refresh using platform refresh_token

### Quick Commands for Next Steps

```bash
# Start Amplify Sandbox (creates AWS resources)
npm run ampx:sandbox

# Generate GraphQL types
npm run ampx:generate

# Run development server
npm run dev

# Test authentication flow
# 1. Go to http://localhost:3000/auth
# 2. Sign up with email and team name
# 3. Check dashboard
```

---
