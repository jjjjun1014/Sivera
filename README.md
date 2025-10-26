# Sivera - All-in-One Ad Management Platform

통합 광고 관리 플랫폼 프론트엔드

## 📋 프로젝트 개요

Sivera는 Google Ads, Meta Ads, TikTok Ads, Amazon Ads, Naver Ads 등 여러 광고 플랫폼을 하나의 대시보드에서 관리할 수 있는 통합 광고 관리 솔루션입니다.

## 🛠 기술 스택

- **Framework**: Next.js 15.5.4 (App Router, Turbopack)
- **Language**: TypeScript
- **UI Library**: HeroUI (NextUI 기반)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Form Handling**: React Hook Form
- **Date Handling**: @internationalized/date
- **Payment**: PortOne V2
- **Animation**: Framer Motion

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- npm, yarn, 또는 pnpm

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

개발 서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 환경 변수 설정

`.env.example` 파일을 복사하여 `.env.local` 파일을 생성하고 필요한 환경 변수를 설정하세요.

```bash
cp .env.example .env.local
```

## 🔌 백엔드 연동 가이드 (중요!)

**현재 프론트엔드는 Supabase 의존성이 모두 제거된 상태입니다.**

모든 서버 액션 파일과 API 호출 코드에 `TODO: Backend Integration Required` 주석이 달려있으며, 각 주석에는 필요한 API 엔드포인트가 명시되어 있습니다.

### 🔍 TODO 주석 찾기

프로젝트 전체에서 백엔드 연동이 필요한 부분을 찾으려면:

```bash
# 모든 TODO 주석 검색
grep -r "TODO: Backend Integration Required" src/

# 특정 파일별로 확인
grep -r "TODO" src/app/dashboard/actions.ts
```

### 📡 필요한 API 엔드포인트 목록

#### 인증 (Authentication)
- `GET /api/auth/me` - 현재 인증된 사용자 정보
- `GET /api/auth/me/team` - 사용자의 팀 ID
- `GET /api/auth/me/role` - 사용자의 역할
- `GET /api/auth/me/profile` - 사용자의 프로필
- `POST /api/auth/logout` - 로그아웃

#### 팀 관리 (Teams)
- `POST /api/teams` - 새 팀 생성
- `GET /api/teams/current` - 현재 사용자의 팀 정보
- `GET /api/teams/:teamId/members` - 팀 멤버 목록
- `POST /api/teams/invitations` - 팀원 초대
- `PATCH /api/teams/members/:memberId/role` - 멤버 역할 변경
- `DELETE /api/teams/members/:memberId` - 멤버 제거

#### 초대 (Invitations)
- `GET /api/invitations/:token` - 초대 정보 조회
- `POST /api/invitations/:token/accept` - 초대 수락
- `POST /api/invitations/:invitationId/decline` - 초대 거절
- `GET /api/invitations/pending` - 대기 중인 초대 목록

#### 프로필 (Profile)
- `GET /api/profile` - 사용자 프로필 조회
- `GET /api/profiles/:userId` - 특정 사용자 프로필 조회
- `PATCH /api/profile` - 프로필 업데이트
- `PATCH /api/profile/avatar` - 아바타 업데이트
- `PUT /api/user/password` - 비밀번호 변경
- `DELETE /api/user/account` - 계정 삭제

#### 캠페인 (Campaigns)
- `GET /api/campaigns` - 캠페인 목록 (페이지네이션, 필터링 지원)
- `GET /api/campaigns/:id` - 캠페인 상세 정보
- `PUT /api/campaigns/:id` - 캠페인 업데이트
- `DELETE /api/campaigns/:id` - 캠페인 삭제
- `POST /api/campaigns/:id/sync` - 캠페인 데이터 동기화

#### 플랫폼 인증 정보 (Platform Credentials)
- `GET /api/credentials` - 플랫폼 인증 정보 목록
- `POST /api/credentials` - 인증 정보 추가
- `PATCH /api/credentials/:id` - 인증 정보 업데이트
- `PATCH /api/credentials/:id/toggle` - 인증 정보 활성화/비활성화
- `DELETE /api/credentials/:id` - 인증 정보 삭제

#### 통합 데이터 (Integrated Data)
- `GET /api/integrated/data` - 모든 플랫폼 통합 데이터
- `POST /api/integrated/sync` - 모든 플랫폼 동기화

#### 플랫폼 연동 (Platform Integrations)
- `POST /api/integrations/google-ads/auth/start` - Google Ads OAuth 시작
- `DELETE /api/integrations/google-ads` - Google Ads 연동 해제
- `POST /api/integrations/meta-ads/auth/start` - Meta Ads OAuth 시작
- `DELETE /api/integrations/meta-ads` - Meta Ads 연동 해제
- (기타 플랫폼도 동일한 패턴)

### 📂 주요 파일 위치

백엔드 연동이 필요한 주요 파일들:

```
src/
├── app/
│   ├── login/
│   │   └── client-actions.ts          # 로그인 관련 클라이언트 액션
│   ├── dashboard/
│   │   ├── actions.ts                 # 캠페인 CRUD
│   │   ├── settings/actions.ts        # 사용자 설정
│   │   ├── profile/actions.ts         # 프로필 관리
│   │   ├── team/actions.ts            # 팀 관리
│   │   └── integrated/
│   │       ├── actions.ts             # 통합 데이터
│   │       └── google-ads-actions.ts  # Google Ads 연동
│   └── invite/[token]/
│       ├── page.tsx                   # 초대 페이지
│       └── InviteAcceptClient.tsx     # 초대 수락
├── utils/
│   ├── auth/server.ts                 # 서버 인증 유틸
│   ├── profile.server.ts              # 프로필 서버 유틸
│   ├── server-action-wrapper.ts       # 서버 액션 래퍼
│   ├── team/user-teams.ts             # 팀 유틸
│   └── supabase/
│       ├── client.ts                  # API 클라이언트 (stub)
│       └── server.ts                  # API 서버 클라이언트 (stub)
└── stores/
    └── slices/
        ├── platformActionsSlice.ts    # 플랫폼 액션 스토어
        └── teamActionsSlice.ts        # 팀 액션 스토어
```

### 🔄 Mock 데이터

현재 UI가 동작하도록 Mock 데이터가 유지되어 있습니다:

- `src/lib/data/` - Mock 캠페인, 광고, 플랫폼 데이터
- 백엔드 API 연동 후 이 Mock 데이터는 제거하고 실제 API 호출로 대체하면 됩니다

### 🎨 타입 정의

모든 타입 정의는 `src/types/` 디렉토리에 있습니다:

- `campaign.types.ts` - 캠페인 관련 타입
- `workspace.ts` - 워크스페이스 타입
- `permissions.ts` - 권한 관리 (RBAC)
- `subscription.ts` - 구독/요금제 타입
- `database.types.ts` - 데이터베이스 스키마 타입

## 🏗 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── (auth)/            # 인증 관련 페이지 (로그인, 회원가입 등)
│   ├── dashboard/         # 대시보드 페이지
│   │   ├── platforms/    # 플랫폼별 대시보드
│   │   ├── analytics/    # 분석 페이지
│   │   ├── integrated/   # 통합 관리 페이지
│   │   ├── team/         # 팀 관리 페이지
│   │   └── settings/     # 설정 페이지
│   └── invite/           # 팀 초대 페이지
├── components/
│   ├── features/         # 주요 기능 컴포넌트
│   ├── layouts/          # 레이아웃 컴포넌트
│   ├── tables/           # 테이블 컴포넌트
│   ├── templates/        # 페이지 템플릿
│   └── ui/               # 재사용 가능한 UI 컴포넌트
├── lib/
│   ├── data/             # Mock 데이터
│   └── utils/            # 유틸리티 함수
├── stores/               # Zustand 스토어
├── types/                # TypeScript 타입 정의
├── utils/                # 서버 유틸리티
└── styles/               # 글로벌 스타일

```

## 🎯 주요 기능

### ✅ 이미 구현된 기능

- **대시보드**: 통합 광고 성과 대시보드
- **플랫폼별 관리**: Google Ads, Meta Ads, TikTok Ads, Amazon Ads, Naver Ads
- **캠페인 관리**: 예산 편집, 상태 토글, 테이블 관리
- **팀 관리**: 팀원 초대, 역할 관리 (RBAC)
- **워크스페이스**: 다중 워크스페이스 지원
- **구독 관리**: Basic, Standard, Pro 플랜
- **결제 시스템**: PortOne V2 통합 준비
- **반응형 디자인**: 모바일 최적화

### 🚧 백엔드 연동 필요

- 사용자 인증 및 세션 관리
- 실제 광고 플랫폼 API 연동
- 데이터베이스 연동
- 파일 업로드 (프로필 사진 등)
- 실시간 데이터 동기화

## 🔐 권한 관리 (RBAC)

다음 역할이 구현되어 있습니다:

- **Owner**: 모든 권한
- **Admin**: 팀원 관리 제외한 모든 권한
- **Member**: 기본 읽기/쓰기 권한
- **Viewer**: 읽기 전용

권한 체크 로직은 `src/types/permissions.ts` 참고

## 💳 구독 플랜

- **Basic**: 월 $29 / ₩39,000 - 1개 플랫폼
- **Standard**: 월 $79 / ₩99,000 - 3개 플랫폼
- **Pro**: 월 $149 / ₩189,000 - 5개 플랫폼

## 🌐 다국어 지원

현재 한국어만 지원 (`ko.json`)하지만, 다국어 시스템은 구축되어 있습니다:
- `src/app/dictionaries/` - 언어별 사전 파일
- 영어(`en.json`), 중국어(`zh.json`) 파일도 준비되어 있음

## 📝 환경 변수

`.env.example` 파일 참고:

```env
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# AWS (백엔드에서 사용 예정)
AWS_REGION=ap-northeast-2
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID=
NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID=
NEXT_PUBLIC_API_GATEWAY_URL=

# PortOne V2 (결제)
NEXT_PUBLIC_PORTONE_STORE_ID=
```

## 🐛 알려진 이슈

- 모든 API 호출이 stub 상태이므로 백엔드 연동 전까지는 Mock 데이터로 동작
- 플랫폼 OAuth 흐름은 백엔드 구현 필요
- 파일 업로드 기능은 백엔드 스토리지 연동 필요

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.

---

**Last Updated**: 2025-01-26
**Version**: 0.1.0
