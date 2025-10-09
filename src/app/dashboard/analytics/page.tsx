"use client";

import { useState, useMemo } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { DateRangePicker } from "@heroui/date-picker";
import { Progress } from "@heroui/progress";
import { Checkbox } from "@heroui/checkbox";
import { getLocalTimeZone, today } from "@internationalized/date";
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
    });
  }
  return data;
};

// 샘플 데이터
const campaignData = [
  {
    id: 1,
    name: "여름 세일 프로모션",
    platform: "Google Ads",
    status: "active",
    impressions: 125000,
    clicks: 4200,
    conversions: 156,
    cost: 850000,
    ctr: 3.36,
    cpc: 202,
    roas: 4.2,
  },
  {
    id: 2,
    name: "신제품 런칭",
    platform: "Meta Ads",
    status: "active",
    impressions: 89000,
    clicks: 2800,
    conversions: 92,
    cost: 620000,
    ctr: 3.15,
    cpc: 221,
    roas: 3.8,
  },
  {
    id: 3,
    name: "브랜드 인지도 향상",
    platform: "TikTok Ads",
    status: "paused",
    impressions: 156000,
    clicks: 3900,
    conversions: 78,
    cost: 480000,
    ctr: 2.5,
    cpc: 123,
    roas: 2.9,
  },
  {
    id: 4,
    name: "재고 정리 특가",
    platform: "Google Ads",
    status: "active",
    impressions: 67000,
    clicks: 2100,
    conversions: 134,
    cost: 390000,
    ctr: 3.13,
    cpc: 186,
    roas: 5.1,
  },
  {
    id: 5,
    name: "가을 신상품 홍보",
    platform: "Meta Ads",
    status: "review",
    impressions: 45000,
    clicks: 1500,
    conversions: 42,
    cost: 280000,
    ctr: 3.33,
    cpc: 187,
    roas: 3.2,
  },
];

export default function AnalyticsPage() {
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));

  // 기본값: 오늘부터 14일 전
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
    impressions: false,
    clicks: false,
  });

  const chartData = useMemo(() => generateChartData(), []);

  const statusColorMap: Record<string, "success" | "warning" | "danger" | "default"> = {
    active: "success",
    paused: "warning",
    review: "default",
  };

  const statusTextMap: Record<string, string> = {
    active: "활성",
    paused: "일시정지",
    review: "검토중",
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">통합 분석</h1>
        <p className="text-default-500">
          모든 플랫폼의 광고 성과를 한눈에 확인하세요
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            />
            <Select
              label="플랫폼"
              placeholder="전체 플랫폼"
              radius="sm"
              variant="bordered"
            >
              <SelectItem key="all">전체</SelectItem>
              <SelectItem key="google">Google Ads</SelectItem>
              <SelectItem key="meta">Meta Ads</SelectItem>
              <SelectItem key="tiktok">TikTok Ads</SelectItem>
            </Select>
            <Select
              label="상태"
              placeholder="전체 상태"
              radius="sm"
              variant="bordered"
            >
              <SelectItem key="all">전체</SelectItem>
              <SelectItem key="active">활성</SelectItem>
              <SelectItem key="paused">일시정지</SelectItem>
              <SelectItem key="review">검토중</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">총 노출수</p>
            <p className="text-3xl font-bold">482K</p>
            <p className="text-xs text-success mt-1">+12.5%</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">총 클릭수</p>
            <p className="text-3xl font-bold">14.5K</p>
            <p className="text-xs text-success mt-1">+8.3%</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">전환수</p>
            <p className="text-3xl font-bold">502</p>
            <p className="text-xs text-success mt-1">+15.2%</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">평균 ROAS</p>
            <p className="text-3xl font-bold">3.8x</p>
            <p className="text-xs text-danger mt-1">-2.1%</p>
          </CardBody>
        </Card>
      </div>

      {/* Combined Chart */}
      <Card className="mb-6">
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
          <ResponsiveContainer width="100%" height={400}>
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
              <Tooltip
                formatter={(value: number) => value.toLocaleString()}
              />
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
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="impressions"
                  fill="#0070f3"
                  fillOpacity={0.3}
                  stroke="#0070f3"
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

      {/* Data Table */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">캠페인 성과</h3>
          <Button color="primary" radius="sm" variant="flat" size="sm">
            내보내기
          </Button>
        </CardHeader>
        <CardBody>
          <Table
            aria-label="캠페인 성과 데이터"
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys as any}
          >
            <TableHeader>
              <TableColumn>캠페인명</TableColumn>
              <TableColumn>플랫폼</TableColumn>
              <TableColumn>상태</TableColumn>
              <TableColumn align="end">노출수</TableColumn>
              <TableColumn align="end">클릭수</TableColumn>
              <TableColumn align="end">전환수</TableColumn>
              <TableColumn align="end">비용</TableColumn>
              <TableColumn align="end">CTR</TableColumn>
              <TableColumn align="end">CPC</TableColumn>
              <TableColumn align="end">ROAS</TableColumn>
            </TableHeader>
            <TableBody>
              {campaignData.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-xs text-default-500">ID: {campaign.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>{campaign.platform}</TableCell>
                  <TableCell>
                    <Chip
                      color={statusColorMap[campaign.status]}
                      size="sm"
                      variant="flat"
                    >
                      {statusTextMap[campaign.status]}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-right">
                    {campaign.impressions.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {campaign.clicks.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {campaign.conversions}
                  </TableCell>
                  <TableCell className="text-right">
                    ₩{(campaign.cost / 1000).toFixed(1)}K
                  </TableCell>
                  <TableCell className="text-right">{campaign.ctr}%</TableCell>
                  <TableCell className="text-right">₩{campaign.cpc}</TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-success">
                      {campaign.roas}x
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 text-sm text-default-500">
            선택됨: {selectedKeys === "all" ? campaignData.length : selectedKeys.size}개
          </div>
        </CardBody>
      </Card>

      {/* Platform Performance */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Google Ads</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">전환율</span>
                <span className="text-sm font-semibold">3.2%</span>
              </div>
              <Progress value={64} color="primary" size="sm" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">ROI</span>
                <span className="text-sm font-semibold">4.5x</span>
              </div>
              <Progress value={90} color="success" size="sm" />
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs text-default-500">이번 달 지출</p>
              <p className="text-2xl font-bold">₩1.24M</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Meta Ads</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">전환율</span>
                <span className="text-sm font-semibold">2.8%</span>
              </div>
              <Progress value={56} color="primary" size="sm" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">ROI</span>
                <span className="text-sm font-semibold">3.5x</span>
              </div>
              <Progress value={70} color="success" size="sm" />
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs text-default-500">이번 달 지출</p>
              <p className="text-2xl font-bold">₩900K</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">TikTok Ads</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">전환율</span>
                <span className="text-sm font-semibold">2.1%</span>
              </div>
              <Progress value={42} color="primary" size="sm" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">ROI</span>
                <span className="text-sm font-semibold">2.9x</span>
              </div>
              <Progress value={58} color="warning" size="sm" />
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs text-default-500">이번 달 지출</p>
              <p className="text-2xl font-bold">₩480K</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
