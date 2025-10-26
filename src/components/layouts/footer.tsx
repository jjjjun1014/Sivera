"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Container } from "@/components/layouts/Container";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);
  const pathname = usePathname();

  // 홈 페이지에서만 푸터 표시
  if (pathname !== "/") {
    return null;
  }

  const essentialLinks = [
    { label: "이용약관", href: "/terms" },
    { label: "개인정보처리방침", href: "/privacy" },
    { label: "환불정책", href: "/refund-policy" },
    { label: "문의하기", href: "/contact" },
  ];

  return (
    <footer
      className="bg-default-50 pt-12 pb-8"
      data-testid="footer"
      role="contentinfo"
    >
      <Container>
        {/* Essential links */}
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          {essentialLinks.map((link) => (
            <Link
              key={link.label}
              as={NextLink}
              className="text-sm text-default-600 hover:text-primary"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Divider className="mb-6" />

        {/* Copyright */}
        <div className="text-center mb-4">
          <p className="text-sm text-default-600">
            © {currentYear} Sivera. All rights reserved.
          </p>
        </div>

        {/* Business info toggle */}
        <div className="text-center">
          <Button
            variant="light"
            size="sm"
            onPress={() => setShowBusinessInfo(!showBusinessInfo)}
            endContent={showBusinessInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            className="text-default-500"
          >
            사업자 정보
          </Button>

          {showBusinessInfo && (
            <div className="mt-4 pt-4 border-t border-divider text-sm text-default-500 space-y-1">
              <p>상호: Sivera</p>
              <p>대표자: [대표자명]</p>
              <p>사업자등록번호: [사업자등록번호]</p>
              <p>통신판매업신고번호: [통신판매업신고번호]</p>
              <p>주소: [사업장 주소]</p>
              <p>이메일: sivera@sivera.app</p>
              <p>전화: [전화번호]</p>
            </div>
          )}
        </div>
      </Container>
    </footer>
  );
};
