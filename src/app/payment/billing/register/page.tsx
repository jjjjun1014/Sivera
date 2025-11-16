"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Chip } from "@heroui/chip";
import { ArrowLeft, Check, CreditCard, Calendar } from "lucide-react";
import { PortOneBillingWidget } from "@/components/payments/PortOneBillingWidget";
import { PLANS, getMonthlyPrice, getTeamSizeTier } from "@/lib/config/plans";
import type { PlanType } from "@/types/subscription";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

function BillingRegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const planParam = searchParams.get("plan") as PlanType | null;
  const seatsParam = searchParams.get("seats");

  const [customerKey, setCustomerKey] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("01012345678");
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [connectedPlatforms, setConnectedPlatforms] = useState<{ platform: string; count: number }[]>([]);
  const [teamId, setTeamId] = useState<string>("");

  // 팀의 연결된 플랫폼 정보 로드
  const loadPlatformConnections = useCallback(async (teamId: string) => {
    try {
      const { data: credentials } = await client.models.PlatformCredential.list({
        filter: { teamID: { eq: teamId }, isActive: { eq: true } },
      });

      if (credentials) {
        // 플랫폼별로 그룹화
        const platformCounts = credentials.reduce((acc, cred) => {
          const platform = cred.platform || "unknown";
          acc[platform] = (acc[platform] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const platformList = Object.entries(platformCounts).map(([platform, count]) => ({
          platform: platform.charAt(0).toUpperCase() + platform.slice(1),
          count,
        }));

        setConnectedPlatforms(platformList);
      }
    } catch (error) {
      console.error("Failed to load platform connections:", error);
    }
  }, []);

  // 사용자 정보 및 팀 플랫폼 로드
  useEffect(() => {
    let isMounted = true;
    
    async function loadUserInfo() {
      try {
        const session = await fetchAuthSession();
        const attributes = await fetchUserAttributes();
        
        if (!isMounted) return;
        
        const userId = session.userSub || `customer_${Date.now()}`;
        const name = attributes.name || attributes.given_name || attributes.family_name || "고객";
        const email = attributes.email || "customer@example.com";
        const phone = attributes.phone_number || "01012345678";
        const teamIdFromAuth = attributes["custom:teamId"];
        
        setCustomerKey(userId);
        setCustomerName(name);
        setCustomerEmail(email);
        setCustomerPhoneNumber(phone);
        
        if (teamIdFromAuth && isMounted) {
          setTeamId(teamIdFromAuth);
          await loadPlatformConnections(teamIdFromAuth);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to load user info:", error);
        setCustomerKey(`customer_${Date.now()}`);
        setCustomerName("테스트 고객");
        setCustomerEmail("test@sivera.io");
        setCustomerPhoneNumber("01012345678");
      } finally {
        if (isMounted) {
          setIsLoadingUser(false);
        }
      }
    }
    
    loadUserInfo();
    
    return () => {
      isMounted = false;
    };
  }, [loadPlatformConnections]);

  // 스마트 라우팅 채널 그룹 - 더 이상 필요 없음

  // 로딩 중
  if (isLoadingUser) {
    return (
      <div className="container mx-auto px-6 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardBody className="py-12 flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-default-500">사용자 정보를 불러오는 중...</p>
          </CardBody>
        </Card>
      </div>
    );
  }

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
  const trialEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const firstBillingDate = new Date(trialEndDate.getTime() + 24 * 60 * 60 * 1000);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
      {/* 뒤로가기 */}
      <Button
        variant="light"
        startContent={<ArrowLeft className="w-4 h-4" />}
        onPress={() => router.back()}
        className="mb-6"
      >
        돌아가기
      </Button>

      <div className="space-y-6">
        {/* 1단계: 플랜 확인 */}
        <Card className="border-2 border-primary/20">
          <CardBody className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <span className="text-2xl">💎</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl sm:text-2xl font-bold">{planInfo.name} 플랜</h2>
                    {planInfo.highlighted && (
                      <Chip size="sm" color="primary" variant="flat">
                        추천
                      </Chip>
                    )}
                  </div>
                  <p className="text-sm text-default-600">
                    팀 {seats}명 · {planInfo.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl sm:text-4xl font-bold text-primary">
                  ₩{amount.toLocaleString()}
                </p>
                <p className="text-sm text-default-500">/월</p>
              </div>
            </div>
            
            <Button
              size="sm"
              variant="flat"
              className="mt-4"
              onPress={() => router.back()}
            >
              플랜 변경하기
            </Button>
          </CardBody>
        </Card>

        {/* 2단계: 무료 체험 정보 */}
        <Card className="bg-linear-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <CardBody className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/20 rounded-lg shrink-0">
                <span className="text-3xl">🎉</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">14일 무료 체험</h3>
                <div className="space-y-2">
                  <p className="text-sm text-default-700">
                    <span className="font-semibold">
                      {trialEndDate.toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    까지 무료로 모든 기능을 사용하세요
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-default-600">
                      첫 결제일:{" "}
                      <span className="font-semibold">
                        {firstBillingDate.toLocaleDateString('ko-KR')}
                      </span>
                    </span>
                  </div>
                  <p className="text-xs text-default-500 pt-2 border-t border-divider/50">
                    체험 기간 중 언제든 취소 가능하며, 취소 시 요금이 청구되지 않습니다
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 3단계: 결제수단 등록 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-default-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-default-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">결제수단 등록</h2>
                <p className="text-sm text-default-500 mt-0.5">
                  정기결제를 위해 결제수단을 등록해주세요
                </p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <PortOneBillingWidget
              customerId={customerKey}
              customerName={customerName}
              customerEmail={customerEmail}
              customerPhoneNumber={customerPhoneNumber}
              connectedPlatforms={connectedPlatforms}
              onSuccess={(billingKey, paymentMethod) => {
                router.push(`/payment/billing/success?billingKey=${billingKey}&paymentMethod=${paymentMethod}&plan=${plan}&seats=${seats}`);
              }}
              onError={(error) => {
                router.push(`/payment/billing/failure?error=billing_error&message=${encodeURIComponent(error.message)}`);
              }}
            />
          </CardBody>
        </Card>

        {/* 포함된 기능 (접을 수 있는 Accordion) */}
        <Card>
          <CardBody className="p-6">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="font-semibold text-default-700">포함된 기능 보기</h3>
                <span className="text-default-400 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="mt-4 space-y-3 pt-4 border-t border-divider">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      광고 계정:{" "}
                      {planInfo.features.adAccounts === "unlimited"
                        ? "무제한"
                        : `${planInfo.features.adAccounts}개`}
                    </p>
                    <p className="text-xs text-default-500 mt-0.5">
                      Google, Meta, TikTok 등 모든 플랫폼 지원
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      데이터 보관:{" "}
                      {planInfo.features.dataRetention === "unlimited"
                        ? "무제한"
                        : `${planInfo.features.dataRetention}일`}
                    </p>
                    <p className="text-xs text-default-500 mt-0.5">
                      과거 데이터 언제든 조회 가능
                    </p>
                  </div>
                </div>
                {planInfo.features.reportingFrequency && (
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">
                        리포팅: {planInfo.features.reportingFrequency}
                      </p>
                      <p className="text-xs text-default-500 mt-0.5">
                        자동 생성 리포트 제공
                      </p>
                    </div>
                  </div>
                )}
                {planInfo.features.prioritySupport && (
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">우선 지원</p>
                      <p className="text-xs text-default-500 mt-0.5">
                        24시간 내 응답 보장
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </details>
          </CardBody>
        </Card>
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
