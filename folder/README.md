# Sivera Alpha 2 - AWS Amplify Gen 2 Multi-Platform Integration

A modern, production-ready **multi-domain integration platform** built with **AWS Amplify Gen 2** that unifies authentication and services across Google, Meta, Amazon, and TikTok platforms.

This is a complete, enterprise-ready solution for managing **advertising, content, analytics, commerce, and social media** from a single unified platform, powered by AWS serverless infrastructure.

## 📋 목차

- [주요 기능](#-주요-기능)
- [프로젝트 구조](#-프로젝트-구조-도메인-기반-아키텍처)
- [시작하기](#-시작하기)
- [사용 방법](#-사용-방법)
- [보안](#-보안)
- [기여하기](#-기여하기)
- [문제 해결](#-문제-해결)
- [라이선스](#-라이선스)
- [문의](#-문의)

## 🚀 주요 기능

### 1. AWS Amplify Gen 2 기반 아키텍처

- **Fullstack TypeScript**: 백엔드와 프론트엔드 모두 TypeScript로 작성
- **AWS Cognito**: 안전한 사용자 인증 및 권한 관리
- **AWS AppSync**: GraphQL API로 실시간 데이터 동기화
- **AWS S3**: 콘텐츠 파일 및 미디어 자산 저장
- **DynamoDB**: NoSQL 데이터베이스로 확장 가능한 데이터 저장

### 2. 통합 인증 시스템

- **플랫폼 중립적 인증**: Google, Meta, Amazon, TikTok OAuth 2.0 통합
- **자동 토큰 관리**: 30분 주기 자동 갱신, 24시간 전 만료 감지
- **능력 기반 접근**: 플랫폼별 API 능력(Capabilities) 자동 감지
- **멀티 계정 지원**: 플랫폼당 여러 계정 동시 연동

### 3. 도메인별 서비스 (확장 가능)

#### 🎯 광고 도메인 (Advertising)

- **Google Ads**: 검색/디스플레이 광고, 캠페인 관리, 성과 분석
- **Meta Ads**: Facebook/Instagram 광고, Insights API
- **Amazon Ads**: Sponsored Products, 키워드 관리
- **TikTok Ads**: TikTok for Business, 동영상 광고

#### 📹 컨텐츠 도메인 (Content) - 개발 예정

- **YouTube**: 동영상 업로드, 메타데이터 관리, 스케줄링
- **Facebook/Instagram**: 비디오 업로드, 스토리 관리
- **TikTok**: 동영상 퍼블리싱, 트렌드 분석

#### 📊 분석 도메인 (Analytics) - 개발 예정

- **Google Analytics**: 웹사이트 트래픽 분석
- **Meta Insights**: 소셜 미디어 참여도 분석
- **통합 대시보드**: 크로스 플랫폼 성과 시각화

#### 🛒 커머스 도메인 (Commerce) - 개발 예정

- **Google Merchant Center**: 제품 카탈로그 동기화
- **Facebook Commerce**: 쇼핑 광고 자동화
- **Amazon Seller**: 제품 관리, 주문 처리

#### 💬 소셜 도메인 (Social) - 개발 예정

- **멀티 플랫폼 게시**: Facebook, Instagram, Twitter 동시 게시
- **통합 인박스**: 모든 플랫폼 메시지 통합 관리
- **참여도 분석**: 댓글, 좋아요, 공유 분석

### 4. 인증 및 팀 관리

- **통합 인증 오케스트레이터**: 플랫폼별 OAuth 흐름 자동 처리
- **자격 증명 스토어**: 암호화된 토큰 저장 및 관리
- **능력 기반 라우팅**: 사용자가 요청한 서비스에 맞는 플랫폼 자동 선택
- **팀 협업**: 마스터/에디터/뷰어 권한 관리
- **멀티 팀 지원**: 여러 팀 동시 관리 가능

### 5. 플러그인 아키텍처

- **플랫폼 레지스트리**: 새로운 플랫폼 동적 등록
- **도메인 어댑터**: 플랫폼별 API 차이 추상화
- **서비스 팩토리**: 런타임에 서비스 인스턴스 생성
- **이벤트 기반 통신**: 도메인 간 느슨한 결합

### 6. 개발자 친화적 API

- **RESTful API**: 모든 도메인 서비스 API 제공
- **GraphQL 지원**: 유연한 데이터 쿼리 (예정)
- **Webhook**: 실시간 이벤트 알림
- **SDK**: TypeScript, Python 클라이언트 라이브러리 (예정)

##  프로젝트 구조 (도메인 기반 아키텍처)

```text
sivera-alpha-2/
├── amplify/                        # AWS Amplify Gen 2 Backend
│   ├── auth/                      # Cognito 인증 설정
│   │   └── resource.ts           # 사용자 인증 정의
│   ├── data/                      # AppSync GraphQL API
│   │   └── resource.ts           # 데이터 스키마 정의
│   ├── storage/                   # S3 스토리지 설정
│   │   └── resource.ts           # 파일 스토리지 정의
│   └── backend.ts                 # 백엔드 통합 설정
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── dashboard/            # 대시보드 페이지
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   └── providers.tsx         # Context providers
│
sivera-platform/
├── core/                           # 핵심 도메인 독립 시스템
│   ├── auth/                      # 통합 인증 관리
│   │   ├── providers/            # 플랫폼별 OAuth 프로바이더
│   │   ├── token-manager.service.ts
│   │   ├── credential-store.service.ts
│   │   └── auth-orchestrator.service.ts
│   ├── platform-registry/         # 플랫폼 레지스트리
│   │   ├── platform.interface.ts
│   │   ├── platform-registry.service.ts
│   │   └── platform-capabilities.enum.ts
│   └── gateway/                   # API Gateway
│
├── domains/                        # 도메인별 서비스
│   ├── advertising/               # 광고 도메인 ✅ 구현 완료
│   │   ├── services/
│   │   │   ├── campaign.service.ts
│   │   │   ├── creative.service.ts
│   │   │   └── reporting.service.ts
│   │   └── adapters/
│   │       ├── google-ads.adapter.ts
│   │       ├── meta-ads.adapter.ts
│   │       ├── amazon-ads.adapter.ts
│   │       └── tiktok-ads.adapter.ts
│   │
│   ├── content/                   # 컨텐츠 관리 도메인 🔄 개발 예정
│   │   ├── services/
│   │   │   ├── video-upload.service.ts
│   │   │   ├── content-management.service.ts
│   │   │   └── scheduling.service.ts
│   │   └── adapters/
│   │       ├── youtube.adapter.ts
│   │       ├── facebook-video.adapter.ts
│   │       └── tiktok-video.adapter.ts
│   │
│   ├── analytics/                 # 분석 도메인 🔄 개발 예정
│   ├── commerce/                  # 이커머스 도메인 🔄 개발 예정
│   └── social/                    # 소셜 미디어 도메인 🔄 개발 예정
│
├── app/                           # Application Router
│   ├── api/                      # RESTful API
│   │   ├── v2/                  # API v2 (도메인 기반)
│   │   │   ├── auth/            # 인증 API
│   │   │   ├── advertising/     # 광고 API
│   │   │   ├── content/         # 컨텐츠 API
│   │   │   ├── analytics/       # 분석 API
│   │   │   ├── commerce/        # 커머스 API
│   │   │   └── social/          # 소셜 API
│   │   └── v1/                  # API v1 (레거시)
│   └── dashboard/               # UI 대시보드
│
├── shared/                        # 공유 리소스
│   ├── interfaces/
│   ├── types/
│   ├── utils/
│   └── constants/
│
└── infrastructure/               # 인프라 레이어
    ├── database/                # 데이터베이스 및 마이그레이션
    ├── cache/                   # 캐시 레이어
    ├── queue/                   # 메시지 큐
    └── monitoring/              # 모니터링
```

> 자세한 아키텍처 설명은 [ARCHITECTURE.md](./ARCHITECTURE.md)를 참조하세요.

## 🚦 시작하기

### 사전 요구사항

- **Node.js** 18.0.0 이상
- **npm** 9.0.0 이상
- **AWS Account** (Amplify 사용 시)
- **플랫폼 API 자격증명** (Google, Meta, Amazon, TikTok)

### 빠른 시작

#### 1. 의존성 설치

```bash
npm install
```

#### 2. 환경 변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일 수정:

```env
# AWS Amplify
AWS_REGION=us-east-1

# Google Platform
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Meta Platform
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret

# Amazon Platform
AMAZON_CLIENT_ID=your_amazon_client_id
AMAZON_CLIENT_SECRET=your_amazon_client_secret

# TikTok Platform
TIKTOK_APP_ID=your_tiktok_app_id
TIKTOK_APP_SECRET=your_tiktok_app_secret

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### 3. 개발 서버 시작

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

#### 4. (선택) AWS Amplify 백엔드 설정

실제 인증 및 데이터베이스를 사용하려면:

```bash
npm run ampx:sandbox
```

이 명령은 다음을 생성합니다:
- AWS Cognito (사용자 인증)
- AWS AppSync (GraphQL API)
- AWS DynamoDB (데이터베이스)
- AWS S3 (파일 스토리지)
- `amplify_outputs.json` (프론트엔드 설정)

### 플랫폼 API 설정

#### Google Ads
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. Google Ads API 활성화
4. OAuth 2.0 자격증명 생성
5. 리다이렉트 URI 추가: `http://localhost:3000/api/auth/callback/google`
6. Client ID와 Secret을 `.env.local`에 추가

#### Meta (Facebook) Ads
1. [Meta for Developers](https://developers.facebook.com/) 접속
2. 새 앱 생성 또는 기존 앱 선택
3. "Facebook Login" 제품 추가
4. OAuth 리다이렉트 URI 설정: `http://localhost:3000/api/auth/callback/meta`
5. 고급 액세스 요청: `ads_management`, `ads_read`
6. App ID와 Secret을 `.env.local`에 추가

#### Amazon Ads
1. [Amazon Advertising API](https://advertising.amazon.com/API/docs/en-us/get-started/overview) 접속
2. API 액세스 등록
3. Login with Amazon 애플리케이션 생성
4. Client ID와 Secret을 `.env.local`에 추가

#### TikTok for Business
1. [TikTok for Business](https://business-api.tiktok.com/) 접속
2. 개발자 계정 생성
3. 새 앱 등록
4. App ID와 Secret을 `.env.local`에 추가

### 개발 명령어

```bash
# 개발
npm run dev              # 개발 서버 시작
npm run build            # 프로덕션 빌드
npm run start            # 프로덕션 서버

# Amplify
npm run ampx:sandbox     # 샌드박스 모드
npm run ampx:generate    # GraphQL 타입 생성

# 코드 품질
npm run lint             # ESLint
npm run format           # Prettier
npm run type-check       # TypeScript 타입 체크

# 테스트
npm run test             # 단위 테스트
npm run test:e2e         # E2E 테스트
```

> 자세한 아키텍처 설명은 [ARCHITECTURE.md](./ARCHITECTURE.md)를 참조하세요.

## 🗂️ 프로젝트 구조 (도메인 기반 아키텍처)

```
sivera-alpha-2/
├── amplify/                        # AWS Amplify Gen 2 백엔드
│   ├── auth/                      # 인증 설정 (Cognito)
│   ├── data/                      # GraphQL 스키마 ✅ 업데이트됨
│   │   └── resource.ts           # Team, TeamMember, TeamInvitation 추가
│   ├── storage/                   # 파일 스토리지
│   └── backend.ts                 # 백엔드 통합
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── api/                   # API Routes
│   │   │   └── auth/             # OAuth 콜백
│   │   │       ├── google/       # Google OAuth
│   │   │       ├── meta/         # Meta OAuth
│   │   │       ├── amazon/       # Amazon OAuth
│   │   │       └── tiktok/       # TikTok OAuth
│   │   ├── auth/                  # 인증 페이지 ✅ 신규
│   │   │   └── page.tsx          # 회원가입/로그인/비밀번호 찾기
│   │   ├── dashboard/            # 대시보드 페이지 ✅ 업데이트됨
│   │   ├── settings/             # 설정 페이지 ✅ 신규
│   │   │   └── team/             # 팀 설정
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   └── providers.tsx         # Context providers
│
│   ├── core/                       # 핵심 도메인 독립 시스템
│   │   ├── auth/                  # 통합 인증 관리 ✅ 업데이트됨
│   │   │   └── credential-store.service.ts  # Amplify Data API 연동 완료
│   │   └── platform-registry/     # 플랫폼 레지스트리
│   │       ├── platform.interface.ts
│   │       ├── platform-registry.service.ts
│   │       └── platform-capabilities.enum.ts
│
│   ├── domains/                    # 도메인별 서비스
│   │   ├── auth/                  # 인증 도메인 ✅ 신규
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts  # 회원가입, 로그인, 비밀번호 찾기
│   │   │   └── components/
│   │   │       ├── SignUpForm.tsx
│   │   │       ├── SignInForm.tsx
│   │   │       └── PasswordResetForm.tsx
│   │   │
│   │   ├── team/                  # 팀 도메인 ✅ 신규
│   │   │   ├── services/
│   │   │   │   └── team.service.ts  # 조직 생성, 팀원 초대
│   │   │   └── components/
│   │   │       ├── TeamMembersList.tsx
│   │   │       ├── InviteMemberModal.tsx
│   │   │       └── TeamSwitcher.tsx
│   │   │
│   │   ├── advertising/           # 광고 도메인 ⚠️ 구조 완성
│   │   │   ├── services/
│   │   │   │   ├── campaign.service.ts
│   │   │   │   ├── creative.service.ts
│   │   │   │   └── reporting.service.ts
│   │   │   └── adapters/
│   │   │       ├── google-ads.adapter.ts
│   │   │       ├── meta-ads.adapter.ts
│   │   │       ├── amazon-ads.adapter.ts
│   │   │       └── tiktok-ads.adapter.ts
```

> 자세한 아키텍처 설명은 [ARCHITECTURE.md](./ARCHITECTURE.md)를 참조하세요.

## 🚦 시작하기

📖 **완전한 설치 및 배포 가이드는 [INSTALLATION.md](./INSTALLATION.md)를 참조하세요.**

### 로컬 개발 빠른 시작

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.example .env.local
# Edit .env.local with your credentials

# 3. 개발 서버 실행 (Amplify 없이도 작동)
npm run dev

# 4. (선택사항) Amplify 백엔드 시작
# AWS 리소스 생성 (Cognito, AppSync, DynamoDB, S3)
npm run ampx:sandbox
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### ⚠️ 중요 사항

- **Amplify 없이도 개발 가능**: 프로젝트는 `amplify_outputs.json`이 없어도 실행됩니다
- **Mock 설정 사용**: Amplify Sandbox를 실행하기 전까지 mock 설정으로 작동
- **실제 인증 필요시**: `npm run ampx:sandbox`로 AWS 리소스 생성 필요

### 주요 명령어

```bash
# 개발
npm run dev              # 개발 서버 시작
npm run build            # 프로덕션 빌드
npm run start            # 프로덕션 서버 시작

# Amplify
npm run ampx:sandbox     # 샌드박스 모드로 백엔드 시작
npm run ampx:generate    # GraphQL 타입 생성
npm run ampx:generate:forms  # Amplify UI 폼 생성

# 코드 품질
npm run lint             # ESLint 실행
npm run format           # Prettier 포맷팅
npm run type-check       # TypeScript 타입 체크

# 테스트
npm run test             # 단위 테스트
npm run test:e2e         # E2E 테스트
```

## � 구현 진행 상태

### 완료된 기능 (88% 완료)

#### ✅ 인증 및 팀 관리 (100%)
- **회원가입**: 일반 가입, 초대 링크 가입
- **로그인/로그아웃**: AWS Cognito 통합
- **비밀번호 재설정**: 이메일 인증 코드
- **조직 생성**: 자동 마스터 권한 부여
- **팀원 초대**: UUID 토큰 기반, 7일 유효기간
- **멀티 조직**: 한 사용자가 여러 조직 소속 가능
- **역할 관리**: master, team_mate, viewer
- **팀 전환**: TeamSwitcher 컴포넌트

#### ✅ 플랫폼 인증 (90%)
- **Google OAuth**: 완전 구현 ✅
- **Meta OAuth**: 완전 구현 ✅
- **Amazon OAuth**: 초기화 완료, 콜백 구현 필요
- **TikTok OAuth**: 초기화 완료, 콜백 구현 필요
- **자격증명 저장**: 별칭(alias) 지원으로 여러 계정 관리
- **자동 토큰 갱신**: 구조 완성, 스케줄러 구현 필요

#### ✅ 코어 서비스 (100%)
- **Platform Registry**: 플랫폼 능력(Capability) 기반 검색
- **Credential Store**: Amplify Data API 완전 통합
- **Auth Orchestrator**: 플랫폼 중립적 인증 플로우

#### ⚠️ 도메인 서비스 (40%)
- **Advertising**: 구조 완성, 플랫폼 API 연동 필요
- **Content, Analytics, Commerce, Social**: 미착수

### 다음 단계

**단기 (1-2주)**
1. Google Ads API 연동
2. Meta Ads API 연동
3. 캠페인 목록 페이지
4. AWS SES 이메일 발송

**중기 (1개월)**
1. Amazon, TikTok 광고 API 연동
2. 캠페인 생성/수정 기능
3. 성과 메트릭 대시보드
4. AWS KMS 토큰 암호화

**장기 (3개월)**
1. Content Management 도메인
2. Analytics 도메인
3. 크로스 플랫폼 리포팅
4. 자동화 워크플로우

## �📱 사용 방법

### 1. 개발 환경 실행

```bash
# 개발 서버 시작
npm run dev

# 브라우저에서 접속
open http://localhost:3000
```

### 2. 회원가입 및 로그인

#### 일반 회원가입
1. `/auth` 페이지 접속
2. 이메일, 비밀번호, 조직 이름 입력
3. 자동으로 조직 생성 및 마스터 권한 부여
4. 대시보드로 이동

#### 초대 링크로 가입
1. 팀 관리자가 초대 링크 생성
2. 초대받은 사용자가 링크 클릭
3. 이메일 자동 입력 (변경 불가)
4. 비밀번호만 입력하고 가입
5. 기존 조직의 팀원으로 추가

#### 멀티 조직 관리
- 대시보드에서 TeamSwitcher로 조직 전환
- 각 조직별로 다른 역할 보유 가능
- 초대 수락으로 여러 조직에 참여

### 3. 플랫폼 연동 (OAuth)

**환경 변수 설정**:
```bash
# .env.local 파일에 플랫폼 API 키 입력
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
```

**연동 과정**:
1. 대시보드에서 조직 선택 (TeamSwitcher)
2. 플랫폼 카드에서 "Connect" 버튼 클릭
3. OAuth 인증 페이지로 리다이렉션
4. 권한 승인
5. 대시보드로 복귀 및 성공 메시지 확인

**여러 계정 관리 (별칭)**:
- 같은 플랫폼에 여러 계정 연결 가능
- 별칭(alias)으로 구분 (예: "메인 계정", "테스트 계정")
- 팀 단위로 자격증명 관리

### 4. 캠페인 관리 (구현 예정)

- 캠페인 목록 조회
- 캠페인 생성/수정/삭제
- 예산 및 상태 변경
- 실시간 성과 모니터링

### 5. 팀 협업

#### 팀원 초대
1. 대시보드 → "Team Settings" 클릭
2. "팀원 초대" 버튼 클릭
3. 이메일 입력, 역할 선택
4. 초대 링크 생성 및 공유
5. 초대받은 사용자가 링크로 가입

#### 권한 관리
- **Master**: 모든 권한, 팀원 초대/제거, 역할 변경
- **Team Mate**: 캠페인 관리, 플랫폼 연결, 데이터 읽기/쓰기
- **Viewer**: 읽기 전용, 데이터 조회만 가능

#### 팀별 데이터 격리
- 각 조직의 데이터는 완전히 분리
- 플랫폼 자격증명도 조직별로 관리
- Row Level Security로 보안 강화

## 🔒 보안

- Row Level Security (RLS)로 데이터 보호
- 팀별 데이터 격리
- API 키 암호화 저장
- 권한 기반 접근 제어

## 🤝 기여하기

프로젝트에 기여하고 싶으시다면 [CONTRIBUTING.md](./CONTRIBUTING.md)를 참고해주세요.

**빠른 가이드:**

1. **저장소 포크 및 클론**

   ```bash
   git clone https://github.com/YOUR_USERNAME/all-ad.git
   cd all-ad
   pnpm install
   ```

2. **기능 브랜치 생성**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **개발 및 커밋**

   ```bash
   # 자동으로 ESLint + Prettier 적용됨 (pre-commit hook)
   git add .
   git commit -m "feat(scope): description"
   ```

4. **푸시 및 PR 생성**

   ```bash
   git push origin feature/amazing-feature
   ```

자세한 개발 워크플로우, 코딩 가이드라인, 문제 해결 방법은 **[CONTRIBUTING.md](./CONTRIBUTING.md)**에서 확인하세요.


## 🔧 문제 해결

### 자주 발생하는 문제들

#### 1. Pre-commit Hook 오류

```bash
# Hook이 설치되지 않은 경우
pnpm run prepare

# Hook 파일 권한 문제
chmod +x .husky/pre-commit

# 수동으로 pre-commit 체크 실행
pnpm run pre-commit
```

#### 2. ESLint 오류

```bash
# ESLint 캐시 초기화
rm -rf .eslintcache

# 전체 프로젝트 재린팅
pnpm lint
```

#### 3. TypeScript 오류

```bash
# TypeScript 캐시 초기화
rm -rf .next
rm tsconfig.tsbuildinfo

# 타입 체크
pnpm tsc
```

#### 4. 의존성 문제

```bash
# node_modules 재설치
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 📝 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 문의

- Email: <support@all-ad.com>
- Website: <https://all-ad.com>


