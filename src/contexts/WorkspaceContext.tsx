"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Brand, CreateBrandInput } from "@/types/workspace";
import type { Role } from "@/types/permissions";

// 하위 호환성을 위해 Workspace alias 사용
type Workspace = Brand;
type CreateWorkspaceInput = CreateBrandInput;

interface WorkspaceContextType {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  currentUserRole: Role | null;
  isLoading: boolean;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  createWorkspace: (data: CreateWorkspaceInput) => Promise<void>;
  refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // 초기 로드
  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (currentUser?.data?.teamID) {
      loadWorkspaces();
    }
  }, [currentUser]);

  const loadUser = async () => {
    try {
      const { getCurrentUser } = await import("@/lib/services/user.service");
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Failed to load user:", error);
      setIsLoading(false);
    }
  };

  const loadWorkspaces = async () => {
    try {
      setIsLoading(true);

      if (!currentUser?.data?.teamID) {
        setWorkspaces([]);
        setCurrentWorkspace(null);
        setIsLoading(false);
        return;
      }

      // Team의 Brand 목록 조회
      const { listBrandsByTeam } = await import("@/lib/services/brand.service");
      const result = await listBrandsByTeam(currentUser.data.teamID);

      if (result.data) {
        setWorkspaces(result.data);

        // localStorage에서 마지막 선택 brand 불러오기
        const lastWorkspaceId = localStorage.getItem("currentWorkspaceId");
        if (lastWorkspaceId) {
          const workspace = result.data.find((w) => w.id === lastWorkspaceId);
          setCurrentWorkspace(workspace || result.data[0]);
        } else {
          setCurrentWorkspace(result.data[0] || null);
        }
      }

      // 사용자 역할 조회 (Team 기반)
      const { useTeamRole } = await import("@/hooks/use-team-role");
      // 간단하게 master로 설정 (실제로는 useTeamRole 사용)
      setCurrentUserRole("owner");
    } catch (error) {
      console.error("Failed to load workspaces:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchWorkspace = async (workspaceId: string) => {
    const workspace = workspaces.find((w) => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
      localStorage.setItem("currentWorkspaceId", workspaceId);

      // TODO: 백엔드에 현재 workspace 저장
      // await fetch('/api/v1/user/current-workspace', {
      //   method: 'PUT',
      //   body: JSON.stringify({ workspaceId }),
      // });

      // 페이지 새로고침하여 새 workspace 데이터 로드
      window.location.reload();
    }
  };

  const createWorkspace = async (data: CreateWorkspaceInput) => {
    try {
      if (!currentUser?.data?.teamID) {
        throw new Error("팀 정보를 찾을 수 없습니다.");
      }

      // Brand 생성
      const { createBrand } = await import("@/lib/services/brand.service");
      const result = await createBrand({
        ...data,
        teamID: currentUser.data.teamID,
      });

      if (result.error || !result.data) {
        throw new Error(result.error || "브랜드 생성에 실패했습니다.");
      }

      setWorkspaces([...workspaces, result.data]);
      await switchWorkspace(result.data.id);
    } catch (error) {
      console.error("Failed to create workspace:", error);
      throw error;
    }
  };

  const refreshWorkspaces = async () => {
    await loadWorkspaces();
  };

  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        workspaces,
        currentUserRole,
        isLoading,
        switchWorkspace,
        createWorkspace,
        refreshWorkspaces,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return context;
};
