import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 보안 헤더 설정
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // 이미지 최적화
  images: {
    remotePatterns: [
      // 필요시 외부 이미지 도메인 추가
    ],
    formats: ["image/avif", "image/webp"],
  },

  // 압축 활성화
  compress: true,

  // 개발 모드 설정
  reactStrictMode: true,

  // 프로덕션 소스맵 비활성화 (보안)
  productionBrowserSourceMaps: false,

  // 번들 분석 (필요시 주석 해제)
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       fs: false,
  //     };
  //   }
  //   return config;
  // },
};

export default nextConfig;
