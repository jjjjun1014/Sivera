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
    icons: [],
    categories: ["business", "productivity", "marketing"],
  };
}
