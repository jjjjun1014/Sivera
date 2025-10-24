"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Switch } from "@heroui/switch";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { User } from "@heroui/user";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { User as UserIcon, Bell, Settings as SettingsIcon, Users, CreditCard, Shield, Lock } from "lucide-react";
import { toast } from "@/utils/toast";
import { BillingSection } from "@/components/settings/BillingSection";

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

// 샘플 팀원 데이터
const teamMembers = [
  {
    id: 1,
    name: "김민수",
    email: "minsu.kim@company.com",
    role: "owner",
    avatar: "https://i.pravatar.cc/150?u=1",
    joinedAt: "2024-01-15",
    lastActive: "방금 전",
  },
  {
    id: 2,
    name: "이지은",
    email: "jieun.lee@company.com",
    role: "admin",
    avatar: "https://i.pravatar.cc/150?u=2",
    joinedAt: "2024-02-20",
    lastActive: "10분 전",
  },
  {
    id: 3,
    name: "박서준",
    email: "seojun.park@company.com",
    role: "member",
    avatar: "https://i.pravatar.cc/150?u=3",
    joinedAt: "2024-03-10",
    lastActive: "1시간 전",
  },
];

const roleColorMap: Record<string, "primary" | "success" | "default"> = {
  owner: "primary",
  admin: "success",
  member: "default",
};

const roleTextMap: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
};

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState("profile");
  const { isOpen: isInviteOpen, onOpen: onInviteOpen, onClose: onInviteClose } = useDisclosure();
  const { isOpen: isPasswordOpen, onOpen: onPasswordOpen, onClose: onPasswordClose } = useDisclosure();

  // 프로필 설정
  const [profile, setProfile] = useState({
    name: "김민수",
    email: "minsu.kim@company.com",
    avatar: "https://i.pravatar.cc/150?u=1",
  });

  // 비밀번호 변경
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // 알림 설정
  const [notifications, setNotifications] = useState({
    budgetAlert80: true,
    budgetAlert90: true,
    budgetAlert100: true,
    campaignError: true,
    weeklyReport: false,
    monthlyReport: true,
    emailNotifications: true,
  });

  // 환경설정
  const [preferences, setPreferences] = useState({
    currency: "KRW",
    defaultDateRange: "14",
    timezone: "Asia/Seoul",
    retention: "365",
    autoBackup: true,
  });

  // 팀 설정
  const [teamName, setTeamName] = useState("마케팅 팀");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("");

  // localStorage에서 설정 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("appSettings");
    if (saved) {
      const settings = JSON.parse(saved);
      setNotifications(settings.notifications || notifications);
      setPreferences({
        currency: settings.dashboardSettings?.currency || "KRW",
        defaultDateRange: settings.dashboardSettings?.defaultDateRange || "14",
        timezone: settings.dashboardSettings?.timezone || "Asia/Seoul",
        retention: settings.dataSettings?.retention || "365",
        autoBackup: settings.dataSettings?.autoBackup ?? true,
      });
    }
  }, []);

  // 프로필 저장
  const handleSaveProfile = () => {
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

  // 알림 설정 저장
  const handleSaveNotifications = () => {
    const settings = JSON.parse(localStorage.getItem("appSettings") || "{}");
    settings.notifications = notifications;
    localStorage.setItem("appSettings", JSON.stringify(settings));

    toast.success({
      title: "알림 설정 저장 완료",
      description: "알림 설정이 성공적으로 저장되었습니다.",
    });
  };

  // 환경설정 저장
  const handleSavePreferences = () => {
    const settings = {
      notifications,
      dashboardSettings: {
        currency: preferences.currency,
        defaultDateRange: preferences.defaultDateRange,
        timezone: preferences.timezone,
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

  // 팀원 초대
  const handleInvite = () => {
    if (!inviteEmail || !inviteRole) {
      toast.error({
        title: "입력 오류",
        description: "이메일과 역할을 모두 입력해주세요.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast.error({
        title: "이메일 형식 오류",
        description: "올바른 이메일 주소를 입력해주세요.",
      });
      return;
    }

    toast.success({
      title: "초대 이메일 전송 완료",
      description: `${inviteEmail}로 초대 링크가 전송되었습니다.`,
    });

    setInviteEmail("");
    setInviteRole("");
    onInviteClose();
  };

  // 팀원 제거
  const handleRemoveMember = (memberId: number, memberName: string) => {
    toast.error({
      title: "팀원 제거 확인",
      description: `${memberName}을(를) 팀에서 제거하시겠습니까?`,
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
                <div className="flex items-center gap-6">
                  <Avatar
                    src={profile.avatar}
                    className="w-20 h-20"
                    name={profile.name}
                  />
                  <div>
                    <Button size="sm" variant="flat" color="primary">
                      사진 변경
                    </Button>
                    <p className="text-sm text-default-500 mt-2">
                      JPG, PNG 또는 GIF (최대 800x800px)
                    </p>
                  </div>
                </div>

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
                />

                <div className="flex justify-between items-center pt-4 border-t border-divider">
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

                <div className="flex justify-end pt-4 border-t border-divider">
                  <Button color="primary" onPress={handleSaveProfile}>
                    프로필 저장
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* 보안 설정 */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">보안</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">2단계 인증 (2FA)</p>
                    <p className="text-sm text-default-500">
                      추가 보안을 위해 2단계 인증을 활성화하세요
                    </p>
                  </div>
                  <Button variant="flat" color="primary" size="sm">
                    설정
                  </Button>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-divider">
                  <div>
                    <p className="font-medium">활성 세션</p>
                    <p className="text-sm text-default-500">
                      현재 로그인된 디바이스 관리
                    </p>
                  </div>
                  <Button variant="flat" size="sm">
                    세션 관리
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>

        {/* 알림 탭 */}
        <Tab
          key="notifications"
          title={
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span>알림</span>
            </div>
          }
        >
          <div className="py-6 space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">알림 설정</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">예산 알림</h3>
                  <div className="space-y-4">
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
                  </div>
                </div>

                <div className="pt-4 border-t border-divider">
                  <h3 className="text-lg font-semibold mb-4">시스템 알림</h3>
                  <div className="space-y-4">
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
                        <p className="font-medium">이메일 알림</p>
                        <p className="text-sm text-default-500">
                          등록된 이메일로 알림을 받습니다
                        </p>
                      </div>
                      <Switch
                        isSelected={notifications.emailNotifications}
                        onValueChange={(checked) =>
                          setNotifications({ ...notifications, emailNotifications: checked })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-divider">
                  <h3 className="text-lg font-semibold mb-4">리포트</h3>
                  <div className="space-y-4">
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
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-divider">
                  <Button color="primary" onPress={handleSaveNotifications}>
                    알림 설정 저장
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
                  label="기본 통화"
                  selectedKeys={[preferences.currency]}
                  onSelectionChange={(keys) =>
                    setPreferences({
                      ...preferences,
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

                <Input
                  label="시간대"
                  value={preferences.timezone}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      timezone: e.target.value,
                    })
                  }
                  radius="sm"
                  variant="bordered"
                  description="데이터 표시 시 사용할 시간대"
                />
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

        {/* 팀 관리 탭 */}
        <Tab
          key="team"
          title={
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>팀 관리</span>
            </div>
          }
        >
          <div className="py-6 space-y-6">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">팀 정보</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <Input
                  label="팀 이름"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  radius="sm"
                  variant="bordered"
                />

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center p-4 bg-default-50 rounded-lg">
                    <p className="text-2xl font-bold">{teamMembers.length}</p>
                    <p className="text-sm text-default-500">팀원</p>
                  </div>
                  <div className="text-center p-4 bg-default-50 rounded-lg">
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-default-500">광고 계정</p>
                  </div>
                  <div className="text-center p-4 bg-default-50 rounded-lg">
                    <p className="text-2xl font-bold">48</p>
                    <p className="text-sm text-default-500">캠페인</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">팀원</h2>
                <Button color="primary" size="sm" onPress={onInviteOpen}>
                  + 팀원 초대
                </Button>
              </CardHeader>
              <CardBody>
                <Table aria-label="팀원 목록">
                  <TableHeader>
                    <TableColumn key="member">팀원</TableColumn>
                    <TableColumn key="email">이메일</TableColumn>
                    <TableColumn key="role">역할</TableColumn>
                    <TableColumn key="joined">가입일</TableColumn>
                    <TableColumn key="active">최근 활동</TableColumn>
                    <TableColumn key="actions" align="center">작업</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <User
                            name={member.name}
                            avatarProps={{ src: member.avatar }}
                          />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-default-500">
                            {member.email}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Chip
                            color={roleColorMap[member.role]}
                            size="sm"
                            variant="flat"
                          >
                            {roleTextMap[member.role]}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{member.joinedAt}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-default-500">
                            {member.lastActive}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-center">
                            {member.role !== "owner" && (
                              <Button
                                size="sm"
                                variant="flat"
                                color="danger"
                                onPress={() => handleRemoveMember(member.id, member.name)}
                              >
                                제거
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* 역할 설명 */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="p-4 border border-divider rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Chip color="primary" size="sm" variant="flat">Owner</Chip>
                    </div>
                    <p className="text-sm text-default-500">
                      모든 권한 보유. 결제 및 팀 설정 관리 가능
                    </p>
                  </div>
                  <div className="p-4 border border-divider rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Chip color="success" size="sm" variant="flat">Admin</Chip>
                    </div>
                    <p className="text-sm text-default-500">
                      팀원 관리 및 광고 계정 설정 가능
                    </p>
                  </div>
                  <div className="p-4 border border-divider rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Chip color="default" size="sm" variant="flat">Member</Chip>
                    </div>
                    <p className="text-sm text-default-500">
                      광고 데이터 조회 및 캠페인 관리 가능
                    </p>
                  </div>
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
              currentPlan="free"
              currentSeats={teamMembers.length}
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

      {/* 팀원 초대 모달 */}
      <Modal isOpen={isInviteOpen} onClose={onInviteClose}>
        <ModalContent>
          <ModalHeader>팀원 초대</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="이메일"
                type="email"
                placeholder="이메일 주소를 입력하세요"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                radius="sm"
                variant="bordered"
              />
              <Select
                label="역할 선택"
                placeholder="역할을 선택하세요"
                selectedKeys={inviteRole ? [inviteRole] : []}
                onSelectionChange={(keys) => setInviteRole(Array.from(keys)[0] as string)}
                radius="sm"
                variant="bordered"
              >
                <SelectItem key="admin">Admin (팀원 관리 가능)</SelectItem>
                <SelectItem key="member">Member (조회 및 캠페인 관리)</SelectItem>
              </Select>
              <div className="p-3 bg-default-50 rounded-lg">
                <p className="text-sm text-default-600">
                  초대 링크가 이메일로 전송됩니다. 링크는 7일간 유효합니다.
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onInviteClose}>
              취소
            </Button>
            <Button color="primary" onPress={handleInvite}>
              초대 보내기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
