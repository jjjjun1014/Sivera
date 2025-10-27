"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { DateRangePicker } from "@heroui/date-picker";
import { Pagination } from "@heroui/pagination";
import { Checkbox } from "@heroui/checkbox";
import { useDisclosure } from "@heroui/modal";
import { Target, TrendingUp, TrendingDown } from "lucide-react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { GoalSettingModal, PlatformGoals } from "@/components/modals/GoalSettingModal";
import { platformGoalsStorage } from "@/lib/storage/platformGoals";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { platformPerformance, topCampaigns } from "@/lib/mock-data";
import { PLATFORM_COLORS } from "@/types";
import { CHART_CONFIG } from "@/lib/constants";
import { usePagination } from "@/hooks";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PLATFORM_NAME = "integrated-dashboard";

// 14일간의 샘플 차트 데이터 생성
const generateChartData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 13); // 14일 전부터

  for (let i = 0; i < 14; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    data.push({
      date: `${month}/${day}`,
      impressions: Math.floor(30000 + Math.random() * 10000),
      clicks: Math.floor(1000 + Math.random() * 500),
      conversions: Math.floor(30 + Math.random() * 20),
      cost: Math.floor(150000 + Math.random() * 50000),
      roas: parseFloat((2.5 + Math.random() * 2.5).toFixed(2)),
    });
  }
  return data;
};

// 전체 합산 데이터
const totalData = {
  totalSpent: platformPerformance.reduce((sum, p) => sum + p.spent, 0),
  totalConversions: platformPerformance.reduce((sum, p) => sum + p.conversions, 0),
  avgROAS: platformPerformance.reduce((sum, p) => sum + p.roas, 0) / platformPerformance.length,
  avgCPA: platformPerformance.reduce((sum, p) => sum + p.cpa, 0) / platformPerformance.length,
};

export default function IntegratedDashboardPage() {
  // Workspace context
  const { currentWorkspace } = useWorkspace();
  const workspaceId = currentWorkspace?.id || "default";

  const [goals, setGoals] = useState<PlatformGoals>(platformGoalsStorage.getDefaultGoals());
  const { isOpen: isGoalModalOpen, onOpen: onGoalModalOpen, onClose: onGoalModalClose } = useDisclosure();

  const todayDate = today(getLocalTimeZone());
  const fourteenDaysAgo = todayDate.subtract({ days: 13 });

  const [dateRange, setDateRange] = useState({
    start: fourteenDaysAgo,
    end: todayDate,
  });

  // 차트 지표 토글 상태
  const [chartMetrics, setChartMetrics] = useState({
    cost: true,
    conversions: true,
    roas: false,
    impressions: false,
    clicks: false,
  });

  const chartData = useMemo(() => generateChartData(), []);

  // 페이지네이션
  const { currentPage, totalPages, paginatedData: paginatedCampaigns, setCurrentPage } = usePagination(topCampaigns, {
    itemsPerPage: 5,
  });

  // localStorage에서 목표 불러오기 (사업체별)
  useEffect(() => {
    const loadedGoals = platformGoalsStorage.loadPlatform(PLATFORM_NAME, workspaceId);
    if (loadedGoals) {
      setGoals(loadedGoals);
    }
  }, [workspaceId]);

  const handleSaveGoals = (newGoals: PlatformGoals) => {
    setGoals(newGoals);
    platformGoalsStorage.savePlatform(PLATFORM_NAME, workspaceId, newGoals);
  };

  // 달성률 계산
  const calculateAchievement = (current: number, target: number): number => {
    if (target === 0) return 0;
    return Math.round((current / target) * 100);
  };

  const calculateReversedAchievement = (current: number, target: number): number => {
    if (target === 0 || current === 0) return 0;
    return Math.round((target / current) * 100);
  };

  const getAchievementColor = (rate: number): string => {
    if (rate >= 100) return "text-success";
    if (rate >= 80) return "text-warning";
    return "text-danger";
  };

  const getAchievementIcon = (rate: number) => {
    if (rate >= 100) return <TrendingUp className="w-5 h-5 text-success" />;
    if (rate >= 80) return <TrendingUp className="w-5 h-5 text-warning" />;
    return <TrendingDown className="w-5 h-5 text-danger" />;
  };

  // 각 지표별 달성률
  const budgetRate = calculateAchievement(totalData.totalSpent, goals.totalBudget);
  const conversionRate = calculateAchievement(totalData.totalConversions, goals.targetConversions);
  const cpaRate = calculateReversedAchievement(totalData.avgCPA, goals.targetCPA);
  const roasRate = calculateAchievement(totalData.avgROAS, goals.targetROAS);

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">통합 대시보드</h1>
          <p className="text-default-500">
            전체 계정의 광고 성과를 한눈에 확인하세요
          </p>
        </div>
        <div className="flex gap-3">
          <DateRangePicker
            label="기간 선택"
            radius="sm"
            variant="bordered"
            value={dateRange}
            onChange={(value) => value && setDateRange(value)}
            defaultValue={{
              start: fourteenDaysAgo,
              end: todayDate,
            }}
            className="max-w-xs"
          />
          <Button
            color="primary"
            variant="flat"
            startContent={<Target className="w-4 h-4" />}
            onPress={onGoalModalOpen}
          >
            목표 설정
          </Button>
        </div>
      </div>

      {/* 전체 계정 요약 - 4 Cards */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">전체 계정 요약</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 전체 광고비 */}
          <Card>
            <CardBody className="py-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-default-500">전체 광고비</p>
                {goals.totalBudget > 0 && getAchievementIcon(budgetRate)}
              </div>
              <p className="text-2xl font-bold mb-1">₩{totalData.totalSpent.toLocaleString()}</p>
              {goals.totalBudget > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-default-400">목표: ₩{goals.totalBudget.toLocaleString()}</p>
                  <p className={`text-sm font-semibold mt-1 ${getAchievementColor(budgetRate)}`}>
                    {budgetRate}% 달성
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* 전체 전환수 */}
          <Card>
            <CardBody className="py-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-default-500">전체 전환수</p>
                {goals.targetConversions > 0 && getAchievementIcon(conversionRate)}
              </div>
              <p className="text-2xl font-bold mb-1">{totalData.totalConversions.toLocaleString()}건</p>
              {goals.targetConversions > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-default-400">목표: {goals.targetConversions.toLocaleString()}건</p>
                  <p className={`text-sm font-semibold mt-1 ${getAchievementColor(conversionRate)}`}>
                    {conversionRate}% 달성
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* 평균 ROAS */}
          <Card>
            <CardBody className="py-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-default-500">평균 ROAS</p>
                {goals.targetROAS > 0 && getAchievementIcon(roasRate)}
              </div>
              <p className="text-2xl font-bold mb-1">{totalData.avgROAS.toFixed(1)}x</p>
              {goals.targetROAS > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-default-400">목표: {goals.targetROAS.toFixed(1)}x</p>
                  <p className={`text-sm font-semibold mt-1 ${getAchievementColor(roasRate)}`}>
                    {roasRate}% 달성
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* 평균 CPA */}
          <Card>
            <CardBody className="py-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-default-500">평균 CPA</p>
                {goals.targetCPA > 0 && getAchievementIcon(cpaRate)}
              </div>
              <p className="text-2xl font-bold mb-1">₩{Math.round(totalData.avgCPA).toLocaleString()}</p>
              {goals.targetCPA > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-default-400">목표: ₩{goals.targetCPA.toLocaleString()}</p>
                  <p className={`text-sm font-semibold mt-1 ${getAchievementColor(cpaRate)}`}>
                    {cpaRate}% 달성 {cpaRate >= 100 && "(목표 이하)"}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* 플랫폼별 성과 비교 카드 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">플랫폼별 성과</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {platformPerformance.map((platform) => (
            <Card key={platform.platform} className="border-l-4" style={{ borderLeftColor: PLATFORM_COLORS[platform.platform] }}>
              <CardBody className="py-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold" style={{ color: PLATFORM_COLORS[platform.platform] }}>
                    {platform.platform}
                  </p>
                  <span className="text-xs text-default-400">{platform.sharePercent}%</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-default-500">광고비</span>
                    <span className="text-sm font-semibold">₩{(platform.spent / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-default-500">전환수</span>
                    <span className="text-sm font-semibold">{platform.conversions}건</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-default-500">ROAS</span>
                    <span className="text-sm font-semibold text-success">{platform.roas.toFixed(1)}x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-default-500">CPA</span>
                    <span className="text-sm font-semibold">₩{platform.cpa.toLocaleString()}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* 차트 섹션 */}
      <div className="mb-6">
        {/* ComposedChart - 통합 성과 지표 */}
        <Card>
          <CardHeader className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">통합 성과 지표</h3>
            <div className="flex gap-6 flex-wrap">
              <Checkbox
                isSelected={chartMetrics.cost}
                onValueChange={(checked) =>
                  setChartMetrics({ ...chartMetrics, cost: checked })
                }
                size="sm"
              >
                <span style={{ color: "#17c964" }}>광고비</span>
              </Checkbox>
              <Checkbox
                isSelected={chartMetrics.conversions}
                onValueChange={(checked) =>
                  setChartMetrics({ ...chartMetrics, conversions: checked })
                }
                size="sm"
              >
                <span style={{ color: "#f5a524" }}>전환수</span>
              </Checkbox>
              <Checkbox
                isSelected={chartMetrics.roas}
                onValueChange={(checked) =>
                  setChartMetrics({ ...chartMetrics, roas: checked })
                }
                size="sm"
              >
                <span style={{ color: "#ff0080" }}>ROAS</span>
              </Checkbox>
              <Checkbox
                isSelected={chartMetrics.impressions}
                onValueChange={(checked) =>
                  setChartMetrics({ ...chartMetrics, impressions: checked })
                }
                size="sm"
              >
                <span style={{ color: "#0070f3" }}>노출수</span>
              </Checkbox>
              <Checkbox
                isSelected={chartMetrics.clicks}
                onValueChange={(checked) =>
                  setChartMetrics({ ...chartMetrics, clicks: checked })
                }
                size="sm"
              >
                <span style={{ color: "#7928ca" }}>클릭수</span>
              </Checkbox>
            </div>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: "#888", fontSize: 12 }}
                  axisLine={{ stroke: "#444" }}
                />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(value) => value.toLocaleString()}
                  tick={{ fill: "#888", fontSize: 12 }}
                  axisLine={{ stroke: "#444" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => value.toLocaleString()}
                  tick={{ fill: "#888", fontSize: 12 }}
                  axisLine={{ stroke: "#444" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.85)",
                    border: "1px solid #444",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value: number) => value.toLocaleString()}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="line"
                />
                {chartMetrics.cost && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="cost"
                    stroke="#17c964"
                    strokeWidth={3}
                    name="광고비"
                    dot={false}
                  />
                )}
                {chartMetrics.conversions && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="conversions"
                    stroke="#f5a524"
                    strokeWidth={3}
                    name="전환수"
                    dot={false}
                  />
                )}
                {chartMetrics.roas && (
                  <Bar
                    yAxisId="right"
                    dataKey="roas"
                    fill="#ff0080"
                    fillOpacity={0.7}
                    name="ROAS"
                    barSize={20}
                    radius={[8, 8, 0, 0]}
                  />
                )}
                {chartMetrics.impressions && (
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="impressions"
                    fill="#0070f3"
                    fillOpacity={0.3}
                    stroke="#0070f3"
                    strokeWidth={2}
                    name="노출수"
                  />
                )}
                {chartMetrics.clicks && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="clicks"
                    stroke="#7928ca"
                    strokeWidth={3}
                    name="클릭수"
                    dot={false}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* 플랫폼별 TOP 5 캠페인 */}
      <Card>
        <CardBody className="pt-6">
          <h3 className="text-lg font-semibold mb-4">전체 플랫폼 TOP 10 캠페인 (전환수 기준)</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-divider">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-default-700">순위</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-default-700">플랫폼</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-default-700">캠페인명</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-default-700">광고비</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-default-700">전환수</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-default-700">CPA</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-default-700">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCampaigns.map((campaign) => (
                  <tr key={campaign.rank} className="border-b border-divider hover:bg-default-100 transition-colors">
                    <td className="py-3 px-4 text-sm">{campaign.rank}</td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: `${PLATFORM_COLORS[campaign.platform]}20`,
                          color: PLATFORM_COLORS[campaign.platform],
                        }}
                      >
                        {campaign.platform.replace(" Ads", "")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">{campaign.name}</td>
                    <td className="py-3 px-4 text-sm text-right">₩{campaign.spent.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right font-semibold">{campaign.conversions}건</td>
                    <td className="py-3 px-4 text-sm text-right">₩{campaign.cpa.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right">{campaign.roas.toFixed(1)}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={setCurrentPage}
                showControls
                color="primary"
              />
            </div>
          )}
        </CardBody>
      </Card>

      {/* Goal Setting Modal */}
      <GoalSettingModal
        isOpen={isGoalModalOpen}
        onClose={onGoalModalClose}
        platformName="통합 계정"
        workspaceId={workspaceId}
        currentGoals={goals}
        onSave={handleSaveGoals}
      />
    </div>
  );
}
