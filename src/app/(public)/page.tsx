"use client";

import { Button } from "@heroui/button";
import Link from "next/link";
import { ArrowRight, BarChart3, Globe, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative px-4 py-20 md:py-32">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            광고 관리, 이제 하나로
          </h1>
          <p className="text-xl md:text-2xl text-default-600 mb-8 max-w-3xl mx-auto">
            Google, Meta, Amazon, TikTok 광고를 하나의 플랫폼에서 관리하세요
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup">
              <Button
                size="lg"
                color="primary"
                endContent={<ArrowRight className="w-5 h-5" />}
                className="font-semibold"
              >
                무료로 시작하기
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="bordered"
                className="font-semibold"
              >
                로그인
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="px-4 py-20 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            통합 광고 관리의 모든 것
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">멀티 플랫폼 통합</h3>
              <p className="text-default-600">
                Google, Meta, Amazon, TikTok 등 주요 광고 플랫폼을 하나의 대시보드에서 관리
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">실시간 분석</h3>
              <p className="text-default-600">
                광고 성과를 실시간으로 추적하고 인사이트를 통해 최적화
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">자동화 도구</h3>
              <p className="text-default-600">
                반복 작업을 자동화하고 효율적인 캠페인 관리
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            합리적인 가격으로 시작하세요
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-default-200 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">스타터</h3>
              <p className="text-default-600 mb-4">개인 및 소규모 팀</p>
              <div className="text-4xl font-bold mb-6">
                ₩29,000<span className="text-lg text-default-500">/월</span>
              </div>
              <ul className="text-left space-y-3 mb-6">
                <li>✓ 플랫폼 2개 연동</li>
                <li>✓ 기본 분석 리포트</li>
                <li>✓ 이메일 지원</li>
              </ul>
              <Link href="/signup">
                <Button variant="bordered" className="w-full">
                  시작하기
                </Button>
              </Link>
            </div>

            <div className="border-2 border-orange-600 rounded-lg p-8 text-center relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                인기
              </div>
              <h3 className="text-2xl font-bold mb-2">프로</h3>
              <p className="text-default-600 mb-4">성장하는 비즈니스</p>
              <div className="text-4xl font-bold mb-6">
                ₩99,000<span className="text-lg text-default-500">/월</span>
              </div>
              <ul className="text-left space-y-3 mb-6">
                <li>✓ 모든 플랫폼 연동</li>
                <li>✓ 고급 분석 및 인사이트</li>
                <li>✓ 자동화 도구</li>
                <li>✓ 우선 지원</li>
              </ul>
              <Link href="/signup">
                <Button color="primary" className="w-full">
                  시작하기
                </Button>
              </Link>
            </div>

            <div className="border border-default-200 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">엔터프라이즈</h3>
              <p className="text-default-600 mb-4">대규모 조직</p>
              <div className="text-4xl font-bold mb-6">
                문의<span className="text-lg text-default-500"></span>
              </div>
              <ul className="text-left space-y-3 mb-6">
                <li>✓ 프로의 모든 기능</li>
                <li>✓ 무제한 사용자</li>
                <li>✓ 전담 지원</li>
                <li>✓ 맞춤 개발</li>
              </ul>
              <Link href="/signup">
                <Button variant="bordered" className="w-full">
                  문의하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-orange-600 to-orange-400">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8 opacity-90">
            14일 무료 체험으로 Sivera의 강력한 기능을 경험해보세요
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-white text-orange-600 font-semibold hover:bg-gray-100"
              endContent={<ArrowRight className="w-5 h-5" />}
            >
              무료로 시작하기
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-white dark:bg-gray-800 border-t border-default-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Sivera</h3>
              <p className="text-sm text-default-600">
                통합 광고 관리 플랫폼
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">제품</h4>
              <ul className="space-y-2 text-sm text-default-600">
                <li><Link href="#" className="hover:text-orange-600">기능</Link></li>
                <li><Link href="#" className="hover:text-orange-600">가격</Link></li>
                <li><Link href="#" className="hover:text-orange-600">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">회사</h4>
              <ul className="space-y-2 text-sm text-default-600">
                <li><Link href="#" className="hover:text-orange-600">소개</Link></li>
                <li><Link href="/blog" className="hover:text-orange-600">블로그</Link></li>
                <li><Link href="#" className="hover:text-orange-600">채용</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">법적 고지</h4>
              <ul className="space-y-2 text-sm text-default-600">
                <li><Link href="/legal/terms" className="hover:text-orange-600">이용약관</Link></li>
                <li><Link href="/legal/privacy" className="hover:text-orange-600">개인정보처리방침</Link></li>
                <li><Link href="/legal/marketing" className="hover:text-orange-600">마케팅 수신 동의</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-default-500 pt-8 border-t border-default-200">
            © 2025 Sivera. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
