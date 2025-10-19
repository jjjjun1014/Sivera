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

### 현재 개발 상태 (2025-10-19)
- ✅ UI/UX 기본 구조 완성
- ✅ 플랫폼별 대시보드 페이지 구현 (Google/Meta/TikTok/Amazon)
- ✅ 통합 분석 대시보드 (목표 추적, 플랫폼 비교, 차트)
- ✅ 커스터마이징 시스템 (localStorage 기반)
- ✅ 목표 설정 및 달성률 표시
- ✅ 천 단위 구분자 자동 포맷팅
- ✅ 날짜 선택 기능
- ⏳ AWS 인프라 연동 준비 완료 (구현 대기)
- ⏳ 실제 광고 플랫폼 API 연동 (구현 대기)
- ⏳ 알림/노티피케이션 시스템 (작업 예정)
- ⏳ 일괄 작업 기능 (작업 예정)
- ⏳ 팀 관리 및 변경 이력 (작업 예정)

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
│   │   └── ColumnManagerModal.tsx      # 테이블 컬럼 관리
│   ├── tables/                   # 테이블 컴포넌트
│   │   └── CampaignTable.tsx     # ⭐ 캠페인 테이블 (드래그앤드롭, 정렬, 편집)
│   ├── features/                 # 기능별 컴포넌트
│   └── ui/                       # 기본 UI 컴포넌트
│
├── lib/                          # 라이브러리 및 유틸리티
│   ├── aws/                      # ⭐ AWS 클라이언트
│   │   ├── cognito.ts            # 인증
│   │   ├── dynamodb.ts           # 데이터베이스
│   │   └── api-gateway.ts        # API 통신
│   ├── storage/                  # ⭐ 스토리지 관리
│   │   └── platformConfig.ts     # 플랫폼 설정 저장/로드
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

### 1. 플랫폼 페이지 구조 (Google Ads 기준)

**위치**: `src/app/dashboard/platforms/google-ads/page.tsx`

**구조**:
```tsx
export default function GoogleAdsPage() {
  // 1. 상태 관리
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedSummaryMetrics, setSelectedSummaryMetrics] = useState([]);
  const [selectedChartMetrics, setSelectedChartMetrics] = useState([]);
  const [tableColumnOrder, setTableColumnOrder] = useState([]);
  const [tableColumnVisibility, setTableColumnVisibility] = useState({});

  // 2. localStorage 로드 (useEffect)
  useEffect(() => {
    const settings = platformConfigStorage.load("google-ads");
    // 설정 복원
  }, []);

  // 3. 설정 저장/불러오기 핸들러
  const handleSaveConfig = (name: string) => {
    platformConfigStorage.addConfig(...);
  };

  // 4. UI 렌더링
  return (
    <div>
      {/* 헤더 */}
      {/* 날짜 선택 + 지표 선택 + 커스텀 저장 */}
      {/* 요약 카드 (4개) */}
      {/* 차트 */}
      {/* 캠페인 테이블 */}
      {/* 모달들 */}
    </div>
  );
}
```

**반드시 포함해야 할 요소**:
1. **날짜 선택**: DateRangePicker
2. **지표 선택 버튼**: MetricsConfigModal 트리거
3. **커스텀 저장 드롭다운**: 설정 저장/불러오기/관리
4. **요약 카드**: 선택된 메트릭 4개 표시
5. **차트**: 선택된 메트릭 표시 (최대 4개, 듀얼 Y축)
6. **테이블**: CampaignTable 컴포넌트

### 2. CampaignTable 컴포넌트

**위치**: `src/components/tables/CampaignTable.tsx`

**주요 기능**:
- TanStack Table 기반
- 드래그앤드롭 컬럼 순서 변경 (dnd-kit)
- 컬럼 표시/숨김
- 정렬 (오름차순/내림차순)
- 인라인 편집 (캠페인명, 예산)
- 활성화/비활성화 토글
- 확인 모달 (변경사항 저장 전 확인)

**Props**:
```typescript
interface CampaignTableProps {
  data: Campaign[];
  onCampaignChange?: (id: number, field: string, value: any) => void;
  onToggleStatus?: (id: number, currentStatus: string) => void;
  editingCampaigns?: Set<number>;
  onEditCampaign?: (id: number) => void;
  onSaveCampaign?: (id: number) => void;
  initialColumnOrder?: string[];              // 저장된 컬럼 순서
  initialColumnVisibility?: Record<string, boolean>; // 저장된 표시/숨김
  onColumnOrderChange?: (order: string[]) => void;   // 컬럼 순서 변경 콜백
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void; // 표시/숨김 변경 콜백
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

1. **템플릿**: `src/app/dashboard/platforms/google-ads/page.tsx`
   - 이 파일을 복사해서 새 플랫폼 페이지 생성
   - 플랫폼명만 변경 (`PLATFORM_NAME` 상수)

2. **테이블**: `src/components/tables/CampaignTable.tsx`
   - 테이블 구조 참고
   - 플랫폼별로 컬럼 다르면 새로 만들기

3. **타입**: `src/types/campaign.types.ts`
   - Campaign 타입 정의 확인/수정

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

```bash
# 1. Google Ads 페이지 복사
cp -r src/app/dashboard/platforms/google-ads src/app/dashboard/platforms/new-platform

# 2. page.tsx에서 PLATFORM_NAME 변경
const PLATFORM_NAME = "new-platform";

# 3. 메트릭 정의 수정 (플랫폼마다 다를 수 있음)

# 4. 네비게이션 추가 (필요시)
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

**Good Luck! 🚀**
