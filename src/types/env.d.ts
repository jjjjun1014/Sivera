/**
 * TODO: Backend Integration Required
 *
 * Add your backend-specific environment variables here.
 * These are example AWS-based environment variables.
 * Adjust based on your actual backend infrastructure.
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Next.js
      NODE_ENV: "development" | "production" | "test";
      NEXT_PUBLIC_APP_URL: string;

      // AWS (TODO: Add as needed by backend)
      AWS_REGION?: string;
      AWS_ACCESS_KEY_ID?: string;
      AWS_SECRET_ACCESS_KEY?: string;
      NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID?: string;
      NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID?: string;
      NEXT_PUBLIC_AWS_COGNITO_REGION?: string;
      NEXT_PUBLIC_API_GATEWAY_URL?: string;
      AWS_KMS_KEY_ID?: string;

      // PortOne V2 (Payment)
      NEXT_PUBLIC_PORTONE_STORE_ID?: string;

      // Service
      SERVICE_VERSION?: string;
    }
  }
}

export {};
