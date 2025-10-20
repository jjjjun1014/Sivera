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
import { platformPerformance, topCampaigns } from "@/lib/mock-data";
import { PLATFORM_COLORS } from "@/types";
import { CHART_CONFIG } from "@/lib/constants";
import { usePagination } from "@/hooks";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PLATFORM_NAME = "integrated-dashboard";

// 파이 차트용 데이터
const pieChartData = platformPerformance.map((p) => ({
  name: p.platform,
  value: p.spent,
}));

// 막대 차트용 데이터
const barChartData = platformPerformance.map((p) => ({
  platform: p.platform.replace(" Ads", ""),
  전환수: p.conversions,
  ROAS: p.roas,
}));

// 전체 합산 데이터
const totalData = {
  totalSpent: platformPerformance.reduce((sum, p) => sum + p.spent, 0),
  totalConversions: platformPerformance.reduce((sum, p) => sum + p.conversions, 0),
  avgROAS: platformPerformance.reduce((sum, p) => sum + p.roas, 0) / platformPerformance.length,
  avgCPA: platformPerformance.reduce((sum, p) => sum + p.cpa, 0) / platformPerformance.length,
};

export default function IntegratedDashboardPage() {
  const [goals, setGoals] = useState<PlatformGoals>(platformGoalsStorage.getDefaultGoals());
  const { isOpen: isGoalModalOpen, onOpen: onGoalModalOpen, onClose: onGoalModalClose } = useDisclosure();

  const todayDate = today(getLocalTimeZone());
  const fourteenDaysAgo = todayDate.subtract({ days: 13 });

  const [dateRange, setDateRange] = useState({
    start: fourteenDaysAgo,
    end: todayDate,
  });

  // 페이지네이션
  const { currentPage, totalPages, paginatedData: paginatedCampaigns, setCurrentPage } = usePagination(topCampaigns, {
    itemsPerPage: 5,
  });

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 파이 차트 - 광고비 비중 */}
        <Card>
          <CardBody className="pt-6">
            <h3 className="text-lg font-semibold mb-4">플랫폼별 광고비 비중</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name.replace(" Ads", "")}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={5}
                  cornerRadius={10}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip
                  {...CHART_CONFIG.tooltip}
                  formatter={(value: number) => [`₩${value.toLocaleString()}`, "광고비"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* 막대 차트 - 플랫폼별 전환수 & ROAS */}
        <Card>
          <CardBody className="pt-6">
            <h3 className="text-lg font-semibold mb-4">플랫폼별 전환수 & ROAS</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={barChartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                <XAxis dataKey="platform" {...CHART_CONFIG.axis} />
                <YAxis
                  yAxisId="left"
                  {...CHART_CONFIG.axis}
                  label={{ value: "전환수", angle: -90, position: "insideLeft", fill: CHART_CONFIG.axis.tick.fill }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  {...CHART_CONFIG.axis}
                  label={{ value: "ROAS", angle: 90, position: "insideRight", fill: CHART_CONFIG.axis.tick.fill }}
                />
                <Tooltip {...CHART_CONFIG.tooltip} />
                <Legend {...CHART_CONFIG.legend} />
                <Bar yAxisId="left" dataKey="전환수" fill="#17C964" radius={[8, 8, 0, 0]} />
                <Bar yAxisId="right" dataKey="ROAS" fill="#F5A524" radius={[8, 8, 0, 0]} />
              </BarChart>
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
        currentGoals={goals}
        onSave={handleSaveGoals}
      />
    </div>
  );
}
