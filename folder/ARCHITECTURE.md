# Sivera Alpha 2 - Architecture Documentation

## Overview

Sivera Alpha 2 is built on **AWS Amplify Gen 2**, leveraging serverless architecture and fullstack TypeScript for a modern, scalable multi-platform integration platform.

## Core Architecture Principles

### 1. Fullstack TypeScript

All backend and frontend code is written in TypeScript, providing:
- Type safety across the entire stack
- Better developer experience with autocomplete
- Reduced runtime errors
- Easier refactoring and maintenance

### 2. Domain-Driven Design (DDD)

The platform is organized into distinct business domains:

- **Advertising**: Campaign management, ad creation, performance tracking
- **Content**: Video/image uploads, content scheduling, publishing
- **Analytics**: Traffic analysis, engagement metrics, conversion tracking
- **Commerce**: Product catalogs, order management, inventory sync
- **Social**: Social posting, comment management, message inbox

### 3. AWS Amplify Gen 2 Backend

#### Authentication (AWS Cognito)

```typescript
// amplify/auth/resource.ts
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    'custom:teamId': { dataType: 'String', mutable: true },
    'custom:role': { dataType: 'String', mutable: true },
  },
  multifactor: {
    mode: 'OPTIONAL',
    sms: true,
    totp: true,
  },
})
```

Features:
- Email-based authentication with verification codes
- Custom attributes for team and role management
- Optional multi-factor authentication (SMS, TOTP)
- Advanced security mode with brute force protection

#### Data API (AWS AppSync + DynamoDB)

```typescript
// amplify/data/resource.ts
const schema = a.schema({
  Team: a.model({
    name: a.string().required(),
    members: a.hasMany('TeamMember', 'teamId'),
    platforms: a.hasMany('PlatformCredential', 'teamId'),
  }),
  
  Campaign: a.model({
    teamId: a.id().required(),
    platform: a.enum(['google', 'meta', 'amazon', 'tiktok']),
    name: a.string().required(),
    metrics: a.hasMany('CampaignMetric', 'campaignId'),
  }),
})
```

Features:
- GraphQL API with type-safe client generation
- Automatic CRUD operations
- Real-time subscriptions
- Row-level security with authorization rules
- Relationship modeling (hasMany, belongsTo)

#### Storage (AWS S3)

```typescript
// amplify/storage/resource.ts
export const storage = defineStorage({
  name: 'sivera-storage',
  access: (allow) => ({
    'content/{teamId}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
    ],
    'public/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
    ],
  }),
})
```

Features:
- Team-based file isolation
- Public and private access levels
- Automatic CDN distribution
- Secure file uploads with pre-signed URLs

## Frontend Architecture

### Next.js App Router

```
src/app/
├── layout.tsx              # Root layout with Amplify config
├── page.tsx                # Landing page with authentication
├── providers.tsx           # Context providers (Auth, Theme, HeroUI)
└── dashboard/
    └── page.tsx            # Protected dashboard page
```

### Amplify UI Integration

```typescript
import { Authenticator } from '@aws-amplify/ui-react'

export default function Home() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div>
          <h1>Welcome {user?.username}</h1>
          <button onClick={signOut}>Sign Out</button>
        </div>
      )}
    </Authenticator>
  )
}
```

Benefits:
- Pre-built authentication UI
- Automatic connection to Cognito
- Customizable themes and components
- Accessibility compliant (WCAG)

## Core Services

### Platform Registry

Centralized registry for all platform integrations:

```typescript
export class PlatformRegistryService {
  private platforms: Map<PlatformType, PlatformDefinition>
  
  registerPlatform(definition: PlatformDefinition): void
  getPlatform(type: PlatformType): PlatformDefinition
  getPlatformsByCapability(capability: PlatformCapability): PlatformDefinition[]
  supportsCapability(platform: PlatformType, capability: PlatformCapability): boolean
}
```

### Credential Store

Secure storage and management of platform credentials:

```typescript
export class CredentialStoreService {
  async storeCredentials(teamId: string, platform: PlatformType, token: OAuthToken): Promise<string>
  async getCredentials(teamId: string, platform: PlatformType): Promise<OAuthToken | null>
  async updateToken(credentialId: string, token: OAuthToken): Promise<boolean>
  async hasValidCredentials(teamId: string, platform: PlatformType): Promise<boolean>
}
```

## Data Flow

### Campaign Management Example

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   User UI   │────▶│ GraphQL API  │────▶│  DynamoDB   │
│ (Dashboard) │     │  (AppSync)   │     │  (Campaigns)│
└─────────────┘     └──────────────┘     └─────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │  Platform    │
                    │   Adapters   │
                    │ (Google/Meta)│
                    └──────────────┘
```

1. User creates/updates campaign via UI
2. GraphQL mutation sent to AppSync
3. Data stored in DynamoDB
4. Platform adapter syncs with external API
5. Real-time updates via GraphQL subscriptions

## Security Architecture

### Authentication Flow

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│  User    │────1───▶│  Cognito │────2───▶│   App    │
│          │◀───4────│          │◀───3────│          │
└──────────┘         └──────────┘         └──────────┘

1. Sign up/Sign in request
2. Cognito verifies credentials
3. Returns JWT tokens
4. App authenticates API requests
```

### Authorization Rules

```typescript
// Row-level security
Team: a.model({
  // ...
}).authorization((allow) => [
  allow.owner(),  // Only team owner can manage
  allow.custom((ctx) => ctx.identity.sub),  // Custom authorization
])

// Field-level security
accessToken: a.string().required()  // Encrypted at rest
```

### Data Protection

- **Encryption at rest**: All DynamoDB data encrypted with AWS KMS
- **Encryption in transit**: All API calls over HTTPS/WSS
- **Token encryption**: Platform tokens encrypted before storage
- **Row-level security**: Team data isolation enforced at database level

## Scalability

### Auto-scaling Components

- **API Gateway**: Automatically scales with request volume
- **AppSync**: Built-in scaling for GraphQL operations
- **DynamoDB**: On-demand capacity mode scales automatically
- **Lambda**: Concurrent executions scale based on demand
- **S3**: Unlimited storage capacity

### Performance Optimizations

- **GraphQL batching**: Multiple operations in single request
- **DataLoader**: Batching and caching for N+1 queries
- **CDN**: CloudFront for static assets and media files
- **Connection pooling**: Efficient database connections
- **Lazy loading**: Components loaded on-demand

## Monitoring & Observability

### AWS CloudWatch

- **Logs**: Centralized logging for all services
- **Metrics**: API latency, error rates, usage patterns
- **Alarms**: Automated alerts for critical issues
- **Dashboards**: Real-time visualization of system health

### Amplify Console

- **Deployment status**: CI/CD pipeline monitoring
- **Backend status**: Resource health checks
- **User analytics**: Authentication metrics
- **Performance**: Frontend performance metrics

## Development Workflow

### Local Development

```bash
# Start Amplify sandbox (creates temporary AWS resources)
npm run ampx:sandbox

# This creates:
# - Cognito user pool
# - AppSync GraphQL API
# - DynamoDB tables
# - S3 buckets
# - Lambda functions
```

### Type Generation

```bash
# Generate GraphQL types from schema
npm run ampx:generate

# Generates:
# - TypeScript types for all models
# - GraphQL queries, mutations, subscriptions
# - Client-side API functions
```

### Testing Strategy

- **Unit tests**: Core business logic (Vitest)
- **Integration tests**: API endpoints (Playwright)
- **E2E tests**: User workflows (Playwright)
- **Type checking**: TypeScript compiler

## Deployment Architecture

### Staging Environment

```
┌─────────────┐
│   GitHub    │
│  Repository │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Amplify    │
│  Sandbox    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Temporary  │
│   AWS       │
│  Resources  │
└─────────────┘
```

### Production Environment

```
┌─────────────┐
│   GitHub    │
│  Repository │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Amplify    │
│   CI/CD     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Production  │
│    AWS      │
│  Resources  │
└─────────────┘
```

## Future Enhancements

### Planned Features

1. **GraphQL Federation**: Microservices architecture with Apollo Gateway
2. **Event Sourcing**: CQRS pattern for audit logs
3. **Caching Layer**: Redis/ElastiCache for frequently accessed data
4. **Machine Learning**: Predictive analytics with SageMaker
5. **Real-time Collaboration**: WebSocket-based team collaboration
6. **Mobile Apps**: React Native apps with Amplify SDK

### Scalability Roadmap

1. **Multi-region deployment**: Global availability with low latency
2. **CDN optimization**: Edge computing with Lambda@Edge
3. **Database sharding**: Horizontal scaling for large datasets
4. **Microservices**: Domain-based service separation
5. **Event-driven architecture**: SNS/SQS for async processing

## References

- [AWS Amplify Gen 2 Documentation](https://docs.amplify.aws/react/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)
