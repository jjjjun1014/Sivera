/**
 * 사업체(Workspace) 중앙 관리 Mock 데이터
 * 
 * TODO: AWS 연동 후 실제 DB로 교체
 */

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  subscriptionId: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface AdAccountAssignment {
  accountId: string;
  workspaceIds: string[];
  isActive: boolean;
  lastSync?: string;
}

// 사업체 목록 (중앙 관리)
export const mockWorkspaces: Workspace[] = [
  {
    id: "1",
    name: "사업체 A",
    description: "메인 사업체",
    ownerId: "user1",
    subscriptionId: "sub1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: "2",
    name: "사업체 B",
    description: "서브 사업체",
    ownerId: "user1",
    subscriptionId: "sub2",
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: "3",
    name: "사업체 C",
    description: "테스트 사업체",
    ownerId: "user1",
    subscriptionId: "sub3",
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date(),
    isActive: false,
  },
];

// 광고 계정 → 사업체 매핑 (중앙 관리)
export const mockAdAccountAssignments: Record<string, AdAccountAssignment> = {
  "1": {
    accountId: "1",
    workspaceIds: ["1"],
    isActive: true,
    lastSync: "2024-10-27 11:15",
  },
  "2": {
    accountId: "2",
    workspaceIds: ["1", "2"],
    isActive: true,
    lastSync: "2024-10-27 11:10",
  },
  "3": {
    accountId: "3",
    workspaceIds: ["2"],
    isActive: true,
    lastSync: "2024-10-27 11:05",
  },
  "4": {
    accountId: "4",
    workspaceIds: ["1"],
    isActive: false,
    lastSync: "2024-10-26 09:30",
  },
};

/**
 * 사업체 목록 조회
 */
export function getWorkspaces(): Workspace[] {
  return mockWorkspaces.filter(w => w.isActive);
}

/**
 * 특정 사업체 조회
 */
export function getWorkspaceById(id: string): Workspace | undefined {
  return mockWorkspaces.find(w => w.id === id);
}

/**
 * 광고 계정에 부여된 사업체 목록 조회
 */
export function getWorkspacesForAccount(accountId: string): string[] {
  return mockAdAccountAssignments[accountId]?.workspaceIds || [];
}

/**
 * 광고 계정 활성화 상태 조회
 */
export function isAccountActive(accountId: string): boolean {
  return mockAdAccountAssignments[accountId]?.isActive ?? false;
}

/**
 * 광고 계정에 사업체 부여
 */
export function assignWorkspacesToAccount(
  accountId: string,
  workspaceIds: string[]
): void {
  if (!mockAdAccountAssignments[accountId]) {
    mockAdAccountAssignments[accountId] = {
      accountId,
      workspaceIds: [],
      isActive: true,
    };
  }
  mockAdAccountAssignments[accountId].workspaceIds = workspaceIds;
  mockAdAccountAssignments[accountId].lastSync = new Date().toLocaleString('ko-KR');
}

/**
 * 광고 계정 활성화/비활성화
 */
export function toggleAccountStatus(accountId: string): boolean {
  if (!mockAdAccountAssignments[accountId]) {
    mockAdAccountAssignments[accountId] = {
      accountId,
      workspaceIds: [],
      isActive: true,
    };
  }
  mockAdAccountAssignments[accountId].isActive = !mockAdAccountAssignments[accountId].isActive;
  return mockAdAccountAssignments[accountId].isActive;
}

/**
 * 사업체 생성
 */
export function createWorkspace(data: {
  name: string;
  description?: string;
  ownerId: string;
  subscriptionId?: string;
}): Workspace {
  const newWorkspace: Workspace = {
    id: String(mockWorkspaces.length + 1),
    name: data.name,
    description: data.description,
    ownerId: data.ownerId,
    subscriptionId: data.subscriptionId || `sub${mockWorkspaces.length + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  };
  mockWorkspaces.push(newWorkspace);
  return newWorkspace;
}

/**
 * 사업체 수정
 */
export function updateWorkspace(
  id: string,
  data: Partial<Pick<Workspace, 'name' | 'description' | 'subscriptionId' | 'isActive'>>
): Workspace | null {
  const workspace = mockWorkspaces.find(w => w.id === id);
  if (!workspace) return null;

  if (data.name) workspace.name = data.name;
  if (data.description !== undefined) workspace.description = data.description;
  if (data.subscriptionId) workspace.subscriptionId = data.subscriptionId;
  if (data.isActive !== undefined) workspace.isActive = data.isActive;
  workspace.updatedAt = new Date();

  return workspace;
}

/**
 * 사업체 삭제 (비활성화)
 */
export function deleteWorkspace(id: string): boolean {
  const workspace = mockWorkspaces.find(w => w.id === id);
  if (!workspace) return false;

  workspace.isActive = false;
  workspace.updatedAt = new Date();
  return true;
}
