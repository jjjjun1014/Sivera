"use client";

import { useState, useMemo } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { DateRangePicker } from "@heroui/date-picker";
import { Tabs, Tab } from "@heroui/tabs";
import { getLocalTimeZone, today } from "@internationalized/date";
import { CampaignTable, Campaign } from "@/components/tables/CampaignTable";
import { AdGroupTable } from "@/components/tables/AdGroupTable";
import { AdTable } from "@/components/tables/AdTable";
import { CreateCampaignModal } from "@/components/modals/CreateCampaignModal";
import { useDisclosure } from "@heroui/modal";
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
      impressions: Math.floor(28000 + Math.random() * 10000),
      clicks: Math.floor(900 + Math.random() * 500),
      conversions: Math.floor(30 + Math.random() * 18),
      cost: Math.floor(110000 + Math.random() * 45000),
    });
  }
  return data;
};

const initialCampaigns: Campaign[] = [
  {
    id: 1,
    name: "검색 광고 - 브랜드 키워드",
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
    name: "검색 광고 - 제품 키워드",
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
    name: "검색 광고 - 경쟁사 키워드",
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

const initialAdGroups: AdGroup[] = [
  {
    id: 1,
    campaignId: 1,
    campaignName: "검색 광고 - 브랜드 키워드",
    campaignType: "search",
    name: "브랜드명 정확 일치",
    status: "active",
    budget: 300000,
    spent: 245000,
    impressions: 125000,
    clicks: 2800,
    ctr: 2.24,
    conversions: 95,
    cpc: 88,
    cpa: 2579,
    roas: 4.5,
  },
  {
    id: 2,
    campaignId: 1,
    campaignName: "검색 광고 - 브랜드 키워드",
    campaignType: "search",
    name: "브랜드명 구문 일치",
    status: "active",
    budget: 300000,
    spent: 233000,
    impressions: 110000,
    clicks: 2400,
    ctr: 2.18,
    conversions: 83,
    cpc: 97,
    cpa: 2807,
    roas: 3.9,
  },
  {
    id: 3,
    campaignId: 2,
    campaignName: "검색 광고 - 제품 키워드",
    campaignType: "search",
    name: "제품 A - 정확 일치",
    status: "active",
    budget: 200000,
    spent: 168000,
    impressions: 89000,
    clicks: 1850,
    ctr: 2.08,
    conversions: 62,
    cpc: 91,
    cpa: 2710,
    roas: 3.7,
  },
  {
    id: 4,
    campaignId: 3,
    campaignName: "검색 광고 - 경쟁사 키워드",
    campaignType: "performance-max",
    name: "Performance Max 자동 그룹",
    status: "active",
    budget: 500000,
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

const initialAds: Ad[] = [
  {
    id: 1,
    campaignId: 1,
    campaignName: "검색 광고 - 브랜드 키워드",
    adGroupId: 1,
    adGroupName: "브랜드명 정확 일치",
    name: "브랜드 A - 공식 사이트",
    type: "text",
    status: "active",
    spent: 125000,
    impressions: 65000,
    clicks: 1480,
    ctr: 2.28,
    conversions: 52,
    cpc: 84,
    cpa: 2404,
    roas: 4.8,
  },
  {
    id: 2,
    campaignId: 1,
    campaignName: "검색 광고 - 브랜드 키워드",
    adGroupId: 1,
    adGroupName: "브랜드명 정확 일치",
    name: "브랜드 A - 특별 할인",
    type: "text",
    status: "active",
    spent: 120000,
    impressions: 60000,
    clicks: 1320,
    ctr: 2.20,
    conversions: 43,
    cpc: 91,
    cpa: 2791,
    roas: 4.2,
  },
  {
    id: 3,
    campaignId: 1,
    campaignName: "검색 광고 - 브랜드 키워드",
    adGroupId: 2,
    adGroupName: "브랜드명 구문 일치",
    name: "브랜드 A + 제품",
    type: "text",
    status: "active",
    spent: 115000,
    impressions: 54000,
    clicks: 1200,
    ctr: 2.22,
    conversions: 41,
    cpc: 96,
    cpa: 2805,
    roas: 3.9,
  },
];

export default function GoogleAdsSearchPage() {
  const [selectedTab, setSelectedTab] = useState("campaigns");
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [adGroups, setAdGroups] = useState(initialAdGroups);
  const [ads, setAds] = useState(initialAds);

  // Filter state
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  const [selectedAdGroupId, setSelectedAdGroupId] = useState<number | string | null>(null);

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

  const { isOpen: isCreateModalOpen, onOpen: onCreateModalOpen, onClose: onCreateModalClose } = useDisclosure();

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

  // AdGroup handlers
  const handleAdGroupChange = (
    id: number | string,
    field: string,
    value: any
  ) => {
    setAdGroups((prev) =>
      prev.map((adGroup) =>
        adGroup.id === id ? { ...adGroup, [field]: value } : adGroup
      )
    );
  };

  const handleToggleAdGroupStatus = (id: number | string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    handleAdGroupChange(id, "status", newStatus);
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
    setSelectedTab("adgroups");
  };

  const handleAdGroupClick = (adGroupId: number | string) => {
    setSelectedAdGroupId(adGroupId);
    setSelectedTab("ads");
  };

  const handleClearFilter = () => {
    setSelectedCampaignId(null);
    setSelectedAdGroupId(null);
  };

  // Filtered data
  const filteredAdGroups = useMemo(() => {
    if (!selectedCampaignId) return adGroups;
    return adGroups.filter((ag) => ag.campaignId === selectedCampaignId);
  }, [adGroups, selectedCampaignId]);

  const filteredAds = useMemo(() => {
    if (!selectedAdGroupId) return ads;
    return ads.filter((ad) => ad.adGroupId === selectedAdGroupId);
  }, [ads, selectedAdGroupId]);

  const selectedCampaignName = useMemo(() => {
    if (!selectedCampaignId) return null;
    return campaigns.find((c) => c.id === selectedCampaignId)?.name || null;
  }, [campaigns, selectedCampaignId]);

  const selectedAdGroupName = useMemo(() => {
    if (!selectedAdGroupId) return null;
    return adGroups.find((ag) => ag.id === selectedAdGroupId)?.name || null;
  }, [adGroups, selectedAdGroupId]);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Google Ads - Search</h1>
        <p className="text-default-500">검색 광고 성과를 관리하세요</p>
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
            <Tab key="adgroups" title="Ad Group" />
            <Tab key="ads" title="Ad & Keyword" />
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

          {selectedTab === "adgroups" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold">광고그룹 목록 ({filteredAdGroups.length})</h3>
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
                <Button color="primary" radius="sm" variant="flat" size="sm">
                  + 새 광고그룹
                </Button>
              </div>
              <AdGroupTable
                data={filteredAdGroups}
                onAdGroupChange={handleAdGroupChange}
                onToggleStatus={handleToggleAdGroupStatus}
                showCampaignColumn={!selectedCampaignId}
                onAdGroupClick={handleAdGroupClick}
              />
            </>
          )}

          {selectedTab === "ads" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold">광고 & 키워드 목록 ({filteredAds.length})</h3>
                  {selectedAdGroupName && (
                    <Button
                      size="sm"
                      variant="flat"
                      color="default"
                      onPress={handleClearFilter}
                      startContent={<span>✕</span>}
                    >
                      {selectedAdGroupName} 필터 해제
                    </Button>
                  )}
                </div>
                <Button color="primary" radius="sm" variant="flat" size="sm">
                  + 새 광고
                </Button>
              </div>
              <AdTable
                data={filteredAds}
                onAdChange={handleAdChange}
                onToggleStatus={handleToggleAdStatus}
                showCampaignColumn={!selectedCampaignId}
                showAdGroupColumn={!selectedAdGroupId}
              />
            </>
          )}
        </CardBody>
      </Card>

      <AIChatAssistant
        context={{
          currentPage: "/dashboard/platforms/google-ads/search",
          campaigns: campaigns,
          selectedMetrics: chartMetrics,
        }}
      />

      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={onCreateModalClose}
        platformName="Google Ads"
        campaignType="검색 광고"
      />
    </div>
  );
}
