/**
 * 공통 테이블 타입 정의
 */

export interface BaseTableProps<T = any> {
  data: T[];
  onRowChange?: (id: number | string, field: string, value: any) => void;
  onToggleStatus?: (id: number | string, currentStatus: string) => void;
  initialColumnOrder?: string[];
  initialColumnVisibility?: Record<string, boolean>;
  onColumnOrderChange?: (order: string[]) => void;
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;
  onRowClick?: (id: number | string) => void;
  isLoading?: boolean;
  loadingMessage?: string;
  totalCount?: number;
}

export interface EditingCellState {
  id: number | string;
  field: string;
}

export interface PendingChange {
  id: number | string;
  field: string;
  value: any;
  oldValue: any;
}

export const PINNED_COLUMN_IDS = ["select", "actions"] as const;
