'use client';

/**
 * Anomaly Alert Banner Component
 *
 * 이상 패턴이 감지되면 페이지 상단에 경고 배너를 표시합니다.
 */

import { useState } from 'react';
import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { AlertTriangle, TrendingUp, TrendingDown, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { AnomalyResult } from '@/lib/ai/anomaly';

interface AnomalyAlertBannerProps {
  anomalies: AnomalyResult[];
  onDismiss?: () => void;
  onViewDetails?: (anomaly: AnomalyResult) => void;
}

export function AnomalyAlertBanner({
  anomalies,
  onDismiss,
  onViewDetails,
}: AnomalyAlertBannerProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  if (anomalies.length === 0) return null;

  const visibleAnomalies = anomalies.filter(
    (a) => !dismissedIds.has(`${a.campaignId}-${a.metricName}-${a.date}`)
  );

  if (visibleAnomalies.length === 0) return null;

  const highSeverityCount = visibleAnomalies.filter((a) => a.severity === 'high').length;
  const mediumSeverityCount = visibleAnomalies.filter((a) => a.severity === 'medium').length;
  const lowSeverityCount = visibleAnomalies.filter((a) => a.severity === 'low').length;

  const handleDismissAnomaly = (anomaly: AnomalyResult) => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(`${anomaly.campaignId}-${anomaly.metricName}-${anomaly.date}`);
      return next;
    });
  };

  const handleDismissAll = () => {
    if (onDismiss) {
      onDismiss();
    } else {
      setDismissedIds(
        new Set(anomalies.map((a) => `${a.campaignId}-${a.metricName}-${a.date}`))
      );
    }
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'default';
    }
  };

  const getSeverityLabel = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return '긴급';
      case 'medium':
        return '주의';
      case 'low':
        return '알림';
    }
  };

  return (
    <Card
      className={`mb-6 border-2 ${
        highSeverityCount > 0
          ? 'border-danger bg-danger-50/50 dark:bg-danger-900/10'
          : mediumSeverityCount > 0
            ? 'border-warning bg-warning-50/50 dark:bg-warning-900/10'
            : 'border-default-300 bg-default-50/50'
      }`}
    >
      <CardBody className="p-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <AlertTriangle
              className={
                highSeverityCount > 0
                  ? 'text-danger'
                  : mediumSeverityCount > 0
                    ? 'text-warning'
                    : 'text-default-500'
              }
              size={24}
            />
            <div>
              <h3 className="font-semibold text-base">이상 패턴 감지</h3>
              <p className="text-sm text-default-600">
                {visibleAnomalies.length}개의 이상 패턴이 감지되었습니다.
                {highSeverityCount > 0 && (
                  <span className="text-danger ml-1">({highSeverityCount}개 긴급)</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="light"
              onPress={() => setIsExpanded(!isExpanded)}
              endContent={isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            >
              {isExpanded ? '접기' : '펼치기'}
            </Button>
            <Button size="sm" variant="light" onPress={handleDismissAll} endContent={<X size={16} />}>
              모두 닫기
            </Button>
          </div>
        </div>

        {/* 요약 */}
        {!isExpanded && (
          <div className="flex gap-2">
            {highSeverityCount > 0 && (
              <Chip color="danger" size="sm" variant="flat">
                긴급 {highSeverityCount}
              </Chip>
            )}
            {mediumSeverityCount > 0 && (
              <Chip color="warning" size="sm" variant="flat">
                주의 {mediumSeverityCount}
              </Chip>
            )}
            {lowSeverityCount > 0 && (
              <Chip color="default" size="sm" variant="flat">
                알림 {lowSeverityCount}
              </Chip>
            )}
          </div>
        )}

        {/* 상세 목록 */}
        {isExpanded && (
          <div className="space-y-2 mt-2">
            {visibleAnomalies.map((anomaly, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-background/80 rounded-lg border border-default-200"
              >
                <div className="flex-shrink-0 pt-1">
                  {anomaly.deviation > 0 ? (
                    <TrendingUp className="text-danger" size={20} />
                  ) : (
                    <TrendingDown className="text-success" size={20} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Chip
                      color={getSeverityColor(anomaly.severity)}
                      size="sm"
                      variant="flat"
                      className="whitespace-nowrap"
                    >
                      {getSeverityLabel(anomaly.severity)}
                    </Chip>
                    {anomaly.campaignName && (
                      <span className="font-semibold text-sm truncate">
                        {anomaly.campaignName}
                      </span>
                    )}
                    <span className="text-xs text-default-500">{anomaly.date}</span>
                  </div>
                  <p className="text-sm text-default-700 mb-2">{anomaly.message}</p>
                  <div className="flex gap-4 text-xs text-default-500">
                    <span>
                      현재: {anomaly.value.toLocaleString()}
                      {anomaly.metricName?.includes('률') && '%'}
                    </span>
                    <span>
                      평균: {Math.round(anomaly.expectedValue).toLocaleString()}
                      {anomaly.metricName?.includes('률') && '%'}
                    </span>
                    {anomaly.deviation !== 0 && (
                      <span
                        className={anomaly.deviation > 0 ? 'text-danger' : 'text-success'}
                      >
                        {anomaly.deviation > 0 ? '▲' : '▼'}{' '}
                        {Math.abs(anomaly.deviation).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 flex gap-2">
                  {onViewDetails && (
                    <Button size="sm" color="primary" onPress={() => onViewDetails(anomaly)}>
                      상세보기
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="light"
                    onPress={() => handleDismissAnomaly(anomaly)}
                  >
                    무시
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
