"use client";

import { useState, useMemo } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { Switch } from "@heroui/switch";
import { DateRangePicker } from "@heroui/date-picker";
import { getLocalTimeZone, today } from "@internationalized/date";
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

      {/* Campaign Table */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">캠페인 목록</h3>
          <Button color="primary" radius="sm" variant="flat" size="sm">
            + 새 캠페인
          </Button>
        </CardHeader>
        <CardBody>
          <Table
            aria-label="Google Ads 캠페인"
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys as any}
          >
            <TableHeader>
              <TableColumn>캠페인명</TableColumn>
              <TableColumn>상태</TableColumn>
              <TableColumn align="end">예산</TableColumn>
              <TableColumn align="end">지출</TableColumn>
              <TableColumn align="end">노출수</TableColumn>
              <TableColumn align="end">클릭수</TableColumn>
              <TableColumn align="end">CTR</TableColumn>
              <TableColumn align="end">전환수</TableColumn>
              <TableColumn align="end">CPC</TableColumn>
              <TableColumn align="end">CPA</TableColumn>
              <TableColumn align="end">ROAS</TableColumn>
              <TableColumn align="center">작업</TableColumn>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => {
                const isEditing = editingCampaigns.has(campaign.id);
                return (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          size="sm"
                          value={campaign.name}
                          onChange={(e) =>
                            handleCampaignChange(
                              campaign.id,
                              "name",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-xs text-default-500">
                            ID: {campaign.id}
                          </p>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          size="sm"
                          isSelected={campaign.status === "active"}
                          onValueChange={() =>
                            handleToggleStatus(campaign.id, campaign.status)
                          }
                          color="success"
                        />
                        {campaign.hasError && (
                          <Chip color="danger" size="sm" variant="flat">
                            오류!
                          </Chip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <Input
                          size="sm"
                          type="number"
                          value={campaign.budget.toString()}
                          onChange={(e) =>
                            handleCampaignChange(
                              campaign.id,
                              "budget",
                              parseInt(e.target.value)
                            )
                          }
                        />
                      ) : (
                        `₩${(campaign.budget / 1000).toFixed(0)}K`
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      ₩{(campaign.spent / 1000).toFixed(0)}K
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.impressions.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {campaign.clicks.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">{campaign.ctr}%</TableCell>
                    <TableCell className="text-right">
                      {campaign.conversions}
                    </TableCell>
                    <TableCell className="text-right">₩{campaign.cpc}</TableCell>
                    <TableCell className="text-right">
                      ₩{campaign.cpa.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-success">
                        {campaign.roas}x
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        {isEditing ? (
                          <Button
                            size="sm"
                            color="primary"
                            variant="flat"
                            onPress={() => handleSaveCampaign(campaign.id)}
                          >
                            저장
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="light"
                            onPress={() => handleEditCampaign(campaign.id)}
                          >
                            수정
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="mt-4 text-sm text-default-500">
            선택됨: {selectedKeys === "all" ? campaigns.length : selectedKeys.size}개
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
