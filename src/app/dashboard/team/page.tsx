"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Selection } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { History } from "lucide-react";
import { toast } from "@/utils/toast";
import { AuditLogModal } from "@/components/modals/AuditLogModal";
import { useWorkspace } from "@/contexts/WorkspaceContext";

// 광고 계정 샘플 데이터
const adAccounts = [
  { id: "ga1", name: "Google Ads - 메인 계정", platform: "google" },
  { id: "ga2", name: "Google Ads - 서브 계정", platform: "google" },
  { id: "meta1", name: "Meta Ads - 공식 계정", platform: "meta" },
  { id: "tiktok1", name: "TikTok Ads - 브랜드 계정", platform: "tiktok" },
  { id: "amazon1", name: "Amazon Ads - 스토어 계정", platform: "amazon" },
];

// 샘플 데이터
const teamMembers = [
  {
    id: 1,
    name: "김민수",
    email: "minsu.kim@company.com",
    role: "owner",
    adAccounts: [
      { accountId: "ga1", role: "admin" },
      { accountId: "ga2", role: "admin" },
      { accountId: "meta1", role: "admin" },
      { accountId: "tiktok1", role: "admin" },
      { accountId: "amazon1", role: "admin" },
    ],
  },
  {
    id: 2,
    name: "이지은",
    email: "jieun.lee@company.com",
    role: "member",
    adAccounts: [
      { accountId: "ga1", role: "editor" },
      { accountId: "meta1", role: "editor" },
      { accountId: "tiktok1", role: "viewer" },
    ],
  },
  {
    id: 3,
    name: "박서준",
    email: "seojun.park@company.com",
    role: "member",
    adAccounts: [
      { accountId: "ga2", role: "editor" },
      { accountId: "amazon1", role: "editor" },
    ],
  },
  {
    id: 4,
    name: "최유리",
    email: "yuri.choi@company.com",
    role: "viewer",
    adAccounts: [
      { accountId: "ga1", role: "viewer" },
      { accountId: "meta1", role: "viewer" },
    ],
  },
];

const pendingInvites = [
  {
    id: 1,
    email: "new.member@company.com",
    role: "member",
    invitedBy: "김민수",
    invitedAt: "2024-10-08",
  },
  {
    id: 2,
    email: "viewer@company.com",
    role: "viewer",
    invitedBy: "김민수",
    invitedAt: "2024-10-09",
  },
];

export default function TeamPage() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAuditLogOpen, onOpen: onAuditLogOpen, onClose: onAuditLogClose } = useDisclosure();
  const { isOpen: isRoleChangeOpen, onOpen: onRoleChangeOpen, onClose: onRoleChangeClose } = useDisclosure();
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedAccountRoles, setSelectedAccountRoles] = useState<Record<string, string>>({});
  const [currentEditingMember, setCurrentEditingMember] = useState<typeof teamMembers[0] | null>(null);
  const [editingAccountRoles, setEditingAccountRoles] = useState<Record<string, string>>({});
  const { workspaces } = useWorkspace();

  const roleColorMap: Record<string, "primary" | "success" | "default"> = {
    owner: "primary",
    member: "success",
    viewer: "default",
  };

  const roleTextMap: Record<string, string> = {
    owner: "소유자",
    member: "멤버",
    viewer: "뷰어",
  };

  const accountRoleTextMap: Record<string, string> = {
    admin: "관리자",
    editor: "편집자",
    viewer: "뷰어",
  };

  const getAccountDisplay = (member: typeof teamMembers[0]) => {
    const accounts = member.adAccounts.map(acc => {
      const account = adAccounts.find(a => a.id === acc.accountId);
      return account ? account.name : acc.accountId;
    });
    
    if (accounts.length === 0) return "-";
    if (accounts.length === 1) return accounts[0];
    if (accounts.length === 2) return `${accounts[0]}, ${accounts[1]}`;
    return `${accounts[0]}, ${accounts[1]} +${accounts.length - 2}`;
  };

  const handleInvite = () => {
    if (!inviteEmail) {
      toast.error({
        title: "입력 오류",
        description: "이메일을 입력해주세요.",
      });
      return;
    }

    if (Object.keys(selectedAccountRoles).length === 0) {
      toast.error({
        title: "입력 오류",
        description: "최소 하나의 광고 계정과 역할을 선택해주세요.",
      });
      return;
    }

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast.error({
        title: "이메일 형식 오류",
        description: "올바른 이메일 주소를 입력해주세요.",
      });
      return;
    }

    // TODO: 실제 초대 이메일 전송 로직 구현
    toast.success({
      title: "초대 이메일 전송 완료",
      description: `${inviteEmail}로 초대 링크가 전송되었습니다.`,
    });

    setInviteEmail("");
    setSelectedAccountRoles({});
    onClose();
  };

  const handleRoleChange = (memberId: number, memberName: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (member) {
      setCurrentEditingMember(member);
      // 현재 멤버의 계정 역할을 편집 상태로 복사
      const roles: Record<string, string> = {};
      member.adAccounts.forEach(acc => {
        roles[acc.accountId] = acc.role;
      });
      setEditingAccountRoles(roles);
      onRoleChangeOpen();
    }
  };

  const handleSaveRoleChanges = () => {
    // TODO: 실제 역할 변경 API 호출
    toast.success({
      title: "역할 변경 완료",
      description: `${currentEditingMember?.name}의 역할이 변경되었습니다.`,
    });
    onRoleChangeClose();
  };

  const handleRemoveAccountRole = (accountId: string) => {
    const newRoles = { ...editingAccountRoles };
    delete newRoles[accountId];
    setEditingAccountRoles(newRoles);
  };

  const handleRemoveMember = (memberId: number, memberName: string) => {
    toast.error({
      title: "팀원 제거 확인",
      description: `${memberName}을(를) 팀에서 제거하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
    });
  };

  const handleResendInvite = (email: string) => {
    toast.success({
      title: "초대 재전송 완료",
      description: `${email}로 초대 링크를 다시 전송했습니다.`,
    });
  };

  const handleCancelInvite = (email: string) => {
    toast.success({
      title: "초대 취소",
      description: `${email}의 초대를 취소했습니다.`,
    });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">팀 관리</h1>
          <p className="text-default-500">
            팀원을 초대하고 권한을 관리하세요
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="flat"
            radius="sm"
            startContent={<History className="w-4 h-4" />}
            onPress={onAuditLogOpen}
          >
            변경 이력
          </Button>
          <Button
            color="primary"
            radius="sm"
            onPress={onOpen}
          >
            + 팀원 초대
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">전체 팀원</p>
            <p className="text-3xl font-bold">4</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">활성 팀원</p>
            <p className="text-3xl font-bold text-success">3</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">대기 중 초대</p>
            <p className="text-3xl font-bold text-warning">2</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">총 캠페인 접근</p>
            <p className="text-3xl font-bold">25</p>
          </CardBody>
        </Card>
      </div>

      {/* Team Members Table */}
      <Card className="mb-6">
        <CardHeader>
          <h3 className="text-xl font-semibold">팀원 목록</h3>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <Table
              aria-label="팀원 목록 테이블"
              selectionMode="multiple"
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
              disallowEmptySelection={false}
              classNames={{
                wrapper: "min-w-[900px]",
              }}
            >
            <TableHeader>
              <TableColumn className="whitespace-nowrap">팀원</TableColumn>
              <TableColumn className="whitespace-nowrap">이메일</TableColumn>
              <TableColumn className="whitespace-nowrap">역할</TableColumn>
              <TableColumn className="whitespace-nowrap">광고 계정</TableColumn>
              <TableColumn align="center" className="whitespace-nowrap">작업</TableColumn>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <span className="font-medium">{member.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-default-500 whitespace-nowrap">
                      {member.email}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={roleColorMap[member.role]}
                      size="sm"
                      variant="flat"
                      className="whitespace-nowrap"
                    >
                      {roleTextMap[member.role]}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {member.adAccounts.slice(0, 2).map((acc) => {
                        const account = adAccounts.find(a => a.id === acc.accountId);
                        return (
                          <Chip key={acc.accountId} size="sm" variant="flat" color="default">
                            {account?.name}
                          </Chip>
                        );
                      })}
                      {member.adAccounts.length > 2 && (
                        <Chip size="sm" variant="flat" color="default">
                          +{member.adAccounts.length - 2}
                        </Chip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        radius="sm"
                        isDisabled={member.role === "owner"}
                        onPress={() => handleRoleChange(member.id, member.name)}
                      >
                        역할 변경
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        radius="sm"
                        isDisabled={member.role === "owner"}
                        onPress={() => handleRemoveMember(member.id, member.name)}
                      >
                        제거
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>

          <div className="mt-4 text-sm text-default-500">
            선택됨: {selectedKeys === "all" ? teamMembers.length : selectedKeys.size}개
          </div>
        </CardBody>
      </Card>

      {/* Pending Invites */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">대기 중인 초대</h3>
        </CardHeader>
        <CardBody>
          <Table aria-label="대기 중인 초대 테이블">
            <TableHeader>
              <TableColumn className="whitespace-nowrap">이메일</TableColumn>
              <TableColumn className="whitespace-nowrap">역할</TableColumn>
              <TableColumn className="whitespace-nowrap">초대한 사람</TableColumn>
              <TableColumn className="whitespace-nowrap">초대일</TableColumn>
              <TableColumn align="center" className="whitespace-nowrap">작업</TableColumn>
            </TableHeader>
            <TableBody>
              {pendingInvites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>
                    <span className="font-medium whitespace-nowrap">{invite.email}</span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={roleColorMap[invite.role]}
                      size="sm"
                      variant="flat"
                      className="whitespace-nowrap"
                    >
                      {roleTextMap[invite.role]}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <span className="whitespace-nowrap">{invite.invitedBy}</span>
                  </TableCell>
                  <TableCell>
                    <span className="whitespace-nowrap">{invite.invitedAt}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        radius="sm"
                        onPress={() => handleResendInvite(invite.email)}
                      >
                        재전송
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        radius="sm"
                        onPress={() => handleCancelInvite(invite.email)}
                      >
                        취소
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Role Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold">O</span>
              </div>
              <h4 className="font-semibold">소유자</h4>
            </div>
            <p className="text-sm text-default-500">
              모든 권한을 가지며 팀원 관리, 결제, 설정 변경이 가능합니다.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <span className="text-success font-bold">M</span>
              </div>
              <h4 className="font-semibold">멤버</h4>
            </div>
            <p className="text-sm text-default-500">
              캠페인 생성, 수정, 삭제 및 광고 플랫폼 연동이 가능합니다.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-default/10 rounded-lg flex items-center justify-center">
                <span className="text-default-700 font-bold">V</span>
              </div>
              <h4 className="font-semibold">뷰어</h4>
            </div>
            <p className="text-sm text-default-500">
              데이터 조회만 가능하며 수정 권한은 없습니다.
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Invite Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>
            <h2 className="text-2xl font-bold">팀원 초대</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              <Input
                label="이메일"
                placeholder="이메일 주소를 입력하세요"
                radius="sm"
                variant="bordered"
                type="email"
                isRequired
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">광고 계정 및 역할 선택</label>
                  <span className="text-xs text-default-500">
                    {Object.keys(selectedAccountRoles).length}개 선택됨
                  </span>
                </div>
                <div className="space-y-3">
                  {adAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between gap-4 p-3 border border-divider rounded-lg">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm font-medium">{account.name}</span>
                        <Chip size="sm" variant="flat" color="primary">
                          {account.platform}
                        </Chip>
                      </div>
                      <Select
                        placeholder="역할 선택"
                        radius="sm"
                        size="sm"
                        className="w-40"
                        selectedKeys={selectedAccountRoles[account.id] ? [selectedAccountRoles[account.id]] : []}
                        onSelectionChange={(keys) => {
                          const role = Array.from(keys)[0] as string;
                          if (role) {
                            setSelectedAccountRoles(prev => ({ ...prev, [account.id]: role }));
                          } else {
                            const newRoles = { ...selectedAccountRoles };
                            delete newRoles[account.id];
                            setSelectedAccountRoles(newRoles);
                          }
                        }}
                      >
                        <SelectItem key="admin">관리자</SelectItem>
                        <SelectItem key="editor">편집자</SelectItem>
                        <SelectItem key="viewer">뷰어</SelectItem>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-default-50 rounded-lg space-y-2">
                <p className="text-sm font-medium text-default-700">
                  초대 정보
                </p>
                <ul className="text-xs text-default-600 space-y-1 list-disc list-inside">
                  <li>초대 링크가 이메일로 전송됩니다.</li>
                  <li>링크는 7일간 유효합니다.</li>
                  <li>선택된 광고 계정에 대해서만 접근 권한이 부여됩니다.</li>
                  <li>역할에 따라 수정 권한이 제한될 수 있습니다.</li>
                </ul>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              취소
            </Button>
            <Button color="primary" onPress={handleInvite}>
              초대 보내기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Audit Log Modal */}
      <AuditLogModal isOpen={isAuditLogOpen} onClose={onAuditLogClose} />

      {/* Role Change Modal */}
      <Modal isOpen={isRoleChangeOpen} onClose={onRoleChangeClose} size="4xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>
            <h2 className="text-2xl font-bold">{currentEditingMember?.name} - 역할 관리</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              {/* 현재 부여된 계정 목록 */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">부여된 광고 계정</h3>
                <Table aria-label="부여된 계정 목록">
                  <TableHeader>
                    <TableColumn>계정명</TableColumn>
                    <TableColumn>플랫폼</TableColumn>
                    <TableColumn>역할</TableColumn>
                    <TableColumn align="center">작업</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(editingAccountRoles)
                      .filter(([accountId]) => adAccounts.find(a => a.id === accountId))
                      .map(([accountId, role]) => {
                        const account = adAccounts.find(a => a.id === accountId)!;
                        return (
                          <TableRow key={accountId}>
                            <TableCell>{account.name}</TableCell>
                            <TableCell>
                              <Chip size="sm" variant="flat" color="primary">
                                {account.platform}
                              </Chip>
                            </TableCell>
                            <TableCell>
                            <Select
                              size="sm"
                              radius="sm"
                              className="w-32"
                              selectedKeys={[role]}
                              onSelectionChange={(keys) => {
                                const newRole = Array.from(keys)[0] as string;
                                setEditingAccountRoles(prev => ({ ...prev, [accountId]: newRole }));
                              }}
                            >
                              <SelectItem key="admin">관리자</SelectItem>
                              <SelectItem key="editor">편집자</SelectItem>
                              <SelectItem key="viewer">뷰어</SelectItem>
                            </Select>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="flat"
                                color="danger"
                                onPress={() => handleRemoveAccountRole(accountId)}
                              >
                                제거
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>

              {/* 새 계정 추가 */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">광고 계정 추가</h3>
                <div className="space-y-3">
                  {adAccounts
                    .filter(account => !editingAccountRoles[account.id])
                    .map((account) => (
                      <div key={account.id} className="flex items-center justify-between gap-4 p-3 border border-divider rounded-lg">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-sm font-medium">{account.name}</span>
                          <Chip size="sm" variant="flat" color="primary">
                            {account.platform}
                          </Chip>
                        </div>
                        <Select
                          placeholder="역할 선택"
                          radius="sm"
                          size="sm"
                          className="w-40"
                          onSelectionChange={(keys) => {
                            const role = Array.from(keys)[0] as string;
                            if (role) {
                              setEditingAccountRoles(prev => ({ ...prev, [account.id]: role }));
                            }
                          }}
                        >
                          <SelectItem key="admin">관리자</SelectItem>
                          <SelectItem key="editor">편집자</SelectItem>
                          <SelectItem key="viewer">뷰어</SelectItem>
                        </Select>
                      </div>
                    ))}
                  {adAccounts.filter(account => !editingAccountRoles[account.id]).length === 0 && (
                    <p className="text-sm text-default-500 text-center py-4">
                      모든 광고 계정이 이미 부여되었습니다.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onRoleChangeClose}>
              취소
            </Button>
            <Button color="primary" onPress={handleSaveRoleChanges}>
              변경 사항 저장
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
