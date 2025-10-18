"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { useState } from "react";

export interface ColumnOption {
  id: string;
  label: string;
  category: "basic" | "performance" | "efficiency";
  isPinned?: boolean; // 고정 컬럼 (체크박스, 작업 등)
}

interface ColumnManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnOption[];
  visibleColumns: Record<string, boolean>;
  onApply: (visible: Record<string, boolean>) => void;
}

const CATEGORY_LABELS = {
  basic: "기본 정보",
  performance: "성과 지표",
  efficiency: "효율성 지표",
};

export function ColumnManagerModal({
  isOpen,
  onClose,
  columns,
  visibleColumns,
  onApply,
}: ColumnManagerModalProps) {
  const [tempVisible, setTempVisible] = useState<Record<string, boolean>>(visibleColumns);

  const handleToggle = (columnId: string) => {
    setTempVisible((prev) => ({
      ...prev,
      [columnId]: !(prev[columnId] ?? true),
    }));
  };

  const handleSelectAll = () => {
    const allVisible: Record<string, boolean> = {};
    columns.forEach((col) => {
      if (!col.isPinned) {
        allVisible[col.id] = true;
      }
    });
    setTempVisible(allVisible);
  };

  const handleDeselectAll = () => {
    const allHidden: Record<string, boolean> = {};
    columns.forEach((col) => {
      if (!col.isPinned) {
        allHidden[col.id] = false;
      }
    });
    setTempVisible(allHidden);
  };

  const handleApply = () => {
    onApply(tempVisible);
    onClose();
  };

  const handleClose = () => {
    setTempVisible(visibleColumns); // 취소시 원래대로
    onClose();
  };

  const groupedColumns = columns
    .filter((col) => !col.isPinned)
    .reduce((acc, column) => {
      if (!acc[column.category]) {
        acc[column.category] = [];
      }
      acc[column.category].push(column);
      return acc;
    }, {} as Record<string, ColumnOption[]>);

  const visibleCount = columns.filter(
    (col) => !col.isPinned && (tempVisible[col.id] ?? true)
  ).length;
  const totalCount = columns.filter((col) => !col.isPinned).length;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex justify-between items-center w-full">
                <div>
                  <h3 className="text-xl font-semibold">컬럼 관리</h3>
                  <p className="text-sm text-default-500 font-normal">
                    표시할 컬럼을 선택하세요 ({visibleCount}/{totalCount} 선택됨)
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="flat" onPress={handleSelectAll}>
                    전체 선택
                  </Button>
                  <Button size="sm" variant="flat" onPress={handleDeselectAll}>
                    전체 해제
                  </Button>
                </div>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {Object.entries(groupedColumns).map(([category, categoryColumns]) => (
                  <div key={category}>
                    <h4 className="text-sm font-semibold text-default-700 mb-3">
                      {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {categoryColumns.map((column) => (
                        <div
                          key={column.id}
                          className={`
                            flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all
                            ${
                              tempVisible[column.id] ?? true
                                ? "border-primary bg-primary/10"
                                : "border-default-200 hover:border-default-300"
                            }
                          `}
                          onClick={() => handleToggle(column.id)}
                        >
                          <Checkbox
                            isSelected={tempVisible[column.id] ?? true}
                            onValueChange={() => handleToggle(column.id)}
                          />
                          <span className="text-sm font-medium">{column.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={handleClose}>
                취소
              </Button>
              <Button color="primary" onPress={handleApply}>
                적용
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
