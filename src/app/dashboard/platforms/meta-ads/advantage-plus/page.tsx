"use client";

import { useState, useMemo } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { DateRangePicker } from "@heroui/date-picker";
import { Tabs, Tab } from "@heroui/tabs";
import { getLocalTimeZone, today } from "@internationalized/date";
import { CampaignTable, Campaign } from "@/components/tables/CampaignTable";
import { AdTable } from "@/components/tables/AdTable";
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
import type { AdGroup, Ad } from "@/types/campaign";
import { AIChatAssistant } from "@/components/features/AIChatAssistant";
import { CreateCampaignModal } from "@/components/modals/CreateCampaignModal";
import { useDisclosure } from "@heroui/modal";

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

const initialAds: Ad[] = [
  {
    id: 1,
    campaignId: 1,
    campaignName: "Advantage+ Shopping - 봄 신상품",
    adGroupId: 0,
    adGroupName: "자동 최적화",
    name: "자동 생성 광고 A",
    type: "image",
    status: "active",
    spent: 328000,
    impressions: 156000,
    clicks: 3400,
    ctr: 2.18,
    conversions: 122,
    cpc: 96,
    cpa: 2689,
    roas: 4.9,
  },
  {
    id: 2,
    campaignId: 1,
    campaignName: "Advantage+ Shopping - 봄 신상품",
    adGroupId: 0,
    adGroupName: "자동 최적화",
    name: "자동 생성 광고 B",
    type: "video",
    status: "active",
    spent: 330000,
    impressions: 156000,
    clicks: 3400,
    ctr: 2.18,
    conversions: 123,
    cpc: 97,
    cpa: 2683,
    roas: 4.7,
  },
  {
    id: 3,
    campaignId: 2,
    campaignName: "Advantage+ App - 리타겟팅",
    adGroupId: 0,
    adGroupName: "자동 최적화",
    name: "자동 생성 광고 C",
    type: "carousel",
    status: "active",
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

export default function MetaAdsStandardPage() {
  const { isOpen: isCreateModalOpen, onOpen: onCreateModalOpen, onClose: onCreateModalClose } = useDisclosure();
  const [selectedTab, setSelectedTab] = useState("campaigns");
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [ads, setAds] = useState(initialAds);

  // Filter state (Advantage+는 광고 세트 없음)
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);

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

  // Campaign handlers
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

  const handleToggleCampaignStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    handleCampaignChange(id, "status", newStatus);
  };

  // Ad handlers
  const handleAdChange = (id: number | string, field: string, value: any) => {
    setAds((prev) =>
      prev.map((ad) => (ad.id === id ? { ...ad, [field]: value } : ad))
    );
  };

  const handleToggleAdStatus = (id: number | string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    handleAdChange(id, "status", newStatus);
  };

  // Filter handlers
  const handleCampaignClick = (campaignId: number) => {
    setSelectedCampaignId(campaignId);
    setSelectedTab("ads");
  };

  const handleClearFilter = () => {
    setSelectedCampaignId(null);
  };

  // Filtered data
  const filteredAds = useMemo(() => {
    if (!selectedCampaignId) return ads;
    return ads.filter((ad) => ad.campaignId === selectedCampaignId);
  }, [ads, selectedCampaignId]);

  const selectedCampaignName = useMemo(() => {
    if (!selectedCampaignId) return null;
    return campaigns.find((c) => c.id === selectedCampaignId)?.name || null;
  }, [campaigns, selectedCampaignId]);


  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Meta Ads - Advantage+</h1>
        <p className="text-default-500">
          AI 기반 자동 최적화 캠페인으로 최고의 성과를 달성하세요
        </p>
      </div>

      <Card className="mb-6">
        <CardBody>
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
            <p className="text-xs text-success mt-1">+12.4%</p>
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
            <p className="text-xs text-success mt-1">+8.2%</p>
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
        <CardHeader>
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            radius="sm"
            variant="underlined"
            classNames={{
              tabList: "gap-6",
              cursor: "bg-primary",
              tab: "px-0",
            }}
          >
            <Tab key="campaigns" title="Campaign" />
            <Tab key="ads" title="Ad" />
          </Tabs>
        </CardHeader>
        <CardBody>
          {selectedTab === "campaigns" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">캠페인 목록 ({campaigns.length})</h3>
                <Button color="primary" radius="sm" variant="flat" size="sm" onPress={onCreateModalOpen}>
                  + 새 캠페인
                </Button>
              </div>
              <CampaignTable
                data={campaigns}
                onCampaignChange={handleCampaignChange}
                onToggleStatus={handleToggleCampaignStatus}
                onCampaignClick={handleCampaignClick}
              />
            </>
          )}

          {selectedTab === "ads" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold">자동 생성 광고 목록 ({filteredAds.length})</h3>
                  {selectedCampaignName && (
                    <Button
                      size="sm"
                      variant="flat"
                      color="default"
                      onPress={handleClearFilter}
                      startContent={<span>✕</span>}
                    >
                      {selectedCampaignName} 필터 해제
                    </Button>
                  )}
                </div>
                <div className="text-sm text-default-500">
                  * AI가 자동으로 광고를 생성하고 최적화합니다
                </div>
              </div>
              <AdTable
                data={filteredAds}
                onAdChange={handleAdChange}
                onToggleStatus={handleToggleAdStatus}
                showCampaignColumn={!selectedCampaignId}
                showAdGroupColumn={false}
              />
            </>
          )}
        </CardBody>
      </Card>

      <AIChatAssistant
        context={{
          currentPage: "/dashboard/platforms/meta-ads/advantage-plus",
          campaigns: campaigns,
        }}
      />

      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={onCreateModalClose}
        platformName="Meta Ads"
        campaignType="Advantage+ 캠페인"
      />
    </div>
  );
}
