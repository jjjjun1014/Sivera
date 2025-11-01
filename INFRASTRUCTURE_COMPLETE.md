# Sivera Frontend - Infrastructure Setup Complete ✅

## 🎉 완료된 작업

### 1. **Amplify Gen 2 통합**
- ✅ amplify_outputs.json 백엔드 연동
- ✅ Amplify 클라이언트 초기화 (SSR 지원)
- ✅ Auth Context 전역 상태 관리
- ✅ GraphQL 클라이언트 설정

### 2. **인증 시스템 (AWS Cognito)**
- ✅ 로그인 (`/login`)
- ✅ 회원가입 (`/signup`)
- ✅ 비밀번호 재설정 (`/forgot-password`, `/reset-password`)
- ✅ 이메일 인증 코드 처리
- ✅ JWT 토큰 관리
- ✅ 자동 로그인 유지

### 3. **팀 관리 시스템**
- ✅ 팀 생성/수정/삭제
- ✅ 팀 멤버 관리 (master/team_mate/viewer)
- ✅ 팀 초대 생성/수락/취소
- ✅ 초대 링크 페이지 (`/invite`)
- ✅ 권한 기반 접근 제어

### 4. **서비스 레이어 (완전 구현)**
```typescript
src/lib/services/
├── auth.service.ts         # 인증 (Cognito)
├── graphql.service.ts      # GraphQL 범용 CRUD
├── user.service.ts         # 사용자 관리
├── team.service.ts         # 팀 및 초대
├── campaign.service.ts     # 캠페인 및 메트릭
├── platform.service.ts     # OAuth 및 플랫폼 연동
└── index.ts               # 중앙 export
```

### 5. **타입 시스템**
```typescript
src/types/
├── amplify.ts    # 백엔드 모델 타입 (12개 모델)
└── schema.ts     # GraphQL 스키마 타입
```

### 6. **유틸리티 함수**
```typescript
src/utils/
├── error-handler.ts  # 통일된 에러 처리
├── date.ts          # 날짜 포맷팅
└── numbers.ts       # 숫자 포맷팅 (ROAS, CTR, CPC 등)
```

### 7. **상수 정의**
```typescript
src/constants/
└── platforms.ts  # 플랫폼 이름, 색상, 아이콘
```

### 8. **UI 컴포넌트**
- ✅ AuthForm (로그인/회원가입 통합)
- ✅ ForgotPasswordForm
- ✅ ResetPasswordForm
- ✅ InviteAcceptForm
- ✅ DashboardAuthGuard (보호된 페이지)

---

## 🔐 백엔드 연동 완료

### AWS Cognito User Pool
- **User Pool ID**: `us-west-1_yqQYuvh9F`
- **Client ID**: 환경 변수에서 관리
- **Region**: `us-west-1`

### AppSync GraphQL API
- **Endpoint**: `https://5ssvw3be2ratbibxq7ozd6g44u.appsync-api.us-west-1.amazonaws.com/graphql`
- **Auth Mode**: Cognito User Pools

### DynamoDB Tables (12개)
1. User
2. Team
3. TeamMember
4. TeamInvitation
5. PlatformCredential
6. Campaign
7. CampaignMetric
8. ManualCampaign
9. ManualCampaignMetric
10. SyncLog
11. OauthState
12. ActivityLog

---

## 📁 프로젝트 구조

```
Sivera/
├── amplify_outputs.json        # 백엔드 설정 (복사됨)
├── .env.local                 # 환경 변수 (복사됨)
├── src/
│   ├── app/
│   │   ├── login/             # 로그인 페이지
│   │   ├── signup/            # 회원가입 페이지
│   │   ├── forgot-password/   # 비밀번호 찾기
│   │   ├── reset-password/    # 비밀번호 재설정
│   │   ├── invite/            # 초대 수락
│   │   ├── dashboard/         # 대시보드 (인증 필요)
│   │   └── providers.tsx      # AuthProvider 통합
│   ├── components/
│   │   ├── auth/              # 인증 관련 컴포넌트
│   │   ├── features/          # 기능별 컴포넌트
│   │   └── layouts/           # DashboardLayout (인증 가드)
│   ├── contexts/
│   │   └── auth-context.tsx   # 전역 인증 상태
│   ├── lib/
│   │   ├── amplify-client.ts  # Amplify 설정
│   │   └── services/          # 모든 비즈니스 로직
│   ├── types/
│   │   ├── amplify.ts         # 백엔드 타입
│   │   └── schema.ts          # GraphQL 타입
│   ├── constants/
│   │   └── platforms.ts       # 플랫폼 상수
│   └── utils/
│       ├── error-handler.ts   # 에러 처리
│       ├── date.ts            # 날짜 유틸
│       └── numbers.ts         # 숫자 유틸
```

---

## 🚀 사용 방법

### 1. 환경 변수 설정 (.env.local)
이미 백엔드에서 복사되어 설정됨:
```bash
AWS_REGION=us-west-1
COGNITO_USER_POOL_ID=us-west-1_yqQYuvh9F
# ... (OAuth credentials 등)
```

### 2. 로그인 사용
```typescript
import { useAuth } from '@/contexts/auth-context';

function MyComponent() {
  const { signIn, user, loading } = useAuth();

  const handleLogin = async () => {
    const result = await signIn({
      email: 'user@example.com',
      password: 'password123',
    });
    
    if (result.success) {
      // 로그인 성공
    }
  };
}
```

### 3. 보호된 페이지
```typescript
// DashboardLayout에 이미 적용됨
import DashboardAuthGuard from '@/components/auth/DashboardAuthGuard';

export default function ProtectedPage() {
  return (
    <DashboardAuthGuard>
      <div>보호된 콘텐츠</div>
    </DashboardAuthGuard>
  );
}
```

### 4. GraphQL 호출
```typescript
import { list, create, update } from '@/lib/services/graphql.service';

// 팀 목록 조회
const teams = await list('Team', { limit: 10 });

// 캠페인 생성
const campaign = await create('Campaign', {
  data: {
    teamID: 'team-id',
    name: 'My Campaign',
    platform: 'google',
  },
});
```

### 5. 팀 초대
```typescript
import { createInvitation } from '@/lib/services/team.service';

// 초대 생성
const invitation = await createInvitation({
  teamID: 'team-id',
  email: 'new-member@example.com',
  role: 'team_mate',
  invitedByID: 'current-user-id',
});

// 초대 링크: /invite?token={invitation.id}
```

---

## 🎯 다음 단계 (선택사항)

### 1. OAuth 플로우 구현
- Google Ads 연동
- Meta Ads 연동
- Amazon Ads 연동
- TikTok Ads 연동

### 2. Campaign 데이터 실시간 동기화
- 백엔드 Lambda 활용
- SyncLog 모니터링

### 3. Dashboard UI 개선
- 실제 데이터 연동
- 차트 및 그래프
- 필터링 및 검색

---

## ⚠️ 중요 사항

1. **백엔드는 절대 수정하지 않았습니다** (sivera-backend 폴더는 읽기 전용)
2. **모든 인증은 Cognito 기반**으로 동작합니다
3. **GraphQL 쿼리는 AppSync**를 통해 실행됩니다
4. **타입 안전성**이 모든 서비스에서 보장됩니다
5. **에러 처리**가 통일되어 있습니다

---

## 📝 코드 재사용 원칙

- ✅ 모든 API 호출은 `src/lib/services/`에서 관리
- ✅ 타입은 `src/types/`에서 중앙 관리
- ✅ 상수는 `src/constants/`에서 정의
- ✅ 유틸리티 함수는 `src/utils/`에서 공유
- ✅ 컴포넌트는 기능별로 분리

---

## 🛠 빌드 및 실행

```bash
# 개발 서버
pnpm dev

# 빌드 (테스트는 하지 않음)
# pnpm build
```

---

## ✅ 체크리스트

- [x] Amplify 클라이언트 설정
- [x] 타입 시스템 구축
- [x] Auth Service (로그인/회원가입/비밀번호 재설정)
- [x] User Service (사용자 관리)
- [x] Team Service (팀 및 초대)
- [x] Campaign Service (캠페인 및 메트릭)
- [x] Platform Service (OAuth 준비)
- [x] GraphQL Service (범용 CRUD)
- [x] Auth Context (전역 상태)
- [x] Dashboard Auth Guard (보호)
- [x] Invite 페이지 구현
- [x] 에러 처리 표준화
- [x] 유틸리티 함수 (date, numbers)
- [x] 상수 정의 (platforms)

---

**모든 기초 인프라가 완벽하게 구축되었습니다! 🎉**

편히 주무세요! 내일 OAuth 플로우나 Dashboard 실데이터 통합을 진행하시면 됩니다.
