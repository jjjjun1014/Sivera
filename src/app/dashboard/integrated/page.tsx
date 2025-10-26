"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Selection } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { Pagination } from "@heroui/pagination";
import { platformAccounts } from "@/lib/mock-data";
import { usePagination } from "@/hooks";

export default function IntegratedPage() {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  // 페이지네이션
  const { currentPage, totalPages, paginatedData, setCurrentPage } = usePagination(platformAccounts, {
    itemsPerPage: 5,
  });

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">플랫폼 연동</h1>
        <p className="text-default-500">
          광고 플랫폼 계정을 연동하고 관리하세요
        </p>
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
            <p className="text-3xl font-bold text-success">3</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">총 캠페인</p>
            <p className="text-3xl font-bold">18</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-1">마지막 동기화</p>
            <p className="text-lg font-bold">11:15</p>
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
            onSelectionChange={setSelectedKeys}
          >
            <TableHeader>
              <TableColumn key="platform">플랫폼</TableColumn>
              <TableColumn key="account">계정명</TableColumn>
              <TableColumn key="accountId">계정 ID</TableColumn>
              <TableColumn key="status">상태</TableColumn>
              <TableColumn key="lastSync">마지막 동기화</TableColumn>
              <TableColumn key="campaigns" align="center">캠페인 수</TableColumn>
              <TableColumn key="enabled" align="center">활성화</TableColumn>
              <TableColumn key="actions" align="center">작업</TableColumn>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
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

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-default-500">
              선택됨: {selectedKeys === "all" ? platformAccounts.length : selectedKeys.size}개
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={setCurrentPage}
                showControls
                color="primary"
                size="sm"
              />
            )}
          </div>
        </CardBody>
      </Card>

      {/* Platform Cards */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">사용 가능한 플랫폼</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <Card className="hover:shadow-lg transition-shadow">
            <CardBody className="text-center py-8">
              <div className="w-16 h-16 bg-danger/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold">A</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">Amazon Ads</h4>
              <p className="text-sm text-default-500 mb-4">
                Amazon 스폰서 광고
              </p>
              <Button color="primary" variant="bordered" radius="sm" fullWidth>
                연동하기
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

    </div>
  );
}
