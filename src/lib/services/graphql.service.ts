/**
 * GraphQL Service
 * 
 * Amplify Gen 2 GraphQL API 호출 레이어
 * 백엔드 스키마와 1:1 매칭
 */

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/types/schema';
import { configureAmplify } from '@/lib/amplify-client';

// Lazy client initialization
let client: ReturnType<typeof generateClient<Schema>> | null = null;

function getClient() {
  if (!client) {
    configureAmplify();
    client = generateClient<Schema>({
      authMode: 'userPool', // Use Cognito user pool authentication
    });
  }
  return client;
}

// ===================================================================
// 타입 헬퍼
// ===================================================================

type ModelName = keyof Schema;
type SelectionSet = string[];

export interface ListOptions {
  filter?: Record<string, any>;
  limit?: number;
  nextToken?: string;
  selectionSet?: SelectionSet;
}

export interface GetOptions {
  id: string;
  selectionSet?: SelectionSet;
}

export interface CreateOptions<T> {
  data: T;
  selectionSet?: SelectionSet;
}

export interface UpdateOptions<T> {
  id: string;
  data: Partial<T>;
  selectionSet?: SelectionSet;
}

export interface DeleteOptions {
  id: string;
}

// ===================================================================
// 범용 CRUD 함수
// ===================================================================

/**
 * List: 모델의 리스트 조회
 */
export async function list<T>(
  modelName: string,
  options: ListOptions = {}
): Promise<{ data: T[]; nextToken?: string; error?: any }> {
  try {
    const { filter, limit, nextToken, selectionSet } = options;
    
    // @ts-ignore - 동적 모델 접근
    const response = await getClient().models[modelName].list({
      filter,
      limit,
      nextToken,
      selectionSet,
    });

    return {
      data: response.data as T[],
      nextToken: response.nextToken,
    };
  } catch (error) {
    console.error(`Error listing ${modelName}:`, error);
    return { data: [], error };
  }
}

/**
 * Get: 단일 모델 조회
 */
export async function get<T>(
  modelName: string,
  options: GetOptions
): Promise<{ data: T | null; error?: any }> {
  try {
    const { id, selectionSet } = options;
    
    // @ts-ignore - 동적 모델 접근
    const response = await getClient().models[modelName].get({
      id,
      selectionSet,
    });

    return { data: response.data as T };
  } catch (error) {
    console.error(`Error getting ${modelName}:`, error);
    return { data: null, error };
  }
}

/**
 * Create: 모델 생성
 */
export async function create<T>(
  modelName: string,
  options: CreateOptions<Partial<T>>
): Promise<{ data: T | null; error?: any }> {
  try {
    const { data, selectionSet } = options;
    
    console.log(`📤 Creating ${modelName} with authMode: userPool`);
    
    // @ts-ignore - 동적 모델 접근
    const response = await getClient().models[modelName].create({
      ...data,
      selectionSet,
    });

    console.log(`✅ ${modelName} created successfully:`, response);
    return { data: response.data as T };
  } catch (error: any) {
    console.error(`❌ Error creating ${modelName}:`, error);
    console.error(`❌ Error details:`, {
      message: error.message,
      errors: error.errors,
      name: error.name,
    });
    return { data: null, error };
  }
}

/**
 * Update: 모델 업데이트
 */
export async function update<T>(
  modelName: string,
  options: UpdateOptions<T>
): Promise<{ data: T | null; error?: any }> {
  try {
    const { id, data, selectionSet } = options;
    
    // @ts-ignore - 동적 모델 접근
    const response = await getClient().models[modelName].update({
      id,
      ...data,
      selectionSet,
    });

    return { data: response.data as T };
  } catch (error) {
    console.error(`Error updating ${modelName}:`, error);
    return { data: null, error };
  }
}

/**
 * Delete: 모델 삭제
 */
export async function remove(
  modelName: string,
  options: DeleteOptions
): Promise<{ success: boolean; error?: any }> {
  try {
    const { id } = options;
    
    // @ts-ignore - 동적 모델 접근
    await getClient().models[modelName].delete({ id });

    return { success: true };
  } catch (error) {
    console.error(`Error deleting ${modelName}:`, error);
    return { success: false, error };
  }
}

// ===================================================================
// 커스텀 쿼리 (Secondary Index 활용)
// ===================================================================

/**
 * Query: Secondary Index를 사용한 쿼리
 */
export async function query<T>(
  modelName: string,
  indexName: string,
  keyCondition: Record<string, any>,
  options: ListOptions = {}
): Promise<{ data: T[]; nextToken?: string; error?: any }> {
  try {
    const { filter, limit, nextToken, selectionSet } = options;
    
    const client = getClient();
    const model = client.models[modelName as keyof typeof client.models];
    
    if (!model) {
      throw new Error(`Model ${modelName} not found`);
    }

    // Secondary index 쿼리는 list() 메서드 사용
    // @ts-ignore - 동적 타입
    const response = await model.list({
      filter: {
        ...keyCondition,
        ...(filter || {}),
      },
      limit,
      nextToken,
      selectionSet,
    });

    return {
      data: response.data as T[],
      nextToken: response.nextToken || undefined,
    };
  } catch (error) {
    console.error(`Error querying ${modelName} with ${indexName}:`, error);
    return { data: [], error };
  }
}

// ===================================================================
// 에러 헬퍼
// ===================================================================

/**
 * GraphQL 에러 메시지 추출
 */
export function getErrorMessage(error: any): string {
  if (!error) return '알 수 없는 오류가 발생했습니다.';
  
  // GraphQL 에러
  if (error.errors && Array.isArray(error.errors)) {
    return error.errors[0]?.message || '요청 처리 중 오류가 발생했습니다.';
  }
  
  // 일반 에러
  return error.message || error.toString();
}

/**
 * 권한 에러 확인
 */
export function isAuthorizationError(error: any): boolean {
  const message = getErrorMessage(error);
  return message.includes('Unauthorized') || message.includes('권한');
}

/**
 * 네트워크 에러 확인
 */
export function isNetworkError(error: any): boolean {
  const message = getErrorMessage(error);
  return message.includes('Network') || message.includes('네트워크');
}

// ===================================================================
// Export client for direct usage
// ===================================================================

export { getClient };
