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
import { useState, useEffect } from "react";
import { toast } from "@/utils/toast";

export interface MetricOption {
  key: string;
  label: string;
  color: string;
  category: "cost" | "performance" | "efficiency";
}

const CHART_COLORS = ["#17C964", "#0072F5", "#F5A524", "#9353D3"];

interface MetricsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: MetricOption[];
  selectedSummaryMetrics: string[];
  selectedChartMetrics: string[];
  onApply: (summary: string[], chart: string[]) => void;
}

const CATEGORY_LABELS = {
  cost: "비용 관련",
  performance: "성과 지표",
  efficiency: "효율성 지표",
};

export function MetricsConfigModal({
  isOpen,
  onClose,
  metrics,
  selectedSummaryMetrics,
  selectedChartMetrics,
  onApply,
}: MetricsConfigModalProps) {
  const [tempSummary, setTempSummary] = useState<string[]>(selectedSummaryMetrics);
  const [tempChart, setTempChart] = useState<string[]>(selectedChartMetrics);

  // 모달이 열릴 때마다 선택 상태 동기화
  useEffect(() => {
    if (isOpen) {
      setTempSummary(selectedSummaryMetrics);
      setTempChart(selectedChartMetrics);
    }
  }, [isOpen, selectedSummaryMetrics, selectedChartMetrics]);

  const handleToggleSummary = (metricKey: string) => {
    const newSelected = [...tempSummary];
    const index = newSelected.indexOf(metricKey);

    if (index > -1) {
      // 체크 해제
      newSelected.splice(index, 1);
    } else {
      // 체크 추가
      if (newSelected.length >= 4) {
        toast.error({
          title: "선택 제한",
          description: "요약 카드는 최대 4개의 메트릭만 선택할 수 있습니다.",
        });
        return;
      }
      newSelected.push(metricKey);
    }
    setTempSummary(newSelected);
  };

  const handleToggleChart = (metricKey: string) => {
    const newSelected = [...tempChart];
    const index = newSelected.indexOf(metricKey);

    if (index > -1) {
      newSelected.splice(index, 1);
    } else {
      if (newSelected.length >= 4) {
        toast.error({
          title: "선택 제한",
          description: "차트는 최대 4개의 메트릭만 선택할 수 있습니다.",
        });
        return;
      }
      newSelected.push(metricKey);
    }
    setTempChart(newSelected);
  };

  const handleApply = () => {
    if (tempSummary.length < 1 || tempSummary.length > 4) {
      toast.error({
        title: "선택 오류",
        description: "요약 카드는 1~4개의 메트릭을 선택해주세요.",
      });
      return;
    }
    onApply(tempSummary, tempChart);
    onClose();
  };

  const handleClose = () => {
    setTempSummary(selectedSummaryMetrics);
    setTempChart(selectedChartMetrics);
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
    <Modal isOpen={isOpen} onClose={handleClose} size="3xl" scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold">지표 선택</h3>
              <p className="text-sm text-default-500 font-normal">
                요약 카드: {tempSummary.length}/4 선택됨 | 차트: {tempChart.length}/4 선택됨
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {Object.entries(groupedMetrics).map(([category, categoryMetrics]) => (
                  <div key={category}>
                    <h4 className="text-sm font-semibold text-default-700 mb-3">
                      {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                    </h4>
                    <div className="space-y-2">
                      {categoryMetrics.map((metric) => {
                        const chartIndex = tempChart.indexOf(metric.key);
                        const chartColor = chartIndex !== -1 ? CHART_COLORS[chartIndex] : undefined;

                        return (
                          <div
                            key={metric.key}
                            className="flex items-center gap-4 p-3 rounded-lg border border-default-200 hover:border-default-300 transition-all"
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-sm font-medium">{metric.label}</span>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  isSelected={tempSummary.includes(metric.key)}
                                  onValueChange={() => handleToggleSummary(metric.key)}
                                />
                                <span className="text-xs text-default-500">
                                  요약 카드
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  isSelected={tempChart.includes(metric.key)}
                                  onValueChange={() => handleToggleChart(metric.key)}
                                />
                                <span className="text-xs text-default-500 flex items-center gap-1">
                                  차트
                                  {chartColor && (
                                    <span
                                      className="inline-block w-2 h-2 rounded-full"
                                      style={{ backgroundColor: chartColor }}
                                    />
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
