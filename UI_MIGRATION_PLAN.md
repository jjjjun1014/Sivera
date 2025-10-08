# Sivera UI 전체 재구성 계획서

## 📋 목표
- 모든 기존 컴포넌트를 HeroUI 컴포넌트로 완전히 대체
- 일관된 디자인 시스템 적용 (radius: 'sm', 메인 컬러 통일)
- 웹 구조를 메인/허브/대시보드 3단계로 재구성
- Vercel 배포 및 AWS 서버 연동 준비

## 🎨 디자인 시스템 규칙

### 색상 규칙
- **메인 컬러**: primary (모든 버튼 기본)
- **성공**: success (green)
- **오류**: danger (red)
- **알림**: primary (blue)
- **버튼 텍스트**: 배경과 대비되는 색상 (가독성 최우선)
- **투명 버튼**: 버튼 컬러와 동일한 텍스트 컬러

### 모서리 둥글기
- **모든 사각형 요소**: radius="sm"
- **모든 입력창**: radius="sm"
- **모든 버튼**: radius="sm"

### 버튼 규칙
- **6글자 이상**: variant="bordered" (지저분함 방지)
- **6글자 미만**: variant="solid"
- **기본 색상**: color="primary"

## 🏗️ 웹 구조

```
/ (메인 페이지)
├── /hub (허브 - 통합 대시보드)
└── /dashboard (각 서비스별 대시보드)
    ├── /marketing (마케팅 대시보드)
    └── /workspace (작업 공간)
```

## 📦 HeroUI 컴포넌트 매핑

### 1. Accordion (아코디언)
**사용처**: 이용약관, 개인정보처리방침, FAQ 등 긴 텍스트
```tsx
<Accordion variant="bordered">
  <AccordionItem title="이용약관">
    {/* 긴 텍스트 내용 */}
  </AccordionItem>
</Accordion>
```

### 2. Autocomplete (자동완성 드롭다운)
**사용처**: 기존 Dropdown 대체, 검색 가능한 선택 목록
```tsx
<Autocomplete
  allowsCustomValue
  variant="bordered"
  label="항목 선택"
>
  {items.map((item) => (
    <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
  ))}
</Autocomplete>
```

### 3. Alert (알림 배너)
**사용처**: 페이지 상단 중요 알림 (오류/성공/정보)
```tsx
<Alert
  color="success" // success(초록), danger(빨강), primary(파랑)
  title="알림 제목"
  description="상세 설명"
  variant="faded"
  isVisible={isVisible}
  onClose={() => setIsVisible(false)}
/>
```

### 4. Avatar (아바타)
**사용처**: 사용자 프로필 이미지
```tsx
<Avatar
  src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
  name="사용자 이름"
/>
```

### 5. Badge (뱃지)
**사용처**: 읽지 않은 알림 개수 표시
```tsx
<Badge color="primary" content="5">
  <Avatar src="..." />
</Badge>
```

### 6. Breadcrumbs (경로 탐색)
**사용처**: 허브 이후 현재 위치 표시 및 빠른 이동
```tsx
<Breadcrumbs>
  <BreadcrumbItem>Home</BreadcrumbItem>
  <BreadcrumbItem>Hub</BreadcrumbItem>
  <BreadcrumbItem>Dashboard</BreadcrumbItem>
</Breadcrumbs>
```

### 7. Button (버튼)
**사용처**: 모든 버튼
```tsx
<Button
  color="primary"
  radius="sm"
  variant={text.length >= 6 ? "bordered" : "solid"}
>
  버튼 텍스트
</Button>
```

### 8. Calendar (캘린더)
**사용처**: 날짜 선택
```tsx
<Calendar
  aria-label="날짜 선택"
  defaultValue={today(getLocalTimeZone())}
/>
```

### 9. Checkbox (체크박스)
**사용처**: 모든 체크박스, 데이터 테이블 전체 선택
```tsx
<Checkbox defaultSelected>옵션</Checkbox>
```

### 10. Chip (칩)
**사용처**: 상태 표시 (활성/비활성, 진행중/완료 등)
```tsx
<Chip color="success">활성</Chip>
<Chip color="danger">비활성</Chip>
```

### 11. CircularProgress (원형 진행 바)
**사용처**: 페이지 로딩, 백그라운드 약간 어둡게
```tsx
<CircularProgress
  aria-label="Loading..."
  color="warning"
  showValueLabel={true}
  size="lg"
  value={value}
/>
```

### 12. DateInput (날짜 입력)
**사용처**: 캘린더 선택 후 날짜 표시
```tsx
<DateInput
  label="날짜 입력"
  labelPlacement="outside"
  startContent={<CalendarIcon />}
/>
```

### 13. DateRangePicker (날짜 범위 선택)
**사용처**: 기간 설정 (시작일~종료일)
```tsx
<DateRangePicker
  label="기간 설정"
  radius="sm"
/>
```

### 14. Dropdown (드롭다운 메뉴)
**사용처**: 아바타 클릭, 네비게이션 메뉴
```tsx
<Dropdown>
  <DropdownTrigger>
    <Button variant="bordered">메뉴 열기</Button>
  </DropdownTrigger>
  <DropdownMenu>
    <DropdownItem key="profile">프로필</DropdownItem>
    <DropdownItem key="settings">설정</DropdownItem>
    <DropdownItem key="logout" color="danger">로그아웃</DropdownItem>
  </DropdownMenu>
</Dropdown>
```

### 15. Form & Input (폼과 입력)
**사용처**: 모든 입력 폼
```tsx
<Form onSubmit={handleSubmit}>
  <Input
    isRequired
    label="사용자명"
    name="username"
    placeholder="사용자명 입력"
    radius="sm"
    variant="bordered"
    errorMessage="올바른 사용자명을 입력하세요"
  />
  <Button type="submit" color="primary">제출</Button>
</Form>
```

### 16. Link (링크)
**사용처**: 텍스트 링크 (이용약관, 개인정보처리방침 등)
```tsx
<Link href="/legal/terms">이용약관</Link>
```

### 17. Listbox (리스트박스)
**사용처**: 선택 가능한 목록
```tsx
<Listbox onAction={(key) => handleAction(key)}>
  <ListboxItem key="new">새로 만들기</ListboxItem>
  <ListboxItem key="edit">수정</ListboxItem>
  <ListboxItem key="delete" color="danger">삭제</ListboxItem>
</Listbox>
```

### 18. Navbar (네비게이션 바)
**사용처**: 상단 메뉴
```tsx
<Navbar>
  <NavbarBrand>
    <p className="font-bold">Sivera</p>
  </NavbarBrand>
  <NavbarContent>
    <NavbarItem>
      <Link href="/hub">Hub</Link>
    </NavbarItem>
  </NavbarContent>
</Navbar>
```

### 19. NumberInput (숫자 입력)
**사용처**: 데이터 테이블 숫자 입력
```tsx
<NumberInput
  placeholder="금액 입력"
  radius="sm"
/>
```

### 20. Pagination (페이지네이션)
**사용처**: 데이터 테이블 페이지 이동
```tsx
<Pagination
  showControls
  initialPage={1}
  total={10}
/>
```

### 21. Progress (진행 바)
**사용처**: 데이터 테이블 진행률 표시
```tsx
<Progress
  color="warning"
  showValueLabel={true}
  value={40}
  maxValue={100}
/>
```

### 22. RangeCalendar (범위 캘린더)
**사용처**: 날짜 범위 선택
```tsx
<RangeCalendar
  aria-label="날짜 범위 선택"
  minValue={today(getLocalTimeZone())}
/>
```

### 23. Select (선택)
**사용처**: 단순 선택 목록 (검색 불필요)
```tsx
<Select
  label="항목 선택"
  radius="sm"
>
  {items.map((item) => (
    <SelectItem key={item.key}>{item.label}</SelectItem>
  ))}
</Select>
```

### 24. Switch (스위치)
**사용처**: ON/OFF 토글
```tsx
<Switch defaultSelected>자동 업데이트</Switch>
```

### 25. Table (데이터 테이블)
**사용처**: 모든 데이터 테이블, 최상단 전체 선택 체크박스
```tsx
<Table
  selectionMode="multiple"
  selectedKeys={selectedKeys}
  onSelectionChange={setSelectedKeys}
>
  <TableHeader>
    <TableColumn>이름</TableColumn>
    <TableColumn>역할</TableColumn>
    <TableColumn>상태</TableColumn>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow key={item.key}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.role}</TableCell>
        <TableCell>{item.status}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### 26. Tabs (탭)
**사용처**: 페이지 내 탭 전환 (페이지 생성 최소화)
```tsx
<Tabs aria-label="Options">
  <Tab key="photos" title="사진">
    <Card><CardBody>사진 내용</CardBody></Card>
  </Tab>
  <Tab key="music" title="음악">
    <Card><CardBody>음악 내용</CardBody></Card>
  </Tab>
</Tabs>
```

### 27. Toast (토스트 알림)
**사용처**: 모든 알림 (오류:빨강, 성공:초록, 기타:파랑)
```tsx
addToast({
  title: "알림 제목",
  description: "상세 설명",
  color: "success" // success(초록), danger(빨강), primary(파랑)
})
```

### 28. Textarea (텍스트 영역)
**사용처**: 여러 줄 입력
```tsx
<Textarea
  label="설명"
  placeholder="설명을 입력하세요"
  radius="sm"
/>
```

### 29. User (사용자 정보)
**사용처**: 사용자 프로필 카드
```tsx
<User
  name="사용자 이름"
  description="역할 설명"
  avatarProps={{
    src: "https://i.pravatar.cc/150"
  }}
/>
```

## 🗂️ 파일 구조 변경

### 현재 구조
```
src/app/
├── (public)/
│   ├── page.tsx (랜딩)
│   ├── login/
│   ├── signup/
│   └── legal/
└── (dashboard)/
    ├── hub/
    └── marketing/
```

### 변경 후 구조
```
src/app/
├── page.tsx (메인 랜딩)
├── hub/
│   └── page.tsx (통합 허브)
├── dashboard/
│   ├── marketing/
│   │   ├── page.tsx (마케팅 대시보드)
│   │   ├── campaigns/
│   │   ├── integrations/
│   │   └── analytics/
│   └── workspace/
│       └── page.tsx (작업 공간)
├── auth/
│   ├── login/
│   ├── signup/
│   └── forgot-password/
└── legal/
    ├── terms/
    ├── privacy/
    └── marketing/
```

## 📝 작업 순서

### Phase 1: 기초 설정 (1일)
1. ✅ tailwind.config.ts 업데이트 (all-ad 참고)
2. ✅ 프로젝트 계획서 작성
3. 컴포넌트 디자인 시스템 문서화

### Phase 2: 공통 컴포넌트 교체 (2일)
1. AuthForm 완전 재작성 (Form, Input, Button, Checkbox, Link)
2. LoadingSpinner → CircularProgress
3. DataTable → Table (전체 선택 체크박스 추가)
4. MetricCard → Card + Chip

### Phase 3: 페이지 재구성 (3일)
1. 메인 랜딩 페이지 (Navbar, Button, Card)
2. 허브 페이지 (Breadcrumbs, Card, Button)
3. 마케팅 대시보드 (Tabs, Table, Chart)
4. 법적 고지 페이지 (Accordion)

### Phase 4: 기능 컴포넌트 추가 (2일)
1. 알림 시스템 (Toast, Alert)
2. 날짜 선택기 (Calendar, DateInput, DateRangePicker)
3. 사용자 프로필 (Avatar, Badge, Dropdown, User)
4. 상태 표시 (Chip, Progress, CircularProgress)

### Phase 5: 통합 및 테스트 (2일)
1. 전체 페이지 통합 테스트
2. 반응형 디자인 검증
3. 접근성 검증 (ARIA)
4. 다크 모드 적용

### Phase 6: 배포 준비 (1일)
1. Vercel 설정
2. AWS 연동 설정
3. 환경 변수 설정
4. 최종 빌드 및 배포

## 🎯 예상 소요 시간
- **총 작업 기간**: 약 11일 (실제 작업일 기준)
- **1일 작업량**: 6-8시간
- **우선순위**: Phase 1-3 (핵심 기능)

## ✅ 체크리스트

### 디자인 시스템
- [ ] 모든 컴포넌트 radius="sm"
- [ ] 모든 버튼 color="primary"
- [ ] 6글자 이상 버튼 variant="bordered"
- [ ] 오류:danger, 성공:success, 알림:primary
- [ ] 버튼 텍스트 가독성 확보

### 컴포넌트 교체
- [ ] AuthForm (Form, Input, Button, Checkbox, Link)
- [ ] LoadingSpinner (CircularProgress)
- [ ] DataTable (Table)
- [ ] MetricCard (Card, Chip)
- [ ] ErrorBoundary (Alert)

### 페이지 구조
- [ ] 메인 페이지 (/)
- [ ] 허브 페이지 (/hub)
- [ ] 마케팅 대시보드 (/dashboard/marketing)
- [ ] 법적 고지 (Accordion)
- [ ] 인증 페이지 (Form)

### 기능
- [ ] Toast 알림 시스템
- [ ] Alert 배너
- [ ] 날짜 선택기
- [ ] 사용자 프로필
- [ ] 상태 표시

### 배포
- [ ] Vercel 연동
- [ ] AWS 서버 설정
- [ ] 환경 변수 설정
- [ ] 최종 빌드 테스트

## 📌 참고 사항
- **HeroUI만 사용**: NextUI 절대 사용 금지
- **차트**: 나중에 별도 라이브러리 사용 (현재는 참고만)
- **참고 프로젝트**: https://github.com/all-ad/all-ad.git
- **바탕화면 .md 파일**: ARCHITECTURE.md, README.md, CLAUDE.md 참고

## 🤝 다음 단계
1. 이 계획서를 검토하고 수정 사항 논의
2. Phase 1부터 순차적으로 진행
3. 각 Phase 완료 후 리뷰 및 피드백
4. 최종 배포 및 테스트

---

**작성일**: 2025-10-08
**버전**: 1.0
**작성자**: Claude Code Agent
