"use client";

import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useState } from "react";
import { Play, Pause, Trash2, Edit, ChevronDown } from "lucide-react";
import { toast } from "@/utils/toast";

interface BulkActionsBarProps {
  selectedCount: number;
  onActivate?: () => void;
  onPause?: () => void;
  onDelete?: () => void;
  onBulkEditBudget?: (value: number, action: "set" | "increase" | "decrease") => void;
  onClearSelection?: () => void;
}

export function BulkActionsBar({
  selectedCount,
  onActivate,
  onPause,
  onDelete,
  onBulkEditBudget,
  onClearSelection,
}: BulkActionsBarProps) {
  const { isOpen: isBudgetModalOpen, onOpen: onBudgetModalOpen, onClose: onBudgetModalClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();

  const [budgetAction, setBudgetAction] = useState<"set" | "increase" | "decrease">("set");
  const [budgetValue, setBudgetValue] = useState("");

  const handleBudgetSave = () => {
    const value = parseFloat(budgetValue.replace(/,/g, ""));
    if (isNaN(value) || value <= 0) {
      toast.error({
        title: "입력 오류",
        description: "올바른 예산을 입력하세요.",
      });
      return;
    }

    onBulkEditBudget?.(value, budgetAction);
    toast.success({
      title: "예산 변경 완료",
      description: `${selectedCount}개 캠페인의 예산이 변경되었습니다.`,
    });
    onBudgetModalClose();
    setBudgetValue("");
  };

  const handleDelete = () => {
    onDelete?.();
    toast.success({
      title: "캠페인 삭제 완료",
      description: `${selectedCount}개 캠페인이 삭제되었습니다.`,
    });
    onDeleteModalClose();
  };

  const handleActivate = () => {
    onActivate?.();
    toast.success({
      title: "캠페인 활성화 완료",
      description: `${selectedCount}개 캠페인이 활성화되었습니다.`,
    });
  };

  const handlePause = () => {
    onPause?.();
    toast.success({
      title: "캠페인 일시정지 완료",
      description: `${selectedCount}개 캠페인이 일시정지되었습니다.`,
    });
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-content1 border border-divider rounded-lg shadow-lg px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{selectedCount}개 선택됨</span>
              <Button size="sm" variant="light" onPress={onClearSelection}>
                선택 해제
              </Button>
            </div>

            <div className="h-6 w-px bg-divider" />

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                color="success"
                variant="flat"
                startContent={<Play className="w-4 h-4" />}
                onPress={handleActivate}
              >
                활성화
              </Button>

              <Button
                size="sm"
                color="warning"
                variant="flat"
                startContent={<Pause className="w-4 h-4" />}
                onPress={handlePause}
              >
                일시정지
              </Button>

              <Button
                size="sm"
                color="primary"
                variant="flat"
                startContent={<Edit className="w-4 h-4" />}
                onPress={onBudgetModalOpen}
              >
                예산 변경
              </Button>

              <Button
                size="sm"
                color="danger"
                variant="flat"
                startContent={<Trash2 className="w-4 h-4" />}
                onPress={onDeleteModalOpen}
              >
                삭제
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Edit Modal */}
      <Modal isOpen={isBudgetModalOpen} onClose={onBudgetModalClose}>
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-bold">예산 일괄 변경</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-sm text-default-600">
                {selectedCount}개의 캠페인 예산을 변경합니다.
              </p>

              <Select
                label="변경 방식"
                selectedKeys={[budgetAction]}
                onChange={(e) => setBudgetAction(e.target.value as "set" | "increase" | "decrease")}
              >
                <SelectItem key="set">설정 (새 예산으로 변경)</SelectItem>
                <SelectItem key="increase">증가 (현재 예산에 추가)</SelectItem>
                <SelectItem key="decrease">감소 (현재 예산에서 차감)</SelectItem>
              </Select>

              <Input
                label="예산 (₩)"
                placeholder="100,000"
                type="text"
                value={budgetValue}
                onChange={(e) => {
                  const num = e.target.value.replace(/,/g, "");
                  if (!isNaN(Number(num))) {
                    setBudgetValue(Number(num).toLocaleString());
                  }
                }}
                startContent={<span className="text-default-400">₩</span>}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onBudgetModalClose}>
              취소
            </Button>
            <Button color="primary" onPress={handleBudgetSave}>
              적용
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-bold">캠페인 삭제 확인</h3>
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-default-600">
              선택한 {selectedCount}개의 캠페인을 삭제하시겠습니까?
            </p>
            <p className="text-sm text-danger mt-2">
              ⚠️ 이 작업은 되돌릴 수 없습니다.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteModalClose}>
              취소
            </Button>
            <Button color="danger" onPress={handleDelete}>
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
