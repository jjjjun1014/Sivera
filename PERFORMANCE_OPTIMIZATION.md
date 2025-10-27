# 성능 최적화 가이드

## ✅ 완료된 최적화 (2025-10-27)

### 1. 패키지 최적화
- **제거:** ag-charts, ag-grid (4개 패키지) - 대용량 차트 라이브러리
- **제거:** @heroui/react - 개별 컴포넌트 import로 대체
- **결과:** 번들 크기 200MB+ 감소 예상

### 2. 번들 분석 환경 구축
```bash
pnpm run analyze  # 번들 크기 분석
```

## 📊 현재 상태

### 좋은 점
- ✅ React.memo로 컴포넌트 최적화
- ✅ useMemo, useCallback 적극 활용
- ✅ Turbopack 사용 (빠른 빌드)
- ✅ Dynamic import + Suspense (코드 분할)
- ✅ 개별 HeroUI 컴포넌트 import
- ✅ 테이블 debounce (300ms)
- ✅ useReducer로 상태 통합 관리

### 빌드 크기
- `.next` 폴더: 551MB (패키지 제거 후 재측정 필요)

## 🚀 추가 개선 가능 항목

### 1. 서버 컴포넌트 활용 (우선순위: 높음)
현재 대부분의 페이지가 "use client"입니다.

**개선 대상:**
```tsx
// Before: src/app/dashboard/analytics/page.tsx
"use client";
export default function IntegratedDashboardPage() { ... }

// After: 초기 데이터는 서버에서, 인터랙션만 클라이언트로
export default async function IntegratedDashboardPage() {
  const data = await fetchData(); // 서버에서 데이터 로드
  return <AnalyticsClient data={data} />; // 클라이언트 컴포넌트로 전달
}
```

**효과:**
- 초기 페이지 로드 속도 개선
- JavaScript 번들 크기 감소
- SEO 개선

### 2. 테이블 가상화 (우선순위: 중간)
100+ 행의 데이터를 다룰 때 가상화 적용

```bash
pnpm add @tanstack/react-virtual
```

```tsx
// src/components/tables/CampaignTable.tsx
import { useVirtualizer } from '@tanstack/react-virtual';

// 가상화로 보이는 행만 렌더링
const rowVirtualizer = useVirtualizer({
  count: data.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 50,
});
```

**효과:**
- 1000+ 행 테이블에서도 부드러운 스크롤
- 메모리 사용량 감소

### 3. 이미지 최적화 강화 (우선순위: 낮음)

```tsx
// next/image 사용 확인
import Image from 'next/image';

<Image
  src="/hero-image.png"
  width={1200}
  height={600}
  priority // LCP 개선
  alt="Sivera Platform"
/>
```

### 4. 폰트 최적화 (우선순위: 낮음)

```tsx
// src/app/layout.tsx
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // 추가
  preload: true, // 추가
});
```

## 📈 성능 모니터링

### 번들 분석
```bash
pnpm run analyze
```

### Lighthouse 점수 목표
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

### Core Web Vitals 목표
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## 🔍 성능 측정 도구

1. **Chrome DevTools**
   - Performance 탭
   - Network 탭
   - Coverage 탭 (사용하지 않는 코드 확인)

2. **Next.js 분석**
   ```bash
   pnpm run analyze
   ```

3. **Production 측정**
   ```bash
   pnpm build
   pnpm start
   # Lighthouse로 측정
   ```

## 💡 개발 팁

### 1. 컴포넌트 최적화 체크리스트
- [ ] React.memo 적용 (props 변경 시만 리렌더)
- [ ] useCallback 적용 (함수 props)
- [ ] useMemo 적용 (무거운 연산)
- [ ] key prop 최적화 (안정적인 ID 사용)

### 2. 상태 관리 최적화
- [ ] 전역 상태는 Zustand 사용 (이미 적용)
- [ ] 로컬 상태는 최소화
- [ ] Context는 작은 단위로 분리

### 3. 네트워크 최적화
- [ ] API 응답 캐싱
- [ ] 불필요한 요청 제거
- [ ] 요청 중복 방지 (debounce, throttle)

## 📝 참고 자료

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Web Vitals](https://web.dev/vitals/)
