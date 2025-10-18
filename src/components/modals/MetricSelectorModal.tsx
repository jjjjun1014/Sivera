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
import { toast } from "@/utils/toast";

export interface MetricOption {
  key: string;
  label: string;
  color: string;
  category: "cost" | "performance" | "efficiency";
}

interface MetricSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: MetricOption[];
  selectedMetrics: Set<string>;
  onApply: (selected: Set<string>) => void;
  maxSelection?: number;
  minSelection?: number;
}

const CATEGORY_LABELS = {
  cost: "비용 관련",
  performance: "성과 지표",
  efficiency: "효율성 지표",
};

export function MetricSelectorModal({
  isOpen,
  onClose,
  metrics,
  selectedMetrics,
  onApply,
  maxSelection = 4,
  minSelection = 0,
}: MetricSelectorModalProps) {
  const [tempSelected, setTempSelected] = useState<Set<string>>(selectedMetrics);

  const handleToggle = (metricKey: string) => {
    const newSelected = new Set(tempSelected);
    if (newSelected.has(metricKey)) {
      if (minSelection > 0 && newSelected.size <= minSelection) {
        toast.error({
          title: "선택 제한",
          description: `최소 ${minSelection}개의 메트릭을 선택해야 합니다.`,
        });
        return;
      }
      newSelected.delete(metricKey);
    } else {
      if (newSelected.size >= maxSelection) {
        toast.error({
          title: "선택 제한",
          description: `최대 ${maxSelection}개의 메트릭만 선택할 수 있습니다.`,
        });
        return;
      }
      newSelected.add(metricKey);
    }
    setTempSelected(newSelected);
  };

  const handleApply = () => {
    if (minSelection > 0 && tempSelected.size < minSelection) {
      toast.error({
        title: "선택 부족",
        description: `${minSelection}개의 메트릭을 선택해주세요.`,
      });
      return;
    }
    onApply(tempSelected);
    onClose();
  };

  const handleClose = () => {
    setTempSelected(selectedMetrics); // 취소시 원래대로
    onClose();
  };

  const groupedMetrics = metrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, MetricOption[]>);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold">메트릭 선택</h3>
              <p className="text-sm text-default-500 font-normal">
                {minSelection > 0 && minSelection === maxSelection
                  ? `정확히 ${maxSelection}개 선택 필요 (${tempSelected.size}/${maxSelection} 선택됨)`
                  : `최대 ${maxSelection}개 선택 가능 (${tempSelected.size}/${maxSelection} 선택됨)`}
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {Object.entries(groupedMetrics).map(([category, categoryMetrics]) => (
                  <div key={category}>
                    <h4 className="text-sm font-semibold text-default-700 mb-3">
                      {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {categoryMetrics.map((metric) => (
                        <div
                          key={metric.key}
                          className={`
                            flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all
                            ${
                              tempSelected.has(metric.key)
                                ? "border-primary bg-primary/10"
                                : "border-default-200 hover:border-default-300"
                            }
                          `}
                          onClick={() => handleToggle(metric.key)}
                        >
                          <Checkbox
                            isSelected={tempSelected.has(metric.key)}
                            onValueChange={() => handleToggle(metric.key)}
                          />
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block w-3 h-3 rounded-full"
                              style={{ backgroundColor: metric.color }}
                            />
                            <span className="text-sm font-medium">{metric.label}</span>
                          </div>
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
