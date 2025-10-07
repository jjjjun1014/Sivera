import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blog"],
        disallow: [
          "/api/",
          "/hub/",
          "/marketing/",
          "/login",
          "/signup",
          "/forgot-password",
          "/reset-password",
          "/invite/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
