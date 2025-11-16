/**
 * 상태 맵핑 상수 (중앙 관리)
 * 각 플랫폼의 실제 캠페인 상태를 표시
 */

export const statusColorMap: Record<string, "success" | "warning" | "danger" | "default"> = {
  // 활성 상태
  active: "success",
  enabled: "success",
  
  // 일시정지 상태
  paused: "warning",
  
  // 비활성 상태
  inactive: "default",
  disabled: "default",
  
  // 정지 상태
  stopped: "danger",
  removed: "danger",
  deleted: "danger",
  
  // 오류 상태
  error: "danger",
  failed: "danger",
};

export const statusTextMap: Record<string, string> = {
  // 활성 상태
  active: "활성화",
  enabled: "활성화",
  
  // 일시정지 상태
  paused: "일시정지",
  
  // 비활성 상태
  inactive: "비활성화",
  disabled: "비활성화",
  
  // 정지 상태
  stopped: "정지",
  removed: "삭제됨",
  deleted: "삭제됨",
  
  // 오류 상태
  error: "오류",
  failed: "오류",
};
