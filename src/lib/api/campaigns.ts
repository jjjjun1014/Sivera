/**
 * Campaign API 인터페이스
 * 백엔드 연동을 위한 API 추상화 레이어
 * 
 * 사용 예시:
 * ```typescript
 * // 페이지 컴포넌트에서
 * const {
 *   data: campaigns,
 *   isLoading,
 *   total,
 *   loadingMessage,
 *   ...pagination
 * } = useServerPagination({
 *   fetchFn: campaignAPI.getAll,
 *   initialPageSize: 50,
 * });
 * 
 * <CampaignTable
 *   data={campaigns}
 *   isLoading={isLoading}
 *   totalCount={total}
 *   loadingMessage={loadingMessage}
 * />
 * ```
 */

import { apiClient } from './client';
import type { 
  PaginatedResponse, 
  QueryParams, 
  CampaignUpdateRequest, 
  BulkUpdateRequest,
  BulkOperationResponse 
} from '@/types/api.types';

// 환경 변수로 Mock/Real API 전환
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

/**
 * Campaign 타입 (실제 백엔드 스키마에 맞게 조정 필요)
 */
export interface Campaign {
  id: number;
  name: string;
  status: 'active' | 'paused' | 'stopped';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  cpc: number;
  cpa: number;
  roas: number;
  platformId: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mock 데이터 (개발용)
 */
const mockCampaigns: Campaign[] = [
  // TODO: mock-data에서 import
];

/**
 * Mock API 구현
 */
const mockAPI = {
  async getAll(params: QueryParams): Promise<PaginatedResponse<Campaign>> {
    // Mock 페이지네이션 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 800)); // 로딩 시뮬레이션

    const { page = 1, pageSize = 50, search, filters } = params;
    
    let filtered = [...mockCampaigns];
    
    // 검색 적용
    if (search) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // 필터 적용 (간단한 구현)
    if (filters) {
      // 실제로는 filters 배열을 순회하며 적용
    }
    
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = filtered.slice(start, end);
    
    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasPrevious: page > 1,
        hasNext: end < total,
      },
    };
  },

  async update(request: CampaignUpdateRequest): Promise<Campaign> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockCampaigns.findIndex(c => c.id === request.id);
    if (index === -1) {
      throw new Error('Campaign not found');
    }
    
    mockCampaigns[index] = {
      ...mockCampaigns[index],
      ...request.updates,
      updatedAt: new Date().toISOString(),
    };
    
    return mockCampaigns[index];
  },

  async bulkUpdate(request: BulkUpdateRequest<Campaign>): Promise<BulkOperationResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let success = 0;
    const errors: { id: number | string; error: string }[] = [];
    
    for (const id of request.ids) {
      try {
        await mockAPI.update({ id: Number(id), updates: request.updates });
        success++;
      } catch (error) {
        errors.push({ id, error: (error as Error).message });
      }
    }
    
    return {
      success,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    };
  },

  async toggleStatus(id: number): Promise<Campaign> {
    const campaign = mockCampaigns.find(c => c.id === id);
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    return mockAPI.update({ id, updates: { status: newStatus } });
  },
};

/**
 * 실제 API 구현
 */
const realAPI = {
  async getAll(params: QueryParams): Promise<PaginatedResponse<Campaign>> {
    // QueryParams를 적절한 형식으로 변환
    const queryString = new URLSearchParams();
    if (params.page) queryString.append('page', params.page.toString());
    if (params.pageSize) queryString.append('pageSize', params.pageSize.toString());
    if (params.search) queryString.append('search', params.search);
    if (params.sort) queryString.append('sort', JSON.stringify(params.sort));
    if (params.filters) queryString.append('filters', JSON.stringify(params.filters));
    
    return apiClient.get<PaginatedResponse<Campaign>>(`/campaigns?${queryString.toString()}`);
  },

  async update(request: CampaignUpdateRequest): Promise<Campaign> {
    return apiClient.patch<Campaign>(`/campaigns/${request.id}`, request.updates);
  },

  async bulkUpdate(request: BulkUpdateRequest<Campaign>): Promise<BulkOperationResponse> {
    return apiClient.post<BulkOperationResponse>('/campaigns/bulk-update', request);
  },

  async toggleStatus(id: number): Promise<Campaign> {
    return apiClient.post<Campaign>(`/campaigns/${id}/toggle-status`, {});
  },
};

/**
 * Export: Mock/Real 자동 전환
 */
export const campaignAPI = USE_MOCK ? mockAPI : realAPI;

/**
 * 사용 예시:
 * 
 * // 1. 페이지네이션과 함께 사용
 * const pagination = useServerPagination({
 *   fetchFn: campaignAPI.getAll,
 *   initialPageSize: 50,
 * });
 * 
 * // 2. 단일 업데이트
 * const handleUpdate = async (id: number, field: string, value: any) => {
 *   try {
 *     await campaignAPI.update({ id, updates: { [field]: value } });
 *     pagination.refresh(); // 데이터 새로고침
 *   } catch (error) {
 *     console.error('Update failed:', error);
 *   }
 * };
 * 
 * // 3. 일괄 업데이트
 * const handleBulkUpdate = async (ids: number[], updates: Partial<Campaign>) => {
 *   const result = await campaignAPI.bulkUpdate({ ids, updates });
 *   console.log(`성공: ${result.success}, 실패: ${result.failed}`);
 * };
 */
