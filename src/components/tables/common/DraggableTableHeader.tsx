import { memo } from "react";
import { flexRender } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronUp, ChevronDown } from "lucide-react";

interface DraggableTableHeaderProps {
  header: any;
  pinnedColumnIds?: string[];
}

/**
 * 드래그 가능한 테이블 헤더 컴포넌트
 * - DnD Kit으로 컬럼 순서 변경 가능
 * - 정렬 기능 내장
 * - 고정된 컬럼은 드래그 불가
 */
export const DraggableTableHeader = memo(function DraggableTableHeader({
  header,
  pinnedColumnIds = ["select", "actions"],
}: DraggableTableHeaderProps) {
  const isPinned = pinnedColumnIds.includes(header.column.id);

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
});
