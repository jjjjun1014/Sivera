"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";

// 샘플 데이터
const platformData = [
  {
    id: 1,
    platform: "Google Ads",
    accountName: "메인 계정",
    accountId: "123-456-7890",
    status: "active",
    lastSync: "2024-10-09 10:30",
    campaigns: 5,
  },
  {
    id: 2,
    platform: "Meta Ads",
    accountName: "Facebook 비즈니스",
    accountId: "987654321",
    status: "active",
    lastSync: "2024-10-09 09:45",
    campaigns: 4,
  },
  {
    id: 3,
    platform: "TikTok Ads",
    accountName: "TikTok for Business",
    accountId: "TT-456789",
    status: "inactive",
    lastSync: "2024-10-07 14:20",
    campaigns: 3,
  },
  {
    id: 4,
    platform: "Google Ads",
    accountName: "서브 계정",
    accountId: "321-654-0987",
    status: "error",
    lastSync: "2024-10-08 16:00",
    campaigns: 2,
  },
];

export default function IntegratedPage() {
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const { isOpen, onOpen, onClose } = useDisclosure();

  const statusColorMap: Record<string, "success" | "warning" | "danger"> = {
    active: "success",
    inactive: "warning",
    error: "danger",
  };

  const statusTextMap: Record<string, string> = {
    active: "연결됨",
    inactive: "비활성",
    error: "오류",
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">플랫폼 연동</h1>
          <p className="text-default-500">
            광고 플랫폼 계정을 연동하고 관리하세요
          </p>
        </div>
        <Button
          color="primary"
          radius="sm"
          onPress={onOpen}
        >
          + 새 플랫폼 연동
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">연동된 플랫폼</p>
            <p className="text-3xl font-bold">4</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">활성 계정</p>
            <p className="text-3xl font-bold text-success">2</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">총 캠페인</p>
            <p className="text-3xl font-bold">14</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">마지막 동기화</p>
            <p className="text-lg font-bold">10:30</p>
          </CardBody>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">연동된 계정</h3>
        </CardHeader>
        <CardBody>
          <Table
            aria-label="플랫폼 연동 테이블"
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys as any}
          >
            <TableHeader>
              <TableColumn>플랫폼</TableColumn>
              <TableColumn>계정명</TableColumn>
              <TableColumn>계정 ID</TableColumn>
              <TableColumn>상태</TableColumn>
              <TableColumn>마지막 동기화</TableColumn>
              <TableColumn align="center">캠페인 수</TableColumn>
              <TableColumn align="center">활성화</TableColumn>
              <TableColumn align="center">작업</TableColumn>
            </TableHeader>
            <TableBody>
              {platformData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                        <span className="text-xs font-bold">
                          {item.platform.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium">{item.platform}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.accountName}</TableCell>
                  <TableCell>
                    <span className="text-xs font-mono text-default-500">
                      {item.accountId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={statusColorMap[item.status]}
                      size="sm"
                      variant="flat"
                    >
                      {statusTextMap[item.status]}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{item.lastSync}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-semibold">{item.campaigns}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      defaultSelected={item.status === "active"}
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
                      >
                        동기화
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
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 text-sm text-default-500">
            선택됨: {selectedKeys === "all" ? platformData.length : selectedKeys.size}개
          </div>
        </CardBody>
      </Card>

      {/* Platform Cards */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">사용 가능한 플랫폼</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardBody className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold">G</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Google Ads</h4>
              <p className="text-sm text-default-500 mb-4">
                Google 검색 및 디스플레이 광고
              </p>
              <Button color="primary" variant="bordered" radius="sm" fullWidth>
                연동하기
              </Button>
            </CardBody>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardBody className="text-center py-8">
              <div className="w-16 h-16 bg-secondary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold">M</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Meta Ads</h4>
              <p className="text-sm text-default-500 mb-4">
                Facebook 및 Instagram 광고
              </p>
              <Button color="primary" variant="bordered" radius="sm" fullWidth>
                연동하기
              </Button>
            </CardBody>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardBody className="text-center py-8">
              <div className="w-16 h-16 bg-warning/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold">T</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">TikTok Ads</h4>
              <p className="text-sm text-default-500 mb-4">
                TikTok 동영상 광고
              </p>
              <Button color="primary" variant="bordered" radius="sm" fullWidth>
                연동하기
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Add Platform Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            <h2 className="text-2xl font-bold">새 플랫폼 연동</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Select
                label="플랫폼 선택"
                placeholder="플랫폼을 선택하세요"
                radius="sm"
                variant="bordered"
                isRequired
              >
                <SelectItem key="google">Google Ads</SelectItem>
                <SelectItem key="meta">Meta Ads</SelectItem>
                <SelectItem key="tiktok">TikTok Ads</SelectItem>
                <SelectItem key="amazon">Amazon Ads</SelectItem>
              </Select>

              <Input
                label="계정명"
                placeholder="계정 이름을 입력하세요"
                radius="sm"
                variant="bordered"
                isRequired
              />

              <Input
                label="API 키"
                placeholder="API 키를 입력하세요"
                radius="sm"
                variant="bordered"
                type="password"
                isRequired
              />

              <Input
                label="계정 ID"
                placeholder="계정 ID를 입력하세요"
                radius="sm"
                variant="bordered"
                isRequired
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              취소
            </Button>
            <Button color="primary" onPress={onClose}>
              연동하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
