"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { toast } from "@/utils/toast";
import { useAccount } from "@/contexts/AccountContext";
import type { Brand, AdAccount } from "@/contexts/AccountContext";
import type { AccountRole, AccountMember } from "@/types/team";
import { SIMPLE_TEAM_MEMBERS } from "@/lib/mock-data";
import { ACCOUNT_ROLE_TEXT, PLATFORM_COLOR } from "@/lib/constants/team";
import { AccountRoleSelector } from "@/components/team/AccountRoleSelector";
import { PlatformOAuthCard } from "@/components/integrated/PlatformOAuthCard";

export default function IntegratedPage() {
  const { brands, allAccounts } = useAccount();
  const [selectedTab, setSelectedTab] = useState("oauth");
  
  // 브랜드 관리 모달
  const { isOpen: isBrandModalOpen, onOpen: onBrandModalOpen, onClose: onBrandModalClose } = useDisclosure();
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [selectedAccountsForBrand, setSelectedAccountsForBrand] = useState<Set<string>>(new Set());
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  
  // 계정 팀원 권한 모달
  const { isOpen: isAccountMemberModalOpen, onOpen: onAccountMemberModalOpen, onClose: onAccountMemberModalClose } = useDisclosure();
  const [currentAccount, setCurrentAccount] = useState<AdAccount | null>(null);
  const [accountMembers, setAccountMembers] = useState<Record<string, AccountMember[]>>({});

  const handleCreateBrand = () => {
    setEditingBrand(null);
    setBrandName("");
    setBrandDescription("");
    setSelectedAccountsForBrand(new Set());
    onBrandModalOpen();
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setBrandName(brand.name);
    setBrandDescription(brand.description || "");
    setSelectedAccountsForBrand(new Set(brand.accountIds));
    onBrandModalOpen();
  };

  const handleSaveBrand = () => {
    if (!brandName.trim()) {
      toast.error({
        title: "입력 오류",
        description: "브랜드 이름을 입력하세요.",
      });
      return;
    }

    if (selectedAccountsForBrand.size === 0) {
      toast.error({
        title: "입력 오류",
        description: "최소 1개 이상의 광고 계정을 선택하세요.",
      });
      return;
    }

    // TODO: API 호출
    toast.success({
      title: editingBrand ? "브랜드 수정 완료" : "브랜드 생성 완료",
      description: `${brandName} 브랜드가 ${editingBrand ? "수정" : "생성"}되었습니다.`,
    });
    
    onBrandModalClose();
  };

  const handleManageAccountMembers = (account: AdAccount) => {
    setCurrentAccount(account);
    onAccountMemberModalOpen();
  };

  const handleAddAccountMember = (memberId: number, role: AccountRole) => {
    if (!currentAccount) return;

    const member = SAMPLE_TEAM_MEMBERS.find(m => m.id === memberId);
    if (!member) return;

    setAccountMembers(prev => ({
      ...prev,
      [currentAccount.id]: [
        ...(prev[currentAccount.id] || []),
        {
          memberId: member.id,
          memberName: member.name,
          memberEmail: member.email,
          role,
        },
      ],
    }));

    toast.success({
      title: "권한 추가 완료",
      description: `${member.name}님에게 ${currentAccount.accountName} 계정 접근 권한이 부여되었습니다.`,
    });
  };

  const handleRemoveAccountMember = (memberId: number) => {
    if (!currentAccount) return;

    setAccountMembers(prev => ({
      ...prev,
      [currentAccount.id]: (prev[currentAccount.id] || []).filter(m => m.memberId !== memberId),
    }));

    toast.success({
      title: "권한 제거 완료",
      description: "계정 접근 권한이 제거되었습니다.",
    });
  };

  const handleChangeAccountMemberRole = (memberId: number, newRole: AccountRole) => {
    if (!currentAccount) return;

    setAccountMembers(prev => ({
      ...prev,
      [currentAccount.id]: (prev[currentAccount.id] || []).map(m =>
        m.memberId === memberId ? { ...m, role: newRole } : m
      ),
    }));

    toast.success({
      title: "역할 변경 완료",
      description: "팀원 역할이 변경되었습니다.",
    });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">통합 관리</h1>
        <p className="text-default-500">
          플랫폼 연동, 브랜드 관리, 광고 계정 권한 설정을 한 곳에서 관리하세요
        </p>
      </div>

      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
        aria-label="통합 관리 탭"
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-0 h-12",
        }}
      >
        {/* OAuth 연동 탭 */}
        <Tab key="oauth" title="플랫폼 연동">
          <div className="py-6">
            {/* OAuth 플랫폼 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <PlatformOAuthCard
                platform="google"
                description="Google 검색 및 디스플레이 광고"
                onConnect={() => toast.info({ title: "Google Ads 연동", description: "준비 중입니다." })}
              />
              <PlatformOAuthCard
                platform="meta"
                description="Facebook 및 Instagram 광고"
                onConnect={() => toast.info({ title: "Meta Ads 연동", description: "준비 중입니다." })}
              />
              <PlatformOAuthCard
                platform="tiktok"
                description="TikTok 동영상 광고"
                onConnect={() => toast.info({ title: "TikTok Ads 연동", description: "준비 중입니다." })}
              />
              <PlatformOAuthCard
                platform="amazon"
                description="Amazon 스폰서 광고"
                onConnect={() => toast.info({ title: "Amazon Ads 연동", description: "준비 중입니다." })}
              />
            </div>

            {/* 연동된 계정 목록 */}
            <Card>
              <CardHeader className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">연동된 광고 계정</h3>
              </CardHeader>
              <CardBody>
                <Table aria-label="연동된 계정 목록">
                  <TableHeader>
                    <TableColumn>플랫폼</TableColumn>
                    <TableColumn>계정명</TableColumn>
                    <TableColumn>계정 ID</TableColumn>
                    <TableColumn>브랜드</TableColumn>
                    <TableColumn align="center">활성화</TableColumn>
                    <TableColumn align="center">작업</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent="연동된 계정이 없습니다.">
                    {allAccounts.map((account) => {
                      const brand = brands.find(b => b.id === account.brandId);
                      return (
                        <TableRow key={account.id}>
                          <TableCell>
                            <Chip
                              color={PLATFORM_COLOR[account.platform]}
                              size="sm"
                              variant="flat"
                            >
                              {account.platform.toUpperCase()}
                            </Chip>
                          </TableCell>
                          <TableCell>{account.accountName}</TableCell>
                          <TableCell>
                            <span className="text-xs font-mono text-default-500">
                              {account.accountId}
                            </span>
                          </TableCell>
                          <TableCell>
                            {brand ? (
                              <Chip size="sm" variant="flat">{brand.name}</Chip>
                            ) : (
                              <span className="text-sm text-default-400">미지정</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch
                              isSelected={account.isActive}
                              size="sm"
                              color="success"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2 justify-center">
                              <Button
                                size="sm"
                                variant="flat"
                                color="primary"
                                radius="sm"
                                onPress={() => handleManageAccountMembers(account)}
                              >
                                팀원 권한
                              </Button>
                              <Button
                                size="sm"
                                variant="flat"
                                color="danger"
                                radius="sm"
                              >
                                삭제
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          </div>
        </Tab>

        {/* 브랜드 관리 탭 */}
        <Tab key="brands" title="브랜드 관리">
          <div className="py-6">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">브랜드 목록</h3>
                <Button color="primary" onPress={handleCreateBrand}>
                  브랜드 생성
                </Button>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {brands.map((brand) => {
                    const brandAccounts = allAccounts.filter(acc => acc.brandId === brand.id);
                    return (
                      <Card key={brand.id} className="border border-divider">
                        <CardBody>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="text-lg font-semibold">{brand.name}</h4>
                              {brand.description && (
                                <p className="text-sm text-default-500 mt-1">{brand.description}</p>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="flat"
                              color="primary"
                              onPress={() => handleEditBrand(brand)}
                            >
                              수정
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-default-600">광고 계정:</span>
                              <span className="text-sm font-semibold">{brandAccounts.length}개</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {brandAccounts.map((acc) => (
                                <Chip
                                  key={acc.id}
                                  size="sm"
                                  variant="flat"
                                  color={PLATFORM_COLOR[acc.platform]}
                                >
                                  {acc.accountName}
                                </Chip>
                              ))}
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
                {brands.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-default-500 mb-4">생성된 브랜드가 없습니다</p>
                    <Button color="primary" onPress={handleCreateBrand}>
                      첫 번째 브랜드 만들기
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </Tab>
      </Tabs>

      {/* 브랜드 생성/수정 모달 */}
      <Modal isOpen={isBrandModalOpen} onClose={onBrandModalClose} size="2xl">
        <ModalContent>
          <ModalHeader>{editingBrand ? "브랜드 수정" : "브랜드 생성"}</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="브랜드 이름"
                placeholder="브랜드 이름을 입력하세요"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                isRequired
              />
              <Textarea
                label="설명"
                placeholder="브랜드 설명 (선택사항)"
                value={brandDescription}
                onChange={(e) => setBrandDescription(e.target.value)}
              />
              <div>
                <label className="text-sm font-medium mb-2 block">
                  광고 계정 선택 ({selectedAccountsForBrand.size}개 선택됨)
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto border border-divider rounded-lg p-3">
                  {allAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-2 hover:bg-default-100 rounded cursor-pointer"
                      onClick={() => {
                        const newSet = new Set(selectedAccountsForBrand);
                        if (newSet.has(account.id)) {
                          newSet.delete(account.id);
                        } else {
                          newSet.add(account.id);
                        }
                        setSelectedAccountsForBrand(newSet);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedAccountsForBrand.has(account.id)}
                          onChange={() => {}}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="text-sm font-medium">{account.accountName}</p>
                          <p className="text-xs text-default-400">{account.accountId}</p>
                        </div>
                      </div>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={PLATFORM_COLOR[account.platform]}
                      >
                        {account.platform.toUpperCase()}
                      </Chip>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="flat" onPress={onBrandModalClose}>
              취소
            </Button>
            <Button color="primary" onPress={handleSaveBrand}>
              {editingBrand ? "수정" : "생성"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 계정 팀원 권한 모달 */}
      <Modal isOpen={isAccountMemberModalOpen} onClose={onAccountMemberModalClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            {currentAccount?.accountName} - 팀원 권한 관리
          </ModalHeader>
          <ModalBody>
            {currentAccount && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-default-100 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{currentAccount.accountName}</p>
                    <p className="text-xs text-default-500">{currentAccount.accountId}</p>
                  </div>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={PLATFORM_COLOR[currentAccount.platform]}
                  >
                    {currentAccount.platform.toUpperCase()}
                  </Chip>
                </div>

                {/* 접근 권한이 있는 팀원 */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">접근 권한이 있는 팀원</h4>
                  {(accountMembers[currentAccount.id] || []).length === 0 ? (
                    <p className="text-sm text-default-500 text-center py-4">
                      접근 권한이 부여된 팀원이 없습니다
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {(accountMembers[currentAccount.id] || []).map((member) => (
                        <div
                          key={member.memberId}
                          className="flex items-center justify-between p-3 border border-divider rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium">{member.memberName}</p>
                            <p className="text-xs text-default-500">{member.memberEmail}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <AccountRoleSelector
                              value={member.role}
                              onChange={(role) => handleChangeAccountMemberRole(member.memberId, role)}
                            />
                            <Button
                              size="sm"
                              color="danger"
                              variant="flat"
                              onPress={() => handleRemoveAccountMember(member.memberId)}
                            >
                              제거
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 팀원 추가 */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">팀원 추가</h4>
                  <div className="space-y-2">
                    {SAMPLE_TEAM_MEMBERS.filter(
                      m => !(accountMembers[currentAccount.id] || []).some(am => am.memberId === m.id)
                    ).map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 border border-divider rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-default-500">{member.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <AccountRoleSelector
                            value="viewer"
                            onChange={(role) => handleAddAccountMember(member.id, role)}
                            className="w-32"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="flat" onPress={onAccountMemberModalClose}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
