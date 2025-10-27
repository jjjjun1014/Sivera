/**
 * AI Rate Limiting 설정 가이드
 * 
 * 이 문서는 AWS Cognito/DB 연동 후 Rate Limiting을 활성화하는 방법을 설명합니다.
 */

# AI Rate Limiting 활성화 가이드

## 📋 현재 상태
- ✅ Rate Limiter 인프라 구축 완료
- ✅ 플랜별 제한 설정 완료
- ⚠️ 실제 차단은 비활성화 (테스트 모드)
- ⚠️ IP 기반 임시 제한만 로그 기록

## 🔧 AWS 연동 후 활성화 단계

### 1. 사용자 인증 추가
```typescript
// src/app/api/ai/chat/route.ts 에서

// TODO 주석 제거하고 실제 함수 구현
const userId = await getUserIdFromToken(request);
const userPlan = await getUserPlan(userId);
```

### 2. Rate Limit 활성화
```typescript
// 현재 주석 처리된 부분 활성화
const rateLimit = checkRateLimit(userId, userPlan);
if (!rateLimit.allowed) {
  return NextResponse.json(
    { error: '...' },
    { status: 429 }
  );
}
```

### 3. 토큰 제한 활성화
```typescript
const tokenLimit = checkTokenLimit(userId, estimatedTokens, userPlan);
if (!tokenLimit.allowed) {
  return NextResponse.json(
    { error: '...' },
    { status: 429 }
  );
}
```

## 📊 플랜별 제한 설정

### Free 플랜
- 요청 제한: 10회/시간
- 토큰 제한: 50,000 토큰/월
- IP 제한: 5회/시간

### Standard 플랜
- 요청 제한: 50회/시간
- 토큰 제한: 500,000 토큰/월

### Pro 플랜
- 요청 제한: 200회/시간 (사실상 무제한)
- 토큰 제한: 2,000,000 토큰/월

## 🗄️ 영구 저장소 연동 (권장)

### DynamoDB 스키마 예시
```
Table: ai_usage
- userId (PK)
- month (SK)
- requestCount
- tokenCount
- resetTime
- ttl
```

### Redis 캐시 (선택)
```
Key: rate:${userId}:${hour}
Value: requestCount
TTL: 1 hour
```

## 🧪 테스트 방법

### 로컬 테스트
```bash
# 사용량 초기화
curl -X POST http://localhost:3000/api/ai/reset-usage \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user"}'

# 제한 테스트
for i in {1..12}; do
  curl -X POST http://localhost:3000/api/ai/chat \
    -H "Content-Type: application/json" \
    -d '{"message": "테스트"}' && echo
done
```

## 📝 체크리스트

- [ ] AWS Cognito 연동
- [ ] getUserIdFromToken() 구현
- [ ] getUserPlan() 구현
- [ ] Rate Limit 활성화 (주석 제거)
- [ ] Token Limit 활성화 (주석 제거)
- [ ] DynamoDB/Redis 연동 (선택)
- [ ] 프론트엔드 사용량 표시 추가
- [ ] 모니터링 대시보드 구축

## 🚨 주의사항

1. **점진적 활성화**: 한 번에 모든 제한을 켜지 말고 단계별로 활성화
2. **모니터링**: CloudWatch로 429 에러 비율 모니터링
3. **사용자 안내**: 제한 도달 시 명확한 안내 메시지 제공
4. **화이트리스트**: 내부 테스트 계정은 제한 제외

## 📞 문의
Rate Limiting 관련 이슈는 개발팀에 문의하세요.
