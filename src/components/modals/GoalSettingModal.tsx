"use client";

import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { toast } from "@/utils/toast";

export interface PlatformGoals {
  totalBudget: number;
  targetConversions: number;
  targetCPA: number;
  targetROAS: number;
  targetCTR: number;
  targetImpressionShare: number;
}

interface GoalSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  platformName: string;
  workspaceId: string; // 사업체 ID 추가 (필수)
  currentGoals: PlatformGoals;
  onSave: (goals: PlatformGoals) => void;
}

export function GoalSettingModal({
  isOpen,
  onClose,
  platformName,
  workspaceId,
  currentGoals,
  onSave,
}: GoalSettingModalProps) {
  const [goals, setGoals] = useState<PlatformGoals>(currentGoals);
  const [displayValues, setDisplayValues] = useState({
    totalBudget: "",
    targetConversions: "",
    targetCPA: "",
    targetROAS: "",
    targetCTR: "",
    targetImpressionShare: "",
  });

  useEffect(() => {
    if (currentGoals) {
      setGoals(currentGoals);
      setDisplayValues({
        totalBudget: currentGoals.totalBudget > 0 ? currentGoals.totalBudget.toLocaleString() : "",
        targetConversions: currentGoals.targetConversions > 0 ? currentGoals.targetConversions.toLocaleString() : "",
        targetCPA: currentGoals.targetCPA > 0 ? currentGoals.targetCPA.toLocaleString() : "",
        targetROAS: currentGoals.targetROAS > 0 ? currentGoals.targetROAS.toString() : "",
        targetCTR: currentGoals.targetCTR > 0 ? currentGoals.targetCTR.toString() : "",
        targetImpressionShare: currentGoals.targetImpressionShare > 0 ? currentGoals.targetImpressionShare.toString() : "",
      });
    }
  }, [currentGoals, isOpen]);

  const formatNumber = (value: string): string => {
    const num = value.replace(/,/g, "");
    if (!num || isNaN(Number(num))) return "";
    return Number(num).toLocaleString();
  };

  const parseNumber = (value: string): number => {
    const num = value.replace(/,/g, "");
    return Number(num) || 0;
  };

  const handleNumberChange = (field: keyof PlatformGoals, value: string) => {
    const numericValue = parseNumber(value);
    setGoals({ ...goals, [field]: numericValue });

    // ROAS, CTR, ImpressionShare는 소수점이 있으므로 포맷하지 않음
    if (field === "targetROAS" || field === "targetCTR" || field === "targetImpressionShare") {
      setDisplayValues({ ...displayValues, [field]: value });
    } else {
      setDisplayValues({ ...displayValues, [field]: formatNumber(value) });
    }
  };

  const handleSave = () => {
    // 유효성 검사
    if (goals.totalBudget <= 0) {
      toast.error({
        title: "입력 오류",
        description: "목표 예산은 0보다 커야 합니다.",
      });
      return;
    }

    onSave(goals);
    toast.success({
      title: "목표 저장 완료",
      description: `${platformName} 목표가 저장되었습니다.`,
    });
    onClose();
  };

  const handleReset = () => {
    setGoals({
      totalBudget: 0,
      targetConversions: 0,
      targetCPA: 0,
      targetROAS: 0,
      targetCTR: 0,
      targetImpressionShare: 0,
    });
    setDisplayValues({
      totalBudget: "",
      targetConversions: "",
      targetCPA: "",
      targetROAS: "",
      targetCTR: "",
      targetImpressionShare: "",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-xl font-bold">{platformName} - 목표 설정</h3>
          <p className="text-sm text-default-500">
            성과 측정을 위한 목표값을 입력하세요
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 총 예산 목표 */}
            <Input
              label="목표 예산 (₩)"
              placeholder="1,000,000"
              type="text"
              value={displayValues.totalBudget}
              onChange={(e) => handleNumberChange("totalBudget", e.target.value)}
              startContent={<span className="text-default-400">₩</span>}
              description="월간 총 광고 예산"
            />

            {/* 목표 전환수 */}
            <Input
              label="목표 전환수"
              placeholder="100"
              type="text"
              value={displayValues.targetConversions}
              onChange={(e) => handleNumberChange("targetConversions", e.target.value)}
              endContent={<span className="text-default-400">건</span>}
              description="목표 전환 건수"
            />

            {/* 목표 CPA */}
            <Input
              label="목표 CPA (₩)"
              placeholder="10,000"
              type="text"
              value={displayValues.targetCPA}
              onChange={(e) => handleNumberChange("targetCPA", e.target.value)}
              startContent={<span className="text-default-400">₩</span>}
              description="전환당 목표 비용"
            />

            {/* 목표 ROAS */}
            <Input
              label="목표 ROAS"
              placeholder="3.5"
              type="number"
              step="0.1"
              value={displayValues.targetROAS}
              onChange={(e) => handleNumberChange("targetROAS", e.target.value)}
              endContent={<span className="text-default-400">x</span>}
              description="광고 수익률 목표"
            />

            {/* 목표 CTR */}
            <Input
              label="목표 CTR (%)"
              placeholder="2.5"
              type="number"
              step="0.01"
              value={displayValues.targetCTR}
              onChange={(e) => handleNumberChange("targetCTR", e.target.value)}
              endContent={<span className="text-default-400">%</span>}
              description="클릭률 목표"
            />

            {/* 목표 노출 점유율 */}
            <Input
              label="목표 노출 점유율 (%)"
              placeholder="70"
              type="number"
              step="1"
              value={displayValues.targetImpressionShare}
              onChange={(e) => handleNumberChange("targetImpressionShare", e.target.value)}
              endContent={<span className="text-default-400">%</span>}
              description="시장 내 노출 비중 목표"
            />
          </div>

          <div className="mt-4 p-4 bg-default-100 rounded-lg">
            <p className="text-sm text-default-600">
              💡 <strong>팁:</strong> 목표값은 언제든지 수정할 수 있으며, 대시보드에서 실시간으로 달성률이 계산됩니다.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={handleReset}>
            초기화
          </Button>
          <Button color="danger" variant="light" onPress={onClose}>
            취소
          </Button>
          <Button color="primary" onPress={handleSave}>
            저장
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
