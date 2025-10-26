"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Workspace, CreateWorkspaceInput } from "@/types/workspace";
import type { Role } from "@/types/permissions";

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

  // 초기 로드
  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      setIsLoading(true);

      // TODO: 백엔드 API 호출
      // const response = await fetch('/api/v1/workspaces');
      // const data = await response.json();
      // setWorkspaces(data);

      // 임시 Mock 데이터
      const mockWorkspaces: Workspace[] = [
        {
          id: "1",
          name: "브랜드 A",
          description: "메인 브랜드",
          ownerId: "user1",
          subscriptionId: "sub1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          name: "브랜드 B",
          description: "서브 브랜드",
          ownerId: "user1",
          subscriptionId: "sub2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      setWorkspaces(mockWorkspaces);

      // localStorage에서 마지막 선택 workspace 불러오기
      const lastWorkspaceId = localStorage.getItem("currentWorkspaceId");
      if (lastWorkspaceId) {
        const workspace = mockWorkspaces.find((w) => w.id === lastWorkspaceId);
        setCurrentWorkspace(workspace || mockWorkspaces[0]);
      } else {
        setCurrentWorkspace(mockWorkspaces[0]);
      }

      // TODO: 백엔드 API 호출로 현재 사용자의 역할 조회
      // const roleResponse = await fetch(`/api/v1/workspaces/${currentWorkspaceId}/members/me`);
      // const roleData = await roleResponse.json();
      // setCurrentUserRole(roleData.role);

      // 임시 Mock 역할 (owner로 설정)
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
      // TODO: 백엔드 API 호출
      // const response = await fetch('/api/v1/workspaces', {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      // });
      // const newWorkspace = await response.json();

      // 임시 Mock
      const newWorkspace: Workspace = {
        id: String(workspaces.length + 1),
        name: data.name,
        description: data.description,
        ownerId: "user1",
        subscriptionId: `sub${workspaces.length + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setWorkspaces([...workspaces, newWorkspace]);
      await switchWorkspace(newWorkspace.id);
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
