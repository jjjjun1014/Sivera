# Cron Jobs 가이드

Sivera Alpha는 스케줄된 작업을 사용하여 정기적인 배치 작업을 자동으로 실행합니다.

## 📋 목차

- [설정된 Cron Jobs](#설정된-cron-jobs)
- [보안 설정](#보안-설정)
- [로컬 테스트](#로컬-테스트)
- [모니터링](#모니터링)
- [문제 해결](#문제-해결)

---

## 설정된 Cron Jobs

### 1. 토큰 자동 갱신 (`/api/cron/refresh-tokens`)

**스케줄**: `0 */6 * * *` (6시간마다)

**목적**: 만료 예정인 플랫폼 OAuth 토큰을 자동으로 갱신합니다.

**동작 방식**:
- 24시간 이내에 만료되는 토큰을 조회
- 각 플랫폼의 refresh token을 사용하여 새 access token 발급
- 실패한 토큰은 로그에 기록

**실행 시간**: 최대 5분

**설정**:
```json
{
  "path": "/api/cron/refresh-tokens",
  "schedule": "0 */6 * * *"
}
```

### 2. 캠페인 데이터 동기화 (`/api/cron/sync-campaigns`)

**스케줄**: `0 */1 * * *` (1시간마다)

**목적**: 모든 플랫폼의 캠페인 데이터를 동기화합니다.

**동작 방식**:
- 활성 광고 계정 조회
- 각 계정의 캠페인 동기화를 큐에 추가
- 변경된 데이터만 증분 업데이트

**실행 시간**: 최대 5분

**설정**:
```json
{
  "path": "/api/cron/sync-campaigns",
  "schedule": "0 */1 * * *"
}
```

### 3. 만료된 토큰 정리 (`/api/cron/cleanup-expired-tokens`)

**스케줄**: `0 2 * * *` (매일 새벽 2시)

**목적**: 만료된 OAuth 상태, 세션, 로그를 정리합니다.

**동작 방식**:
- 만료된 OAuth 상태 삭제
- 만료된 세션 삭제
- 30일 이상 된 토큰 갱신 로그 삭제

**실행 시간**: 최대 1분

**설정**:
```json
{
  "path": "/api/cron/cleanup-expired-tokens",
  "schedule": "0 2 * * *"
}
```

---

## 보안 설정

### CRON_SECRET 환경 변수

Cron Job 엔드포인트는 `CRON_SECRET` 환경 변수로 보호됩니다.

#### 1. CRON_SECRET 생성

안전한 랜덤 문자열을 생성합니다 (최소 16자):

```bash
# 방법 1: OpenSSL 사용
openssl rand -base64 32

# 방법 2: Node.js 사용
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 방법 3: 1Password 등 비밀번호 생성기 사용
```

#### 2. 환경 변수 설정

배포 환경에 `CRON_SECRET` 환경 변수를 추가합니다:

- Production 환경
- Preview/Staging 환경
- Development 환경

#### 3. 로컬 환경 변수 설정

`.env.local` 파일에 추가:

```env
CRON_SECRET="your-generated-secret-here"
```

### 보안 검증 코드

모든 Cron Job 엔드포인트는 다음과 같이 인증을 검증합니다:

```typescript
export async function GET(request: NextRequest) {
  // CRON_SECRET 검증
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // ... 나머지 로직
}
```

---

## 로컬 테스트

Cron Jobs는 로컬에서 일반 API 엔드포인트처럼 테스트할 수 있습니다.

### 개발 서버 실행

```bash
pnpm dev
```

### curl로 테스트

```bash
# 토큰 갱신
curl -X GET http://localhost:3000/api/cron/refresh-tokens \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# 캠페인 동기화
curl -X GET http://localhost:3000/api/cron/sync-campaigns \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# 만료 토큰 정리
curl -X GET http://localhost:3000/api/cron/cleanup-expired-tokens \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### 브라우저에서 테스트

Authorization 헤더를 추가할 수 있는 브라우저 확장 프로그램을 사용하거나, Postman/Insomnia 같은 API 클라이언트를 사용하세요.

### 테스트 스크립트 작성

```typescript
// scripts/test-cron.ts
async function testCronJob(path: string) {
  const response = await fetch(`http://localhost:3000${path}`, {
    headers: {
      Authorization: `Bearer ${process.env.CRON_SECRET}`,
    },
  })

  const data = await response.json()
  console.log(`${path}:`, data)
}

// 실행
testCronJob("/api/cron/refresh-tokens")
```

---

## 모니터링

### 대시보드에서 확인

1. **Cron Jobs 탭**:
   - 프로젝트 → Settings → Cron Jobs
   - 각 Cron Job의 실행 기록 확인
   - "View Logs" 버튼으로 상세 로그 보기

2. **Logs 탭**:
   - 프로젝트 → Logs
   - `requestPath:/api/cron/refresh-tokens` 필터 사용
   - 실시간 로그 모니터링

### 로그 확인

```bash
# CLI로 로그 확인
logs --filter=requestPath:/api/cron/refresh-tokens

# 실시간 모니터링
logs --follow
```

### 알림 설정

통합 기능으로 Slack, Discord 등에 알림을 설정할 수 있습니다:

1. 대시보드 → Integrations
2. Slack/Discord 연동
3. Deployment 및 Error 알림 활성화

### 커스텀 모니터링

Cron Job 실행 결과를 외부 모니터링 서비스로 전송:

```typescript
// app/api/cron/refresh-tokens/route.ts
import { sendToMonitoring } from "@/lib/monitoring"

export async function GET(request: NextRequest) {
  // ... 인증 및 실행 로직

  const result = await tokenRefreshService.refreshAllExpiringSoonTokens()

  // 모니터링 서비스로 전송
  await sendToMonitoring("cron.refresh_tokens", {
    success: true,
    totalProcessed: result.totalProcessed,
    failed: result.failed,
  })

  return NextResponse.json({ success: true, data: result })
}
```

---

## 문제 해결

### Cron Job이 실행되지 않음

**원인 1**: 스케줄 설정이 배포되지 않음

```bash
# 해결: 재배포
git add config/schedule.json
git commit -m "chore: update cron jobs"
git push
```

**원인 2**: CRON_SECRET이 설정되지 않음

```bash
# 해결: 환경 변수 확인
env ls

# 없으면 추가
env add CRON_SECRET production
```

**원인 3**: Cron Job이 비활성화됨

대시보드에서 Cron Jobs 탭을 확인하고 "Enable Cron Jobs" 클릭

### 401 Unauthorized 오류

**원인**: Authorization 헤더가 잘못되었거나 CRON_SECRET이 일치하지 않음

**해결**:

```bash
# 로컬 환경 변수 확인
echo $CRON_SECRET

# 환경 변수 확인
env pull .env.local --force

# 로그 확인
logs --filter=status:401
```

### 404 Not Found 오류

**원인**: Cron Job 경로가 존재하지 않음

**해결**:
```bash
# 라우트 파일 확인
ls -la app/api/cron/refresh-tokens/route.ts

# 빌드 확인
pnpm build

# 재배포
vercel --prod
```

### Timeout 오류

**원인**: Cron Job 실행 시간이 `maxDuration`을 초과

**해결 1**: maxDuration 증가

```typescript
// app/api/cron/refresh-tokens/route.ts
export const maxDuration = 300 // 5분으로 증가
```

**해결 2**: 배치 크기 줄이기

```typescript
// 한 번에 처리하는 토큰 수 제한
const expiringCredentials = await prisma.platformCredential.findMany({
  where: { /* ... */ },
  take: 100, // 최대 100개만 처리
})
```

**해결 3**: 작업 분할

```typescript
// 여러 Cron Job으로 분할
// vercel.json
{
  "crons": [
    { "path": "/api/cron/refresh-tokens/google", "schedule": "0 */6 * * *" },
    { "path": "/api/cron/refresh-tokens/meta", "schedule": "5 */6 * * *" },
    { "path": "/api/cron/refresh-tokens/amazon", "schedule": "10 */6 * * *" }
  ]
}
```

### 동시 실행 문제

**원인**: Cron Job이 이전 실행이 끝나기 전에 다시 시작됨

**해결**: Redis Lock 구현

```typescript
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function GET(request: NextRequest) {
  // Lock 획득 시도
  const lockKey = "cron:refresh-tokens:lock"
  const lockAcquired = await redis.set(lockKey, "1", {
    ex: 300, // 5분 후 자동 만료
    nx: true, // 키가 없을 때만 설정
  })

  if (!lockAcquired) {
    return NextResponse.json({
      success: false,
      message: "Another instance is already running",
    })
  }

  try {
    // Cron Job 실행
    const result = await tokenRefreshService.refreshAllExpiringSoonTokens()
    return NextResponse.json({ success: true, data: result })
  } finally {
    // Lock 해제
    await redis.del(lockKey)
  }
}
```

### 로그가 표시되지 않음

**원인 1**: Cron Job이 리다이렉트 응답을 반환

Cron Job은 리다이렉트를 따라가지 않으므로 로그가 기록되지 않습니다.

**원인 2**: Cron Job이 캐시된 응답을 반환

캐시된 응답도 로그에 표시되지 않습니다.

**해결**: 직접 Response 반환 및 캐시 비활성화

```typescript
export async function GET(request: NextRequest) {
  // ... 로직

  return NextResponse.json(
    { success: true },
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    }
  )
}
```

---

## Cron 표현식 가이드

### 기본 형식

```
* * * * *
│ │ │ │ │
│ │ │ │ └─ 요일 (0-7, 0과 7은 일요일)
│ │ │ └─── 월 (1-12)
│ │ └───── 일 (1-31)
│ └─────── 시 (0-23)
└───────── 분 (0-59)
```

### 예제

```bash
# 매 시간 0분에 실행
0 * * * *

# 6시간마다 실행 (0시, 6시, 12시, 18시)
0 */6 * * *

# 매일 새벽 2시에 실행
0 2 * * *

# 평일 오전 9시에 실행
0 9 * * 1-5

# 매월 1일 자정에 실행
0 0 1 * *
```

### Hobby 플랜 제한

Hobby 플랜에서는 **시간 단위 정확도**만 지원됩니다:

- `* 8 * * *` → 08:00:00 ~ 08:59:59 사이에 실행
- 정확한 분을 지정할 수 없음

Pro 플랜 이상에서는 **분 단위 정확도** 지원:

- `5 8 * * *` → 08:05:00 ~ 08:05:59 사이에 실행

---

## 관리 작업

### Cron Job 업데이트

1. `vercel.json` 수정
2. 코드 변경 (필요한 경우)
3. 재배포

```bash
git add vercel.json app/api/cron/
git commit -m "chore: update cron jobs"
git push
```

### Cron Job 삭제

1. `vercel.json`에서 해당 cron 제거
2. 재배포

```bash
# vercel.json에서 cron 항목 제거 후
git add vercel.json
git commit -m "chore: remove cron job"
git push
```

### Cron Job 비활성화

Vercel 대시보드에서:

1. Settings → Cron Jobs
2. "Disable Cron Jobs" 버튼 클릭

**주의**: 비활성화된 Cron Job도 여전히 목록에 표시되며 할당량에 포함됩니다.

### Rollback 시 주의사항

Instant Rollback을 수행해도 Cron Job은 업데이트되지 않습니다:

- 이전 배포로 롤백해도 Cron Job은 최신 설정 유지
- 수동으로 비활성화하거나 업데이트 필요

---

## 할당량 및 제한

### 플랜별 제한

| 플랜       | Cron Jobs 수 | 정확도    | maxDuration  |
| ---------- | ------------ | --------- | ------------ |
| Hobby      | 2개          | 시간 단위 | 10초         |
| Pro        | 20개         | 분 단위   | 300초 (5분)  |
| Enterprise | 무제한       | 분 단위   | 900초 (15분) |

### 현재 사용량 확인

```bash
# Vercel CLI로 확인
vercel inspect

# 또는 대시보드에서
# Settings → Cron Jobs → Usage
```

---

## 참고 자료

- [Vercel Cron Jobs 공식 문서](https://vercel.com/docs/cron-jobs)
- [Vercel Functions Duration](https://vercel.com/docs/functions/runtimes#max-duration)
- [Cron Expression Generator](https://crontab.guru/)
- [Upstash Redis for Locking](https://upstash.com/)

---

## 추가 Cron Jobs 아이디어

프로젝트 요구사항에 따라 다음 Cron Jobs를 추가할 수 있습니다:

### 1. 성과 보고서 생성
```json
{
  "path": "/api/cron/generate-reports",
  "schedule": "0 1 * * *"
}
```

### 2. 예산 알림
```json
{
  "path": "/api/cron/check-budgets",
  "schedule": "0 */4 * * *"
}
```

### 3. 백업
```json
{
  "path": "/api/cron/backup-data",
  "schedule": "0 3 * * 0"
}
```

### 4. 성능 메트릭 수집
```json
{
  "path": "/api/cron/collect-metrics",
  "schedule": "*/30 * * * *"
}
```

각 Cron Job에 대한 상세 구현은 프로젝트 요구사항에 맞게 추가하세요.
