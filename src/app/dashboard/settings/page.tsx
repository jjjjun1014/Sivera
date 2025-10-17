"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Switch } from "@heroui/switch";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

const CURRENCIES = [
  { key: "KRW", label: "KRW (₩)" },
  { key: "USD", label: "USD ($)" },
  { key: "JPY", label: "JPY (¥)" },
  { key: "EUR", label: "EUR (€)" },
];

const DATE_RANGES = [
  { key: "7", label: "7일" },
  { key: "14", label: "14일" },
  { key: "30", label: "30일" },
  { key: "90", label: "90일" },
];

const DATA_RETENTION = [
  { key: "30", label: "30일" },
  { key: "90", label: "90일" },
  { key: "180", label: "6개월" },
  { key: "365", label: "1년" },
  { key: "forever", label: "무제한" },
];

export default function SettingsPage() {
  // 알림 설정
  const [notifications, setNotifications] = useState({
    budgetAlert80: true,
    budgetAlert90: true,
    budgetAlert100: true,
    campaignError: true,
    weeklyReport: false,
    monthlyReport: true,
  });

  // 대시보드 설정
  const [dashboardSettings, setDashboardSettings] = useState({
    currency: "KRW",
    defaultDateRange: "14",
    timezone: "Asia/Seoul",
  });

  // 연동 설정
  const [integrations, setIntegrations] = useState({
    slackWebhook: "",
    discordWebhook: "",
    emailNotifications: true,
  });

  // 데이터 설정
  const [dataSettings, setDataSettings] = useState({
    retention: "365",
    autoBackup: true,
    exportFormat: "csv",
  });

  // localStorage에서 설정 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("appSettings");
    if (saved) {
      const settings = JSON.parse(saved);
      setNotifications(settings.notifications || notifications);
      setDashboardSettings(settings.dashboardSettings || dashboardSettings);
      setIntegrations(settings.integrations || integrations);
      setDataSettings(settings.dataSettings || dataSettings);
    }
  }, []);

  // 설정 저장
  const handleSave = () => {
    const settings = {
      notifications,
      dashboardSettings,
      integrations,
      dataSettings,
    };
    localStorage.setItem("appSettings", JSON.stringify(settings));
    alert("설정이 저장되었습니다!");
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">설정</h1>
        <p className="text-default-500">시스템 및 환경 설정을 관리하세요</p>
      </div>

      <div className="space-y-6">
        {/* 알림 설정 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">알림 설정</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">예산 80% 소진 알림</p>
                <p className="text-sm text-default-500">
                  캠페인 예산의 80%가 소진되면 알림을 받습니다
                </p>
              </div>
              <Switch
                isSelected={notifications.budgetAlert80}
                onValueChange={(checked) =>
                  setNotifications({ ...notifications, budgetAlert80: checked })
                }
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">예산 90% 소진 알림</p>
                <p className="text-sm text-default-500">
                  캠페인 예산의 90%가 소진되면 알림을 받습니다
                </p>
              </div>
              <Switch
                isSelected={notifications.budgetAlert90}
                onValueChange={(checked) =>
                  setNotifications({ ...notifications, budgetAlert90: checked })
                }
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">예산 100% 소진 알림</p>
                <p className="text-sm text-default-500">
                  캠페인 예산이 모두 소진되면 알림을 받습니다
                </p>
              </div>
              <Switch
                isSelected={notifications.budgetAlert100}
                onValueChange={(checked) =>
                  setNotifications({ ...notifications, budgetAlert100: checked })
                }
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">캠페인 오류 알림</p>
                <p className="text-sm text-default-500">
                  캠페인에 오류가 발생하면 즉시 알림을 받습니다
                </p>
              </div>
              <Switch
                isSelected={notifications.campaignError}
                onValueChange={(checked) =>
                  setNotifications({ ...notifications, campaignError: checked })
                }
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">주간 리포트</p>
                <p className="text-sm text-default-500">
                  매주 월요일 성과 리포트를 이메일로 받습니다
                </p>
              </div>
              <Switch
                isSelected={notifications.weeklyReport}
                onValueChange={(checked) =>
                  setNotifications({ ...notifications, weeklyReport: checked })
                }
              />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">월간 리포트</p>
                <p className="text-sm text-default-500">
                  매월 1일 성과 리포트를 이메일로 받습니다
                </p>
              </div>
              <Switch
                isSelected={notifications.monthlyReport}
                onValueChange={(checked) =>
                  setNotifications({ ...notifications, monthlyReport: checked })
                }
              />
            </div>
          </CardBody>
        </Card>

        {/* 대시보드 기본값 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">대시보드 기본값</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Select
              label="기본 통화"
              selectedKeys={[dashboardSettings.currency]}
              onSelectionChange={(keys) =>
                setDashboardSettings({
                  ...dashboardSettings,
                  currency: Array.from(keys)[0] as string,
                })
              }
              radius="sm"
              variant="bordered"
            >
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency.key}>{currency.label}</SelectItem>
              ))}
            </Select>

            <Select
              label="기본 기간"
              selectedKeys={[dashboardSettings.defaultDateRange]}
              onSelectionChange={(keys) =>
                setDashboardSettings({
                  ...dashboardSettings,
                  defaultDateRange: Array.from(keys)[0] as string,
                })
              }
              radius="sm"
              variant="bordered"
              description="차트 및 데이터 조회 시 기본으로 표시되는 기간"
            >
              {DATE_RANGES.map((range) => (
                <SelectItem key={range.key}>{range.label}</SelectItem>
              ))}
            </Select>

            <Input
              label="시간대"
              value={dashboardSettings.timezone}
              onChange={(e) =>
                setDashboardSettings({
                  ...dashboardSettings,
                  timezone: e.target.value,
                })
              }
              radius="sm"
              variant="bordered"
              description="데이터 표시 시 사용할 시간대"
            />
          </CardBody>
        </Card>

        {/* 연동 설정 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">연동 설정</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="슬랙 웹훅 URL"
              value={integrations.slackWebhook}
              onChange={(e) =>
                setIntegrations({
                  ...integrations,
                  slackWebhook: e.target.value,
                })
              }
              radius="sm"
              variant="bordered"
              placeholder="https://hooks.slack.com/services/..."
              description="알림을 받을 슬랙 채널의 웹훅 URL"
            />

            <Input
              label="디스코드 웹훅 URL"
              value={integrations.discordWebhook}
              onChange={(e) =>
                setIntegrations({
                  ...integrations,
                  discordWebhook: e.target.value,
                })
              }
              radius="sm"
              variant="bordered"
              placeholder="https://discord.com/api/webhooks/..."
              description="알림을 받을 디스코드 채널의 웹훅 URL"
            />

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">이메일 알림</p>
                <p className="text-sm text-default-500">
                  등록된 이메일로 알림을 받습니다
                </p>
              </div>
              <Switch
                isSelected={integrations.emailNotifications}
                onValueChange={(checked) =>
                  setIntegrations({
                    ...integrations,
                    emailNotifications: checked,
                  })
                }
              />
            </div>
          </CardBody>
        </Card>

        {/* 데이터 설정 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">데이터 설정</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Select
              label="데이터 보관 기간"
              selectedKeys={[dataSettings.retention]}
              onSelectionChange={(keys) =>
                setDataSettings({
                  ...dataSettings,
                  retention: Array.from(keys)[0] as string,
                })
              }
              radius="sm"
              variant="bordered"
              description="광고 데이터를 보관할 기간을 설정합니다"
            >
              {DATA_RETENTION.map((period) => (
                <SelectItem key={period.key}>{period.label}</SelectItem>
              ))}
            </Select>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">자동 백업</p>
                <p className="text-sm text-default-500">
                  매일 자동으로 데이터를 백업합니다
                </p>
              </div>
              <Switch
                isSelected={dataSettings.autoBackup}
                onValueChange={(checked) =>
                  setDataSettings({ ...dataSettings, autoBackup: checked })
                }
              />
            </div>
          </CardBody>
        </Card>

        {/* 저장 버튼 */}
        <div className="flex justify-end">
          <Button color="primary" size="lg" onPress={handleSave}>
            설정 저장
          </Button>
        </div>
      </div>
    </div>
  );
}
