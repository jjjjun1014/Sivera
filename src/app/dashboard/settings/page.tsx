"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Switch } from "@heroui/switch";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { User as UserIcon, Settings as SettingsIcon, CreditCard, Lock } from "lucide-react";
import { toast } from "@/utils/toast";
import { BillingSection } from "@/components/settings/BillingSection";

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
  const [selectedTab, setSelectedTab] = useState("profile");
  const { isOpen: isPasswordOpen, onOpen: onPasswordOpen, onClose: onPasswordClose } = useDisclosure();

  // 프로필 설정
  const [profile, setProfile] = useState({
    name: "김민수",
    email: "minsu.kim@company.com",
    phone: "",
    company: "",
    position: "",
    slackWebhook: "",
    team: "마케팅팀", // 읽기 전용
  });

  // 비밀번호 변경
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // 환경설정
  const [preferences, setPreferences] = useState({
    defaultDateRange: "14",
    retention: "365",
    autoBackup: true,
  });

  // localStorage에서 설정 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("appSettings");
    if (saved) {
      const settings = JSON.parse(saved);
      setPreferences({
        defaultDateRange: settings.dashboardSettings?.defaultDateRange || "14",
        retention: settings.dataSettings?.retention || "365",
        autoBackup: settings.dataSettings?.autoBackup ?? true,
      });
    }

    // 프로필 정보 불러오기
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      setProfile((prev) => ({
        ...prev,
        ...profileData,
      }));
    }
  }, []);

  // 프로필 저장
  const handleSaveProfile = () => {
    // localStorage에 프로필 저장
    localStorage.setItem("userProfile", JSON.stringify(profile));
    
    toast.success({
      title: "프로필 저장 완료",
      description: "프로필 정보가 성공적으로 저장되었습니다.",
    });
  };

  // 비밀번호 변경
  const handleChangePassword = () => {
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      toast.error({
        title: "입력 오류",
        description: "모든 필드를 입력해주세요.",
      });
      return;
    }

    if (passwordForm.new !== passwordForm.confirm) {
      toast.error({
        title: "비밀번호 불일치",
        description: "새 비밀번호가 일치하지 않습니다.",
      });
      return;
    }

    if (passwordForm.new.length < 8) {
      toast.error({
        title: "비밀번호 오류",
        description: "비밀번호는 최소 8자 이상이어야 합니다.",
      });
      return;
    }

    // TODO: 실제 비밀번호 변경 로직
    toast.success({
      title: "비밀번호 변경 완료",
      description: "비밀번호가 성공적으로 변경되었습니다.",
    });

    setPasswordForm({ current: "", new: "", confirm: "" });
    onPasswordClose();
  };

  // 환경설정 저장
  const handleSavePreferences = () => {
    const settings = {
      dashboardSettings: {
        defaultDateRange: preferences.defaultDateRange,
      },
      dataSettings: {
        retention: preferences.retention,
        autoBackup: preferences.autoBackup,
      },
    };
    localStorage.setItem("appSettings", JSON.stringify(settings));

    toast.success({
      title: "환경설정 저장 완료",
      description: "환경설정이 성공적으로 저장되었습니다.",
    });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">설정</h1>
        <p className="text-default-500">계정 및 팀 설정을 관리하세요</p>
      </div>

      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
        aria-label="설정 탭"
        variant="underlined"
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-primary"
        }}
      >
        {/* 프로필 탭 */}
        <Tab
          key="profile"
          title={
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              <span>프로필</span>
            </div>
          }
        >
          <div className="py-6 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">개인 정보</h2>
              </CardHeader>
              <CardBody className="space-y-6">
                {/* 기본 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="이름"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    radius="sm"
                    variant="bordered"
                  />

                  <Input
                    label="이메일"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    radius="sm"
                    variant="bordered"
                    type="email"
                    isDisabled
                  />

                  <Input
                    label="전화번호"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    radius="sm"
                    variant="bordered"
                    placeholder="010-1234-5678"
                  />

                  <Input
                    label="소속팀"
                    value={profile.team}
                    radius="sm"
                    variant="bordered"
                    isDisabled
                    description="팀 관리자가 설정한 정보입니다"
                  />
                </div>

                <Divider />

                {/* 회사 정보 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">회사 정보</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="회사명"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      radius="sm"
                      variant="bordered"
                      placeholder="회사명을 입력하세요"
                    />

                    <Input
                      label="직책"
                      value={profile.position}
                      onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                      radius="sm"
                      variant="bordered"
                      placeholder="직책을 입력하세요"
                    />
                  </div>
                </div>

                <Divider />

                {/* 연동 설정 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">연동 설정</h3>
                  <Input
                    label="Slack Webhook URL"
                    value={profile.slackWebhook}
                    onChange={(e) => setProfile({ ...profile, slackWebhook: e.target.value })}
                    radius="sm"
                    variant="bordered"
                    placeholder="https://hooks.slack.com/services/..."
                    description="알림을 받을 Slack Webhook URL을 입력하세요"
                  />
                </div>

                <Divider />

                {/* 비밀번호 변경 */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">비밀번호</p>
                    <p className="text-sm text-default-500">마지막 변경: 30일 전</p>
                  </div>
                  <Button
                    variant="flat"
                    color="primary"
                    onPress={onPasswordOpen}
                    startContent={<Lock className="w-4 h-4" />}
                  >
                    비밀번호 변경
                  </Button>
                </div>

                <Divider />

                {/* 저장 버튼 */}
                <div className="flex justify-end">
                  <Button color="primary" onPress={handleSaveProfile}>
                    프로필 저장
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>

        {/* 환경설정 탭 */}
        <Tab
          key="preferences"
          title={
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-4 h-4" />
              <span>환경설정</span>
            </div>
          }
        >
          <div className="py-6 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">대시보드 기본값</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <Select
                  label="기본 기간"
                  selectedKeys={[preferences.defaultDateRange]}
                  onSelectionChange={(keys) =>
                    setPreferences({
                      ...preferences,
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
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">데이터 설정</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <Select
                  label="데이터 보관 기간"
                  selectedKeys={[preferences.retention]}
                  onSelectionChange={(keys) =>
                    setPreferences({
                      ...preferences,
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
                    isSelected={preferences.autoBackup}
                    onValueChange={(checked) =>
                      setPreferences({ ...preferences, autoBackup: checked })
                    }
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-divider">
                  <Button color="primary" onPress={handleSavePreferences}>
                    환경설정 저장
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>

        {/* 구독 & 결제 탭 */}
        <Tab
          key="billing"
          title={
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span>구독 & 결제</span>
            </div>
          }
        >
          <div className="py-6">
            <BillingSection
              currentPlan="standard"
              currentSeats={3}
              nextBillingDate={new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)}
              trialEndDate={new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)}
              onUpgrade={(plan) => {
                toast.success({
                  title: "업그레이드 요청",
                  description: `${plan} 플랜으로 업그레이드가 요청되었습니다. 결제 연동 후 사용 가능합니다.`,
                });
              }}
            />
          </div>
        </Tab>
      </Tabs>

      {/* 비밀번호 변경 모달 */}
      <Modal isOpen={isPasswordOpen} onClose={onPasswordClose}>
        <ModalContent>
          <ModalHeader>비밀번호 변경</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="현재 비밀번호"
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                radius="sm"
                variant="bordered"
              />
              <Input
                label="새 비밀번호"
                type="password"
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                radius="sm"
                variant="bordered"
                description="최소 8자 이상"
              />
              <Input
                label="새 비밀번호 확인"
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                radius="sm"
                variant="bordered"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onPasswordClose}>
              취소
            </Button>
            <Button color="primary" onPress={handleChangePassword}>
              비밀번호 변경
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
