"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { Pagination } from "@heroui/pagination";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { platformAccounts } from "@/lib/mock-data";
import { usePagination, useWorkspaces, useWorkspaceManagement } from "@/hooks";
import { toast } from "@/utils/toast";
import {
  getWorkspacesForAccount,
  assignWorkspacesToAccount,
  toggleAccountStatus,
  isAccountActive,
  type Workspace,
} from "@/lib/mock-data/workspaces";
import { statusColorMap, statusTextMap } from "@/lib/constants/status";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Input, Textarea } from "@heroui/input";

export default function IntegratedPage() {
  // 중앙 hooks 사용
  const { workspaces, isLoading, refreshWorkspaces } = useWorkspaces();
  const {
    isOpen: isWorkspaceModalOpen,
    onOpen: onWorkspaceModalOpen,
    onClose: onWorkspaceModalClose,
    editingWorkspace,
    formData: workspaceFormData,
    setFormData: setWorkspaceFormData,
    handleCreate: handleCreateWorkspace,
    handleEdit: handleEditWorkspace,
    handleSave: handleSaveWorkspace,
    handleDelete: handleDeleteWorkspace,
  } = useWorkspaceManagement(refreshWorkspaces);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentAccount, setCurrentAccount] = useState<any>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  const [accountStatuses, setAccountStatuses] = useState<Record<string, boolean>>({}); 
  const [mounted, setMounted] = useState(false);

  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 페이지네이션
  const { currentPage, totalPages, paginatedData, setCurrentPage } = usePagination(platformAccounts, {
    itemsPerPage: 5,
  });

  const handleManageWorkspaces = (account: any) => {
    setCurrentAccount(account);
    // 중앙 데이터에서 현재 계정에 부여된 브랜드 가져오기 (단일 선택)
    const assigned = getWorkspacesForAccount(account.id);
    setSelectedWorkspace(assigned.length > 0 ? assigned[0] : null);
    onOpen();
  };

  const handleSaveWorkspaces = () => {
    if (!currentAccount) return;

    // 단일 브랜드 저장 (선택 안했을 경우 빈 배열)
    const selectedArray = selectedWorkspace ? [selectedWorkspace] : [];

    // 중앙 데이터에 저장
    assignWorkspacesToAccount(currentAccount.id, selectedArray);

    toast.success({
      title: "브랜드 할당 완료",
      description: selectedWorkspace 
        ? `${currentAccount.accountName}에 브랜드가 할당되었습니다.`
        : `${currentAccount.accountName}의 브랜드 할당이 해제되었습니다.`,
    });

    onClose();
  };

  const handleToggleStatus = (accountId: string) => {
    const newStatus = toggleAccountStatus(accountId);
    setAccountStatuses(prev => ({ ...prev, [accountId]: newStatus }));
    
    toast.success({
      title: newStatus ? "계정 활성화" : "계정 비활성화",
      description: `광고 계정이 ${newStatus ? "활성화" : "비활성화"}되었습니다.`,
    });
  };

  const getWorkspaceNames = (accountId: string) => {
    // 중앙 데이터에서 브랜드 목록 가져오기
    const workspaceIds = getWorkspacesForAccount(accountId);
    if (workspaceIds.length === 0) return "미할당";
    
    const names = workspaceIds.map((id: string) => {
      const workspace = workspaces.find((w: Workspace) => w.id === id);
      return workspace?.name || id;
    });

    if (names.length === 1) return names[0];
    return `${names[0]} 외 ${names.length - 1}개`;
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">플랫폼 연동</h1>
        <p className="text-default-500">
          광고 플랫폼 계정을 연동하고 관리하세요
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">연동된 플랫폼</p>
            <p className="text-3xl font-bold">4</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">활성 계정</p>
            <p className="text-3xl font-bold text-success">3</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">총 캠페인</p>
            <p className="text-3xl font-bold">18</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">마지막 동기화</p>
            <p className="text-lg font-bold">11:15</p>
          </CardBody>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">연동된 계정</h3>
        </CardHeader>
        <CardBody>
          {!mounted ? (
            <div className="text-center py-8">
              <p className="text-default-500">로딩 중...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table
                aria-label="플랫폼 연동 테이블"
              >
              <TableHeader>
              <TableColumn key="platform">플랫폼</TableColumn>
              <TableColumn key="account">계정명</TableColumn>
              <TableColumn key="accountId">계정 ID</TableColumn>
              <TableColumn key="workspaces" width={180}>할당 브랜드</TableColumn>
              <TableColumn key="status">상태</TableColumn>
                <TableColumn key="lastSync">마지막 동기화</TableColumn>
                <TableColumn key="campaigns" align="center">캠페인 수</TableColumn>
                <TableColumn key="enabled" align="center">활성화</TableColumn>
                <TableColumn key="actions" align="center">작업</TableColumn>
              </TableHeader>
              <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                        <span className="text-xs font-bold">
                          {item.platform.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium">{item.platform}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.accountName}</TableCell>
                  <TableCell>
                    <span className="text-xs font-mono text-default-500">
                      {item.accountId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-default-600">{getWorkspaceNames(item.id)}</span>
                      <Button
                        size="sm"
                        variant="light"
                        color="primary"
                        radius="sm"
                        className="min-w-unit-16"
                        onPress={() => handleManageWorkspaces(item)}
                      >
                        관리
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={statusColorMap[item.status]}
                      size="sm"
                      variant="flat"
                    >
                      {statusTextMap[item.status]}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{item.lastSync}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-semibold">{item.campaigns}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex" onClick={(e) => e.stopPropagation()}>
                      <Switch
                        isSelected={accountStatuses[item.id] ?? isAccountActive(item.id)}
                        onValueChange={() => handleToggleStatus(item.id)}
                        size="sm"
                        color="success"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        radius="sm"
                      >
                        동기화
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        radius="sm"
                      >
                        삭제
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={setCurrentPage}
                showControls
                color="primary"
                size="sm"
              />
            </div>
          )}
        </CardBody>
      </Card>

      {/* Platform Cards */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">사용 가능한 플랫폼</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardBody className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold">G</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Google Ads</h4>
              <p className="text-sm text-default-500 mb-4">
                Google 검색 및 디스플레이 광고
              </p>
              <Button color="primary" variant="bordered" radius="sm" fullWidth>
                연동하기
              </Button>
            </CardBody>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardBody className="text-center py-8">
              <div className="w-16 h-16 bg-secondary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold">M</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Meta Ads</h4>
              <p className="text-sm text-default-500 mb-4">
                Facebook 및 Instagram 광고
              </p>
              <Button color="primary" variant="bordered" radius="sm" fullWidth>
                연동하기
              </Button>
            </CardBody>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardBody className="text-center py-8">
              <div className="w-16 h-16 bg-warning/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold">T</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">TikTok Ads</h4>
              <p className="text-sm text-default-500 mb-4">
                TikTok 동영상 광고
              </p>
              <Button color="primary" variant="bordered" radius="sm" fullWidth>
                연동하기
              </Button>
            </CardBody>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardBody className="text-center py-8">
              <div className="w-16 h-16 bg-danger/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold">A</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Amazon Ads</h4>
              <p className="text-sm text-default-500 mb-4">
                Amazon 스폰서 광고
              </p>
              <Button color="primary" variant="bordered" radius="sm" fullWidth>
                연동하기
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Workspace Assignment Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">브랜드 할당</h2>
            {currentAccount && (
              <p className="text-sm text-default-400 font-normal">
                {currentAccount.platform} · {currentAccount.accountName}
              </p>
            )}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-3">
              <p className="text-sm text-default-500">
                이 광고 계정을 사용할 브랜드를 선택하세요
              </p>

              <div className="space-y-2">
                {workspaces.map((workspace) => {
                  const isSelected = selectedWorkspace === workspace.id;
                  
                  return (
                    <div
                      key={workspace.id}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-default-200 hover:border-default-300 hover:bg-default-50"
                      }`}
                      onClick={() => {
                        // 단일 선택: 동일한 것을 클릭하면 해제, 다른 것을 클릭하면 교체
                        setSelectedWorkspace(isSelected ? null : workspace.id);
                      }}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{workspace.name}</p>
                        {workspace.description && (
                          <p className="text-xs text-default-400 mt-0.5">
                            {workspace.description}
                          </p>
                        )}
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <Switch
                          isSelected={isSelected}
                          onValueChange={() => {
                            // Switch 클릭으로도 단일 선택 가능
                            setSelectedWorkspace(isSelected ? null : workspace.id);
                          }}
                          size="sm"
                          color="primary"
                        />
                      </div>
                    </div>
                  );
                })}

                {workspaces.length === 0 && (
                  <div className="text-center py-8 text-default-400">
                    <p className="text-sm">브랜드가 없습니다</p>
                    <p className="text-xs mt-1">먼저 브랜드를 생성해주세요</p>
                  </div>
                )}
              </div>

              <div className="p-3 bg-default-50 rounded-lg border border-default-200">
                <p className="text-xs text-default-500">
                  💡 선택된 브랜드에서만 이 광고 계정의 데이터를 조회하고 관리할 수 있습니다
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              취소
            </Button>
            <Button
              color="primary"
              onPress={handleSaveWorkspaces}
            >
              {selectedWorkspace ? '브랜드 할당' : '할당 해제'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Workspace Management Section */}
      <div className="mt-8">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">브랜드 관리</h3>
              <p className="text-sm text-default-500 mt-1">
                브랜드를 생성하고 관리합니다
              </p>
            </div>
            <Button
              color="primary"
              startContent={<Plus className="w-4 h-4" />}
              onPress={handleCreateWorkspace}
              size="sm"
            >
              브랜드 추가
            </Button>
          </CardHeader>
          <CardBody>
            {!mounted ? (
              <div className="text-center py-8">
                <p className="text-default-500">로딩 중...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table aria-label="브랜드 관리 테이블" className="min-w-[600px]">
                  <TableHeader>
                    <TableColumn key="name">브랜드명</TableColumn>
                    <TableColumn key="description">설명</TableColumn>
                    <TableColumn key="createdAt">생성일</TableColumn>
                    <TableColumn key="status" align="center">상태</TableColumn>
                    <TableColumn key="actions" align="center">작업</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {workspaces.map((workspace) => (
                      <TableRow key={workspace.id}>
                        <TableCell>
                          <div>
                            <p className="font-semibold">{workspace.name}</p>
                            <p className="text-xs text-default-400">ID: {workspace.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-default-500">
                            {workspace.description || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {new Date(workspace.createdAt).toLocaleDateString("ko-KR")}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Chip
                            color={workspace.isActive ? "success" : "default"}
                            size="sm"
                            variant="flat"
                          >
                            {workspace.isActive ? "활성" : "비활성"}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-center">
                            <Button
                              size="sm"
                              variant="flat"
                              color="primary"
                              isIconOnly
                              onPress={() => handleEditWorkspace(workspace)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="flat"
                              color="danger"
                              isIconOnly
                              onPress={() => handleDeleteWorkspace(workspace.id, workspace.name)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Workspace Create/Edit Modal */}
      <Modal isOpen={isWorkspaceModalOpen} onClose={onWorkspaceModalClose} size="lg">
        <ModalContent>
          <ModalHeader>
            {editingWorkspace ? "브랜드 수정" : "새 브랜드 추가"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="브랜드명"
                placeholder="브랜드 이름을 입력하세요"
                value={workspaceFormData.name}
                onValueChange={(value) => setWorkspaceFormData({ ...workspaceFormData, name: value })}
                isRequired
              />
              <Textarea
                label="설명"
                placeholder="브랜드 설명을 입력하세요 (선택사항)"
                value={workspaceFormData.description}
                onValueChange={(value: string) => setWorkspaceFormData({ ...workspaceFormData, description: value })}
                minRows={3}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onWorkspaceModalClose}>
              취소
            </Button>
            <Button color="primary" onPress={handleSaveWorkspace}>
              {editingWorkspace ? "수정" : "생성"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  );
}
