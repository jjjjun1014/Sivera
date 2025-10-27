/**
 * 서버 사이드 페이지네이션 Hook
 * 대량 데이터 처리를 위한 API 기반 페이지네이션
 */

import { useState, useCallback, useEffect } from 'react';
import type { PaginatedResponse, QueryParams } from '@/types/api.types';

interface UseServerPaginationOptions<T> {
  /** API 호출 함수 */
  fetchFn: (params: QueryParams) => Promise<PaginatedResponse<T>>;
  /** 초기 페이지 크기 */
  initialPageSize?: number;
  /** 자동 로드 여부 */
  autoLoad?: boolean;
  /** 에러 핸들러 */
  onError?: (error: Error) => void;
}

export function useServerPagination<T>({
  fetchFn,
  initialPageSize = 50,
  autoLoad = true,
  onError,
}: UseServerPaginationOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 검색/필터/정렬 상태
  const [search, setSearch] = useState<string>('');
  const [filters, setFilters] = useState<QueryParams['filters']>([]);
  const [sort, setSort] = useState<QueryParams['sort']>([]);

  // 데이터 로드 함수
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: QueryParams = {
        page,
        pageSize,
        search: search || undefined,
        filters: filters?.length ? filters : undefined,
        sort: sort?.length ? sort : undefined,
      };

      const response = await fetchFn(params);

      setData(response.data);
      setTotal(response.pagination.total);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, page, pageSize, search, filters, sort, onError]);

  // 초기 로드
  useEffect(() => {
    if (autoLoad) {
      loadData();
    }
  }, [autoLoad, loadData]);

  // 페이지 변경
  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const previousPage = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  // 검색
  const updateSearch = useCallback((query: string) => {
    setSearch(query);
    setPage(1); // 검색 시 첫 페이지로
  }, []);

  // 필터 업데이트
  const updateFilters = useCallback((newFilters: QueryParams['filters']) => {
    setFilters(newFilters);
    setPage(1); // 필터 변경 시 첫 페이지로
  }, []);

  // 정렬 업데이트
  const updateSort = useCallback((newSort: QueryParams['sort']) => {
    setSort(newSort);
    setPage(1); // 정렬 변경 시 첫 페이지로
  }, []);

  // 페이지 크기 변경
  const updatePageSize = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1); // 페이지 크기 변경 시 첫 페이지로
  }, []);

  // 새로고침
  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  // 로딩 메시지 생성
  const loadingMessage = isLoading
    ? total > 0
      ? `⏳ ${total.toLocaleString()}개 항목 중 ${data.length.toLocaleString()}개 로딩 중...`
      : '⏳ 데이터 로딩 중...'
    : undefined;

  return {
    // 데이터
    data,
    total,
    totalPages,
    
    // 페이지네이션 상태
    page,
    pageSize,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
    
    // 로딩 상태
    isLoading,
    error,
    loadingMessage,
    
    // 검색/필터/정렬
    search,
    filters,
    sort,
    
    // 액션
    goToPage,
    nextPage,
    previousPage,
    updateSearch,
    updateFilters,
    updateSort,
    updatePageSize,
    refresh,
    loadData,
  };
}
