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
import { Tooltip } from "@heroui/tooltip";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { ChevronUp, ChevronDown, Settings2, Lock, Edit2 } from "lucide-react";
import { toast } from "@/utils/toast";
import { ColumnManagerModal, ColumnOption } from "@/components/modals/ColumnManagerModal";
import type { AdGroup } from "@/types/campaign";
import { isBudgetEditable } from "@/types/campaign";

interface AdGroupTableProps {
  data: AdGroup[];
  onAdGroupChange?: (id: number | string, field: string, value: any) => void;
  onToggleStatus?: (id: number | string, currentStatus: string) => void;
  showCampaignColumn?: boolean;
  initialColumnOrder?: string[];
  initialColumnVisibility?: Record<string, boolean>;
  onColumnOrderChange?: (order: string[]) => void;
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;
  onAdGroupClick?: (id: number | string) => void;
}

const PINNED_COLUMN_IDS = ["select", "actions"];

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
      className="px-3 py-3 text-left text-xs font-semibold text-default-600 bg-default-100 border-b-2 border-divider whitespace-nowrap"
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

export function AdGroupTable({
  data,
  onAdGroupChange,
  onToggleStatus,
  showCampaignColumn = true,
  initialColumnOrder = [],
  initialColumnVisibility = {},
  onColumnOrderChange,
  onColumnVisibilityChange,
  onAdGroupClick,
}: AdGroupTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(initialColumnOrder);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility);
  const [editingCell, setEditingCell] = useState<{ id: number | string; field: string } | null>(null);
  const [tempValues, setTempValues] = useState<Record<string, any>>({});
  const [pendingChange, setPendingChange] = useState<{
    id: number | string;
    field: string;
    value: any;
    oldValue: any;
  } | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isColumnModalOpen, onOpen: onColumnModalOpen, onClose: onColumnModalClose } = useDisclosure();

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

  const columnOptions: ColumnOption[] = [
    { id: "campaignName", label: "캠페인명", category: "basic" },
    { id: "name", label: "광고그룹명", category: "basic" },
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

  const confirmChange = () => {
    if (pendingChange) {
      onAdGroupChange?.(pendingChange.id, pendingChange.field, pendingChange.value);

      toast.success({
        title: "수정 완료",
        description: "광고그룹명이 성공적으로 변경되었습니다.",
      });

      setPendingChange(null);
      onClose();
    }
  };

  const cancelChange = () => {
    setPendingChange(null);
    onClose();
    setEditingCell(null);
    if (pendingChange) {
      const key = `${pendingChange.id}-${pendingChange.field}`;
      setTempValues((prev) => {
        const newValues = { ...prev };
        delete newValues[key];
        return newValues;
      });
    }
  };

  const columns = useMemo<ColumnDef<AdGroup>[]>(
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
      ...(showCampaignColumn
        ? [
            {
              id: "campaignName",
              accessorKey: "campaignName",
              header: "캠페인명",
              cell: ({ getValue }: any) => (
                <div className="text-sm text-default-600 max-w-xs truncate" title={getValue() as string}>{getValue() as string}</div>
              ),
            } as ColumnDef<AdGroup>,
          ]
        : []),
      {
        id: "name",
        accessorKey: "name",
        header: "광고그룹명",
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
            <div className="flex items-center gap-2 p-2 max-w-xs">
              <div
                className="cursor-pointer hover:bg-default-100 px-2 py-1 rounded transition-colors flex-1 min-w-0"
                onClick={() => {
                  if (onAdGroupClick) {
                    onAdGroupClick(row.original.id);
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
                  setEditingCell({ id: row.original.id, field: "name" });
                  setTempValues((prev) => ({ ...prev, [key]: getValue() as string }));
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
            <Chip color={statusColorMap[status]} size="sm" variant="flat">
              {statusTextMap[status]}
            </Chip>
          );
        },
      },
      {
        id: "budget",
        accessorKey: "budget",
        header: "예산",
        cell: ({ row, getValue }) => {
          const budget = getValue() as number | undefined;
          if (budget === undefined) return null;

          const budgetEditable = isBudgetEditable(row.original.campaignType);

          return (
            <div className="flex items-center gap-2 justify-end">
              <span className="whitespace-nowrap">₩{budget.toLocaleString()}</span>
              {!budgetEditable && (
                <Tooltip content="자동 예산 할당 캠페인" placement="left">
                  <Lock className="w-3 h-3 text-default-400" />
                </Tooltip>
              )}
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
        cell: ({ getValue }) => <span className="whitespace-nowrap">{(getValue() as number).toFixed(2)}%</span>,
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
                onValueChange={() =>
                  onToggleStatus?.(row.original.id, row.original.status)
                }
              />
            </div>
          );
        },
      },
    ],
    [onAdGroupChange, onToggleStatus, editingCell, tempValues, onOpen, showCampaignColumn]
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
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

  useEffect(() => {
    if (columnOrder.length === 0 && columns.length > 0) {
      setColumnOrder(columns.map((col) => col.id!).filter(Boolean));
    }
  }, [columns, columnOrder.length]);

  useEffect(() => {
    if (columnOrder.length > 0) {
      onColumnOrderChange?.(columnOrder);
    }
  }, [columnOrder, onColumnOrderChange]);

  const draggableColumnIds = columnOrder.filter(
    (id) => !PINNED_COLUMN_IDS.includes(id)
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="광고그룹 검색..."
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
                        <span className="text-sm font-medium text-default-700">광고그룹명</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-default-500 mb-1">변경 전</p>
                          <p className="text-sm font-medium text-danger">
                            {pendingChange.oldValue}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-default-500 mb-1">변경 후</p>
                          <p className="text-sm font-medium text-success">
                            {pendingChange.value}
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
