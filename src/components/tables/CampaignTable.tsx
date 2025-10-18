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
import { GripVertical, ChevronUp, ChevronDown } from "lucide-react";

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
}

// 드래그 가능한 헤더 컴포넌트
function DraggableTableHeader({ header }: { header: any }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: header.column.id,
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
        <div
          {...attributes}
          {...listeners}
          className="cursor-move hover:text-primary"
        >
          <GripVertical className="w-4 h-4" />
        </div>
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
              ) : null}
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
}: CampaignTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

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
          const isEditing = editingCampaigns.has(row.original.id);
          return isEditing ? (
            <Input
              size="sm"
              value={getValue() as string}
              onChange={(e) =>
                onCampaignChange?.(row.original.id, "name", e.target.value)
              }
            />
          ) : (
            <div>
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
          const isEditing = editingCampaigns.has(row.original.id);
          return isEditing ? (
            <Input
              size="sm"
              type="number"
              value={getValue() as number}
              onChange={(e) =>
                onCampaignChange?.(
                  row.original.id,
                  "budget",
                  parseInt(e.target.value)
                )
              }
            />
          ) : (
            <span>₩{((getValue() as number) / 1000).toFixed(0)}K</span>
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
              <div>₩{(spent / 1000).toFixed(0)}K</div>
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
          const isEditing = editingCampaigns.has(row.original.id);
          return (
            <div className="flex gap-2 items-center">
              <Switch
                size="sm"
                isSelected={row.original.status === "active"}
                onValueChange={() =>
                  onToggleStatus?.(row.original.id, row.original.status)
                }
              />
              <Button
                size="sm"
                variant="flat"
                color={isEditing ? "success" : "primary"}
                onPress={() =>
                  isEditing
                    ? onSaveCampaign?.(row.original.id)
                    : onEditCampaign?.(row.original.id)
                }
              >
                {isEditing ? "저장" : "수정"}
              </Button>
            </div>
          );
        },
      },
    ],
    [editingCampaigns, onCampaignChange, onToggleStatus, onEditCampaign, onSaveCampaign]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnOrder,
      globalFilter,
      rowSelection: selectedRows,
    },
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setSelectedRows,
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

  return (
    <div className="space-y-4">
      {/* 검색 및 필터 */}
      <div className="flex justify-between items-center">
        <Input
          placeholder="캠페인 검색..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
          size="sm"
        />
        <div className="text-sm text-default-500">
          선택됨: {Object.keys(selectedRows).length}개
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
                items={columnOrder}
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
    </div>
  );
}
