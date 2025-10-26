/* eslint-disable local/no-literal-strings */
"use client";

import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { motion, useReducedMotion } from "framer-motion";
import { FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";

import { title, subtitle } from "@/components/primitives";
import { Container } from "@/components/layouts/Container";
import { AutoGrid } from "@/components/common/AutoGrid";

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
  buttonVariant?: "solid" | "bordered" | "flat";
}

const PricingCard = ({ plan, index }: { plan: PricingPlan; index: number }) => {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
      transition={
        prefersReducedMotion ? undefined : { duration: 0.5, delay: index * 0.1 }
      }
      viewport={{ once: true }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
    >
      <Card
        className={`h-full ${
          plan.highlighted
            ? "border-primary shadow-xl scale-105 lg:scale-110"
            : ""
        }`}
      >
        <CardHeader className="pb-0 pt-6 px-6 flex-col items-start">
          {plan.highlighted && (
            <Chip className="mb-2" color="primary" size="sm">
              가장 인기 있는 플랜
            </Chip>
          )}
          <h3 className="text-xl font-semibold">{plan.name}</h3>
          <p className="text-default-500 text-sm mt-1">{plan.description}</p>
          <div className="mt-4">
            <span className="text-4xl font-bold">{plan.price}</span>
            <span className="text-default-500 text-sm">/{plan.period}</span>
          </div>
        </CardHeader>
        <CardBody className="px-6 py-4">
          <ul className="space-y-3">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <FaCheck className="text-success mt-0.5 shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardBody>
        <CardFooter className="px-6 pb-6">
          <Button
            fullWidth
            color={plan.highlighted ? "primary" : "default"}
            variant={plan.buttonVariant || "solid"}
            onPress={() => router.push("/login")}
          >
            {plan.buttonText}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export const PricingSection = () => {
  const prefersReducedMotion = useReducedMotion();
  const plans: PricingPlan[] = [
    {
      name: "Free",
      price: "₩0",
      period: "월",
      description: "개인 사용자를 위한 기본 플랜",
      features: [
        "1명만 사용 가능",
        "광고 계정 1개 연결",
        "3일 데이터만 조회",
        "AI 챗봇 사용 불가",
        "API 접근 불가",
      ],
      buttonText: "무료로 시작하기",
      buttonVariant: "bordered",
    },
    {
      name: "Standard",
      price: "₩129,000",
      period: "월",
      description: "API 읽기와 AI 기능을 원하는 팀",
      features: [
        "1-5명 기본 포함",
        "무제한 광고 계정 연결",
        "무제한 데이터 조회",
        "AI 챗봇 사용 가능",
        "API 읽기 전용",
        "이메일 지원",
      ],
      highlighted: true,
      buttonText: "가장 인기 있는 선택",
    },
    {
      name: "Pro",
      price: "₩389,000",
      period: "월",
      description: "API 읽기/쓰기와 모든 기능을 사용하는 팀",
      features: [
        "1-5명 기본 포함",
        "무제한 광고 계정 연결",
        "무제한 데이터 조회",
        "AI 챗봇 사용 가능",
        "API 읽기/쓰기 모두 가능",
        "우선 지원",
        "커스텀 연동 지원",
      ],
      buttonText: "시작하기",
      buttonVariant: "flat",
    },
  ];

  const featureComparison = [
    { category: "팀 멤버", free: "1명", standard: "1-5명", pro: "1-5명" },
    { category: "추가 인원", free: "불가", standard: "6-50명 (별도 요금)", pro: "6-50명 (별도 요금)" },
    { category: "광고 계정 연결", free: "1개", standard: "무제한", pro: "무제한" },
    { category: "데이터 보관", free: "3일", standard: "무제한", pro: "무제한" },
    { category: "통합 대시보드", free: "✅", standard: "✅", pro: "✅" },
    { category: "실시간 동기화", free: "✅", standard: "✅", pro: "✅" },
    { category: "AI 챗봇", free: "❌", standard: "✅", pro: "✅" },
    { category: "AI 이상 탐지", free: "❌", standard: "✅", pro: "✅" },
    { category: "고급 분석 & 리포트", free: "❌", standard: "✅", pro: "✅" },
    { category: "API 읽기", free: "❌", standard: "✅", pro: "✅" },
    { category: "API 쓰기", free: "❌", standard: "❌", pro: "✅" },
    { category: "커스텀 연동", free: "❌", standard: "❌", pro: "✅" },
    { category: "지원", free: "커뮤니티", standard: "이메일", pro: "우선 지원" },
  ];

  return (
    <section className="py-20 bg-default-50" data-testid="pricing-section">
      <Container>
        <motion.div
          className="text-center mb-12"
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          transition={prefersReducedMotion ? undefined : { duration: 0.5 }}
          viewport={{ once: true }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
        >
          <h2 className={title({ size: "md" })}>
            비즈니스에 맞는 플랜을 선택하세요
          </h2>
          <p className={subtitle({ class: "mt-2" })}>
            14일 무료 체험으로 모든 기능을 경험해보세요
          </p>
        </motion.div>

        <AutoGrid minItemWidth={280} className="items-stretch">
          {plans.map((plan, index) => (
            <PricingCard key={index} index={index} plan={plan} />
          ))}
        </AutoGrid>

        {/* Feature Comparison Table */}
        <motion.div
          className="mt-16 max-w-5xl mx-auto"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          transition={prefersReducedMotion ? undefined : { duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        >
          <h3 className="text-2xl font-bold text-center mb-8">플랜별 기능 비교</h3>
          <Card className="shadow-lg">
            <CardBody className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-divider">
                      <th className="text-left p-5 font-bold text-base bg-default-100/80">기능</th>
                      <th className="text-center p-5 font-bold text-base bg-default-100/80 min-w-[140px]">Free</th>
                      <th className="text-center p-5 font-bold text-base bg-primary/15 min-w-[140px]">
                        <div className="flex flex-col items-center gap-1">
                          <span>Standard</span>
                          <Chip color="primary" size="sm" variant="flat">추천</Chip>
                        </div>
                      </th>
                      <th className="text-center p-5 font-bold text-base bg-default-100/80 min-w-[140px]">Pro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureComparison.map((feature, index) => (
                      <tr key={index} className="border-b border-divider/50 last:border-b-0 hover:bg-default-50/50 transition-colors">
                        <td className="p-4 text-sm font-semibold text-default-700">{feature.category}</td>
                        <td className="p-4 text-sm text-center text-default-600">{feature.free}</td>
                        <td className="p-4 text-sm text-center font-medium bg-primary/5">{feature.standard}</td>
                        <td className="p-4 text-sm text-center text-default-600">{feature.pro}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          transition={
            prefersReducedMotion ? undefined : { duration: 0.5, delay: 0.5 }
          }
          viewport={{ once: true }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
        >
          <p className="text-default-600">
            모든 플랜에는 14일 무료 체험이 포함되어 있습니다. 언제든지 취소할 수
            있습니다.
          </p>
        </motion.div>
      </Container>
    </section>
  );
};
