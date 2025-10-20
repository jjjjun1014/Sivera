"use client";

import { useState, useMemo, useEffect } from "react";
import { platformConfigStorage } from "@/lib/storage/platformConfig";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { DateRangePicker } from "@heroui/date-picker";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Input } from "@heroui/input";
import { useDisclosure } from "@heroui/modal";
import { getLocalTimeZone, today } from "@internationalized/date";
import { CampaignTable, Campaign } from "@/components/tables/CampaignTable";
import { MetricsConfigModal, MetricOption } from "@/components/modals/MetricsConfigModal";
import { SaveConfigModal } from "@/components/modals/SaveConfigModal";
import { Settings2, ChevronDown, Star, Trash2, Edit2 } from "lucide-react";
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

const CHART_COLORS = ["#17C964", "#0072F5", "#F5A524", "#9353D3"];

const generateChartData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 13);

  for (let i = 0; i < 14; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const impressions = Math.floor(30000 + Math.random() * 10000);
    const clicks = Math.floor(1100 + Math.random() * 600);
    const conversions = Math.floor(28 + Math.random() * 18);
    const cost = Math.floor(105000 + Math.random() * 55000);
    const budget = Math.floor(130000 + Math.random() * 80000);
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
      roas: (4 + Math.random() * 2.5),
    });
  }
  return data;
};

const initialCampaigns: Campaign[] = [
  {
    id: 1,
    name: "스폰서 제품 - 베스트셀러",
    status: "active",
    hasError: false,
    budget: 550000,
    spent: 428000,
    impressions: 198000,
    clicks: 5800,
    ctr: 2.93,
    conversions: 186,
    cpc: 74,
    cpa: 2301,
    roas: 5.4,
  },
  {
    id: 2,
    name: "스폰서 브랜드 광고",
    status: "active",
    hasError: false,
    budget: 400000,
    spent: 342000,
    impressions: 156000,
    clicks: 4200,
    ctr: 2.69,
    conversions: 148,
    cpc: 81,
    cpa: 2311,
    roas: 5.1,
  },
  {
    id: 3,
    name: "스폰서 디스플레이 - 리타겟팅",
    status: "paused",
    hasError: false,
    budget: 200000,
    spent: 180000,
    impressions: 245000,
    clicks: 3500,
    ctr: 1.43,
    conversions: 76,
    cpc: 51,
    cpa: 2368,
    roas: 5.0,
  },
];

const PLATFORM_NAME = "amazon-ads-dashboard";

export default function AmazonAdsPage() {
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

  // 메트릭 모달 제어 (요약 카드와 차트 공통 사용)
  const { isOpen: isMetricModalOpen, onOpen: onMetricModalOpen, onClose: onMetricModalClose } = useDisclosure();

  // 저장 모달 제어
  const { isOpen: isSaveModalOpen, onOpen: onSaveModalOpen, onClose: onSaveModalClose } = useDisclosure();

  // 선택된 메트릭 (요약 카드 4개 + 차트 4개)
  const [selectedSummaryMetrics, setSelectedSummaryMetrics] = useState<string[]>([
    "cost",
    "conversions",
    "cpa",
    "roas",
  ]);

  const [selectedChartMetrics, setSelectedChartMetrics] = useState<string[]>([
    "cost",
    "conversions",
  ]);

  // localStorage에서 초기 데이터 로드
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 클라이언트에서만 실행
    const settings = platformConfigStorage.load(PLATFORM_NAME);

    if (settings) {
      // 저장된 설정이 있으면 복원
      setSavedConfigs(settings.configs);
      setCurrentConfigId(settings.currentConfigId);

      // 현재 적용 중인 설정이 있으면 적용
      if (settings.currentConfigId) {
        const currentConfig = settings.configs.find((c) => c.id === settings.currentConfigId);
        if (currentConfig) {
          setSelectedSummaryMetrics(currentConfig.summaryMetrics);
          setSelectedChartMetrics(currentConfig.chartMetrics);
          if (currentConfig.tableColumnOrder) {
            setTableColumnOrder(currentConfig.tableColumnOrder);
          }
          if (currentConfig.tableColumnVisibility) {
            setTableColumnVisibility(currentConfig.tableColumnVisibility);
          }
        }
      }
    }

    setIsLoaded(true);
  }, []);

  // 저장된 설정들
  interface SavedConfig {
    id: string;
    name: string;
    summaryMetrics: string[];
    chartMetrics: string[];
    tableColumnOrder?: string[];
    tableColumnVisibility?: Record<string, boolean>;
    isDefault: boolean;
  }

  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);
  const [editingConfigId, setEditingConfigId] = useState<string | null>(null);
  const [editingConfigName, setEditingConfigName] = useState("");
  const [currentConfigId, setCurrentConfigId] = useState<string | null>(null);

  // 테이블 상태 (CampaignTable에서 전달받을 예정)
  const [tableColumnOrder, setTableColumnOrder] = useState<string[]>([]);
  const [tableColumnVisibility, setTableColumnVisibility] = useState<Record<string, boolean>>({});

  // 현재 설정 이름 가져오기
  const currentConfigName = useMemo(() => {
    if (!currentConfigId) return "커스텀 저장";
    const config = savedConfigs.find((c) => c.id === currentConfigId);
    return config ? config.name : "커스텀 저장";
  }, [currentConfigId, savedConfigs]);

  // 사용 가능한 메트릭 정의 (테이블 컬럼 기반)
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

  // 요약 카드 데이터 계산
  const summaryData = useMemo(() => {
    const totalCost = campaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);

    return {
      cost: { value: `₩${(totalCost / 1000).toFixed(1)}K`, change: "+11.2%" },
      budget: { value: `₩${(totalBudget / 1000).toFixed(1)}K`, change: "+5.2%" },
      spent: { value: `₩${(totalCost / 1000).toFixed(1)}K`, change: "+11.2%" },
      impressions: { value: totalImpressions.toLocaleString(), change: "+12.3%" },
      clicks: { value: totalClicks.toLocaleString(), change: "+10.1%" },
      conversions: { value: totalConversions.toString(), change: "+15.7%" },
      ctr: { value: `${((totalClicks / totalImpressions) * 100).toFixed(2)}%`, change: "-0.8%" },
      cpc: { value: `₩${Math.floor(totalCost / totalClicks).toLocaleString()}`, change: "+3.2%" },
      cpa: { value: `₩${Math.floor(totalCost / totalConversions).toLocaleString()}`, change: "+1.9%" },
      roas: { value: `${(campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length).toFixed(1)}x`, change: "+8.4%" },
    };
  }, [campaigns]);

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

  // 설정 저장
  const handleSaveConfig = (name: string) => {
    const newConfig = platformConfigStorage.addConfig(PLATFORM_NAME, {
      name,
      summaryMetrics: selectedSummaryMetrics,
      chartMetrics: selectedChartMetrics,
      tableColumnOrder: tableColumnOrder.length > 0 ? tableColumnOrder : undefined,
      tableColumnVisibility: Object.keys(tableColumnVisibility).length > 0 ? tableColumnVisibility : undefined,
      isDefault: savedConfigs.length === 0,
    });

    setSavedConfigs((prev) => [...prev, newConfig]);
    toast.success({
      title: "설정 저장 완료",
      description: `"${name}" 설정이 저장되었습니다. (차트, 요약, 테이블 포함)`,
    });
  };

  // 설정 불러오기
  const handleLoadConfig = (configId: string) => {
    const config = savedConfigs.find((c) => c.id === configId);
    if (config) {
      setSelectedSummaryMetrics(config.summaryMetrics);
      setSelectedChartMetrics(config.chartMetrics);

      // 테이블 설정도 복원
      if (config.tableColumnOrder) {
        setTableColumnOrder(config.tableColumnOrder);
      }
      if (config.tableColumnVisibility) {
        setTableColumnVisibility(config.tableColumnVisibility);
      }

      // 현재 설정 ID 업데이트 (localStorage에도 저장)
      setCurrentConfigId(configId);
      platformConfigStorage.setCurrentConfig(PLATFORM_NAME, configId);

      toast.success({
        title: "설정 불러오기 완료",
        description: `"${config.name}" 설정을 적용했습니다.`,
      });
    }
  };

  // 설정 삭제
  const handleDeleteConfig = (configId: string) => {
    const config = savedConfigs.find((c) => c.id === configId);

    // localStorage에서 삭제
    platformConfigStorage.deleteConfig(PLATFORM_NAME, configId);

    setSavedConfigs((prev) => prev.filter((c) => c.id !== configId));

    // 현재 적용 중인 설정이 삭제되면 currentConfigId 초기화
    if (currentConfigId === configId) {
      setCurrentConfigId(null);
    }

    toast.success({
      title: "설정 삭제 완료",
      description: `"${config?.name}" 설정이 삭제되었습니다.`,
    });
  };

  // 기본값 설정
  const handleSetDefault = (configId: string) => {
    // localStorage에 저장
    platformConfigStorage.setDefaultConfig(PLATFORM_NAME, configId);

    setSavedConfigs((prev) =>
      prev.map((c) => ({
        ...c,
        isDefault: c.id === configId,
      }))
    );
    const config = savedConfigs.find((c) => c.id === configId);
    toast.success({
      title: "기본값 설정 완료",
      description: `"${config?.name}" 설정이 기본값으로 설정되었습니다.`,
    });
  };

  // 설정 이름 수정
  const handleRenameConfig = (configId: string, newName: string) => {
    // localStorage에 저장
    platformConfigStorage.updateConfig(PLATFORM_NAME, configId, { name: newName });

    setSavedConfigs((prev) =>
      prev.map((c) =>
        c.id === configId ? { ...c, name: newName } : c
      )
    );
    setEditingConfigId(null);
    setEditingConfigName("");
    toast.success({
      title: "이름 수정 완료",
      description: `설정 이름이 "${newName}"으로 변경되었습니다.`,
    });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Amazon Ads - 대시보드</h1>
        <p className="text-default-500">
          전체 Amazon 광고 성과를 한눈에 확인하세요
        </p>
      </div>

      {/* Date Range Picker & Controls */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex justify-between items-center gap-4">
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
            <div className="flex items-center gap-2">
              <Button
                variant="flat"
                size="sm"
                startContent={<Settings2 className="w-4 h-4" />}
                onPress={onMetricModalOpen}
              >
                지표 선택
              </Button>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    size="sm"
                    endContent={<ChevronDown className="w-4 h-4" />}
                  >
                    {currentConfigName}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="커스텀 설정 저장"
                  onAction={(key) => {
                    if (key === "save") {
                      onSaveModalOpen();
                    } else if (key === "default") {
                      // 기본값으로 돌아가기
                      setSelectedSummaryMetrics(["cost", "conversions", "cpa", "roas"]);
                      setSelectedChartMetrics(["cost", "conversions"]);
                      setTableColumnOrder([]);
                      setTableColumnVisibility({});
                      setCurrentConfigId(null);
                      platformConfigStorage.setCurrentConfig(PLATFORM_NAME, null);
                      toast.success({
                        title: "기본값 적용",
                        description: "기본 설정으로 돌아갔습니다.",
                      });
                    } else {
                      // 저장된 설정 불러오기
                      handleLoadConfig(key as string);
                    }
                  }}
                >
                  <DropdownItem key="save">현재 설정 저장</DropdownItem>
                  <DropdownItem key="default">기본값으로 돌아가기</DropdownItem>
                  {savedConfigs.length > 0 && (
                    <DropdownItem key="divider" isReadOnly className="opacity-0 h-0 p-0">
                      ---
                    </DropdownItem>
                  )}
                  {savedConfigs.map((config) => (
                    <DropdownItem
                      key={config.id}
                      textValue={config.name}
                      className="py-2"
                    >
                      <div className="flex items-center justify-between w-full gap-2">
                        <div className="flex items-center gap-2 flex-1" onClick={() => handleLoadConfig(config.id)}>
                          {config.isDefault && (
                            <Star className="w-3 h-3 fill-warning text-warning flex-shrink-0" />
                          )}
                          <span className="text-sm">{config.name}</span>
                        </div>
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <Popover placement="left">
                            <PopoverTrigger>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                className="min-w-unit-6 w-6 h-6"
                              >
                                <Edit2 className="w-3 h-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-3">
                              <div className="flex flex-col gap-2">
                                <Input
                                  size="sm"
                                  label="이름 변경"
                                  defaultValue={config.name}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      const newName = (e.target as HTMLInputElement).value;
                                      if (newName.trim()) {
                                        handleRenameConfig(config.id, newName.trim());
                                      }
                                    }
                                  }}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => handleSetDefault(config.id)}
                            className="min-w-unit-6 w-6 h-6"
                          >
                            <Star className={`w-3 h-3 ${config.isDefault ? "fill-warning text-warning" : ""}`} />
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            onPress={() => handleDeleteConfig(config.id)}
                            className="min-w-unit-6 w-6 h-6"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Summary Cards */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {selectedSummaryMetrics.map((metricKey) => {
            const metric = availableMetrics.find((m) => m.key === metricKey);
            if (!metric) return null;

            const data = summaryData[metricKey as keyof typeof summaryData];
            const isPositive = data.change.startsWith("+");

            return (
              <Card key={metricKey}>
                <CardBody className="text-center py-6">
                  <p className="text-sm text-default-500 mb-1">{metric.label}</p>
                  <p className="text-3xl font-bold">{data.value}</p>
                  <p className={`text-xs mt-1 ${isPositive ? "text-success" : "text-danger"}`}>
                    {data.change}
                  </p>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <Card className="mb-6">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex justify-between items-center w-full">
            <h3 className="text-lg font-semibold">성과 추이</h3>
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
              {selectedChartMetrics.map((metricKey, index) => {
                const metric = availableMetrics.find((m) => m.key === metricKey);
                if (!metric) return null;

                const color = CHART_COLORS[index % CHART_COLORS.length];

                // 큰 값들은 왼쪽 축, 작은 값들은 오른쪽 축 사용
                const largeValueMetrics = ["cost", "budget", "spent", "impressions", "clicks", "cpc", "cpa"];
                const yAxisId = largeValueMetrics.includes(metricKey) ? "left" : "right";

                return (
                  <Line
                    key={metricKey}
                    yAxisId={yAxisId}
                    type="monotone"
                    dataKey={metricKey}
                    stroke={color}
                    strokeWidth={3}
                    name={metric.label}
                    dot={{
                      fill: color,
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
            initialColumnOrder={tableColumnOrder}
            initialColumnVisibility={tableColumnVisibility}
            onColumnOrderChange={setTableColumnOrder}
            onColumnVisibilityChange={setTableColumnVisibility}
          />
        </CardBody>
      </Card>

      {/* Metrics Config Modal */}
      <MetricsConfigModal
        isOpen={isMetricModalOpen}
        onClose={onMetricModalClose}
        metrics={availableMetrics}
        selectedSummaryMetrics={selectedSummaryMetrics}
        selectedChartMetrics={selectedChartMetrics}
        onApply={(summary, chart) => {
          setSelectedSummaryMetrics(summary);
          setSelectedChartMetrics(chart);
        }}
      />

      {/* Save Config Modal */}
      <SaveConfigModal
        isOpen={isSaveModalOpen}
        onClose={onSaveModalClose}
        onSave={handleSaveConfig}
      />
    </div>
  );
}
