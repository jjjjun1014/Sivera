"use client";

import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { DateRangePicker } from "@heroui/date-picker";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { getLocalTimeZone, today } from "@internationalized/date";
import { auditLogStorage, AuditLogEntry, ACTION_LABELS, ACTION_COLORS } from "@/lib/storage/auditLog";

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuditLogModal({ isOpen, onClose }: AuditLogModalProps) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [selectedAction, setSelectedAction] = useState<string>("all");

  const todayDate = today(getLocalTimeZone());
  const thirtyDaysAgo = todayDate.subtract({ days: 29 });

  const [dateRange, setDateRange] = useState({
    start: thirtyDaysAgo,
    end: todayDate,
  });

  // 로그 불러오기
  useEffect(() => {
    if (isOpen) {
      const allLogs = auditLogStorage.getAllLogs();
      setLogs(allLogs);
      filterLogs(allLogs, dateRange, selectedAction);
    }
  }, [isOpen]);

  // 날짜 범위 또는 액션 필터 변경 시
  useEffect(() => {
    filterLogs(logs, dateRange, selectedAction);
  }, [dateRange, selectedAction]);

  const filterLogs = (
    logsToFilter: AuditLogEntry[],
    range: typeof dateRange,
    action: string
  ) => {
    let filtered = logsToFilter;

    // 날짜 필터링
    if (range.start && range.end) {
      const startTime = new Date(
        range.start.year,
        range.start.month - 1,
        range.start.day
      ).getTime();
      const endTime = new Date(
        range.end.year,
        range.end.month - 1,
        range.end.day,
        23,
        59,
        59
      ).getTime();

      filtered = filtered.filter(
        (log) => log.timestamp >= startTime && log.timestamp <= endTime
      );
    }

    // 액션 타입 필터링
    if (action !== "all") {
      filtered = filtered.filter((log) => log.action === action);
    }

    setFilteredLogs(filtered);
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const quickDateFilters = [
    { label: "최근 7일", days: 7 },
    { label: "최근 30일", days: 30 },
    { label: "최근 90일", days: 90 },
  ];

  const handleQuickFilter = (days: number) => {
    const end = today(getLocalTimeZone());
    const start = end.subtract({ days: days - 1 });
    setDateRange({ start, end });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>
          <div>
            <h2 className="text-2xl font-bold">변경 이력</h2>
            <p className="text-sm text-default-500 font-normal mt-1">
              팀원들의 모든 작업 기록을 확인하세요
            </p>
          </div>
        </ModalHeader>
        <ModalBody>
          {/* Filters */}
          <div className="space-y-4 mb-4">
            <div className="flex flex-wrap items-end gap-4">
              {/* Date Range Picker */}
              <div className="flex-1 min-w-[300px]">
                <DateRangePicker
                  label="기간 선택"
                  radius="sm"
                  variant="bordered"
                  value={dateRange}
                  onChange={(value) => value && setDateRange(value)}
                />
              </div>

              {/* Action Filter */}
              <div className="w-48">
                <Select
                  label="작업 유형"
                  radius="sm"
                  variant="bordered"
                  selectedKeys={[selectedAction]}
                  onChange={(e) => setSelectedAction(e.target.value)}
                >
                  <SelectItem key="all">전체</SelectItem>
                  <SelectItem key="invite">팀원 초대</SelectItem>
                  <SelectItem key="remove">팀원 제거</SelectItem>
                  <SelectItem key="role_change">역할 변경</SelectItem>
                  <SelectItem key="campaign_create">캠페인 생성</SelectItem>
                  <SelectItem key="campaign_edit">캠페인 수정</SelectItem>
                  <SelectItem key="campaign_delete">캠페인 삭제</SelectItem>
                  <SelectItem key="budget_change">예산 변경</SelectItem>
                  <SelectItem key="platform_connect">플랫폼 연동</SelectItem>
                  <SelectItem key="platform_disconnect">플랫폼 해제</SelectItem>
                </Select>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2">
              {quickDateFilters.map((filter) => (
                <Button
                  key={filter.days}
                  size="sm"
                  variant="flat"
                  onPress={() => handleQuickFilter(filter.days)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>

            {/* Results Count */}
            <div className="text-sm text-default-500">
              총 <span className="font-semibold text-foreground">{filteredLogs.length}</span>개의
              기록
            </div>
          </div>

          {/* Logs Table */}
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg font-semibold mb-2">변경 이력이 없습니다</p>
              <p className="text-default-500">선택한 기간 동안 작업 기록이 없습니다.</p>
            </div>
          ) : (
            <Table aria-label="변경 이력 테이블" removeWrapper>
              <TableHeader>
                <TableColumn>사용자</TableColumn>
                <TableColumn>작업</TableColumn>
                <TableColumn>대상</TableColumn>
                <TableColumn>세부사항</TableColumn>
                <TableColumn>시간</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <span className="font-medium">{log.userName}</span>
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" variant="flat" color={ACTION_COLORS[log.action]}>
                        {ACTION_LABELS[log.action]}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{log.target}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-default-500">{log.details}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-default-400">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            닫기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
