"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
import { ArrowLeft, Check, CreditCard, Calendar } from "lucide-react";
import { PortOneBillingWidget } from "@/components/payments/PortOneBillingWidget";
import { PLANS, getMonthlyPrice, getTeamSizeTier } from "@/lib/config/plans";
import type { PlanType } from "@/types/subscription";

function BillingRegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const planParam = searchParams.get("plan") as PlanType | null;
  const seatsParam = searchParams.get("seats");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");

  const [customerKey] = useState(() => {
    // TODO: 실제 사용자 ID로 변경
    return `customer_${Date.now()}`;
  });

  // 환경 변수에서 채널 키 가져오기
  const inicisChannel = process.env.NEXT_PUBLIC_PORTONE_INICIS_CHANNEL;
  const paypalChannel = process.env.NEXT_PUBLIC_PORTONE_PAYPAL_CHANNEL;

  // 유효하지 않은 접근
  if (!planParam || planParam === "free") {
    if (typeof window !== "undefined") {
      router.replace("/dashboard/settings");
    }
    return (
      <div className="container mx-auto px-6 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardBody className="py-12 flex justify-center">
            <Spinner size="lg" />
          </CardBody>
        </Card>
      </div>
    );
  }

  const plan = planParam;
  const seats = parseInt(seatsParam || "1");
  const planInfo = PLANS[plan];
  const teamTier = getTeamSizeTier(seats);
  const amount = getMonthlyPrice(plan, seats, "KRW");

  return (
    <div className="container mx-auto px-6 py-8">
      <Button
        variant="light"
        startContent={<ArrowLeft className="w-4 h-4" />}
        onPress={() => router.back()}
        className="mb-4"
      >
        돌아가기
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 구독 정보 */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold">구독 정보</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{planInfo.name} 플랜</h3>
                  {planInfo.highlighted && (
                    <Chip size="sm" color="primary" variant="flat">
                      추천
                    </Chip>
                  )}
                </div>
                <p className="text-sm text-default-500">{planInfo.description}</p>
              </div>

              <div className="space-y-2 py-4 border-y border-divider">
                <div className="flex justify-between text-sm">
                  <span className="text-default-600">기본 요금</span>
                  <span className="font-semibold">
                    ₩{planInfo.basePriceKRW.toLocaleString()}/월
                  </span>
                </div>
                {teamTier.priceKRW > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-default-600">팀 규모 ({teamTier.name})</span>
                    <span className="font-semibold text-primary">
                      +₩{teamTier.priceKRW.toLocaleString()}/월
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-divider">
                  <span className="font-bold">월 결제 금액</span>
                  <span className="text-xl font-bold text-primary">
                    ₩{amount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-primary/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">다음 결제일</span>
                </div>
                <p className="text-sm text-default-600">
                  {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')}
                  <span className="text-xs ml-2">(14일 무료 체험 후)</span>
                </p>
              </div>
            </CardBody>
          </Card>

          {/* 포함 기능 */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">포함된 기능</h3>
            </CardHeader>
            <CardBody className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  광고 계정:{" "}
                  {planInfo.features.adAccounts === "unlimited"
                    ? "무제한"
                    : `${planInfo.features.adAccounts}개`}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  데이터 보관:{" "}
                  {planInfo.features.dataRetention === "unlimited"
                    ? "무제한"
                    : `${planInfo.features.dataRetention}일`}
                </span>
              </div>
              {planInfo.features.aiChatbot && (
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-sm">AI 챗봇 사용</span>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* 결제수단 등록 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              <div>
                <h2 className="text-xl font-bold">결제수단 등록</h2>
                <p className="text-sm text-default-500 mt-1">
                  정기결제를 위해 카드 또는 페이팔을 등록해주세요
                </p>
              </div>
            </CardHeader>
            <CardBody>
              <Tabs
                selectedKey={paymentMethod}
                onSelectionChange={(key) => setPaymentMethod(key as "card" | "paypal")}
                size="lg"
                className="mb-6"
              >
                <Tab key="card" title="신용/체크카드" />
                <Tab key="paypal" title="PayPal" />
              </Tabs>

              {paymentMethod === "card" ? (
                <div>
                  <div className="mb-4 p-4 bg-primary/10 rounded-lg">
                    <h4 className="font-semibold mb-2">💳 국내/해외 카드</h4>
                    <ul className="text-sm text-default-600 space-y-1">
                      <li>• 국내 모든 카드사 이용 가능</li>
                      <li>• Visa, Mastercard, JCB 해외카드 지원</li>
                      <li>• 안전한 KG이니시스 결제 시스템</li>
                    </ul>
                  </div>
                  {inicisChannel ? (
                    <PortOneBillingWidget
                      customerId={customerKey}
                      channelKey={inicisChannel}
                      onSuccess={(billingKey) => {
                        console.log("Card billing key issued:", billingKey);
                        router.push(`/payment/billing/success?billingKey=${billingKey}&plan=${plan}&seats=${seats}`);
                      }}
                      onError={(error) => {
                        console.error("Card billing error:", error);
                        router.push(`/payment/billing/failure?error=card_error&message=${error.message}`);
                      }}
                    />
                  ) : (
                    <div className="p-6 text-center bg-danger/10 rounded-lg">
                      <p className="text-danger">카드 결제 채널이 설정되지 않았습니다.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="mb-4 p-4 bg-primary/10 rounded-lg">
                    <h4 className="font-semibold mb-2">💰 PayPal</h4>
                    <ul className="text-sm text-default-600 space-y-1">
                      <li>• PayPal 계정으로 간편하게 결제</li>
                      <li>• 전 세계 200개국 이상 지원</li>
                      <li>• 구매자 보호 프로그램 적용</li>
                    </ul>
                  </div>
                  {paypalChannel ? (
                    <PortOneBillingWidget
                      customerId={customerKey}
                      channelKey={paypalChannel}
                      onSuccess={(billingKey) => {
                        console.log("PayPal billing key issued:", billingKey);
                        router.push(`/payment/billing/success?billingKey=${billingKey}&plan=${plan}&seats=${seats}`);
                      }}
                      onError={(error) => {
                        console.error("PayPal billing error:", error);
                        router.push(`/payment/billing/failure?error=paypal_error&message=${error.message}`);
                      }}
                    />
                  ) : (
                    <div className="p-6 text-center bg-danger/10 rounded-lg">
                      <p className="text-danger">PayPal 결제 채널이 설정되지 않았습니다.</p>
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function BillingRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-6 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardBody className="py-12 flex justify-center">
              <Spinner size="lg" />
            </CardBody>
          </Card>
        </div>
      }
    >
      <BillingRegisterContent />
    </Suspense>
  );
}
