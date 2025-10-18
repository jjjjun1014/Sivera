"use client";

import { useState, useMemo } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { DateRangePicker } from "@heroui/date-picker";
import { useDisclosure } from "@heroui/modal";
import { getLocalTimeZone, today } from "@internationalized/date";
import { CampaignTable, Campaign } from "@/components/tables/CampaignTable";
import { MetricSelectorModal, MetricOption } from "@/components/modals/MetricSelectorModal";
import { Settings2 } from "lucide-react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const generateChartData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 13);

  for (let i = 0; i < 14; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const impressions = Math.floor(28000 + Math.random() * 10000);
    const clicks = Math.floor(900 + Math.random() * 500);
    const conversions = Math.floor(30 + Math.random() * 18);
    const cost = Math.floor(110000 + Math.random() * 45000);
    const budget = Math.floor(140000 + Math.random() * 60000);
    const spent = Math.floor(cost * (0.7 + Math.random() * 0.3));

    data.push({
      date: `${month}/${day}`,
      impressions,
      clicks,
      conversions,
      cost,
      budget,
      spent,
      ctr: ((clicks / impressions) * 100),
      cpc: Math.floor(cost / clicks),
      cpa: Math.floor(cost / conversions),
      roas: (2.5 + Math.random() * 3),
    });
  }
  return data;
};

const initialCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Instagram 스토리 - 여름 컬렉션",
    status: "active",
    hasError: false,
    budget: 600000,
    spent: 478000,
    impressions: 235000,
    clicks: 5200,
    ctr: 2.21,
    conversions: 178,
    cpc: 92,
    cpa: 2685,
    roas: 4.2,
  },
  {
    id: 2,
    name: "Facebook 피드 - 브랜드 인지도",
    status: "active",
    hasError: false,
    budget: 400000,
    spent: 342000,
    impressions: 189000,
    clicks: 3800,
    ctr: 2.01,
    conversions: 124,
    cpc: 90,
    cpa: 2758,
    roas: 3.8,
  },
  {
    id: 3,
    name: "Messenger 광고 - 리타겟팅",
    status: "paused",
    hasError: false,
    budget: 250000,
    spent: 198000,
    impressions: 156000,
    clicks: 2900,
    ctr: 1.86,
    conversions: 89,
    cpc: 68,
    cpa: 2225,
    roas: 3.5,
  },
];

export default function MetaAdsPage() {
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

  const { isOpen: isMetricModalOpen, onOpen: onMetricModalOpen, onClose: onMetricModalClose } = useDisclosure();

  const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(
    new Set(["cost", "conversions"])
  );

  const availableMetrics: MetricOption[] = [
    { key: "cost", label: "광고비", color: "#17C964", category: "cost" },
    { key: "budget", label: "예산", color: "#10B981", category: "cost" },
    { key: "spent", label: "소진", color: "#F59E0B", category: "cost" },
    { key: "impressions", label: "노출수", color: "#0072F5", category: "performance" },
    { key: "clicks", label: "클릭수", color: "#9353D3", category: "performance" },
    { key: "conversions", label: "전환수", color: "#F5A524", category: "performance" },
    { key: "ctr", label: "CTR", color: "#F31260", category: "efficiency" },
    { key: "cpc", label: "CPC", color: "#06B7DB", category: "efficiency" },
    { key: "cpa", label: "CPA", color: "#EC4899", category: "efficiency" },
    { key: "roas", label: "ROAS", color: "#8B5CF6", category: "efficiency" },
  ];

  const chartData = useMemo(() => generateChartData(), []);

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
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Meta Ads</h1>
        <p className="text-default-500">
          Facebook, Instagram, Messenger 광고 성과를 관리하세요
        </p>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">총 지출</p>
            <p className="text-3xl font-bold">₩1.02M</p>
            <p className="text-xs text-success mt-1">+7.2%</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">총 전환수</p>
            <p className="text-3xl font-bold">391</p>
            <p className="text-xs text-success mt-1">+10.8%</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">평균 CPA</p>
            <p className="text-3xl font-bold">₩2,608</p>
            <p className="text-xs text-danger mt-1">+4.1%</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">평균 ROAS</p>
            <p className="text-3xl font-bold">3.8x</p>
            <p className="text-xs text-success mt-1">+4.5%</p>
          </CardBody>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex justify-between items-center w-full">
            <h3 className="text-lg font-semibold">성과 추이</h3>
            <Button
              variant="flat"
              size="sm"
              startContent={<Settings2 className="w-4 h-4" />}
              onPress={onMetricModalOpen}
            >
              차트 메트릭 선택 ({selectedMetrics.size})
            </Button>
          </div>
        </CardHeader>
        <CardBody className="pt-2">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
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
                  const metric = availableMetrics.find((m) => m.label === name);
                  if (!metric) return [value.toLocaleString(), name];

                  let formattedValue = "";
                  let unit = "";

                  switch (metric.key) {
                    case "cost":
                    case "budget":
                    case "spent":
                    case "cpc":
                    case "cpa":
                      formattedValue = `₩${value.toLocaleString()}`;
                      break;
                    case "conversions":
                    case "clicks":
                    case "impressions":
                      formattedValue = value.toLocaleString();
                      unit = "회";
                      break;
                    case "ctr":
                      formattedValue = value.toFixed(2);
                      unit = "%";
                      break;
                    case "roas":
                      formattedValue = value.toFixed(1);
                      unit = "x";
                      break;
                    default:
                      formattedValue = value.toLocaleString();
                  }

                  return [`${formattedValue}${unit}`, name];
                }}
              />
              {Array.from(selectedMetrics).map((metricKey) => {
                const metric = availableMetrics.find((m) => m.key === metricKey);
                if (!metric) return null;

                return (
                  <Line
                    key={metricKey}
                    yAxisId="left"
                    type="monotone"
                    dataKey={metricKey}
                    stroke={metric.color}
                    strokeWidth={3}
                    name={metric.label}
                    dot={{
                      fill: metric.color,
                      strokeWidth: 2,
                      r: 4,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 6 }}
                  />
                );
              })}
            </ComposedChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

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

      <MetricSelectorModal
        isOpen={isMetricModalOpen}
        onClose={onMetricModalClose}
        metrics={availableMetrics}
        selectedMetrics={selectedMetrics}
        onApply={setSelectedMetrics}
        maxSelection={4}
      />
    </div>
  );
}
