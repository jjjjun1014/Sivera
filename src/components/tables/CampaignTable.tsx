"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnOrderState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Chip } from "@heroui/chip";
import { Switch } from "@heroui/switch";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { GripVertical, Settings2, Edit2 } from "lucide-react";
import { toast } from "@/utils/toast";
import { ColumnManagerModal, ColumnOption } from "@/components/modals/ColumnManagerModal";
import { statusColorMap, statusTextMap } from "@/lib/constants/status";
import { useTableEditing } from "@/hooks/useTableEditing";
import { useDebounce } from "@/hooks/useDebounce";
import { DraggableTableHeader } from "@/components/tables/common/DraggableTableHeader";
import { formatMetricValue } from "@/utils/table-formatters";
import { PINNED_COLUMN_IDS } from "@/types/table.types";

export interface Campaign {
  id: number;
  name: string;
  status: "active" | "paused" | "stopped";
  hasError: boolean;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  cpc: number;
  cpa: number;
  roas: number;
}

interface CampaignTableProps {
  data: Campaign[];
  onCampaignChange?: (id: number, field: string, value: string | number | boolean) => void;
  onToggleStatus?: (id: number, currentStatus: string) => void;
  initialColumnOrder?: string[];
  initialColumnVisibility?: Record<string, boolean>;
  onColumnOrderChange?: (order: string[]) => void;
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;
  onCampaignClick?: (id: number) => void;
  isLoading?: boolean;
  loadingMessage?: string;
  totalCount?: number;
}

// debounce 지연 시간 (300ms)
const DEBOUNCE_DELAY = 300;

export function CampaignTable({
  data,
  onCampaignChange,
  onToggleStatus,
  initialColumnOrder = [],
  initialColumnVisibility = {},
  onColumnOrderChange,
  onColumnVisibilityChange,
  onCampaignClick,
  isLoading = false,
  loadingMessage,
  totalCount,
}: CampaignTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(initialColumnOrder);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility);

  // Debounced search
  const debouncedGlobalFilter = useDebounce(globalFilter, 300);

  // useReducer\ub85c \ud1b5\ud569\ub41c \ud3b8\uc9d1 \uc0c1\ud0dc \uad00\ub9ac
  const editing = useTableEditing<string | number>();

  // 초기 값이 변경되면 상태 업데이트
  useEffect(() => {
    if (initialColumnOrder.length > 0) {
      setColumnOrder(initialColumnOrder);
    }
  }, [initialColumnOrder]);

  useEffect(() => {
    if (Object.keys(initialColumnVisibility).length > 0) {
      setColumnVisibility(initialColumnVisibility);
    }
  }, [initialColumnVisibility]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Switch 토글 확인 모달
  const { isOpen: isSwitchModalOpen, onOpen: onSwitchModalOpen, onClose: onSwitchModalClose } = useDisclosure();
  const [pendingSwitch, setPendingSwitch] = useState<{ id: number; currentStatus: string } | null>(null);

  // 컬럼 관리 모달
  const { isOpen: isColumnModalOpen, onOpen: onColumnModalOpen, onClose: onColumnModalClose } = useDisclosure();

  // 컬럼 옵션 정의
  const columnOptions: ColumnOption[] = [
    { id: "name", label: "캠페인명", category: "basic" },
    { id: "status", label: "상태", category: "basic" },
    { id: "budget", label: "예산", category: "basic" },
    { id: "spent", label: "소진", category: "basic" },
    { id: "impressions", label: "노출수", category: "performance" },
    { id: "clicks", label: "클릭수", category: "performance" },
    { id: "conversions", label: "전환수", category: "performance" },
    { id: "ctr", label: "CTR", category: "efficiency" },
    { id: "cpc", label: "CPC", category: "efficiency" },
    { id: "cpa", label: "CPA", category: "efficiency" },
    { id: "roas", label: "ROAS", category: "efficiency" },
    { id: "select", label: "선택", category: "basic", isPinned: true },
    { id: "actions", label: "작업", category: "basic", isPinned: true },
  ];

  // 변경 확인 및 적용
  const confirmChange = useCallback(() => {
    if (editing.state.pendingChange) {
      onCampaignChange?.(
        Number(editing.state.pendingChange.id),
        editing.state.pendingChange.field,
        editing.state.pendingChange.value
      );

      const fieldLabels: Record<string, string> = {
        name: "캠페인명",
        budget: "예산",
      };

      toast.success({
        title: "수정 완료",
        description: `${fieldLabels[editing.state.pendingChange.field] || editing.state.pendingChange.field}이(가) 성공적으로 변경되었습니다.`,
      });

      editing.confirmEdit();
      onClose();
    }
  }, [editing, onCampaignChange, onClose]);

  // 변경 취소
  const cancelChange = useCallback(() => {
    editing.cancelEdit();
    onClose();
  }, [editing, onClose]);

  const columns = useMemo<ColumnDef<Campaign>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            isSelected={table.getIsAllRowsSelected()}
            isIndeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            isSelected={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        size: 50,
        enableSorting: false,
      },
      {
        id: "name",
        accessorKey: "name",
        header: "캠페인명",
        cell: ({ row, getValue }) => {
          const isEditing = editing.state.editingCell?.id === row.original.id && editing.state.editingCell?.field === "name";
          const key = `${row.original.id}-name`;

          return isEditing ? (
            <Input
              size="sm"
              value={editing.state.tempValues[key] ?? (getValue() as string)}
              onChange={(e) => {
                editing.updateTemp(key, e.target.value);
              }}
              onBlur={() => {
                const newValue = editing.state.tempValues[key] ?? (getValue() as string);
                const oldValue = getValue() as string;

                if (newValue === oldValue) {
                  editing.cancelEdit();
                  return;
                }

                editing.setPending({
                  id: row.original.id,
                  field: "name",
                  value: newValue,
                  oldValue,
                });
                onOpen();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const newValue = editing.state.tempValues[key] ?? (getValue() as string);
                  const oldValue = getValue() as string;

                  if (newValue === oldValue) {
                    editing.cancelEdit();
                    return;
                  }

                  editing.setPending({
                    id: row.original.id,
                    field: "name",
                    value: newValue,
                    oldValue,
                  });
                  onOpen();
                } else if (e.key === "Escape") {
                  editing.cancelEdit();
                }
              }}
            />
          ) : (
            <div className="flex items-center gap-2 p-2 max-w-xs">
              <div
                className="cursor-pointer hover:bg-default-100 px-2 py-1 rounded transition-colors flex-1 min-w-0"
                onClick={() => {
                  if (onCampaignClick) {
                    onCampaignClick(row.original.id);
                  }
                }}
              >
                <div className="font-medium truncate" title={getValue() as string}>{getValue() as string}</div>
                <div className="text-xs text-default-500">ID: {row.original.id}</div>
              </div>
              <Button
                size="sm"
                variant="light"
                isIconOnly
                onPress={() => {
                  editing.startEdit(row.original.id, "name");
                  editing.updateTemp(key, getValue() as string);
                }}
                className="min-w-unit-6 w-6 h-6 flex-shrink-0"
              >
                <Edit2 className="w-3 h-3" />
              </Button>
            </div>
          );
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: "상태",
        cell: ({ row, getValue }) => {
          const status = getValue() as string;

          return (
            <div className="flex items-center gap-2">
              <Chip color={statusColorMap[status]} size="sm" variant="flat">
                {statusTextMap[status]}
              </Chip>
              {row.original.hasError && (
                <span className="text-danger text-xs">⚠️</span>
              )}
            </div>
          );
        },
      },
      {
        id: "budget",
        accessorKey: "budget",
        header: "예산",
        cell: ({ row, getValue }) => {
          const campaignId = row.original.id;
          const field = "budget";
          const key = `${campaignId}-${field}`;
          const currentValue = getValue() as number;
          const isEditing = editing.state.editingCell?.id === campaignId && editing.state.editingCell?.field === field;
          const displayValue = editing.state.tempValues[key] !== undefined ? editing.state.tempValues[key] : currentValue;

          if (isEditing) {
            return (
              <Input
                type="number"
                value={displayValue}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  // 입력 검증: 음수 방지, NaN 체크
                  if (!isNaN(newValue) && newValue >= 0) {
                    editing.updateTemp(key, newValue);
                  }
                }}
                onBlur={() => {
                  const newValue = editing.state.tempValues[key] !== undefined ? editing.state.tempValues[key] : currentValue;
                  if (newValue !== currentValue && !isNaN(newValue as number)) {
                    editing.setPending({
                      id: campaignId,
                      field,
                      value: newValue,
                      oldValue: currentValue,
                    });
                    onOpen();
                  } else {
                    editing.cancelEdit();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  } else if (e.key === "Escape") {
                    editing.cancelEdit();
                  }
                }}
                size="sm"
                className="w-32"
              />
            );
          }

          return (
            <div
              className="text-right whitespace-nowrap cursor-pointer hover:bg-default-100 px-2 py-1 rounded transition-colors"
              onClick={() => {
                editing.startEdit(campaignId, field);
                editing.updateTemp(key, currentValue);
              }}
            >
              ₩{currentValue.toLocaleString()}
            </div>
          );
        },
      },
      {
        id: "spent",
        accessorKey: "spent",
        header: "소진",
        cell: ({ getValue }) => {
          const spent = getValue() as number;
          return <div className="whitespace-nowrap">₩{spent.toLocaleString()}</div>;
        },
      },
      {
        id: "impressions",
        accessorKey: "impressions",
        header: "노출수",
        cell: ({ getValue }) => <span className="whitespace-nowrap">{(getValue() as number).toLocaleString()}</span>,
      },
      {
        id: "clicks",
        accessorKey: "clicks",
        header: "클릭수",
        cell: ({ getValue }) => <span className="whitespace-nowrap">{(getValue() as number).toLocaleString()}</span>,
      },
      {
        id: "ctr",
        accessorKey: "ctr",
        header: "CTR",
        cell: ({ getValue }) => `${(getValue() as number).toFixed(2)}%`,
      },
      {
        id: "conversions",
        accessorKey: "conversions",
        header: "전환수",
        cell: ({ getValue }) => <span className="whitespace-nowrap">{(getValue() as number).toLocaleString()}</span>,
      },
      {
        id: "cpc",
        accessorKey: "cpc",
        header: "CPC",
        cell: ({ getValue }) => <span className="whitespace-nowrap">₩{(getValue() as number).toLocaleString()}</span>,
      },
      {
        id: "cpa",
        accessorKey: "cpa",
        header: "CPA",
        cell: ({ getValue }) => <span className="whitespace-nowrap">₩{(getValue() as number).toLocaleString()}</span>,
      },
      {
        id: "roas",
        accessorKey: "roas",
        header: "ROAS",
        cell: ({ getValue }) => (
          <span className="font-semibold text-success">
            {(getValue() as number).toFixed(1)}x
          </span>
        ),
      },
      {
        id: "actions",
        header: "작업",
        enableSorting: false,
        cell: ({ row }) => {
          return (
            <div className="flex gap-2 items-center justify-center">
              <Switch
                size="sm"
                isSelected={row.original.status === "active"}
                onValueChange={() => {
                  setPendingSwitch({
                    id: row.original.id,
                    currentStatus: row.original.status,
                  });
                  onSwitchModalOpen();
                }}
              />
            </div>
          );
        },
      },
    ],
    [onCampaignChange, onToggleStatus, onOpen, onSwitchModalOpen] // editing hook은 안정적이므로 제외
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnOrder,
      globalFilter: debouncedGlobalFilter, // debounced 값 사용
      rowSelection: selectedRows,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setSelectedRows,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // 드래그 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // 컬럼 드래그 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // 고정된 컬럼은 드래그 불가
      if (
        PINNED_COLUMN_IDS.includes(active.id as string) ||
        PINNED_COLUMN_IDS.includes(over.id as string)
      ) {
        return;
      }

      const oldIndex = columnOrder.indexOf(active.id as string);
      const newIndex = columnOrder.indexOf(over.id as string);
      setColumnOrder(arrayMove(columnOrder, oldIndex, newIndex));
    }
  };

  // 컬럼 순서 초기화
  useEffect(() => {
    if (columnOrder.length === 0 && columns.length > 0) {
      setColumnOrder(columns.map((col) => col.id!).filter(Boolean));
    }
  }, [columns, columnOrder.length]);

  // 컬럼 가시성 토글
  const toggleColumnVisibility = (columnId: string) => {
    setColumnVisibility((prev) => {
      const currentVisibility = prev[columnId] ?? true; // 기본값은 true
      const newVisibility = {
        ...prev,
        [columnId]: !currentVisibility,
      };

      // 부모에게 알림
      onColumnVisibilityChange?.(newVisibility);

      return newVisibility;
    });
  };

  // columnOrder 변경시 부모에게 알림
  useEffect(() => {
    if (columnOrder.length > 0) {
      onColumnOrderChange?.(columnOrder);
    }
  }, [columnOrder, onColumnOrderChange]);

  // 드래그 가능한 컬럼만 필터링
  const draggableColumnIds = columnOrder.filter(
    (id) => !PINNED_COLUMN_IDS.includes(id)
  );

  return (
    <div className="space-y-4">
      {/* 검색 및 컬럼 필터 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Input
            placeholder="캠페인 검색..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
            size="sm"
            isDisabled={isLoading}
          />
          {isLoading && totalCount && (
            <div className="text-sm text-default-500 animate-pulse">
              ⏳ {totalCount.toLocaleString()}개 캠페인 로딩 중...
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-default-500">
            선택됨: {Object.keys(selectedRows).length}개
          </div>
          <Button
            size="sm"
            variant="flat"
            startContent={<Settings2 className="w-4 h-4" />}
            onPress={onColumnModalOpen}
            isDisabled={isLoading}
          >
            컬럼 관리
          </Button>
        </div>
      </div>

      {/* 로딩 상태 */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-default-700">
              {loadingMessage || "캠페인 데이터 로딩 중..."}
            </p>
            {totalCount && (
              <p className="text-sm text-default-500">
                총 {totalCount.toLocaleString()}개 항목 처리 중
              </p>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* 테이블 */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="overflow-x-auto rounded-lg border border-divider">
              <table className="w-full border-collapse bg-content1">
                <thead>
                  <SortableContext
                    items={draggableColumnIds}
                    strategy={horizontalListSortingStrategy}
                  >
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <DraggableTableHeader key={header.id} header={header} />
                        ))}
                      </tr>
                    ))}
                  </SortableContext>
                </thead>
                <tbody>
                  {table.getRowModel().rows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="text-center py-12">
                        <div className="text-default-500">
                          {debouncedGlobalFilter
                            ? "검색 결과가 없습니다."
                            : "캠페인 데이터가 없습니다."}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-divider hover:bg-default-100 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-3 py-3 text-sm">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </DndContext>

          {/* 페이지네이션 */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-default-500">
              {totalCount ? (
                <>전체 {totalCount.toLocaleString()}개 중 </>
              ) : null}
              {table.getFilteredRowModel().rows.length.toLocaleString()}개{" "}
              {debouncedGlobalFilter && "(검색됨)"}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="flat"
                onPress={() => table.previousPage()}
                isDisabled={!table.getCanPreviousPage()}
              >
                이전
              </Button>
              <Button
                size="sm"
                variant="flat"
                onPress={() => table.nextPage()}
                isDisabled={!table.getCanNextPage()}
              >
                다음
              </Button>
            </div>
          </div>
        </>
      )}

      {/* 변경 확인 모달 */}
      <Modal isOpen={isOpen} onClose={cancelChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                변경 사항 확인
              </ModalHeader>
              <ModalBody>
                {pendingChange && (
                  <div className="space-y-3">
                    <p className="text-sm text-default-600">
                      다음과 같이 변경하시겠습니까?
                    </p>
                    <div className="bg-default-100 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-default-700">
                          {pendingChange.field === "name" ? "캠페인명" : "예산"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-default-500 mb-1">변경 전</p>
                          <p className="text-sm font-medium text-danger">
                            {pendingChange.field === "budget"
                              ? `₩${Number(pendingChange.oldValue).toLocaleString()}`
                              : pendingChange.oldValue}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-default-500 mb-1">변경 후</p>
                          <p className="text-sm font-medium text-success">
                            {pendingChange.field === "budget"
                              ? `₩${Number(pendingChange.value).toLocaleString()}`
                              : pendingChange.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={cancelChange}>
                  취소
                </Button>
                <Button color="primary" onPress={confirmChange}>
                  확인
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* 컬럼 관리 모달 */}
      <ColumnManagerModal
        isOpen={isColumnModalOpen}
        onClose={onColumnModalClose}
        columns={columnOptions}
        visibleColumns={columnVisibility}
        onApply={(visible) => {
          setColumnVisibility(visible);
          onColumnVisibilityChange?.(visible);
        }}
      />

      {/* Switch 토글 확인 모달 */}
      <Modal isOpen={isSwitchModalOpen} onClose={onSwitchModalClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader>캠페인 상태 변경</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <p className="text-default-600">
                    {pendingSwitch?.currentStatus === "active"
                      ? "이 캠페인을 일시정지하시겠습니까?"
                      : "이 캠페인을 활성화하시겠습니까?"}
                  </p>
                  <div className="p-4 bg-warning/10 rounded-lg">
                    <p className="text-sm text-warning-600">
                      {pendingSwitch?.currentStatus === "active"
                        ? "⚠️ 캠페인이 일시정지되면 광고 게재가 중단됩니다."
                        : "✓ 캠페인이 활성화되면 즉시 광고가 게재됩니다."}
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onSwitchModalClose}>
                  취소
                </Button>
                <Button
                  color={pendingSwitch?.currentStatus === "active" ? "warning" : "success"}
                  onPress={() => {
                    if (pendingSwitch) {
                      onToggleStatus?.(pendingSwitch.id, pendingSwitch.currentStatus);
                      toast.success({
                        title: "상태 변경 완료",
                        description:
                          pendingSwitch.currentStatus === "active"
                            ? "캠페인이 일시정지되었습니다."
                            : "캠페인이 활성화되었습니다.",
                      });
                    }
                    setPendingSwitch(null);
                    onSwitchModalClose();
                  }}
                >
                  {pendingSwitch?.currentStatus === "active" ? "일시정지" : "활성화"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
