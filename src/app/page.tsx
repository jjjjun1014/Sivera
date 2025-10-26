import { Card, CardBody } from "@heroui/card";

import {
  FAQSection,
  DashboardPreview,
  PricingSection,
  FeaturesSection,
  PlatformsSection,
  HeroButtons,
} from "@/components/home";
import { PageHeader } from "@/components/common";
import { title, subtitle } from "@/components/primitives";

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 lg:py-32">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 dark:from-primary/5 dark:via-background dark:to-secondary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent dark:from-primary/10" />

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="space-y-6">
            <h1 className={title({ size: "lg", class: "bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary dark:from-primary dark:via-purple-400 dark:to-primary animate-gradient" })}>
              광고 관리, 이제 하나로
            </h1>
            <p className={subtitle({ class: "mt-4 max-w-2xl mx-auto text-default-600 dark:text-default-400" })}>
              Google, Meta, Amazon, TikTok 광고를 하나의 플랫폼에서 관리하세요
            </p>
          </div>

          <div className="mt-10">
            <HeroButtons
              primaryButtonText="무료로 시작하기"
            />
          </div>

          {/* Stats preview */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">4+</div>
              <div className="text-sm text-default-500 mt-1">광고 플랫폼</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-default-500 mt-1">서비스 안정성</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-default-500 mt-1">실시간 동기화</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">AI</div>
              <div className="text-sm text-default-500 mt-1">자동화 추천</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Supported Platforms */}
      <PlatformsSection />

      {/* Dashboard Preview */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <PageHeader
            centered
            pageSubtitle="실시간으로 광고 성과를 한눈에 확인하세요"
            pageTitle="강력한 대시보드"
          />

          <div className="relative mt-12">
            <Card className="overflow-hidden shadow-xl">
              <CardBody className="p-0">
                <DashboardPreview />
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl text-white/90 mb-8">
              14일 무료 체험으로 Sivera의 강력한 기능을 경험해보세요
            </p>
            <a
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-primary bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              무료로 시작하기
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
