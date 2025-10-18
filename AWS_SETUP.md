# AWS 인프라 설정 가이드

Sivera 프로젝트를 AWS에서 운영하기 위한 인프라 설정 가이드입니다.

## 필요한 AWS 서비스

### 1. AWS Cognito (사용자 인증)
- **User Pool 생성**
  - 이메일/비밀번호 기반 인증
  - 이메일 인증 활성화
  - MFA 설정 (선택사항)

```bash
# AWS CLI로 User Pool 생성
aws cognito-idp create-user-pool \
  --pool-name sivera-users \
  --auto-verified-attributes email \
  --policies "PasswordPolicy={MinimumLength=8,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true}"
```

### 2. AWS DynamoDB (데이터베이스)

#### 테이블 구조

**users 테이블**
```
PK: userId (String)
Attributes:
  - email (String)
  - name (String)
  - emailVerified (Boolean)
  - createdAt (String)
  - updatedAt (String)
```

**teams 테이블**
```
PK: teamId (String)
SK: userId (String)
GSI: userId-index
Attributes:
  - teamName (String)
  - role (String): owner | admin | member
  - invitedBy (String)
  - joinedAt (String)
```

**platform_configs 테이블**
```
PK: userId#platform (String)
Attributes:
  - configs (Map)
  - currentConfigId (String)
  - updatedAt (String)
```

**platform_credentials 테이블**
```
PK: userId#platform (String)
SK: accountId (String)
Attributes:
  - credentials (String) - KMS 암호화됨
  - status (String): active | inactive
  - createdAt (String)
  - lastSyncAt (String)
```

**campaigns 테이블**
```
PK: userId#platform#accountId (String)
SK: campaignId (String)
Attributes:
  - campaignData (Map)
  - status (String)
  - metrics (Map)
  - updatedAt (String)
```

#### DynamoDB 테이블 생성 스크립트

```bash
# users 테이블
aws dynamodb create-table \
  --table-name sivera-users \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# teams 테이블
aws dynamodb create-table \
  --table-name sivera-teams \
  --attribute-definitions \
    AttributeName=teamId,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=teamId,KeyType=HASH \
    AttributeName=userId,KeyType=RANGE \
  --global-secondary-indexes \
    '[{
      "IndexName": "userId-index",
      "KeySchema": [{"AttributeName":"userId","KeyType":"HASH"}],
      "Projection": {"ProjectionType":"ALL"}
    }]' \
  --billing-mode PAY_PER_REQUEST

# platform_configs 테이블
aws dynamodb create-table \
  --table-name sivera-platform-configs \
  --attribute-definitions AttributeName=userPlatform,AttributeType=S \
  --key-schema AttributeName=userPlatform,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# platform_credentials 테이블
aws dynamodb create-table \
  --table-name sivera-platform-credentials \
  --attribute-definitions \
    AttributeName=userPlatform,AttributeType=S \
    AttributeName=accountId,AttributeType=S \
  --key-schema \
    AttributeName=userPlatform,KeyType=HASH \
    AttributeName=accountId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST

# campaigns 테이블
aws dynamodb create-table \
  --table-name sivera-campaigns \
  --attribute-definitions \
    AttributeName=userPlatformAccount,AttributeType=S \
    AttributeName=campaignId,AttributeType=S \
  --key-schema \
    AttributeName=userPlatformAccount,KeyType=HASH \
    AttributeName=campaignId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
```

### 3. AWS KMS (자격증명 암호화)

```bash
# KMS 키 생성
aws kms create-key \
  --description "Sivera platform credentials encryption" \
  --key-usage ENCRYPT_DECRYPT

# 키 별칭 생성
aws kms create-alias \
  --alias-name alias/sivera-credentials \
  --target-key-id <key-id-from-above>
```

### 4. AWS Lambda (서버리스 백엔드)

Lambda 함수 예시 구조:
```
/lambda
  /auth
    - login.ts
    - signup.ts
    - refresh-token.ts
  /users
    - get-user.ts
    - update-user.ts
  /platforms
    - get-configs.ts
    - save-config.ts
    - sync-campaigns.ts
  /teams
    - create-team.ts
    - invite-member.ts
```

### 5. AWS API Gateway (REST API)

API 엔드포인트 구조:
```
POST   /auth/login
POST   /auth/signup
POST   /auth/refresh

GET    /users/{userId}
PUT    /users/{userId}

GET    /users/{userId}/platforms/{platform}/configs
POST   /users/{userId}/platforms/{platform}/configs
PUT    /users/{userId}/platforms/{platform}/configs/{configId}
DELETE /users/{userId}/platforms/{platform}/configs/{configId}

GET    /users/{userId}/platforms/{platform}/campaigns
POST   /users/{userId}/platforms/{platform}/campaigns/sync

GET    /users/{userId}/teams
POST   /teams
PUT    /teams/{teamId}
DELETE /teams/{teamId}
POST   /teams/{teamId}/invite
```

## 로컬 개발 환경 설정

### LocalStack 사용 (AWS 로컬 시뮬레이션)

```bash
# LocalStack 설치
pip install localstack

# LocalStack 실행
localstack start

# 로컬 엔드포인트 설정
export DYNAMODB_ENDPOINT=http://localhost:4566
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_REGION=ap-northeast-2
```

### 환경 변수 설정

`.env.local` 파일 생성:
```bash
cp .env.example .env.local
# .env.local 파일을 실제 AWS 값으로 수정
```

## 배포

### Next.js 앱 배포
- **AWS Amplify** (추천)
- AWS S3 + CloudFront
- Vercel (선택사항, 하지만 백엔드는 AWS)

### Lambda 함수 배포
```bash
# Serverless Framework 사용
npm install -g serverless
serverless deploy
```

## 보안 설정

1. **IAM 역할 및 정책 생성**
   - Lambda 실행 역할
   - DynamoDB 접근 권한
   - KMS 암호화/복호화 권한

2. **API Gateway 인증**
   - Cognito Authorizer 설정
   - CORS 설정

3. **환경 변수 암호화**
   - AWS Systems Manager Parameter Store 사용
   - 민감한 정보 KMS로 암호화

## 비용 최적화

- DynamoDB On-Demand 모드 사용 (초기)
- Lambda 메모리/타임아웃 최적화
- CloudWatch Logs 보존 기간 설정
- 불필요한 리소스 정리

## 모니터링

- CloudWatch 대시보드 생성
- Lambda 로그 모니터링
- DynamoDB 지표 추적
- API Gateway 요청 로그

## 다음 단계

1. AWS 계정 생성
2. Cognito User Pool 생성
3. DynamoDB 테이블 생성
4. Lambda 함수 작성 및 배포
5. API Gateway 설정
6. Next.js 환경 변수 설정
7. 테스트 및 배포
