/**
 * Amplify Client Configuration for Frontend
 * 
 * 프론트엔드에서 백엔드 Amplify Gen 2 API와 통신하기 위한 설정
 */

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/types/schema';
import outputs from '../../amplify_outputs.json';

// Amplify 클라이언트 초기화
let isConfigured = false;

export function configureAmplify() {
  if (isConfigured) return;
  
  // Amplify Gen 2 설정 방식 (백엔드 amplify_outputs.json 사용)
  Amplify.configure(outputs, {
    ssr: true, // Next.js SSR 지원
  });

  isConfigured = true;
}

// GraphQL 클라이언트 생성
export const client = generateClient<Schema>();
