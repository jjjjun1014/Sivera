"use client";

import { useState, useMemo } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { DateRangePicker } from "@heroui/date-picker";
import { getLocalTimeZone, today } from "@internationalized/date";
import { CampaignTable, Campaign } from "@/components/tables/CampaignTable";
import { toast } from "@/utils/toast";
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
    data.push({
      date: `${month}/${day}`,
      impressions: Math.floor(25000 + Math.random() * 8000),
      clicks: Math.floor(800 + Math.random() * 400),
      conversions: Math.floor(25 + Math.random() * 15),
      cost: Math.floor(120000 + Math.random() * 40000),
    });
  }
  return data;
};

// 샘플 캠페인 데이터
const initialCampaigns = [
  {
    id: 1,
    name: "여름 세일 - 검색 광고",
    status: "active",
    hasError: false,
    budget: 500000,
    spent: 387000,
    impressions: 125000,
    clicks: 4200,
    ctr: 3.36,
    conversions: 156,
    cpc: 92,
    cpa: 2481,
    roas: 4.8,
  },
  {
    id: 2,
    name: "브랜드 키워드 캠페인",
    status: "active",
    hasError: true,
    budget: 300000,
    spent: 245000,
    impressions: 89000,
    clicks: 2800,
    ctr: 3.15,
    conversions: 92,
    cpc: 88,
    cpa: 2663,
    roas: 3.9,
  },
  {
    id: 3,
    name: "디스플레이 - 리타겟팅",
    status: "paused",
    hasError: false,
    budget: 200000,
    spent: 156000,
    impressions: 456000,
    clicks: 3900,
    ctr: 0.86,
    conversions: 78,
    cpc: 40,
    cpa: 2000,
    roas: 3.2,
  },
  {
    id: 4,
    name: "쇼핑 광고 - 신제품",
    status: "active",
    hasError: false,
    budget: 400000,
    spent: 312000,
    impressions: 67000,
    clicks: 2100,
    ctr: 3.13,
    conversions: 134,
    cpc: 149,
    cpa: 2328,
    roas: 5.6,
  },
];

export default function GoogleAdsPage() {
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [editingCampaigns, setEditingCampaigns] = useState<Set<number>>(
    new Set()
  );

  const todayDate = today(getLocalTimeZone());
  const fourteenDaysAgo = todayDate.subtract({ days: 13 });

  const [dateRange, setDateRange] = useState({
    start: fourteenDaysAgo,
    end: todayDate,
  });

  const [chartMetrics, setChartMetrics] = useState({
    cost: true,
    conversions: true,
    impressions: false,
    clicks: false,
  });

  const chartData = useMemo(() => generateChartData(), []);

  const statusColorMap: Record<
    string,
    "success" | "warning" | "danger" | "default"
  > = {
    active: "success",
    paused: "warning",
    stopped: "danger",
  };

  const statusTextMap: Record<string, string> = {
    active: "활성",
    paused: "일시정지",
    stopped: "중지됨",
  };

  const handleEditCampaign = (id: number) => {
    setEditingCampaigns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSaveCampaign = (id: number) => {
    // TODO: AWS 연동 후 실제 저장 로직 구현
    setEditingCampaigns((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleCampaignChange = (
    id: number,
    field: string,
    value: string | number | boolean
  ) => {
    setCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === id ? { ...campaign, [field]: value } : campaign
      )
    );
  };

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    handleCampaignChange(id, "status", newStatus);
    // TODO: AWS 연동 후 실제 API 호출
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Google Ads</h1>
        <p className="text-default-500">
          Google 검색 및 디스플레이 광고 성과를 관리하세요
        </p>
      </div>

      {/* Date Range Picker */}
      <Card className="mb-6">
        <CardBody>
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
            description="기본 14일 설정"
            className="max-w-xs"
          />
        </CardBody>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">총 지출</p>
            <p className="text-3xl font-bold">₩1.1M</p>
            <p className="text-xs text-success mt-1">+8.5%</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">총 전환수</p>
            <p className="text-3xl font-bold">460</p>
            <p className="text-xs text-success mt-1">+12.3%</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">평균 CPA</p>
            <p className="text-3xl font-bold">₩2,391</p>
            <p className="text-xs text-danger mt-1">+3.2%</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">평균 ROAS</p>
            <p className="text-3xl font-bold">4.4x</p>
            <p className="text-xs text-success mt-1">+5.8%</p>
          </CardBody>
        </Card>
      </div>

      {/* Chart */}
      <Card className="mb-6">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex justify-between items-center w-full">
            <h3 className="text-lg font-semibold">성과 추이</h3>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() =>
                  setChartMetrics({ ...chartMetrics, cost: !chartMetrics.cost })
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  chartMetrics.cost
                    ? "bg-success/20 text-success border border-success/50"
                    : "bg-default-100 text-default-500 border border-transparent hover:border-default-300"
                }`}
              >
                <span className="inline-block w-2 h-2 rounded-full bg-success mr-2"></span>
                광고비
              </button>
              <button
                onClick={() =>
                  setChartMetrics({
                    ...chartMetrics,
                    conversions: !chartMetrics.conversions,
                  })
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  chartMetrics.conversions
                    ? "bg-warning/20 text-warning border border-warning/50"
                    : "bg-default-100 text-default-500 border border-transparent hover:border-default-300"
                }`}
              >
                <span className="inline-block w-2 h-2 rounded-full bg-warning mr-2"></span>
                전환수
              </button>
              <button
                onClick={() =>
                  setChartMetrics({
                    ...chartMetrics,
                    impressions: !chartMetrics.impressions,
                  })
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  chartMetrics.impressions
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "bg-default-100 text-default-500 border border-transparent hover:border-default-300"
                }`}
              >
                <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                노출수
              </button>
              <button
                onClick={() =>
                  setChartMetrics({ ...chartMetrics, clicks: !chartMetrics.clicks })
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  chartMetrics.clicks
                    ? "bg-secondary/20 text-secondary border border-secondary/50"
                    : "bg-default-100 text-default-500 border border-transparent hover:border-default-300"
                }`}
              >
                <span className="inline-block w-2 h-2 rounded-full bg-secondary mr-2"></span>
                클릭수
              </button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-2">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0072F5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0072F5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                horizontal={true}
                stroke="#3f3f46"
                opacity={0.3}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={{ stroke: "#52525b" }}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={{ stroke: "#52525b" }}
                tickLine={false}
                tickFormatter={(value) =>
                  value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value
                }
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={{ stroke: "#52525b" }}
                tickLine={false}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#27272a",
                  border: "1px solid #3f3f46",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                  padding: "12px",
                }}
                labelStyle={{
                  color: "#fafafa",
                  fontWeight: 600,
                  marginBottom: "8px",
                  fontSize: "13px",
                }}
                itemStyle={{
                  color: "#e4e4e7",
                  fontSize: "12px",
                  padding: "4px 0",
                }}
                labelFormatter={(label) => `날짜: ${label}`}
                formatter={(value: number, name: string) => {
                  let formattedValue = "";
                  let unit = "";

                  if (name === "광고비") {
                    formattedValue = `₩${value.toLocaleString()}`;
                    unit = "";
                  } else if (name === "전환수" || name === "클릭수" || name === "노출수") {
                    formattedValue = value.toLocaleString();
                    unit = "회";
                  } else {
                    formattedValue = value.toLocaleString();
                  }

                  return [`${formattedValue}${unit}`, name];
                }}
              />
              {chartMetrics.impressions && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="impressions"
                  stroke="#0072F5"
                  strokeWidth={3}
                  name="노출수"
                  dot={{
                    fill: "#0072F5",
                    strokeWidth: 2,
                    r: 4,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6 }}
                />
              )}
              {chartMetrics.cost && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="cost"
                  stroke="#17C964"
                  strokeWidth={3}
                  name="광고비"
                  dot={{
                    fill: "#17C964",
                    strokeWidth: 2,
                    r: 4,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6 }}
                />
              )}
              {chartMetrics.conversions && (
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
              )}
              {chartMetrics.clicks && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="clicks"
                  stroke="#9353D3"
                  strokeWidth={3}
                  name="클릭수"
                  dot={{
                    fill: "#9353D3",
                    strokeWidth: 2,
                    r: 4,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6 }}
                  strokeDasharray="5 5"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Campaign Table */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">캠페인 목록</h3>
          <Button color="primary" radius="sm" variant="flat" size="sm">
            + 새 캠페인
          </Button>
        </CardHeader>
        <CardBody>
          <CampaignTable
            data={campaigns}
            onCampaignChange={handleCampaignChange}
            onToggleStatus={handleToggleStatus}
            editingCampaigns={editingCampaigns}
            onEditCampaign={handleEditCampaign}
            onSaveCampaign={handleSaveCampaign}
          />
        </CardBody>
      </Card>
    </div>
  );
}
