# Sivera 프로젝트 AI 개발 가이드

> 이 문서는 AI 어시스턴트가 Sivera 프로젝트를 이해하고 개발할 때 참고해야 할 지침서입니다.

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [프로젝트 구조](#프로젝트-구조)
4. [핵심 개발 원칙](#핵심-개발-원칙)
5. [주요 컴포넌트 및 패턴](#주요-컴포넌트-및-패턴)
6. [작업 시 참고해야 할 파일들](#작업-시-참고해야-할-파일들)
7. [개발 워크플로우](#개발-워크플로우)
8. [자주 사용하는 패턴](#자주-사용하는-패턴)
9. [주의사항](#주의사항)

---

## 프로젝트 개요

**Sivera**는 다중 광고 플랫폼 통합 관리 대시보드입니다.

### 주요 기능
- 🎯 **다중 플랫폼 지원**: Google Ads, Meta Ads, TikTok Ads, Amazon Ads
- 📊 **통합 대시보드**: 모든 플랫폼의 캠페인 데이터를 한 곳에서 관리
- ⚙️ **커스터마이징**: 사용자별 대시보드 레이아웃 저장 (차트, 요약 카드, 테이블)
- 👥 **팀 협업**: 팀 생성, 초대, 역할 관리
- 🔐 **보안**: AWS Cognito 인증, KMS 암호화 자격증명

### 현재 개발 상태 (2025-10-21)
- ✅ UI/UX 기본 구조 완성
- ✅ 플랫폼별 대시보드 페이지 구현 (Google/Meta/TikTok/Amazon)
  - ✅ 각 플랫폼별 세부 캠페인 타입 페이지 (14개 페이지)
  - ✅ 플랫폼 통합 대시보드 (PlatformGoalDashboard 템플릿)
  - ✅ 탭 기반 계층 구조 (캠페인 → 광고그룹 → 광고)
- ✅ 통합 분석 대시보드 (목표 추적, 플랫폼 비교, 차트)
- ✅ 커스터마이징 시스템 (localStorage 기반)
- ✅ 목표 설정 및 달성률 표시 (전체 플랫폼)
- ✅ 천 단위 구분자 자동 포맷팅
- ✅ 날짜 선택 기능
- ✅ TanStack Table 통합 - 캠페인/광고그룹/광고 테이블 모두 적용
  - ✅ 드래그앤드롭 컬럼 정렬
  - ✅ 인라인 이름 편집 (Edit 아이콘)
  - ✅ 컬럼 관리 모달
  - ✅ 정렬, 필터, 페이지네이션
  - ✅ 계층 필터링 (캠페인 클릭 → 광고그룹 필터, 광고그룹 클릭 → 광고 필터)
- ✅ 테이블 텍스트 truncation (ellipsis)
- ✅ 텍스트 줄바꿈 방지 (whitespace-nowrap)
- ✅ 예산 편집 로직 (campaignType 기반 자동 판별)
- ✅ 알림/노티피케이션 페이지 (UI 완성)
- ✅ 팀 관리 페이지 (초대, 역할, 변경 이력 UI)
- ✅ AWS 인프라 연동 준비 완료 (타입, 인터페이스, API 클라이언트)
- ⏳ 실제 광고 플랫폼 API 연동 (구현 대기)
- ⏳ AWS Lambda/DynamoDB/Cognito 백엔드 구현 (구현 대기)
- ⏳ 일괄 작업 기능 백엔드 연동 (UI 완성, 연동 대기)

---

## 기술 스택

### Frontend
- **Framework**: Next.js 15.5.4 (App Router, Turbopack)
- **Language**: TypeScript 5
- **UI Library**: HeroUI (NextUI 기반)
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Tables**: TanStack Table v8 (정렬, 필터, 드래그앤드롭)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner (toast)
- **Date**: @internationalized/date

### Backend (준비 완료, 구현 대기)
- **Auth**: AWS Cognito
- **Database**: AWS DynamoDB
- **API**: AWS API Gateway + Lambda
- **Encryption**: AWS KMS
- **Storage**: AWS S3 (예정)

### 개발 환경
- **Package Manager**: npm
- **Dev Server**: Next.js Turbopack (포트 3000 또는 3001)
- **Git**: GitHub (main 브랜치)

---

## 프로젝트 구조

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 인증 관련 페이지 (로그인, 회원가입 등)
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── dashboard/                # 대시보드 (로그인 필요)
│   │   ├── page.tsx              # 메인 대시보드
│   │   ├── analytics/            # 통합 분석
│   │   ├── integrated/           # 통합 데이터 관리
│   │   ├── platforms/            # 플랫폼별 페이지
│   │   │   ├── google-ads/       # ⭐ 주요 작업 위치
│   │   │   ├── meta-ads/
│   │   │   ├── tiktok-ads/
│   │   │   └── amazon-ads/
│   │   ├── settings/             # 설정
│   │   ├── team/                 # 팀 관리
│   │   └── profile/              # 프로필
│   ├── (public)/                 # 공개 페이지
│   │   ├── terms/
│   │   ├── privacy/
│   │   └── ...
│   └── layout.tsx                # 루트 레이아웃
│
├── components/                   # 재사용 가능한 컴포넌트
│   ├── modals/                   # 모달 컴포넌트
│   │   ├── MetricsConfigModal.tsx      # ⭐ 차트/요약 카드 메트릭 선택
│   │   ├── SaveConfigModal.tsx         # 설정 저장
│   │   ├── ColumnManagerModal.tsx      # 테이블 컬럼 관리
│   │   ├── GoalSettingModal.tsx        # 목표 설정
│   │   └── AuditLogModal.tsx           # 변경 이력
│   ├── tables/                   # 테이블 컴포넌트
│   │   └── CampaignTable.tsx     # ⭐ 캠페인 테이블 (드래그앤드롭, 정렬, 편집)
│   ├── templates/                # ⭐ 페이지 템플릿
│   │   └── PlatformGoalDashboard.tsx   # 플랫폼 대시보드 템플릿
│   ├── features/                 # 기능별 컴포넌트
│   │   └── BulkActionsBar.tsx    # 일괄 작업 바
│   └── ui/                       # 기본 UI 컴포넌트
│
├── lib/                          # 라이브러리 및 유틸리티
│   ├── aws/                      # ⭐ AWS 클라이언트 (백엔드 연동 준비 완료)
│   │   ├── cognito.ts            # 인증 (인터페이스 정의 완료)
│   │   ├── dynamodb.ts           # 데이터베이스 (테이블 구조 문서화)
│   │   └── api-gateway.ts        # API 통신 (RESTful 엔드포인트 정의)
│   ├── storage/                  # ⭐ 스토리지 관리 (현재 localStorage)
│   │   ├── platformConfig.ts     # 플랫폼 설정 저장/로드
│   │   ├── platformGoals.ts      # 플랫폼 목표 관리
│   │   ├── auditLog.ts           # 변경 이력 관리
│   │   └── BaseStorage.ts        # 스토리지 베이스 클래스
│   ├── config/platforms/         # 플랫폼별 설정
│   ├── mock-data/                # 목업 데이터
│   └── utils.ts                  # 유틸리티 함수
│
├── stores/                       # Zustand 스토어
│   └── slices/                   # 스토어 슬라이스
│
├── types/                        # TypeScript 타입 정의
│   ├── index.ts
│   ├── campaign.types.ts
│   └── platform-*.types.ts
│
└── utils/                        # 유틸리티 함수
    ├── toast.ts                  # Toast 알림
    └── ...

루트 파일:
├── .env.example                  # ⭐ 환경 변수 템플릿
├── AWS_SETUP.md                  # ⭐ AWS 설정 가이드
├── README.md                     # 프로젝트 소개
├── README2.md                    # 이 문서
└── package.json                  # 의존성 관리
```

---

## 핵심 개발 원칙

### 1. **파일 수정 전 반드시 읽기**
```typescript
// ❌ 잘못된 접근
Edit("/path/to/file.tsx", ...)  // 읽지 않고 수정

// ✅ 올바른 접근
Read("/path/to/file.tsx")        // 먼저 읽기
Edit("/path/to/file.tsx", ...)   // 이해한 후 수정
```

### 2. **HeroUI 컴포넌트 사용**
- NextUI 기반이지만 패키지명은 `@heroui/*`
- 공식 문서: 없음 (NextUI 문서 참고)
- 모든 UI는 HeroUI 컴포넌트 우선 사용

```typescript
// ✅ 올바른 import
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Modal, ModalContent, ModalHeader } from "@heroui/modal";

// ❌ 잘못된 import
import { Button } from "@nextui-org/react";
```

### 3. **TypeScript 엄격 모드**
- 모든 파일은 TypeScript
- `any` 타입 최소화
- Props는 interface로 명확히 정의

### 4. **반응형 디자인**
- Mobile First 접근
- Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`

### 5. **상태 관리**
- **로컬 상태**: `useState` (컴포넌트 내부)
- **전역 상태**: Zustand (인증, 팀 등)
- **서버 상태**: localStorage → AWS DynamoDB (마이그레이션 예정)

---

## 주요 컴포넌트 및 패턴

### 1. 플랫폼 페이지 구조

**두 가지 페이지 타입**:

#### A. 플랫폼 대시보드 (목표 기반)
**위치**: `src/app/dashboard/platforms/{platform}/dashboard/page.tsx`
**예시**: Google Ads Dashboard, Meta Ads Dashboard

**구조**: PlatformGoalDashboard 템플릿 사용
```tsx
export default function GoogleAdsDashboardPage() {
  const config = {
    platformKey: "google-ads-dashboard",
    platformName: "Google Ads",
    platformDisplayName: "Google Ads - 대시보드",
    description: "전체 Google 광고 성과를 한눈에 확인하세요",
    campaigns: googleAdsCampaigns,
    sampleTotalData: { /* 메트릭 합계 */ },
  };
  return <PlatformGoalDashboard config={config} />;
}
```

**포함 요소**:
- 6개 메트릭 카드 (광고비, 예산, 전환수, CPA, ROAS, CTR)
- 목표 설정 및 달성률 표시
- TOP 10 캠페인 테이블

#### B. 세부 캠페인 타입 페이지
**위치**: `src/app/dashboard/platforms/{platform}/{campaign-type}/page.tsx`
**예시**: Google Ads Search, Meta Ads Standard

**구조**: 계층 구조 탭 기반 페이지
```tsx
export default function GoogleAdsSearchPage() {
  // 1. 상태 관리
  const [selectedTab, setSelectedTab] = useState("campaigns");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [adGroups, setAdGroups] = useState<AdGroup[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);

  // 2. 필터 상태
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  const [selectedAdGroupId, setSelectedAdGroupId] = useState<number | string | null>(null);

  // 3. 필터 핸들러
  const handleCampaignClick = (campaignId: number) => {
    setSelectedCampaignId(campaignId);
    setSelectedTab("adgroups");  // 자동으로 광고그룹 탭 전환
  };

  const handleAdGroupClick = (adGroupId: number | string) => {
    setSelectedAdGroupId(adGroupId);
    setSelectedTab("ads");  // 자동으로 광고 탭 전환
  };

  // 4. 필터링된 데이터
  const filteredAdGroups = useMemo(() => {
    if (!selectedCampaignId) return adGroups;
    return adGroups.filter(ag => ag.campaignId === selectedCampaignId);
  }, [adGroups, selectedCampaignId]);

  const filteredAds = useMemo(() => {
    if (!selectedAdGroupId) return ads;
    return ads.filter(ad => ad.adGroupId === selectedAdGroupId);
  }, [ads, selectedAdGroupId]);

  // 5. UI 렌더링
  return (
    <div>
      {/* 날짜 선택 + 메트릭 선택 */}
      {/* 요약 카드 (4개) */}
      {/* 차트 (듀얼 Y축) */}
      {/* 탭 (캠페인 / 광고그룹 / 광고) */}
      <Tabs selectedKey={selectedTab} onSelectionChange={setSelectedTab}>
        <Tab key="campaigns" title="캠페인">
          <CampaignTable
            data={campaigns}
            onCampaignClick={handleCampaignClick}
          />
        </Tab>
        <Tab key="adgroups" title="광고그룹">
          {/* 필터 해제 버튼 */}
          <AdGroupTable
            data={filteredAdGroups}
            onAdGroupClick={handleAdGroupClick}
            showCampaignColumn={!selectedCampaignId}
          />
        </Tab>
        <Tab key="ads" title="광고">
          <AdTable
            data={filteredAds}
            showCampaignColumn={!selectedCampaignId}
            showAdGroupColumn={!selectedAdGroupId}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
```

**포함 요소**:
1. DateRangePicker
2. MetricsConfigModal 트리거
3. 요약 카드 4개
4. 차트 (최대 4개 메트릭, 듀얼 Y축)
5. Tabs (캠페인 / 광고그룹 / 광고 & 키워드)
6. 각 탭별 테이블 (CampaignTable, AdGroupTable, AdTable)
7. 필터 해제 버튼 (캠페인/광고그룹명 표시)
8. 계층 필터링 (클릭 → 자동 필터 + 탭 전환)

### 2. 테이블 컴포넌트 (TanStack Table)

**위치**: `src/components/tables/`

모든 테이블 컴포넌트는 TanStack Table v8 기반으로 통일되었습니다.

#### CampaignTable.tsx
**주요 기능**:
- 드래그앤드롭 컬럼 순서 변경 (dnd-kit)
- 컬럼 표시/숨김
- 정렬 (오름차순/내림차순)
- 인라인 이름 편집 (Edit 아이콘 클릭)
- 활성화/비활성화 토글
- 확인 모달 (변경사항 저장 전 확인)
- 캠페인 클릭 → 광고그룹 필터링

**Props**:
```typescript
interface CampaignTableProps {
  data: Campaign[];
  onCampaignChange?: (id: number, field: string, value: any) => void;
  onToggleStatus?: (id: number, currentStatus: string) => void;
  onCampaignClick?: (campaignId: number) => void;  // 필터링용
  initialColumnOrder?: string[];
  initialColumnVisibility?: Record<string, boolean>;
  onColumnOrderChange?: (order: string[]) => void;
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;
}
```

#### AdGroupTable.tsx
**주요 기능**:
- CampaignTable과 동일한 기능
- 광고그룹 이름 편집
- 예산 Lock 아이콘 (Performance Max, Advantage+, GMV Max, DSP)
- 광고그룹 클릭 → 광고 필터링
- `showCampaignColumn` 옵션 (필터링 시 숨김)

**Props**:
```typescript
interface AdGroupTableProps {
  data: AdGroup[];
  onAdGroupChange?: (id: number | string, field: string, value: any) => void;
  onToggleStatus?: (id: number | string, currentStatus: string) => void;
  onAdGroupClick?: (adGroupId: number | string) => void;
  showCampaignColumn?: boolean;  // 캠페인 컬럼 표시 여부
  initialColumnOrder?: string[];
  initialColumnVisibility?: Record<string, boolean>;
  onColumnOrderChange?: (order: string[]) => void;
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;
}
```

#### AdTable.tsx
**주요 기능**:
- CampaignTable과 동일한 기능
- 광고 이름 편집
- 광고 유형 Chip (텍스트/이미지/비디오/캐러셀)
- `showCampaignColumn`, `showAdGroupColumn` 옵션

**Props**:
```typescript
interface AdTableProps {
  data: Ad[];
  onAdChange?: (id: number | string, field: string, value: any) => void;
  onToggleStatus?: (id: number | string, currentStatus: string) => void;
  showCampaignColumn?: boolean;
  showAdGroupColumn?: boolean;
  initialColumnOrder?: string[];
  initialColumnVisibility?: Record<string, boolean>;
  onColumnOrderChange?: (order: string[]) => void;
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;
}
```

### 3. MetricsConfigModal

**위치**: `src/components/modals/MetricsConfigModal.tsx`

**목적**: 요약 카드와 차트 메트릭을 동시에 선택

**구조**:
```tsx
<MetricsConfigModal
  isOpen={isOpen}
  onClose={onClose}
  metrics={availableMetrics}          // 선택 가능한 메트릭 목록
  selectedSummaryMetrics={summary}    // 요약 카드용 (1~4개)
  selectedChartMetrics={chart}        // 차트용 (0~4개)
  onApply={(summary, chart) => {      // 적용 시 호출
    setSelectedSummaryMetrics(summary);
    setSelectedChartMetrics(chart);
  }}
/>
```

**메트릭 정의 예시**:
```typescript
const availableMetrics: MetricOption[] = [
  { key: "cost", label: "광고비", color: "#17C964", category: "cost" },
  { key: "conversions", label: "전환수", color: "#F5A524", category: "performance" },
  { key: "roas", label: "ROAS", color: "#8B5CF6", category: "efficiency" },
  // ...
];
```

### 4. 커스텀 설정 저장 시스템

**위치**: `src/lib/storage/platformConfig.ts`

**흐름**:
```
1. 사용자가 메트릭 선택, 테이블 컬럼 조정
   ↓
2. "현재 설정 저장" 버튼 클릭
   ↓
3. SaveConfigModal에서 이름 입력
   ↓
4. platformConfigStorage.addConfig() 호출
   ↓
5. localStorage에 저장
   ↓
6. 페이지 새로고침 시 자동 로드
```

**저장되는 데이터**:
```typescript
interface SavedConfig {
  id: string;
  name: string;
  summaryMetrics: string[];           // 요약 카드 메트릭
  chartMetrics: string[];             // 차트 메트릭
  tableColumnOrder?: string[];        // 테이블 컬럼 순서
  tableColumnVisibility?: Record<string, boolean>; // 컬럼 표시/숨김
  isDefault: boolean;                 // 기본값 여부
  createdAt: number;
  updatedAt: number;
}
```

---

## 작업 시 참고해야 할 파일들

### 신규 플랫폼 페이지 추가 시

#### 1. 플랫폼 대시보드 (목표 기반)
**템플릿**: `src/app/dashboard/platforms/google-ads/dashboard/page.tsx`
```tsx
// 1. 캠페인 데이터 준비 (src/lib/mock-data/campaigns.ts)
export const newPlatformCampaigns: Campaign[] = [...];

// 2. 페이지 생성
export default function NewPlatformDashboardPage() {
  const config = {
    platformKey: "new-platform-dashboard",
    platformName: "New Platform",
    platformDisplayName: "New Platform - 대시보드",
    description: "설명",
    campaigns: newPlatformCampaigns,
    sampleTotalData: { /* 합계 데이터 */ },
  };
  return <PlatformGoalDashboard config={config} />;
}
```

#### 2. 세부 캠페인 타입 페이지
**템플릿**: `src/app/dashboard/platforms/google-ads/search/page.tsx`
- 복사 후 PLATFORM_NAME 변경
- availableMetrics 수정 (플랫폼별 메트릭)
- 필요시 테이블 컬럼 커스터마이징

#### 3. 관련 파일 수정
- **타입**: `src/types/campaign.types.ts`
- **Mock 데이터**: `src/lib/mock-data/campaigns.ts`
- **네비게이션**: DashboardSidebar에 메뉴 추가

### 차트 수정 시

1. **차트 데이터 생성**: `generateChartData()` 함수
2. **메트릭 정의**: `availableMetrics` 배열
3. **Y축 설정**: `largeValueMetrics` 배열 (왼쪽 축에 표시할 메트릭)
4. **색상**: `CHART_COLORS` 배열 (4가지 색상 순환)

### 모달 추가 시

1. **디렉토리**: `src/components/modals/`
2. **참고**:
   - `MetricsConfigModal.tsx` (복잡한 폼)
   - `SaveConfigModal.tsx` (단순한 입력)
   - `ColumnManagerModal.tsx` (체크박스 리스트)

### AWS 연동 시

1. **인증**: `src/lib/aws/cognito.ts`
2. **데이터베이스**: `src/lib/aws/dynamodb.ts`
3. **API 통신**: `src/lib/aws/api-gateway.ts`
4. **설정 가이드**: `AWS_SETUP.md`
5. **환경 변수**: `.env.example` 참고

---

## 개발 워크플로우

### 1. 새 기능 추가

```bash
# 1. 기존 코드 이해
Read("src/app/dashboard/platforms/google-ads/page.tsx")

# 2. 관련 컴포넌트 확인
Read("src/components/tables/CampaignTable.tsx")

# 3. 타입 확인
Read("src/types/campaign.types.ts")

# 4. 수정
Edit("파일경로", ...)

# 5. 테스트
# 브라우저에서 localhost:3000 또는 3001 확인

# 6. 커밋
git add .
git commit -m "feat: 설명"
git push
```

### 2. 버그 수정

```bash
# 1. 증상 파악
# 사용자 설명 듣기

# 2. 해당 파일 읽기
Read("문제의 파일")

# 3. 관련 파일들 확인
Read("연관 파일들")

# 4. 수정
Edit("파일경로", ...)

# 5. 재현 및 테스트
# 동일한 조건에서 버그 재현 → 수정 확인

# 6. 커밋
git commit -m "fix: 설명"
```

### 3. UI 개선

```bash
# 1. HeroUI 컴포넌트 확인
# NextUI 문서 참고

# 2. Tailwind CSS 사용
# 반응형: sm:, md:, lg:, xl:
# 다크모드: dark:

# 3. 기존 스타일 패턴 따르기
Read("유사한 컴포넌트")

# 4. 수정
Edit(...)

# 5. 여러 화면 크기에서 테스트
# Mobile, Tablet, Desktop
```

---

## 자주 사용하는 패턴

### 1. 모달 열기/닫기

```typescript
// useDisclosure 훅 사용 (HeroUI)
const { isOpen, onOpen, onClose } = useDisclosure();

// 버튼
<Button onPress={onOpen}>열기</Button>

// 모달
<Modal isOpen={isOpen} onClose={onClose}>
  <ModalContent>
    {(onClose) => (
      <>
        <ModalHeader>제목</ModalHeader>
        <ModalBody>내용</ModalBody>
        <ModalFooter>
          <Button onPress={onClose}>닫기</Button>
        </ModalFooter>
      </>
    )}
  </ModalContent>
</Modal>
```

### 2. Toast 알림

```typescript
import { toast } from "@/utils/toast";

// 성공
toast.success({
  title: "성공",
  description: "작업이 완료되었습니다.",
});

// 에러
toast.error({
  title: "오류",
  description: "문제가 발생했습니다.",
});

// 정보
toast.info({
  title: "알림",
  description: "정보 메시지",
});
```

### 3. localStorage 저장/로드

```typescript
import { platformConfigStorage } from "@/lib/storage/platformConfig";

// 저장
const config = platformConfigStorage.addConfig(
  "google-ads",
  {
    name: "설정 이름",
    summaryMetrics: ["cost", "conversions"],
    chartMetrics: ["cost", "conversions"],
    isDefault: false,
  }
);

// 로드
const settings = platformConfigStorage.load("google-ads");

// 현재 설정 ID 저장
platformConfigStorage.setCurrentConfig("google-ads", configId);

// 삭제
platformConfigStorage.deleteConfig("google-ads", configId);
```

### 4. 테이블 상태 관리

```typescript
// TanStack Table 기본 설정
const table = useReactTable({
  data: campaigns,
  columns,
  state: {
    sorting,
    columnOrder,
    columnVisibility,
  },
  onSortingChange: setSorting,
  onColumnOrderChange: setColumnOrder,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
});
```

### 5. 드래그앤드롭 (dnd-kit)

```typescript
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";

const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  if (active.id !== over?.id) {
    const oldIndex = columnOrder.indexOf(active.id as string);
    const newIndex = columnOrder.indexOf(over?.id as string);
    const newOrder = arrayMove(columnOrder, oldIndex, newIndex);
    setColumnOrder(newOrder);
  }
};

<DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
  <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
    {/* 드래그 가능한 요소들 */}
  </SortableContext>
</DndContext>
```

### 6. 차트 (Recharts)

```typescript
import { ComposedChart, Line, XAxis, YAxis, Tooltip } from "recharts";

<ResponsiveContainer width="100%" height={400}>
  <ComposedChart data={chartData}>
    <XAxis dataKey="date" />
    <YAxis yAxisId="left" />
    <YAxis yAxisId="right" orientation="right" />
    <Tooltip />

    {/* 큰 값: 왼쪽 축 */}
    <Line yAxisId="left" dataKey="cost" stroke="#17C964" />

    {/* 작은 값: 오른쪽 축 */}
    <Line yAxisId="right" dataKey="roas" stroke="#8B5CF6" />
  </ComposedChart>
</ResponsiveContainer>
```

---

## 주의사항

### ❌ 하지 말아야 할 것

1. **Supabase/Vercel 코드 추가**
   - 완전히 제거됨, AWS로 전환 완료

2. **직접 DOM 조작**
   - React 상태 관리 사용

3. **인라인 스타일**
   - Tailwind CSS 사용

4. **any 타입 남발**
   - 명확한 타입 정의

5. **컴포넌트 파일이 너무 큼**
   - 500줄 넘으면 분리 고려

6. **console.log 남기기**
   - 디버깅 후 제거

7. **하드코딩된 값**
   - 상수나 환경변수 사용

### ✅ 해야 할 것

1. **타입 안정성**
   - 모든 함수에 타입 정의
   - Props는 interface로

2. **재사용성**
   - 중복 코드는 컴포넌트/함수로 추출

3. **접근성 (a11y)**
   - aria-label, alt 텍스트
   - 키보드 네비게이션

4. **에러 핸들링**
   - try-catch
   - 사용자 친화적 에러 메시지

5. **로딩 상태**
   - Skeleton, Spinner 사용

6. **반응형**
   - 모든 화면 크기에서 테스트

7. **Git 커밋**
   - feat:, fix:, refactor:, docs: 등 prefix 사용
   - 명확한 메시지

---

## 디버깅 체크리스트

문제가 발생했을 때:

1. **개발 서버 실행 중인가?**
   ```bash
   npm run dev
   # 포트 3000 또는 3001
   ```

2. **TypeScript 에러는 없는가?**
   ```bash
   # VSCode에서 Problems 탭 확인
   ```

3. **브라우저 콘솔 에러는?**
   - F12 → Console 탭

4. **localStorage 확인**
   - F12 → Application → Local Storage

5. **컴포넌트 상태 확인**
   - React DevTools 사용

6. **Props 전달 확인**
   - console.log로 확인 (완료 후 제거)

7. **Import 경로 확인**
   - `@/`는 `src/`를 의미
   - 상대 경로 vs 절대 경로

---

## 자주 묻는 질문 (FAQ)

### Q1: 새 플랫폼 페이지를 어떻게 추가하나요?

#### 플랫폼 대시보드 (간단, 5분):
```bash
# 1. 템플릿 복사
cp src/app/dashboard/platforms/google-ads/dashboard/page.tsx \
   src/app/dashboard/platforms/new-platform/dashboard/page.tsx

# 2. config 객체만 수정
platformKey: "new-platform-dashboard"
platformName: "New Platform"
campaigns: newPlatformCampaigns  # mock-data/campaigns.ts에 추가
```

#### 세부 캠페인 페이지 (복잡, 30분):
```bash
# 1. 템플릿 복사
cp src/app/dashboard/platforms/google-ads/search/page.tsx \
   src/app/dashboard/platforms/new-platform/standard/page.tsx

# 2. PLATFORM_NAME 변경
const PLATFORM_NAME = "new-platform-standard";

# 3. availableMetrics 수정 (플랫폼별 메트릭)
```

### Q2: 테이블에 새 컬럼을 어떻게 추가하나요?

```typescript
// CampaignTable.tsx의 columns 배열에 추가
{
  id: "new-column",
  accessorKey: "newData",
  header: "새 컬럼",
  cell: ({ getValue }) => getValue(),
}

// columnOptions에도 추가 (컬럼 관리 모달용)
{ id: "new-column", label: "새 컬럼", category: "basic" }
```

### Q3: 차트에 새 메트릭을 어떻게 추가하나요?

```typescript
// 1. availableMetrics에 추가
{ key: "new-metric", label: "새 메트릭", color: "#색상코드", category: "cost" }

// 2. chartData 생성 시 데이터 추가
data.push({
  date: `${month}/${day}`,
  // ... 기존 메트릭들
  newMetric: 계산값,
});

// 3. 큰 값이면 largeValueMetrics에 추가
const largeValueMetrics = [..., "new-metric"];
```

### Q4: 모달이 닫히지 않아요

```typescript
// handleClose에서 상태 초기화 확인
const handleClose = () => {
  setTempData(initialData); // 임시 데이터 리셋
  onClose();               // 모달 닫기
};

// Modal 컴포넌트에 onClose 전달 확인
<Modal isOpen={isOpen} onClose={handleClose}>
```

### Q5: localStorage 데이터가 안 보여요

```typescript
// useEffect 의존성 배열 확인
useEffect(() => {
  const settings = platformConfigStorage.load(PLATFORM_NAME);
  // ...
}, []); // 빈 배열 = 최초 1회만 실행

// F12 → Application → Local Storage 직접 확인
// Key: platform_config_google-ads
```

---

## 코드 스타일 가이드

### 파일명
- 컴포넌트: `PascalCase.tsx` (예: `CampaignTable.tsx`)
- 유틸리티: `kebab-case.ts` (예: `platform-config.ts`)
- 타입: `kebab-case.types.ts` (예: `campaign.types.ts`)

### 변수명
- 상수: `UPPER_SNAKE_CASE` (예: `PLATFORM_NAME`)
- 변수/함수: `camelCase` (예: `handleSaveConfig`)
- 컴포넌트: `PascalCase` (예: `MetricsConfigModal`)
- 타입/인터페이스: `PascalCase` (예: `Campaign`, `SavedConfig`)

### Import 순서
```typescript
// 1. React 관련
import { useState, useEffect } from "react";

// 2. 외부 라이브러리
import { Button } from "@heroui/button";
import { useReactTable } from "@tanstack/react-table";

// 3. 내부 라이브러리 (@/)
import { platformConfigStorage } from "@/lib/storage/platformConfig";
import { CampaignTable } from "@/components/tables/CampaignTable";

// 4. 타입
import type { Campaign } from "@/types/campaign.types";

// 5. 스타일/아이콘
import { Settings2 } from "lucide-react";
```

### 주석
```typescript
// ✅ 좋은 주석: 왜 이렇게 했는지 설명
// 작은 값들은 오른쪽 Y축을 사용하여 가독성 향상
const yAxisId = largeValueMetrics.includes(metricKey) ? "left" : "right";

// ❌ 나쁜 주석: 코드 그대로 설명
// metricKey가 largeValueMetrics에 있으면 left, 아니면 right
const yAxisId = largeValueMetrics.includes(metricKey) ? "left" : "right";

// ✅ TODO 주석: 추후 작업 명시
// TODO: AWS API Gateway 연동 후 실제 API 호출로 변경

// ✅ 섹션 주석: 큰 블록 구분
// ==================== 설정 저장/불러오기 ====================
```

---

## 최근 주요 변경사항

### 2025-10-21: 탭 기반 계층 구조 완성
- **계층 구조 탭 구현**: 캠페인 → 광고그룹 → 광고 3단계 탭
- **계층 필터링 시스템**:
  - 캠페인명 클릭 → 광고그룹 탭 전환 + campaignId 필터
  - 광고그룹명 클릭 → 광고 탭 전환 + adGroupId 필터
  - 필터 해제 버튼 (부모 이름 표시)
- **테이블 컴포넌트 통일**:
  - CampaignTable, AdGroupTable, AdTable 모두 TanStack Table 적용
  - 드래그앤드롭, 인라인 편집, 컬럼 관리 모두 동일
- **이름 편집 개선**:
  - Edit 아이콘을 이름 옆으로 이동 (Actions 컬럼 제거)
  - 예산 편집 제거 (이름만 편집 가능)
  - 확인 모달 간소화
- **예산 편집 로직**:
  - `campaignType` 기반 자동 판별 (`isBudgetEditable()` 헬퍼)
  - Performance Max, Advantage+, GMV Max, DSP는 Lock 아이콘 표시
- **텍스트 오버플로우 수정**:
  - 모든 텍스트 컬럼에 `max-w-xs truncate` 적용
  - 헤더에 `whitespace-nowrap` 적용
  - Chip 컴포넌트 줄바꿈 방지
- **코드 정리**:
  - 불필요한 `editingCampaigns`, `editingAdGroups`, `editingAds` state 제거
  - 미사용 핸들러 함수 제거 (`handleEditCampaign`, `handleSaveCampaign` 등)
  - props 간소화

### 2025-10-20: 템플릿 기반 리팩토링
- **PlatformGoalDashboard 템플릿 도입**: 플랫폼 대시보드 코드 ~1,500줄 절감
- **페이지 구조 이원화**:
  - 대시보드 (템플릿): 목표 기반, 빠른 개요
  - 세부 페이지 (커스텀): 전체 기능, 커스터마이징
- **전체 플랫폼 기능 통일**:
  - 4개 플랫폼 모두 목표 설정 지원 (Google/Meta/TikTok/Amazon)
  - 14개 세부 페이지: 각 플랫폼별 캠페인 타입 페이지 완성
  - 목표 달성률 시각화: 모든 대시보드에서 동일한 UX
- **테이블 개선**:
  - 텍스트 truncation: 긴 캠페인명 ellipsis 처리
  - Hydration 에러 수정: Table 컴포넌트 안정화
- **AWS 통합 준비 완료**:
  - RESTful API 엔드포인트 정의
  - DynamoDB 테이블 구조 문서화
  - Cognito 인증 인터페이스 완성
  - KMS 암호화 플로우 설계
  - localStorage → AWS 마이그레이션 경로 명확

---

## 마치며

이 문서는 **살아있는 문서**입니다.

- 프로젝트가 진화하면 이 문서도 업데이트하세요
- 새로운 패턴이 생기면 추가하세요
- 잘못된 내용을 발견하면 수정하세요

**개발 시작 전 체크리스트**:
- [ ] 이 문서 (README2.md) 읽기
- [ ] AWS_SETUP.md 읽기 (AWS 관련 작업 시)
- [ ] 관련 파일들 먼저 읽기
- [ ] 기존 패턴 따르기
- [ ] TypeScript 타입 확인
- [ ] 테스트 후 커밋

**질문이 있다면**:
1. 이 문서에서 검색
2. 유사한 코드 참고
3. Git 히스토리 확인
4. 사용자에게 물어보기

**다음 단계 (백엔드 개발자)**:
1. AWS 인프라 프로비저닝 (CloudFormation/Terraform)
2. Lambda 함수 작성 (API Gateway 엔드포인트)
3. DynamoDB 테이블 생성
4. Cognito User Pool 설정
5. 플랫폼 OAuth 연동 (Google/Meta/TikTok/Amazon Ads API)

**Good Luck! 🚀**
