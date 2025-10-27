/**
 * Workspace CRUD 관리 훅
 * 생성, 수정, 삭제 핸들러를 중앙에서 관리
 */

import { useState } from "react";
import { useDisclosure } from "@heroui/modal";
import { toast } from "@/utils/toast";
import {
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  type Workspace,
} from "@/lib/mock-data/workspaces";

interface WorkspaceFormData {
  name: string;
  description: string;
  ownerId: string;
}

export function useWorkspaceManagement(onRefresh: () => void) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [formData, setFormData] = useState<WorkspaceFormData>({
    name: "",
    description: "",
    ownerId: "user1",
  });

  const handleCreate = () => {
    setEditingWorkspace(null);
    setFormData({
      name: "",
      description: "",
      ownerId: "user1",
    });
    onOpen();
  };

  const handleEdit = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
    setFormData({
      name: workspace.name,
      description: workspace.description || "",
      ownerId: workspace.ownerId,
    });
    onOpen();
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error({
        title: "입력 오류",
        description: "브랜드 이름을 입력해주세요.",
      });
      return;
    }

    if (editingWorkspace) {
      const updated = updateWorkspace(editingWorkspace.id, {
        name: formData.name,
        description: formData.description,
      });

      if (updated) {
        onRefresh();
        toast.success({
          title: "수정 완료",
          description: `${formData.name} 브랜드가 수정되었습니다.`,
        });
      }
    } else {
      const newWorkspace = createWorkspace({
        name: formData.name,
        description: formData.description,
        ownerId: formData.ownerId,
      });

      onRefresh();
      toast.success({
        title: "생성 완료",
        description: `${newWorkspace.name} 브랜드가 생성되었습니다.`,
      });
    }

    onClose();
  };

  const handleDelete = (workspaceId: string, workspaceName: string) => {
    if (confirm(`정말로 "${workspaceName}" 브랜드를 삭제하시겠습니까?`)) {
      deleteWorkspace(workspaceId);
      onRefresh();

      toast.success({
        title: "삭제 완료",
        description: `${workspaceName} 브랜드가 삭제되었습니다.`,
      });
    }
  };

  return {
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
  };
}
