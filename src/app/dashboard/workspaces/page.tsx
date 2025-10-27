"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Selection } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useWorkspaces, useWorkspaceManagement } from "@/hooks";
import { statusColorMap, statusTextMap } from "@/lib/constants/status";
import type { Workspace } from "@/lib/mock-data/workspaces";

export default function WorkspacesPage() {
  const { workspaces, isLoading, refreshWorkspaces } = useWorkspaces();
  const {
    isOpen,
    onOpen,
    onClose,
    editingWorkspace,
    formData,
    setFormData,
    handleCreate,
    handleEdit,
    handleSave,
    handleDelete,
  } = useWorkspaceManagement(refreshWorkspaces);

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  const handleToggleActive = (workspaceId: string) => {
    const workspace = workspaces.find((w: Workspace) => w.id === workspaceId);
    if (!workspace) return;

    // TODO: 실제 API 호출로 변경 필요
    // updateWorkspace는 hook에서 관리하지만, toggle은 별도 처리
    const updatedWorkspace = { ...workspace, isActive: !workspace.isActive };
    refreshWorkspaces();
  };

  // status 매핑은 중앙 constants 사용
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">사업체 관리</h1>
          <p className="text-default-500 mt-1">사업체를 생성하고 관리합니다.</p>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={handleCreate}
        >
          사업체 추가
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">전체 사업체</p>
            <p className="text-3xl font-bold">{workspaces.length}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">활성 사업체</p>
            <p className="text-3xl font-bold text-success">
              {workspaces.filter(w => w.isActive).length}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">비활성 사업체</p>
            <p className="text-3xl font-bold text-default-400">
              {workspaces.filter(w => !w.isActive).length}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Workspaces Table */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">사업체 목록</h3>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <Table
              aria-label="사업체 관리 테이블"
              selectionMode="multiple"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
              className="min-w-[900px]"
            >
              <TableHeader>
                <TableColumn key="name">사업체명</TableColumn>
                <TableColumn key="description">설명</TableColumn>
                <TableColumn key="createdAt">생성일</TableColumn>
                <TableColumn key="status" align="center">상태</TableColumn>
                <TableColumn key="active" align="center">활성화</TableColumn>
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
                    <TableCell className="text-center">
                      <div className="inline-flex" onClick={(e) => e.stopPropagation()}>
                        <Switch
                          isSelected={workspace.isActive}
                          onValueChange={() => handleToggleActive(workspace.id)}
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
                          isIconOnly
                          onPress={() => handleEdit(workspace)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          color="danger"
                          isIconOnly
                          onPress={() => handleDelete(workspace.id, workspace.name)}
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
        </CardBody>
      </Card>

      {/* Create/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            {editingWorkspace ? "사업체 수정" : "새 사업체 추가"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="사업체명"
                placeholder="사업체 이름을 입력하세요"
                value={formData.name}
                onValueChange={(value) => setFormData({ ...formData, name: value })}
                isRequired
              />
              <Textarea
                label="설명"
                placeholder="사업체 설명을 입력하세요 (선택사항)"
                value={formData.description}
                onValueChange={(value: string) => setFormData({ ...formData, description: value })}
                minRows={3}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              취소
            </Button>
            <Button color="primary" onPress={handleSave}>
              {editingWorkspace ? "수정" : "생성"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
