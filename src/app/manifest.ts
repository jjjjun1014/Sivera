import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sivera - 통합 광고 관리 플랫폼",
    short_name: "Sivera",
    description: "Google, Meta, Amazon, TikTok 광고를 하나의 플랫폼에서 관리하세요",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f97316",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["business", "productivity", "marketing"],
    shortcuts: [
      {
        name: "대시보드",
        short_name: "Dashboard",
        description: "통합 대시보드로 이동",
        url: "/dashboard/analytics",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
          },
        ],
      },
      {
        name: "통합 분석",
        short_name: "Analytics",
        description: "통합 분석 보기",
        url: "/dashboard/integrated",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
          },
        ],
      },
    ],
  };
}
