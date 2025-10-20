"use client";

import { useState, useMemo } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { DateRangePicker } from "@heroui/date-picker";
import { getLocalTimeZone, today } from "@internationalized/date";
import { CampaignTable, Campaign } from "@/components/tables/CampaignTable";
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
      impressions: Math.floor(32000 + Math.random() * 12000),
      clicks: Math.floor(1100 + Math.random() * 600),
      conversions: Math.floor(40 + Math.random() * 25),
      cost: Math.floor(130000 + Math.random() * 50000),
    });
  }
  return data;
};

const initialCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Advantage+ Shopping - 봄 신상품",
    status: "active",
    hasError: false,
    budget: 800000,
    spent: 658000,
    impressions: 312000,
    clicks: 6800,
    ctr: 2.18,
    conversions: 245,
    cpc: 97,
    cpa: 2686,
    roas: 4.8,
  },
  {
    id: 2,
    name: "Advantage+ App - 리타겟팅",
    status: "active",
    hasError: false,
    budget: 500000,
    spent: 423000,
    impressions: 198000,
    clicks: 4200,
    ctr: 2.12,
    conversions: 156,
    cpc: 101,
    cpa: 2712,
    roas: 4.2,
  },
];

export default function MetaAdsAdvantagePlusPage() {
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
        <h1 className="text-3xl font-bold mb-2">Meta Ads - Advantage+</h1>
        <p className="text-default-500">
          AI 기반 자동 최적화 광고 성과를 관리하세요
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
            <p className="text-3xl font-bold">₩1.08M</p>
            <p className="text-xs text-success mt-1">+12.5%</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">총 전환수</p>
            <p className="text-3xl font-bold">401</p>
            <p className="text-xs text-success mt-1">+15.2%</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">평균 CPA</p>
            <p className="text-3xl font-bold">₩2,694</p>
            <p className="text-xs text-danger mt-1">+2.8%</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">평균 ROAS</p>
            <p className="text-3xl font-bold">4.5x</p>
            <p className="text-xs text-success mt-1">+8.3%</p>
          </CardBody>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">성과 추이</h3>
          <div className="flex gap-6 flex-wrap">
            <Checkbox
              isSelected={chartMetrics.cost}
              onValueChange={(checked) =>
                setChartMetrics({ ...chartMetrics, cost: checked })
              }
              size="sm"
            >
              광고비
            </Checkbox>
            <Checkbox
              isSelected={chartMetrics.conversions}
              onValueChange={(checked) =>
                setChartMetrics({ ...chartMetrics, conversions: checked })
              }
              size="sm"
            >
              전환수
            </Checkbox>
            <Checkbox
              isSelected={chartMetrics.impressions}
              onValueChange={(checked) =>
                setChartMetrics({ ...chartMetrics, impressions: checked })
              }
              size="sm"
            >
              노출수
            </Checkbox>
            <Checkbox
              isSelected={chartMetrics.clicks}
              onValueChange={(checked) =>
                setChartMetrics({ ...chartMetrics, clicks: checked })
              }
              size="sm"
            >
              클릭수
            </Checkbox>
          </div>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis
                yAxisId="left"
                tickFormatter={(value) => value.toLocaleString()}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip formatter={(value: number) => value.toLocaleString()} />
              <Legend />
              {chartMetrics.cost && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="cost"
                  stroke="#17c964"
                  strokeWidth={2}
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
                  strokeWidth={2}
                  name="전환수"
                  dot={false}
                />
              )}
              {chartMetrics.impressions && (
                <Bar
                  yAxisId="left"
                  dataKey="impressions"
                  fill="#0070f3"
                  fillOpacity={0.6}
                  name="노출수"
                />
              )}
              {chartMetrics.clicks && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="clicks"
                  stroke="#7928ca"
                  strokeWidth={2}
                  name="클릭수"
                  dot={false}
                />
              )}
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
    </div>
  );
}
