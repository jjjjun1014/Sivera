/**
 * API 공통 타입 정의
 * 백엔드 연동을 위한 표준 인터페이스
 */

/**
 * 페이지네이션 정보
 */
export interface PaginationInfo {
  /** 현재 페이지 (1부터 시작) */
  page: number;
  /** 페이지당 항목 수 */
  pageSize: number;
  /** 전체 항목 수 */
  total: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 이전 페이지 존재 여부 */
  hasPrevious: boolean;
  /** 다음 페이지 존재 여부 */
  hasNext: boolean;
}

/**
 * 페이지네이션된 API 응답
 */
export interface PaginatedResponse<T> {
  /** 데이터 배열 */
  data: T[];
  /** 페이지네이션 메타데이터 */
  pagination: PaginationInfo;
  /** 응답 타임스탬프 */
  timestamp?: string;
}

/**
 * API 에러 응답
 */
export interface APIErrorResponse {
  /** 에러 메시지 */
  message: string;
  /** 에러 코드 */
  code: string;
  /** HTTP 상태 코드 */
  status: number;
  /** 상세 에러 정보 */
  details?: unknown;
  /** 타임스탬프 */
  timestamp: string;
}

/**
 * 정렬 옵션
 */
export interface SortOption {
  /** 정렬 필드 */
  field: string;
  /** 정렬 방향 */
  direction: 'asc' | 'desc';
}

/**
 * 필터 옵션
 */
export interface FilterOption {
  /** 필터 필드 */
  field: string;
  /** 비교 연산자 */
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
  /** 필터 값 */
  value: any;
}

/**
 * 검색/필터/정렬을 포함한 쿼리 파라미터
 */
export interface QueryParams {
  /** 페이지 번호 */
  page?: number;
  /** 페이지 크기 */
  pageSize?: number;
  /** 검색 쿼리 */
  search?: string;
  /** 정렬 옵션 */
  sort?: SortOption[];
  /** 필터 옵션 */
  filters?: FilterOption[];
}

/**
 * 로딩 상태
 */
export interface LoadingState {
  /** 로딩 중 여부 */
  isLoading: boolean;
  /** 로딩 메시지 */
  message?: string;
  /** 진행률 (0-100) */
  progress?: number;
  /** 전체 항목 수 (로딩 중 표시용) */
  total?: number;
  /** 현재 로드된 항목 수 */
  loaded?: number;
}

/**
 * 캠페인 업데이트 요청
 */
export interface CampaignUpdateRequest {
  /** 캠페인 ID */
  id: number;
  /** 업데이트할 필드와 값 */
  updates: {
    name?: string;
    budget?: number;
    status?: 'active' | 'paused' | 'stopped';
    [key: string]: any;
  };
}

/**
 * 일괄 업데이트 요청
 */
export interface BulkUpdateRequest<T> {
  /** 업데이트할 항목 ID 배열 */
  ids: (number | string)[];
  /** 공통 업데이트 값 */
  updates: Partial<T>;
}

/**
 * 일괄 작업 응답
 */
export interface BulkOperationResponse {
  /** 성공한 항목 수 */
  success: number;
  /** 실패한 항목 수 */
  failed: number;
  /** 실패한 항목 상세 */
  errors?: Array<{
    id: number | string;
    error: string;
  }>;
}
