"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Selection } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { User } from "@heroui/user";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Avatar } from "@heroui/avatar";
import { History } from "lucide-react";
import { toast } from "@/utils/toast";
import { AuditLogModal } from "@/components/modals/AuditLogModal";

// 샘플 데이터
const teamMembers = [
  {
    id: 1,
    name: "김민수",
    email: "minsu.kim@company.com",
    role: "master",
    avatar: "https://i.pravatar.cc/150?u=1",
    joinedAt: "2024-01-15",
    lastActive: "방금 전",
    campaigns: 12,
  },
  {
    id: 2,
    name: "이지은",
    email: "jieun.lee@company.com",
    role: "team_mate",
    avatar: "https://i.pravatar.cc/150?u=2",
    joinedAt: "2024-02-20",
    lastActive: "10분 전",
    campaigns: 8,
  },
  {
    id: 3,
    name: "박서준",
    email: "seojun.park@company.com",
    role: "team_mate",
    avatar: "https://i.pravatar.cc/150?u=3",
    joinedAt: "2024-03-10",
    lastActive: "1시간 전",
    campaigns: 5,
  },
  {
    id: 4,
    name: "최유리",
    email: "yuri.choi@company.com",
    role: "viewer",
    avatar: "https://i.pravatar.cc/150?u=4",
    joinedAt: "2024-04-05",
    lastActive: "2시간 전",
    campaigns: 0,
  },
];

const pendingInvites = [
  {
    id: 1,
    email: "new.member@company.com",
    role: "team_mate",
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
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("");

  const roleColorMap: Record<string, "primary" | "success" | "default"> = {
    master: "primary",
    team_mate: "success",
    viewer: "default",
  };

  const roleTextMap: Record<string, string> = {
    master: "마스터",
    team_mate: "팀원",
    viewer: "뷰어",
  };

  const handleInvite = () => {
    if (!inviteEmail || !inviteRole) {
      toast.error({
        title: "입력 오류",
        description: "이메일과 역할을 모두 입력해주세요.",
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
    setInviteRole("");
    onClose();
  };

  const handleRoleChange = (memberId: number, memberName: string) => {
    toast.warning({
      title: "기능 준비 중",
      description: "팀 관리자에게 문의하여 역할을 변경해주세요.",
    });
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
          <Table
            aria-label="팀원 목록 테이블"
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            disallowEmptySelection={false}
          >
            <TableHeader>
              <TableColumn>팀원</TableColumn>
              <TableColumn>이메일</TableColumn>
              <TableColumn>역할</TableColumn>
              <TableColumn>가입일</TableColumn>
              <TableColumn>마지막 활동</TableColumn>
              <TableColumn align="center">캠페인 수</TableColumn>
              <TableColumn align="center">작업</TableColumn>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <User
                      name={member.name}
                      avatarProps={{
                        src: member.avatar,
                      }}
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
                  <TableCell className="text-center">
                    <span className="font-semibold">{member.campaigns}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        radius="sm"
                        isDisabled={member.role === "master"}
                        onPress={() => handleRoleChange(member.id, member.name)}
                      >
                        역할 변경
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        radius="sm"
                        isDisabled={member.role === "master"}
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
              <TableColumn>이메일</TableColumn>
              <TableColumn>역할</TableColumn>
              <TableColumn>초대한 사람</TableColumn>
              <TableColumn>초대일</TableColumn>
              <TableColumn align="center">작업</TableColumn>
            </TableHeader>
            <TableBody>
              {pendingInvites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>
                    <span className="font-medium">{invite.email}</span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={roleColorMap[invite.role]}
                      size="sm"
                      variant="flat"
                    >
                      {roleTextMap[invite.role]}
                    </Chip>
                  </TableCell>
                  <TableCell>{invite.invitedBy}</TableCell>
                  <TableCell>{invite.invitedAt}</TableCell>
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
                <span className="text-primary font-bold">M</span>
              </div>
              <h4 className="font-semibold">마스터</h4>
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
                <span className="text-success font-bold">T</span>
              </div>
              <h4 className="font-semibold">팀원</h4>
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
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            <h2 className="text-2xl font-bold">팀원 초대</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
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

              <Select
                label="역할 선택"
                placeholder="역할을 선택하세요"
                radius="sm"
                variant="bordered"
                isRequired
                selectedKeys={inviteRole ? [inviteRole] : []}
                onSelectionChange={(keys) => setInviteRole(Array.from(keys)[0] as string)}
              >
                <SelectItem key="team_mate">팀원 (생성, 수정, 삭제 가능)</SelectItem>
                <SelectItem key="viewer">뷰어 (조회만 가능)</SelectItem>
              </Select>

              <div className="p-4 bg-default-50 rounded-lg">
                <p className="text-sm text-default-600">
                  초대 링크가 이메일로 전송됩니다. 링크는 7일간 유효합니다.
                </p>
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
    </div>
  );
}
