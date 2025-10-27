/**
 * Workspace 중앙 상태 관리 훅
 * 모든 페이지에서 동일한 workspace 데이터 공유
 */

import { useState, useEffect } from "react";
import { getWorkspaces, type Workspace } from "@/lib/mock-data/workspaces";

export function useWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로드
  useEffect(() => {
    refreshWorkspaces();
  }, []);

  const refreshWorkspaces = () => {
    setIsLoading(true);
    const data = getWorkspaces();
    setWorkspaces(data);
    setIsLoading(false);
  };

  return {
    workspaces,
    isLoading,
    refreshWorkspaces,
  };
}
