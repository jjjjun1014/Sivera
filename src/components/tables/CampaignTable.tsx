"use client";

import { useState, useMemo, useEffect } from "react";
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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import { GripVertical, ChevronUp, ChevronDown, Settings2 } from "lucide-react";
import { toast } from "@/utils/toast";
import { ColumnManagerModal, ColumnOption } from "@/components/modals/ColumnManagerModal";

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
  onCampaignChange?: (id: number, field: string, value: any) => void;
  onToggleStatus?: (id: number, currentStatus: string) => void;
  editingCampaigns?: Set<number>;
  onEditCampaign?: (id: number) => void;
  onSaveCampaign?: (id: number) => void;
  initialColumnOrder?: string[];
  initialColumnVisibility?: Record<string, boolean>;
  onColumnOrderChange?: (order: string[]) => void;
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;
}

// 고정된 컬럼 ID (드래그 불가)
const PINNED_COLUMN_IDS = ["select", "actions"];

// 드래그 가능한 헤더 컴포넌트
function DraggableTableHeader({ header }: { header: any }) {
  const isPinned = PINNED_COLUMN_IDS.includes(header.column.id);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: header.column.id,
      disabled: isPinned,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const canSort = header.column.getCanSort();
  const sortDirection = header.column.getIsSorted();

  return (
    <th
      ref={setNodeRef}
      style={style}
      className="px-3 py-3 text-left text-xs font-semibold text-default-600 bg-default-100 border-b-2 border-divider"
    >
      <div className="flex items-center gap-2">
        {!isPinned && (
          <div
            {...attributes}
            {...listeners}
            className="cursor-move hover:bg-primary/10 px-1 rounded transition-colors"
          >
            <div className="flex gap-0.5">
              <div className="w-0.5 h-4 bg-default-300 rounded-full"></div>
              <div className="w-0.5 h-4 bg-default-300 rounded-full"></div>
            </div>
          </div>
        )}
        <button
          onClick={header.column.getToggleSortingHandler()}
          className={`flex items-center gap-1 ${
            canSort ? "cursor-pointer hover:text-primary" : ""
          }`}
          disabled={!canSort}
        >
          <span>
            {flexRender(header.column.columnDef.header, header.getContext())}
          </span>
          {canSort && (
            <span className="text-default-400">
              {sortDirection === "asc" ? (
                <ChevronUp className="w-3 h-3" />
              ) : sortDirection === "desc" ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <div className="flex flex-col">
                  <ChevronUp className="w-3 h-3 -mb-1 opacity-30" />
                  <ChevronDown className="w-3 h-3 opacity-30" />
                </div>
              )}
            </span>
          )}
        </button>
      </div>
    </th>
  );
}

export function CampaignTable({
  data,
  onCampaignChange,
  onToggleStatus,
  editingCampaigns = new Set(),
  onEditCampaign,
  onSaveCampaign,
  initialColumnOrder = [],
  initialColumnVisibility = {},
  onColumnOrderChange,
  onColumnVisibilityChange,
}: CampaignTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(initialColumnOrder);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility);

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
  const [editingCell, setEditingCell] = useState<{ id: number; field: string } | null>(null);
  const [tempValues, setTempValues] = useState<Record<string, any>>({});
  const [pendingChange, setPendingChange] = useState<{
    id: number;
    field: string;
    value: any;
    oldValue: any;
  } | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
  const confirmChange = () => {
    if (pendingChange) {
      onCampaignChange?.(pendingChange.id, pendingChange.field, pendingChange.value);

      // 필드명 한글 매핑
      const fieldNames: Record<string, string> = {
        name: "캠페인명",
        budget: "예산",
      };

      toast.success({
        title: "수정 완료",
        description: `${fieldNames[pendingChange.field]}이(가) 성공적으로 변경되었습니다.`,
      });

      setPendingChange(null);
      onClose();
    }
  };

  // 변경 취소
  const cancelChange = () => {
    setPendingChange(null);
    onClose();
    setEditingCell(null);
    // 임시값 초기화
    if (pendingChange) {
      const key = `${pendingChange.id}-${pendingChange.field}`;
      setTempValues((prev) => {
        const newValues = { ...prev };
        delete newValues[key];
        return newValues;
      });
    }
  };

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
          const isEditing = editingCell?.id === row.original.id && editingCell?.field === "name";
          const key = `${row.original.id}-name`;

          return isEditing ? (
            <Input
              size="sm"
              autoFocus
              value={tempValues[key] ?? (getValue() as string)}
              onChange={(e) => {
                setTempValues((prev) => ({ ...prev, [key]: e.target.value }));
              }}
              onBlur={() => {
                const newValue = tempValues[key] ?? (getValue() as string);
                const oldValue = getValue() as string;

                // 값이 변경되지 않았으면 그냥 종료
                if (newValue === oldValue) {
                  setEditingCell(null);
                  return;
                }

                setPendingChange({
                  id: row.original.id,
                  field: "name",
                  value: newValue,
                  oldValue,
                });
                onOpen();
                setEditingCell(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const newValue = tempValues[key] ?? (getValue() as string);
                  const oldValue = getValue() as string;

                  // 값이 변경되지 않았으면 그냥 종료
                  if (newValue === oldValue) {
                    setEditingCell(null);
                    return;
                  }

                  setPendingChange({
                    id: row.original.id,
                    field: "name",
                    value: newValue,
                    oldValue,
                  });
                  onOpen();
                  setEditingCell(null);
                } else if (e.key === "Escape") {
                  setEditingCell(null);
                  setTempValues((prev) => {
                    const newValues = { ...prev };
                    delete newValues[key];
                    return newValues;
                  });
                }
              }}
            />
          ) : (
            <div
              className="cursor-pointer hover:bg-default-100 p-2 rounded transition-colors"
              onClick={() => {
                setEditingCell({ id: row.original.id, field: "name" });
                setTempValues((prev) => ({ ...prev, [key]: getValue() as string }));
              }}
            >
              <div className="font-medium">{getValue() as string}</div>
              <div className="text-xs text-default-500">ID: {row.original.id}</div>
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
          const statusColorMap: Record<string, "success" | "warning" | "danger"> = {
            active: "success",
            paused: "warning",
            stopped: "danger",
          };
          const statusTextMap: Record<string, string> = {
            active: "활성",
            paused: "일시정지",
            stopped: "중지됨",
          };

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
          const isEditing = editingCell?.id === row.original.id && editingCell?.field === "budget";
          const key = `${row.original.id}-budget`;

          return isEditing ? (
            <Input
              size="sm"
              type="text"
              autoFocus
              value={tempValues[key] ?? (getValue() as number).toString()}
              onChange={(e) => {
                setTempValues((prev) => ({ ...prev, [key]: e.target.value }));
              }}
              onBlur={() => {
                const value = tempValues[key] ?? (getValue() as number).toString();
                const numValue = parseInt(value.replace(/[^0-9]/g, ""));

                if (isNaN(numValue) || value.replace(/[^0-9]/g, "") === "") {
                  toast.error({
                    title: "입력 오류",
                    description: "숫자만 입력하세요!",
                  });
                  setEditingCell(null);
                  setTempValues((prev) => {
                    const newValues = { ...prev };
                    delete newValues[key];
                    return newValues;
                  });
                  return;
                }

                const oldValue = getValue() as number;

                // 값이 변경되지 않았으면 그냥 종료
                if (numValue === oldValue) {
                  setEditingCell(null);
                  return;
                }

                setPendingChange({
                  id: row.original.id,
                  field: "budget",
                  value: numValue,
                  oldValue,
                });
                onOpen();
                setEditingCell(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = tempValues[key] ?? (getValue() as number).toString();
                  const numValue = parseInt(value.replace(/[^0-9]/g, ""));

                  if (isNaN(numValue) || value.replace(/[^0-9]/g, "") === "") {
                    toast.error({
                      title: "입력 오류",
                      description: "숫자만 입력하세요!",
                    });
                    setEditingCell(null);
                    setTempValues((prev) => {
                      const newValues = { ...prev };
                      delete newValues[key];
                      return newValues;
                    });
                    return;
                  }

                  const oldValue = getValue() as number;

                  // 값이 변경되지 않았으면 그냥 종료
                  if (numValue === oldValue) {
                    setEditingCell(null);
                    return;
                  }

                  setPendingChange({
                    id: row.original.id,
                    field: "budget",
                    value: numValue,
                    oldValue,
                  });
                  onOpen();
                  setEditingCell(null);
                } else if (e.key === "Escape") {
                  setEditingCell(null);
                  setTempValues((prev) => {
                    const newValues = { ...prev };
                    delete newValues[key];
                    return newValues;
                  });
                }
              }}
            />
          ) : (
            <div
              className="cursor-pointer hover:bg-default-100 p-2 rounded transition-colors"
              onClick={() => {
                setEditingCell({ id: row.original.id, field: "budget" });
                setTempValues((prev) => ({ ...prev, [key]: (getValue() as number).toString() }));
              }}
            >
              ₩{(getValue() as number).toLocaleString()}
            </div>
          );
        },
      },
      {
        id: "spent",
        accessorKey: "spent",
        header: "소진",
        cell: ({ getValue, row }) => {
          const spent = getValue() as number;
          const budget = row.original.budget;
          const percentage = (spent / budget) * 100;
          return (
            <div>
              <div>₩{spent.toLocaleString()}</div>
              <div className="text-xs text-default-500">
                {percentage.toFixed(1)}%
              </div>
            </div>
          );
        },
      },
      {
        id: "impressions",
        accessorKey: "impressions",
        header: "노출수",
        cell: ({ getValue }) => (getValue() as number).toLocaleString(),
      },
      {
        id: "clicks",
        accessorKey: "clicks",
        header: "클릭수",
        cell: ({ getValue }) => (getValue() as number).toLocaleString(),
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
        cell: ({ getValue }) => (getValue() as number).toLocaleString(),
      },
      {
        id: "cpc",
        accessorKey: "cpc",
        header: "CPC",
        cell: ({ getValue }) => `₩${(getValue() as number).toLocaleString()}`,
      },
      {
        id: "cpa",
        accessorKey: "cpa",
        header: "CPA",
        cell: ({ getValue }) => `₩${(getValue() as number).toLocaleString()}`,
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
                onValueChange={() =>
                  onToggleStatus?.(row.original.id, row.original.status)
                }
              />
            </div>
          );
        },
      },
    ],
    [onCampaignChange, onToggleStatus, editingCell, tempValues, onOpen]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnOrder,
      globalFilter,
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
        <Input
          placeholder="캠페인 검색..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
          size="sm"
        />
        <div className="flex items-center gap-3">
          <div className="text-sm text-default-500">
            선택됨: {Object.keys(selectedRows).length}개
          </div>
          <Button
            size="sm"
            variant="flat"
            startContent={<Settings2 className="w-4 h-4" />}
            onPress={onColumnModalOpen}
          >
            컬럼 관리
          </Button>
        </div>
      </div>

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
              {table.getRowModel().rows.map((row) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </DndContext>

      {/* 페이지네이션 */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-default-500">
          {table.getFilteredRowModel().rows.length}개 중{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}
          -
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}
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
                              ? `₩${pendingChange.oldValue.toLocaleString()}`
                              : pendingChange.oldValue}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-default-500 mb-1">변경 후</p>
                          <p className="text-sm font-medium text-success">
                            {pendingChange.field === "budget"
                              ? `₩${pendingChange.value.toLocaleString()}`
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
    </div>
  );
}
