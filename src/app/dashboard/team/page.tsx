"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { History } from "lucide-react";
import { toast } from "@/utils/toast";
import { AuditLogModal } from "@/components/modals/AuditLogModal";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useTeamRole } from "@/hooks/use-team-role";
import { getCurrentUser } from "@/lib/services/user.service";
import { platformAccounts, SAMPLE_TEAM_MEMBERS, SAMPLE_PENDING_INVITES } from "@/lib/mock-data";
import type { TeamMember, TeamInvitation } from "@/types/team";
import { TEAM_ROLE_TEXT, TEAM_ROLE_COLOR } from "@/lib/constants/team";
import type { User } from "@/types/amplify";

// TODO: 광고 계정 데이터는 API에서 가져오기
const adAccounts = platformAccounts;

export default function TeamPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAuditLogOpen, onOpen: onAuditLogOpen, onClose: onAuditLogClose } = useDisclosure();
  const { isOpen: isRoleChangeOpen, onOpen: onRoleChangeOpen, onClose: onRoleChangeClose } = useDisclosure();
  const { isOpen: isAccountMemberModalOpen, onOpen: onAccountMemberModalOpen, onClose: onAccountMemberModalClose } = useDisclosure();
  const { isOpen: isRemoveMemberOpen, onOpen: onRemoveMemberOpen, onClose: onRemoveMemberClose } = useDisclosure();
  
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedAccountRoles, setSelectedAccountRoles] = useState<Record<string, string>>({});
  const [currentEditingMember, setCurrentEditingMember] = useState<TeamMember | null>(null);
  const [editingAccountRoles, setEditingAccountRoles] = useState<Record<string, string>>({});
  const [currentAccount, setCurrentAccount] = useState<typeof adAccounts[0] | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<{ id: number; name: string } | null>(null);
  
  const { workspaces } = useWorkspace();
  
  // 현재 사용자 정보 및 권한
  const [currentUser, setCurrentUser] = useState<{ data: User | null; error?: any } | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(SAMPLE_TEAM_MEMBERS);
  const [pendingInvites, setPendingInvites] = useState<TeamInvitation[]>(SAMPLE_PENDING_INVITES);
  
  // TODO: teamID는 TeamMember를 통해 조회해야 함
  const teamID = null;
  const userID = currentUser?.data?.id || null;
  
  const { role, isMaster, canManageTeam, isLoading } = useTeamRole(teamID, userID);

  useEffect(() => {
    // 현재 사용자 정보 조회
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    // 팀원 목록 조회
    const fetchTeamMembers = async () => {
      if (!teamID) return;
      
      try {
        // TODO: GraphQL로 TeamMember 조회
        // const response = await client.graphql({
        //   query: listTeamMembers,
        //   variables: { filter: { teamID: { eq: teamID } } }
        // });
        // setTeamMembers(response.data.listTeamMembers.items);
      } catch (error) {
        console.error('Failed to fetch team members:', error);
      }
    };

    // 대기 중 초대 조회
    const fetchPendingInvites = async () => {
      if (!teamID) return;
      
      try {
        // TODO: GraphQL로 TeamInvitation 조회
        // const response = await client.graphql({
        //   query: listTeamInvitations,
        //   variables: { filter: { teamID: { eq: teamID }, status: { eq: 'pending' } } }
        // });
        // setPendingInvites(response.data.listTeamInvitations.items);
      } catch (error) {
        console.error('Failed to fetch pending invites:', error);
      }
    };

    if (teamID) {
      fetchTeamMembers();
      fetchPendingInvites();
    }
  }, [teamID]);

  const getAccountDisplay = (member: TeamMember) => {
    const accounts = (member.adAccounts || []).map((acc) => {
      const account = adAccounts.find(a => a.id === acc.accountId);
      return account ? account.accountName : acc.accountId;
    });
    
    if (accounts.length === 0) return "-";
    if (accounts.length === 1) return accounts[0];
    if (accounts.length === 2) return `${accounts[0]}, ${accounts[1]}`;
    return `${accounts[0]}, ${accounts[1]} +${accounts.length - 2}`;
  };

  const handleManageAccountMembers = (account: typeof adAccounts[0]) => {
    setCurrentAccount(account);
    onAccountMemberModalOpen();
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
      (member.adAccounts || []).forEach((acc: any) => {
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
    setMemberToRemove({ id: memberId, name: memberName });
    onRemoveMemberOpen();
  };

  const confirmRemoveMember = () => {
    if (!memberToRemove) return;

    // TODO: 실제 팀원 제거 API 호출
    const updatedMembers = teamMembers.filter(m => m.id !== memberToRemove.id);
    setTeamMembers(updatedMembers);
    
    toast.success({
      title: "팀원 제거 완료",
      description: `${memberToRemove.name}님이 팀에서 제거되었습니다.`,
    });
    
    onRemoveMemberClose();
    setMemberToRemove(null);
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
            팀원을 초대하고 기본 역할을 관리하세요. 광고 계정별 상세 권한은{" "}
            <a href="/dashboard/integrated" className="text-primary hover:underline">
              통합 관리
            </a>
            에서 설정할 수 있습니다.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="flat"
            radius="sm"
            startContent={<History className="w-4 h-4" />}
            onPress={onAuditLogOpen}
            isDisabled={!canManageTeam}
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
            <p className="text-3xl font-bold">{teamMembers.length}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">연동된 광고 계정</p>
            <p className="text-3xl font-bold text-success">{adAccounts.length}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">대기 중 초대</p>
            <p className="text-3xl font-bold text-warning">{pendingInvites.length}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">활성 캠페인</p>
            <p className="text-3xl font-bold">{adAccounts.reduce((sum, acc) => sum + (acc.campaigns || 0), 0)}</p>
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
              classNames={{
                wrapper: "min-w-[700px]",
              }}
            >
            <TableHeader>
              <TableColumn className="whitespace-nowrap">팀원</TableColumn>
              <TableColumn className="whitespace-nowrap">이메일</TableColumn>
              <TableColumn className="whitespace-nowrap">역할</TableColumn>
              <TableColumn align="center" className="whitespace-nowrap">작업</TableColumn>
            </TableHeader>
            <TableBody emptyContent="팀원이 없습니다.">
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
                      color={TEAM_ROLE_COLOR[member.role]}
                      size="sm"
                      variant="flat"
                      className="whitespace-nowrap"
                    >
                      {TEAM_ROLE_TEXT[member.role]}
                    </Chip>
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
        </CardBody>
      </Card>

      {/* Pending Invites */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">대기 중인 초대</h3>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <Table aria-label="대기 중인 초대 테이블" classNames={{ wrapper: "min-w-[700px]" }}>
            <TableHeader>
              <TableColumn className="whitespace-nowrap">이메일</TableColumn>
              <TableColumn className="whitespace-nowrap">역할</TableColumn>
              <TableColumn className="whitespace-nowrap">초대한 사람</TableColumn>
              <TableColumn className="whitespace-nowrap">초대일</TableColumn>
              <TableColumn align="center" className="whitespace-nowrap">작업</TableColumn>
            </TableHeader>
            <TableBody emptyContent="대기 중인 초대가 없습니다.">
              {pendingInvites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>
                    <span className="font-medium whitespace-nowrap">{invite.email}</span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={TEAM_ROLE_COLOR[invite.role]}
                      size="sm"
                      variant="flat"
                      className="whitespace-nowrap"
                    >
                      {TEAM_ROLE_TEXT[invite.role]}
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
          </div>
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
                <div className="overflow-x-auto">
                  <Table aria-label="부여된 계정 목록" classNames={{ wrapper: "min-w-[600px]" }}>
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

      {/* Account Members Management Modal */}
      <Modal isOpen={isAccountMemberModalOpen} onClose={onAccountMemberModalClose} size="3xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>
            <div>
              <h2 className="text-2xl font-bold">광고 계정 접근 권한 관리</h2>
              {currentAccount && (
                <p className="text-sm text-default-400 font-normal mt-1">
                  {currentAccount.platform} · {currentAccount.accountName}
                </p>
              )}
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              <div className="p-4 bg-default-50 rounded-lg">
                <p className="text-sm text-default-600">
                  이 광고 계정에 접근할 수 있는 팀원과 권한을 설정합니다.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">팀원 목록</h3>
                <div className="space-y-3">
                  {teamMembers.map((member) => {
                    const memberAccount = (member.adAccounts || []).find((acc: any) => acc.accountId === currentAccount?.id);
                    const hasAccess = !!memberAccount;
                    
                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 border border-divider rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-default-500">{member.email}</p>
                        </div>
                        {hasAccess ? (
                          <div className="flex items-center gap-3">
                            <Select
                              size="sm"
                              radius="sm"
                              className="w-32"
                              selectedKeys={[memberAccount.role]}
                              aria-label="역할 선택"
                            >
                              <SelectItem key="admin">관리자</SelectItem>
                              <SelectItem key="editor">편집자</SelectItem>
                              <SelectItem key="viewer">뷰어</SelectItem>
                            </Select>
                            <Button
                              size="sm"
                              variant="flat"
                              color="danger"
                              isDisabled={!isMaster}
                            >
                              제거
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            isDisabled={!canManageTeam}
                          >
                            접근 권한 추가
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onAccountMemberModalClose}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Remove Member Confirmation Modal */}
      <Modal isOpen={isRemoveMemberOpen} onClose={onRemoveMemberClose} size="md">
        <ModalContent>
          <ModalHeader>팀원 제거 확인</ModalHeader>
          <ModalBody>
            <p className="text-default-700">
              <span className="font-semibold">{memberToRemove?.name}</span>님을 팀에서 제거하시겠습니까?
            </p>
            <p className="text-sm text-default-500 mt-2">
              이 작업은 되돌릴 수 없으며, 해당 팀원은 모든 광고 계정에 대한 접근 권한을 잃게 됩니다.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="flat"
              onPress={onRemoveMemberClose}
            >
              취소
            </Button>
            <Button
              color="danger"
              onPress={confirmRemoveMember}
            >
              제거
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
