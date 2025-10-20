"use client";

import { useState, useMemo } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { DateRangePicker } from "@heroui/date-picker";
import { getLocalTimeZone, today } from "@internationalized/date";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Selection,
} from "@heroui/table";
import {
  ComposedChart,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar } from "lucide-react";
import {
  PageHeader,
  MetricCard,
  SectionHeader,
  EmptyState,
} from "@/components/common";
import { usePagination } from "@/hooks";
import { CHART_CONFIG } from "@/lib/constants";
import { Campaign, CampaignStatus } from "@/types";
import {
  PlatformDashboardConfig,
  MetricConfig,
} from "@/types/platform-dashboard";
import { GoalSettingModal } from "@/components/modals/GoalSettingModal";
import { platformGoalsStorage } from "@/lib/storage/platformGoals";

interface PlatformDashboardTemplateProps {
  config: PlatformDashboardConfig;
  campaigns?: Campaign[];
  initialMetrics?: string[];
}

export function PlatformDashboardTemplate({
  config,
  campaigns = [],
  initialMetrics,
}: PlatformDashboardTemplateProps) {
  const {
    platformName,
    platformKey,
    description,
    features = {},
    availableMetrics = [],
    defaultMetrics = [],
  } = config;

  // State
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [selectedMetrics] = useState<string[]>(
    initialMetrics || defaultMetrics
  );

  // DateRangePicker state
  const todayDate = today(getLocalTimeZone());
  const thirtyDaysAgo = todayDate.subtract({ days: 29 });
  const [dateRange, setDateRange] = useState({
    start: thirtyDaysAgo,
    end: todayDate,
  });

  // Load goals from storage
  const goals = platformGoalsStorage.loadPlatform(platformKey);

  // Pagination
  const { currentPage, totalPages, paginatedData, setCurrentPage } =
    usePagination(campaigns, {
      itemsPerPage: 5,
    });

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalConversions = campaigns.reduce(
      (sum, c) => sum + c.conversions,
      0
    );
    const avgCPA =
      totalConversions > 0 ? totalSpent / totalConversions : 0;
    const avgROAS =
      campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length || 0;
    const avgCTR =
      campaigns.reduce((sum, c) => sum + (c.ctr || 0), 0) /
        campaigns.length || 0;
    const totalImpressions = campaigns.reduce(
      (sum, c) => sum + (c.impressions || 0),
      0
    );
    const totalClicks = campaigns.reduce(
      (sum, c) => sum + (c.clicks || 0),
      0
    );

    return {
      totalSpent,
      totalConversions,
      avgCPA,
      avgROAS,
      avgCTR,
      totalImpressions,
      totalClicks,
      activeCampaigns: campaigns.filter((c) => c.status === "active").length,
      totalCampaigns: campaigns.length,
    };
  }, [campaigns]);

  // Chart data - last 30 days
  const chartData = useMemo(() => {
    const days = 30;
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

      // Generate realistic fluctuating data based on summary
      const dayFactor = 0.8 + Math.random() * 0.4;
      const spent = Math.round((summaryMetrics.totalSpent / days) * dayFactor);
      const conversions = Math.round(
        (summaryMetrics.totalConversions / days) * dayFactor
      );
      const cpa = conversions > 0 ? spent / conversions : 0;
      const roas = summaryMetrics.avgROAS * (0.9 + Math.random() * 0.2);

      data.push({
        date: dateStr,
        spent,
        conversions,
        cpa: Math.round(cpa),
        roas: Number(roas.toFixed(1)),
        ctr: Number((summaryMetrics.avgCTR * (0.9 + Math.random() * 0.2)).toFixed(2)),
      });
    }

    return data;
  }, [summaryMetrics]);

  // Format metric value
  const formatMetricValue = (
    value: number,
    format: MetricConfig["format"]
  ): string => {
    switch (format) {
      case "currency":
        return `₩${value.toLocaleString()}`;
      case "percentage":
        return `${value.toFixed(2)}%`;
      case "decimal":
        return value.toFixed(2);
      default:
        return value.toLocaleString();
    }
  };

  // Get metric config
  const getMetricConfig = (key: string): MetricConfig | undefined => {
    return availableMetrics.find((m) => m.key === key);
  };

  // Calculate achievement rate
  const calculateAchievement = (
    actual: number,
    target: number,
    isInverse = false
  ): number => {
    if (!target || target === 0) return 0;
    const rate = (actual / target) * 100;
    return isInverse ? 200 - rate : rate;
  };

  // Get status color
  const getStatusColor = (
    status: CampaignStatus
  ): "success" | "warning" | "danger" | "default" => {
    switch (status) {
      case "active":
        return "success";
      case "paused":
        return "warning";
      case "ended":
        return "danger";
      default:
        return "default";
    }
  };

  // Bulk actions handler
  const handleBulkAction = (action: string) => {
    const selectedCampaigns = Array.from(selectedKeys).filter(
      (key) => key !== "all"
    );
    console.log(`Bulk ${action} for campaigns:`, selectedCampaigns);
    // TODO: Implement actual bulk actions
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title={platformName}
        description={description}
        actions={
          <div className="flex gap-2">
            {features.chart && features.goals && (
              <Button
                color="primary"
                variant="flat"
                onPress={() => setIsGoalModalOpen(true)}
              >
                목표 설정
              </Button>
            )}
            {features.filters && (
              <DateRangePicker
                label="기간 선택"
                value={dateRange}
                onChange={setDateRange}
                visibleMonths={2}
                pageBehavior="single"
              />
            )}
          </div>
        }
      />

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="총 광고비"
          value={formatMetricValue(summaryMetrics.totalSpent, "currency")}
          change={
            goals?.totalBudget
              ? `목표 대비 ${calculateAchievement(summaryMetrics.totalSpent, goals.totalBudget).toFixed(1)}%`
              : undefined
          }
          isNegative={
            goals?.totalBudget
              ? summaryMetrics.totalSpent > goals.totalBudget
              : false
          }
        />
        <MetricCard
          label="전환수"
          value={summaryMetrics.totalConversions.toLocaleString()}
          change={
            goals?.targetConversions
              ? `목표 대비 ${calculateAchievement(summaryMetrics.totalConversions, goals.targetConversions).toFixed(1)}%`
              : undefined
          }
          isNegative={
            goals?.targetConversions
              ? summaryMetrics.totalConversions < goals.targetConversions
              : false
          }
        />
        <MetricCard
          label="평균 CPA"
          value={formatMetricValue(summaryMetrics.avgCPA, "currency")}
          change={
            goals?.targetCPA
              ? `목표 대비 ${calculateAchievement(summaryMetrics.avgCPA, goals.targetCPA, true).toFixed(1)}%`
              : undefined
          }
          isNegative={
            goals?.targetCPA ? summaryMetrics.avgCPA > goals.targetCPA : false
          }
        />
        <MetricCard
          label="평균 ROAS"
          value={summaryMetrics.avgROAS.toFixed(2)}
          change={
            goals?.targetROAS
              ? `목표 대비 ${calculateAchievement(summaryMetrics.avgROAS, goals.targetROAS).toFixed(1)}%`
              : undefined
          }
          isNegative={
            goals?.targetROAS
              ? summaryMetrics.avgROAS < goals.targetROAS
              : false
          }
        />
      </div>

      {/* Chart Section - ComposedChart (기존 대시보드 스타일) */}
      {features.chart && chartData.length > 0 && (
        <Card>
          <CardBody className="pt-6">
            <h3 className="text-lg font-semibold mb-4">광고비 & 전환수 추이</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                <XAxis dataKey="date" {...CHART_CONFIG.axis} />
                <YAxis
                  yAxisId="left"
                  {...CHART_CONFIG.axis}
                  tickFormatter={(value) =>
                    value >= 1000 ? `₩${(value / 1000).toFixed(0)}K` : `₩${value}`
                  }
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  {...CHART_CONFIG.axis}
                  tickFormatter={(value) => `${value}건`}
                />
                <Tooltip {...CHART_CONFIG.tooltip} />
                <Legend {...CHART_CONFIG.legend} />
                <Bar
                  yAxisId="left"
                  dataKey="spent"
                  fill="#17C964"
                  name="광고비"
                  radius={[8, 8, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="conversions"
                  stroke="#F5A524"
                  strokeWidth={3}
                  name="전환수"
                  dot={{
                    fill: "#F5A524",
                    strokeWidth: 2,
                    r: 4,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      )}

      {/* Campaign Table */}
      <Card>
        <CardBody>
          <div className="flex justify-between items-center mb-4">
            <SectionHeader
              title="캠페인 목록"
              description={`총 ${campaigns.length}개의 캠페인`}
            />

            {features.bulkActions && selectedKeys !== "all" && selectedKeys.size > 0 && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  color="success"
                  variant="flat"
                  onPress={() => handleBulkAction("activate")}
                >
                  활성화
                </Button>
                <Button
                  size="sm"
                  color="warning"
                  variant="flat"
                  onPress={() => handleBulkAction("pause")}
                >
                  일시중지
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  variant="flat"
                  onPress={() => handleBulkAction("delete")}
                >
                  삭제
                </Button>
              </div>
            )}
          </div>

          {campaigns.length === 0 ? (
            <EmptyState
              title="캠페인이 없습니다"
              description="새로운 캠페인을 생성하여 시작하세요"
            />
          ) : (
            <>
              <Table
                aria-label={`${platformName} 캠페인 목록`}
                selectionMode={features.bulkActions ? "multiple" : "none"}
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
              >
                <TableHeader>
                  <TableColumn key="rank">순위</TableColumn>
                  <TableColumn key="name">캠페인명</TableColumn>
                  <TableColumn key="type">유형</TableColumn>
                  <TableColumn key="status">상태</TableColumn>
                  <TableColumn key="spent" align="right">광고비</TableColumn>
                  <TableColumn key="conversions" align="right">전환수</TableColumn>
                  <TableColumn key="cpa" align="right">CPA</TableColumn>
                  <TableColumn key="roas" align="right">ROAS</TableColumn>
                </TableHeader>
                <TableBody emptyContent="캠페인이 없습니다">
                  {paginatedData.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>{campaign.rank || "-"}</TableCell>
                      <TableCell className="font-medium">
                        {campaign.name}
                      </TableCell>
                      <TableCell>{campaign.type || "-"}</TableCell>
                      <TableCell>
                        <Chip
                          color={getStatusColor(campaign.status)}
                          size="sm"
                          variant="flat"
                        >
                          {campaign.status === "active"
                            ? "활성"
                            : campaign.status === "paused"
                              ? "일시중지"
                              : campaign.status === "ended"
                                ? "종료"
                                : "임시저장"}
                        </Chip>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatMetricValue(campaign.spent, "currency")}
                      </TableCell>
                      <TableCell className="text-right">
                        {campaign.conversions.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatMetricValue(campaign.cpa, "currency")}
                      </TableCell>
                      <TableCell className="text-right">
                        {campaign.roas.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
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
            </>
          )}
        </CardBody>
      </Card>

      {/* Modals */}
      {features.goals && (
        <GoalSettingModal
          isOpen={isGoalModalOpen}
          onClose={() => setIsGoalModalOpen(false)}
          platform={platformKey}
          currentGoals={goals}
        />
      )}
    </div>
  );
}
