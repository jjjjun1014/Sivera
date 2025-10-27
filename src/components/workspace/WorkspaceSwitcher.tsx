"use client";

import { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { ChevronDown, Plus, Check } from "lucide-react";
import { useWorkspace } from "@/contexts/WorkspaceContext";

export function WorkspaceSwitcher() {
  const { currentWorkspace, workspaces, switchWorkspace, createWorkspace, isLoading } =
    useWorkspace();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!newWorkspaceName.trim()) return;

    try {
      setIsCreating(true);
      await createWorkspace({
        name: newWorkspaceName.trim(),
        description: newWorkspaceDescription.trim() || undefined,
      });
      setShowCreateModal(false);
      setNewWorkspaceName("");
      setNewWorkspaceDescription("");
    } catch (error) {
      alert("사업체 생성에 실패했습니다.");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading || !currentWorkspace) {
    return null;
  }

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
            variant="flat"
            className="gap-2 min-w-[180px] justify-between"
            endContent={<ChevronDown className="w-4 h-4" />}
          >
            <span className="font-semibold truncate">{currentWorkspace.name}</span>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="작업공간 선택"
          onAction={(key) => {
            if (key === "create") {
              setShowCreateModal(true);
            } else {
              switchWorkspace(String(key));
            }
          }}
        >
          {[...workspaces.map((workspace) => (
            <DropdownItem key={workspace.id} textValue={workspace.name}>
              <div className="flex items-center justify-between gap-2 w-full">
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="truncate font-medium">{workspace.name}</span>
                  {workspace.description && (
                    <span className="text-xs text-default-400 truncate">
                      {workspace.description}
                    </span>
                  )}
                </div>
                {workspace.id === currentWorkspace.id && (
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                )}
              </div>
            </DropdownItem>
          )),
          <DropdownItem key="create" className="text-primary" textValue="새 작업공간 만들기">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>새 작업공간 만들기</span>
            </div>
          </DropdownItem>
          ]}
        </DropdownMenu>
      </Dropdown>

      {/* Create Workspace Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <ModalContent>
          <ModalHeader>새 작업공간 만들기</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="작업공간 이름"
                placeholder="예: 사업체 A"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                isRequired
              />
              <Textarea
                label="설명 (선택)"
                placeholder="이 작업공간에 대한 간단한 설명"
                value={newWorkspaceDescription}
                onChange={(e) => setNewWorkspaceDescription(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => setShowCreateModal(false)}
              isDisabled={isCreating}
            >
              취소
            </Button>
            <Button
              color="primary"
              onPress={handleCreate}
              isDisabled={!newWorkspaceName.trim() || isCreating}
              isLoading={isCreating}
            >
              만들기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
