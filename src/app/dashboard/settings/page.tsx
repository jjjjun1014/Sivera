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
import { User as UserIcon, Settings as SettingsIcon, CreditCard, Lock, AlertTriangle } from "lucide-react";
import { toast } from "@/utils/toast";
import { BillingSection } from "@/components/settings/BillingSection";
import { signOut, deleteUser } from "aws-amplify/auth";

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
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [userTeams, setUserTeams] = useState<any[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // 프로필 설정
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    slackWebhook: "",
    team: "", // 읽기 전용
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

  // Cognito에서 사용자 정보 및 설정 불러오기
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoadingProfile(true);
        
        // Cognito에서 현재 사용자 정보 가져오기
        const { authGetCurrentUser } = await import("@/lib/services/auth.service");
        const { listTeams } = await import("@/lib/services/team.service");
        
        const authUser = await authGetCurrentUser();
        
        if (authUser) {
          // Cognito 사용자 정보로 프로필 초기화
          setProfile((prev) => ({
            ...prev,
            name: authUser.name || "",
            email: authUser.email || "",
          }));

          // 팀 목록 불러오기
          const teamsResult = await listTeams(authUser.userId);
          if (teamsResult.data && teamsResult.data.length > 0) {
            setUserTeams(teamsResult.data);
            // 첫 번째 팀을 기본 팀으로 설정
            setProfile((prev) => ({
              ...prev,
              team: teamsResult.data[0]?.name || "",
            }));
          }
        }

        // localStorage에서 추가 프로필 정보 불러오기 (phone, company, position 등)
        const savedProfile = localStorage.getItem("userProfile");
        if (savedProfile) {
          const profileData = JSON.parse(savedProfile);
          setProfile((prev) => ({
            ...prev,
            phone: profileData.phone || prev.phone,
            company: profileData.company || prev.company,
            position: profileData.position || prev.position,
            slackWebhook: profileData.slackWebhook || prev.slackWebhook,
          }));
        }

        // localStorage에서 환경설정 불러오기
        const saved = localStorage.getItem("appSettings");
        if (saved) {
          const settings = JSON.parse(saved);
          setPreferences({
            defaultDateRange: settings.dashboardSettings?.defaultDateRange || "14",
            retention: settings.dataSettings?.retention || "365",
            autoBackup: settings.dataSettings?.autoBackup ?? true,
          });
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        toast.error({
          title: "프로필 로드 실패",
          description: "사용자 정보를 불러오는데 실패했습니다.",
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadUserData();
  }, []);

  // 프로필 저장
  const handleSaveProfile = async () => {
    try {
      // localStorage에 추가 프로필 정보만 저장 (name, email은 Cognito에서 관리)
      const profileToSave = {
        phone: profile.phone,
        company: profile.company,
        position: profile.position,
        slackWebhook: profile.slackWebhook,
      };
      localStorage.setItem("userProfile", JSON.stringify(profileToSave));
      
      // TODO: 백엔드 API로 프로필 업데이트
      // await updateUserProfile(profileToSave);
      
      toast.success({
        title: "프로필 저장 완료",
        description: "프로필 정보가 성공적으로 저장되었습니다.",
      });
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error({
        title: "저장 실패",
        description: "프로필 저장 중 오류가 발생했습니다.",
      });
    }
  };

  // 비밀번호 변경
  const handleChangePassword = async () => {
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

    try {
      // Cognito 비밀번호 변경
      const { authUpdatePassword } = await import("@/lib/services/auth.service");
      const result = await authUpdatePassword(passwordForm.current, passwordForm.new);

      if (result.success) {
        toast.success({
          title: "비밀번호 변경 완료",
          description: "비밀번호가 성공적으로 변경되었습니다.",
        });
        setPasswordForm({ current: "", new: "", confirm: "" });
        onPasswordClose();
      } else {
        toast.error({
          title: "비밀번호 변경 실패",
          description: result.error || "비밀번호 변경 중 오류가 발생했습니다.",
        });
      }
    } catch (error) {
      console.error('Failed to change password:', error);
      toast.error({
        title: "비밀번호 변경 실패",
        description: "현재 비밀번호를 확인해주세요.",
      });
    }
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

  // 팀 탈퇴
  const handleLeaveTeam = async (teamId: string, teamName: string) => {
    if (!confirm(`"${teamName}" 팀에서 탈퇴하시겠습니까?\n\n탈퇴 후에는 해당 팀의 데이터에 접근할 수 없습니다.`)) {
      return;
    }

    try {
      const { leaveTeamAction } = await import("@/app/dashboard/team/actions");
      const result = await leaveTeamAction(teamId);

      if (result.success) {
        toast.success({
          title: "팀 탈퇴 완료",
          description: `"${teamName}" 팀에서 탈퇴되었습니다.`,
        });

        // 팀 목록 갱신
        setUserTeams(userTeams.filter(t => t.id !== teamId));
      } else {
        toast.error({
          title: "탈퇴 실패",
          description: result.error || "팀 탈퇴 중 오류가 발생했습니다.",
        });
      }
    } catch (error) {
      console.error("Failed to leave team:", error);
      toast.error({
        title: "오류",
        description: "팀 탈퇴 중 오류가 발생했습니다.",
      });
    }
  };

  // 회원 탈퇴
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "회원탈퇴") {
      toast.error({
        title: "입력 오류",
        description: "'회원탈퇴'를 정확히 입력해주세요.",
      });
      return;
    }

    try {
      // 1. Cognito 사용자 삭제
      await deleteUser();

      // 2. localStorage 정리
      localStorage.clear();

      // 3. 세션 정리 및 로그아웃
      await signOut({ global: true });

      toast.success({
        title: "회원 탈퇴 완료",
        description: "계정이 성공적으로 삭제되었습니다. 이용해주셔서 감사합니다.",
      });

      // 4. 로그인 페이지로 리다이렉트
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error({
        title: "탈퇴 실패",
        description: error instanceof Error ? error.message : "계정 삭제 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    }
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
                {isLoadingProfile ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p className="mt-2 text-sm text-default-500">프로필 정보를 불러오는 중...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* 기본 정보 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="이름"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        radius="sm"
                        variant="bordered"
                        isDisabled
                        description="Cognito에서 관리되는 정보입니다"
                      />

                      <Input
                        label="이메일"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        radius="sm"
                        variant="bordered"
                        type="email"
                        isDisabled
                        description="Cognito에서 관리되는 정보입니다"
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

                    <div className="flex justify-end">
                      <Button color="primary" onPress={handleSaveProfile}>
                        변경사항 저장
                      </Button>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>

            {/* 보안 설정 카드 */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">보안 설정</h2>
              </CardHeader>
              <CardBody className="space-y-4">
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

            {/* 팀 탈퇴 섹션 */}
            <Card className="border-warning">
              <CardHeader>
                <h2 className="text-xl font-semibold text-warning">팀 탈퇴</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-warning-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-warning mb-1">팀에서 탈퇴</p>
                    <p className="text-sm text-warning-600">
                      팀에서 탈퇴하면 해당 팀의 데이터에 접근할 수 없습니다. 마스터는 탈퇴할 수 없습니다.
                    </p>
                  </div>
                </div>

                {userTeams.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">소속된 팀:</p>
                    <div className="space-y-2">
                      {userTeams.map((team) => (
                        <div
                          key={team.id}
                          className="flex items-center justify-between p-4 border border-divider rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{team.name}</p>
                            <p className="text-sm text-default-500">
                              역할: {team.role === 'master' ? '마스터' : team.role === 'team_mate' ? '팀원' : '뷰어'}
                            </p>
                          </div>
                          <Button
                            color="warning"
                            variant="flat"
                            size="sm"
                            onPress={() => handleLeaveTeam(team.id, team.name)}
                            isDisabled={team.role === 'master'}
                          >
                            {team.role === 'master' ? '탈퇴 불가' : '팀 탈퇴'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-default-500">소속된 팀이 없습니다!</p>
                    <p className="text-sm text-default-400 mt-2">
                      팀 페이지에서 새로운 팀을 생성하거나 초대를 받아보세요.
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* 회원 탈퇴 섹션 */}
            <Card className="border-danger">
              <CardHeader>
                <h2 className="text-xl font-semibold text-danger">위험 구역</h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-danger-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-danger mb-1">회원 탈퇴</p>
                    <p className="text-sm text-danger-600">
                      계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium">삭제될 데이터:</p>
                  <ul className="text-sm text-default-600 space-y-2 list-disc list-inside">
                    <li>프로필 정보 및 계정 설정</li>
                    <li>팀 멤버십 및 권한</li>
                    <li>모든 캠페인 데이터 및 광고 성과 기록</li>
                    <li>연동된 광고 플랫폼 계정 정보</li>
                    <li>결제 내역 및 구독 정보</li>
                    <li>백업 데이터 및 히스토리</li>
                  </ul>
                </div>

                <div className="flex justify-end pt-4 border-t border-divider">
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={onDeleteOpen}
                    startContent={<AlertTriangle className="w-4 h-4" />}
                  >
                    회원 탈퇴
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

      {/* 회원 탈퇴 모달 */}
      <Modal 
        isOpen={isDeleteOpen} 
        onClose={() => {
          onDeleteClose();
          setDeleteConfirmText("");
        }}
        size="lg"
      >
        <ModalContent>
          <ModalHeader className="flex items-center gap-2 text-danger">
            <AlertTriangle className="w-5 h-5" />
            회원 탈퇴 확인
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="p-4 bg-danger-50 rounded-lg">
                <p className="text-sm text-danger-700 font-medium mb-2">
                  ⚠️ 이 작업은 되돌릴 수 없습니다
                </p>
                <p className="text-sm text-danger-600">
                  계정을 삭제하면 아래의 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">삭제될 데이터:</p>
                <div className="space-y-2 pl-4">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5" />
                    <p className="text-sm text-default-600">
                      <strong>프로필 및 계정 정보</strong> - 이름, 이메일, 전화번호 등
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5" />
                    <p className="text-sm text-default-600">
                      <strong>팀 멤버십</strong> - 소속된 팀에서 자동으로 제거됩니다
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5" />
                    <p className="text-sm text-default-600">
                      <strong>캠페인 데이터</strong> - 생성한 모든 캠페인 및 성과 기록
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5" />
                    <p className="text-sm text-default-600">
                      <strong>광고 플랫폼 연동</strong> - 연동된 모든 광고 계정 정보
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5" />
                    <p className="text-sm text-default-600">
                      <strong>결제 정보</strong> - 구독 내역 및 결제 기록
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5" />
                    <p className="text-sm text-default-600">
                      <strong>백업 데이터</strong> - 저장된 모든 백업 및 히스토리
                    </p>
                  </div>
                </div>
              </div>

              <Divider />

              <div className="space-y-2">
                <p className="text-sm font-medium">
                  계속하려면 아래에 <span className="text-danger font-bold">"회원탈퇴"</span>를 입력하세요:
                </p>
                <Input
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="회원탈퇴"
                  radius="sm"
                  variant="bordered"
                  classNames={{
                    input: "text-center font-medium",
                  }}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button 
              variant="light" 
              onPress={() => {
                onDeleteClose();
                setDeleteConfirmText("");
              }}
            >
              취소
            </Button>
            <Button 
              color="danger" 
              onPress={handleDeleteAccount}
              isDisabled={deleteConfirmText !== "회원탈퇴"}
            >
              영구 삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
