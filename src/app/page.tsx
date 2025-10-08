import { Card, CardBody } from "@heroui/card";

import {
  StatsSection,
  TestimonialsSection,
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
      <section className="relative overflow-hidden px-6 py-20 lg:py-32 bg-gradient-to-b from-background to-default-100">
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div>
            <h1 className={title({ size: "lg" })}>
              광고 관리, 이제 하나로
            </h1>
            <p className={subtitle({ class: "mt-4 max-w-2xl mx-auto" })}>
              Google, Meta, Amazon, TikTok 광고를 하나의 플랫폼에서 관리하세요
            </p>
          </div>

          <div className="mt-8">
            <HeroButtons
              primaryButtonText="무료로 시작하기"
              secondaryButtonText="데모 보기"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Supported Platforms */}
      <PlatformsSection />

      {/* Statistics Section */}
      <StatsSection />

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

      {/* Testimonials Section */}
      <TestimonialsSection />

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
              href="/auth/signup"
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
