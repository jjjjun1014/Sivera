"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { DateRangePicker } from "@heroui/date-picker";
import { Pagination } from "@heroui/pagination";
import { useDisclosure } from "@heroui/modal";
import { Target, TrendingUp, TrendingDown } from "lucide-react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { GoalSettingModal, PlatformGoals } from "@/components/modals/GoalSettingModal";
import { platformGoalsStorage } from "@/lib/storage/platformGoals";
import { tiktokAdsCampaigns } from "@/lib/mock-data";
import { CHART_CONFIG } from "@/lib/constants";
import { usePagination } from "@/hooks";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PLATFORM_NAME = "tiktok-ads-dashboard";

// 14일간의 샘플 차트 데이터 생성
const generateChartData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 13);

  for (let i = 0; i < 14; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const spent = Math.floor(120000 + Math.random() * 40000);
    const conversions = Math.floor(25 + Math.random() * 15);

    data.push({
      date: `${month}/${day}`,
      spent,
      conversions,
    });
  }
  return data;
};

// 샘플 총합 데이터
const sampleTotalData = {
  totalSpent: 1234567,
  totalBudget: 1500000,
  totalConversions: 856,
  avgCPA: 2850,
  avgROAS: 3.2,
  avgCTR: 2.38,
  impressionShare: 67,
};

export default function GoogleAdsDashboardPage() {
  const [goals, setGoals] = useState<PlatformGoals>(platformGoalsStorage.getDefaultGoals());
  const { isOpen: isGoalModalOpen, onOpen: onGoalModalOpen, onClose: onGoalModalClose } = useDisclosure();

  const todayDate = today(getLocalTimeZone());
  const fourteenDaysAgo = todayDate.subtract({ days: 13 });

  const [dateRange, setDateRange] = useState({
    start: fourteenDaysAgo,
    end: todayDate,
  });

  // 페이지네이션
  const { currentPage, totalPages, paginatedData: paginatedCampaigns, setCurrentPage } = usePagination(
    tiktokAdsCampaigns,
    { itemsPerPage: 5 }
  );

  // localStorage에서 목표 불러오기
  useEffect(() => {
    const loadedGoals = platformGoalsStorage.loadPlatform(PLATFORM_NAME);
    if (loadedGoals) {
      setGoals(loadedGoals);
    }
  }, []);

  const handleSaveGoals = (newGoals: PlatformGoals) => {
    setGoals(newGoals);
    platformGoalsStorage.savePlatform(PLATFORM_NAME, newGoals);
  };

  const chartData = useMemo(() => generateChartData(), []);

  // 달성률 계산 (목표 대비 현재 값)
  const calculateAchievement = (current: number, target: number): number => {
    if (target === 0) return 0;
    return Math.round((current / target) * 100);
  };

  // 역계산 달성률 (낮을수록 좋은 지표: CPA)
  const calculateReversedAchievement = (current: number, target: number): number => {
    if (target === 0 || current === 0) return 0;
    return Math.round((target / current) * 100);
  };

  // 달성률 색상
  const getAchievementColor = (rate: number): string => {
    if (rate >= 100) return "text-success";
    if (rate >= 80) return "text-warning";
    return "text-danger";
  };

  // 달성률 아이콘
  const getAchievementIcon = (rate: number) => {
    if (rate >= 100) return <TrendingUp className="w-5 h-5 text-success" />;
    if (rate >= 80) return <TrendingUp className="w-5 h-5 text-warning" />;
    return <TrendingDown className="w-5 h-5 text-danger" />;
  };

  // 각 지표별 달성률 계산
  const budgetRate = calculateAchievement(sampleTotalData.totalSpent, goals.totalBudget);
  const conversionRate = calculateAchievement(sampleTotalData.totalConversions, goals.targetConversions);
  const cpaRate = calculateReversedAchievement(sampleTotalData.avgCPA, goals.targetCPA);
  const roasRate = calculateAchievement(sampleTotalData.avgROAS, goals.targetROAS);
  const ctrRate = calculateAchievement(sampleTotalData.avgCTR, goals.targetCTR);
  const impressionShareRate = calculateAchievement(sampleTotalData.impressionShare, goals.targetImpressionShare);

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">TikTok Ads - 대시보드</h1>
          <p className="text-default-500">
            전체 TikTok 광고 성과를 한눈에 확인하세요
          </p>
        </div>
        <div className="flex gap-3">
          <DateRangePicker
            label="기간 선택"
            radius="sm"
            variant="bordered"
            value={dateRange}
            onChange={setDateRange}
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

      {/* Core Metrics - 6 Cards */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 총 예산 소진 */}
          <Card>
            <CardBody className="py-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-default-500">총 예산 소진</p>
                {goals.totalBudget > 0 && getAchievementIcon(budgetRate)}
              </div>
              <p className="text-2xl font-bold mb-1">₩{sampleTotalData.totalSpent.toLocaleString()}</p>
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

          {/* 총 전환수 */}
          <Card>
            <CardBody className="py-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-default-500">총 전환수</p>
                {goals.targetConversions > 0 && getAchievementIcon(conversionRate)}
              </div>
              <p className="text-2xl font-bold mb-1">{sampleTotalData.totalConversions.toLocaleString()}건</p>
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

          {/* 평균 CPA */}
          <Card>
            <CardBody className="py-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-default-500">평균 CPA</p>
                {goals.targetCPA > 0 && getAchievementIcon(cpaRate)}
              </div>
              <p className="text-2xl font-bold mb-1">₩{sampleTotalData.avgCPA.toLocaleString()}</p>
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

          {/* 평균 ROAS */}
          <Card>
            <CardBody className="py-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-default-500">평균 ROAS</p>
                {goals.targetROAS > 0 && getAchievementIcon(roasRate)}
              </div>
              <p className="text-2xl font-bold mb-1">{sampleTotalData.avgROAS.toFixed(1)}x</p>
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

          {/* 평균 CTR */}
          <Card>
            <CardBody className="py-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-default-500">평균 CTR</p>
                {goals.targetCTR > 0 && getAchievementIcon(ctrRate)}
              </div>
              <p className="text-2xl font-bold mb-1">{sampleTotalData.avgCTR.toFixed(2)}%</p>
              {goals.targetCTR > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-default-400">목표: {goals.targetCTR.toFixed(2)}%</p>
                  <p className={`text-sm font-semibold mt-1 ${getAchievementColor(ctrRate)}`}>
                    {ctrRate}% 달성
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* 노출 점유율 */}
          <Card>
            <CardBody className="py-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-default-500">노출 점유율</p>
                {goals.targetImpressionShare > 0 && getAchievementIcon(impressionShareRate)}
              </div>
              <p className="text-2xl font-bold mb-1">{sampleTotalData.impressionShare}%</p>
              {goals.targetImpressionShare > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-default-400">목표: {goals.targetImpressionShare}%</p>
                  <p className={`text-sm font-semibold mt-1 ${getAchievementColor(impressionShareRate)}`}>
                    {impressionShareRate}% 달성
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Chart - Spend & Conversions */}
      <Card className="mb-6">
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

      {/* TOP 10 Campaigns Table */}
      <Card>
        <CardBody className="pt-6">
          <h3 className="text-lg font-semibold mb-4">TOP 10 캠페인 (전환수 기준)</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-divider">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-default-700">순위</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-default-700">캠페인명</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-default-700">유형</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-default-700">예산 소진율</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-default-700">전환수</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-default-700">CPA</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-default-700">ROAS</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-default-700">상태</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCampaigns.map((campaign) => (
                  <tr key={campaign.rank} className="border-b border-divider hover:bg-default-100 transition-colors">
                    <td className="py-3 px-4 text-sm">{campaign.rank}</td>
                    <td className="py-3 px-4 text-sm font-medium">{campaign.name}</td>
                    <td className="py-3 px-4 text-sm text-default-500">{campaign.type}</td>
                    <td className="py-3 px-4 text-sm text-right">{campaign.spentRate}</td>
                    <td className="py-3 px-4 text-sm text-right font-semibold">{campaign.conversions}건</td>
                    <td className="py-3 px-4 text-sm text-right">₩{campaign.cpa.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right">{campaign.roas.toFixed(1)}x</td>
                    <td className="py-3 px-4 text-sm text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${campaign.status === "활성" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"}`}>
                        {campaign.status}
                      </span>
                    </td>
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
        platformName="TikTok Ads"
        currentGoals={goals}
        onSave={handleSaveGoals}
      />
    </div>
  );
}
