import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Sivera - 통합 광고 관리 플랫폼",
    template: "%s | Sivera",
  },
  description: "Google, Meta, Amazon, TikTok 광고를 하나의 플랫폼에서 관리하세요. 실시간 분석과 자동화로 마케팅 성과를 극대화하세요.",
  keywords: [
    "광고 관리",
    "마케팅 플랫폼",
    "Google Ads",
    "Meta Ads",
    "Amazon Ads",
    "TikTok Ads",
    "통합 대시보드",
    "광고 자동화",
    "마케팅 분석",
    "캠페인 관리",
  ],
  authors: [{ name: "Sivera", url: "https://sivera.com" }],
  creator: "Sivera",
  publisher: "Sivera",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "Sivera",
    title: "Sivera - 통합 광고 관리 플랫폼",
    description: "Google, Meta, Amazon, TikTok 광고를 하나의 플랫폼에서 관리하세요",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sivera 통합 광고 관리 플랫폼",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sivera - 통합 광고 관리 플랫폼",
    description: "Google, Meta, Amazon, TikTok 광고를 하나의 플랫폼에서 관리하세요",
    images: ["/og-image.png"],
    creator: "@sivera",
  },
  verification: {
    google: "google-site-verification-code",
    // 나중에 실제 인증 코드로 교체
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
