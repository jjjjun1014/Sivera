/**
 * 상태 맵핑 상수 (중앙 관리)
 * 모든 테이블과 컴포넌트에서 재사용
 */

export const statusColorMap: Record<string, "success" | "warning" | "danger"> = {
  active: "success",
  inactive: "warning",
  error: "danger",
};

export const statusTextMap: Record<string, string> = {
  active: "연결됨",
  inactive: "비활성",
  error: "오류",
};
