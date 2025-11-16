"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as PortOne from "@portone/browser-sdk/v2";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { CreditCard, Wallet } from "lucide-react";
import { toast } from "sonner";

interface PortOneBillingWidgetProps {
  customerId: string;
  customerEmail?: string;
  customerName?: string;
  customerPhoneNumber?: string;
  connectedPlatforms?: { platform: string; count: number }[]; // 연결된 플랫폼 정보
  onSuccess?: (billingKey: string, paymentMethod: "card" | "paypal") => void;
  onError?: (error: Error) => void;
}

type PaymentMethodType = "card" | "paypal" | null;

export function PortOneBillingWidget({
  customerId,
  customerEmail,
  customerName,
  customerPhoneNumber,
  connectedPlatforms = [],
  onSuccess,
  onError,
}: PortOneBillingWidgetProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // 이니시스 사용자 입력 폼 상태 - 메모이제이션
  const [inicisName, setInicisName] = useState(customerName || "");
  const [inicisEmail, setInicisEmail] = useState(customerEmail || "");
  const [inicisPhone, setInicisPhone] = useState(customerPhoneNumber || "");
  
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
  const inicisChannelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY_INICIS;
  const paypalChannelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY_PAYPAL;

  const handleCardRegistration = useCallback(async () => {
    if (!storeId || !inicisChannelKey) {
      toast.error("결제 설정이 올바르지 않습니다");
      return;
    }

    if (!inicisName.trim() || !inicisEmail.trim() || !inicisPhone.trim()) {
      toast.error("모든 정보를 입력해주세요");
      return;
    }

    setIsLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const formattedPhone = inicisPhone.replace(/[^0-9]/g, '');
      const timestamp = Date.now().toString();
      const shortId = customerId.substring(0, 10);
      const issueId = `bil-${shortId}-${timestamp}`.substring(0, 40);
      
      const response = await PortOne.requestIssueBillingKey({
        storeId,
        channelKey: inicisChannelKey,
        billingKeyMethod: "CARD",
        issueName: "Sivera Subscription",
        issueId,
        customer: {
          customerId,
          fullName: inicisName.trim(),
          email: inicisEmail.trim(),
          phoneNumber: formattedPhone,
        },
        windowType: { pc: "IFRAME", mobile: "REDIRECTION" },
        redirectUrl: `${baseUrl}/payment/billing/success`,
        noticeUrls: [`${baseUrl}/api/portone/billing-webhook`],
      });

      if (response.code != null) {
        toast.error(response.message || "카드 등록 실패");
        onError?.(new Error(response.message || "카드 등록 실패"));
        setIsLoading(false);
        return;
      }

      toast.success("카드가 성공적으로 등록되었습니다");
      onSuccess?.(response.billingKey, "card");
      setIsLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "카드 등록 실패";
      toast.error(errorMessage);
      onError?.(error as Error);
      setIsLoading(false);
    }
  }, [storeId, inicisChannelKey, inicisName, inicisEmail, inicisPhone, customerId, onSuccess, onError]);

  useEffect(() => {
    if (selectedMethod !== "paypal" || !paypalContainerRef.current) {
      return;
    }

    // 환경 변수 검증
    if (!storeId) {
      console.error("❌ PortOne Store ID가 설정되지 않았습니다");
      toast.error("결제 설정 오류: Store ID 없음");
      return;
    }

    if (!paypalChannelKey) {
      console.error("❌ PayPal 채널 키가 설정되지 않았습니다");
      console.error("NEXT_PUBLIC_PORTONE_CHANNEL_KEY_PAYPAL을 .env.local에 추가하세요");
      toast.error("PayPal 설정이 올바르지 않습니다");
      return;
    }

    console.log("✅ PayPal UI 로딩 시작", {
      storeId,
      channelKey: paypalChannelKey,
      customerId,
      customerEmail,
    });

    let isCleanedUp = false;

    try {
      PortOne.loadIssueBillingKeyUI(
        {
          uiType: "PAYPAL_RT" as const,
          storeId,
          channelKey: paypalChannelKey,
          issueId: `issue-${crypto.randomUUID()}`,
          issueName: "Sivera Subscription",
          customer: { id: customerId, email: customerEmail },
        },
        {
          onIssueBillingKeySuccess: (response) => {
            if (!isCleanedUp) {
              console.log("✅ PayPal 빌링키 발급 성공", response);
              toast.success("PayPal 계정이 연결되었습니다");
              onSuccess?.(response.billingKey, "paypal");
            }
          },
          onIssueBillingKeyFail: (error) => {
            if (isCleanedUp) return;
            
            console.error("❌ PayPal 빌링키 발급 실패", error);
            
            const errorMessage = error.message?.toLowerCase() || '';
            const errorCode = error.code?.toLowerCase() || '';
            const isCancelled = 
              errorMessage.includes('cancel') || 
              errorMessage.includes('close') ||
              errorMessage.includes('abort') ||
              errorMessage.includes('취소') ||
              errorCode.includes('cancel') ||
              errorCode === 'portone-closed' ||
              errorCode === 'popup-closed' ||
              errorCode === 'issue_billing_key_canceled';
            
            if (isCancelled) {
              toast.error("PayPal 연결을 취소했습니다");
            } else {
              toast.error(error.message || "PayPal 등록 실패");
              onError?.(new Error(error.message || "PayPal 등록 실패"));
            }
          },
        }
      );
    } catch (error) {
      console.error("❌ PayPal UI 로딩 중 예외 발생", error);
      toast.error("PayPal 버튼 로딩 실패");
    }

    return () => { 
      isCleanedUp = true;
      console.log("🧹 PayPal UI cleanup");
    };
  }, [selectedMethod, storeId, paypalChannelKey, customerId, customerEmail, onSuccess, onError]);

  // 결제수단 선택 화면
  if (!selectedMethod) {
    return (
      <div className="space-y-6">
        {/* 현재 연결된 플랫폼 정보 */}
        {connectedPlatforms.length > 0 && (
          <Card className="bg-default-50">
            <CardBody>
              <h4 className="font-semibold mb-3 text-sm">현재 연결된 광고 플랫폼</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {connectedPlatforms.map((item) => (
                  <div key={item.platform} className="text-center p-3 bg-white rounded-lg">
                    <p className="text-xs text-default-500 mb-1">{item.platform}</p>
                    <p className="text-lg font-bold text-primary">{item.count}개</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-default-500 mt-3">
                💡 플랜 업그레이드 시 더 많은 광고 계정을 연결할 수 있습니다
              </p>
            </CardBody>
          </Card>
        )}

        {/* 결제수단 선택 */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">결제수단을 선택해주세요</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* 국내 카드 - 테스트 환경에서는 비활성화 */}
            <Card
              isPressable={process.env.NODE_ENV === 'production'}
              onPress={() => process.env.NODE_ENV === 'production' && setSelectedMethod("card")}
              className={`border-2 ${process.env.NODE_ENV === 'production' ? 'border-default-200 hover:border-primary' : 'border-default-100 opacity-60'} transition-colors`}
            >
              <CardBody className="p-6 text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">국내/해외 카드</h4>
                  <p className="text-sm text-default-500">신용카드 · 체크카드</p>
                  {process.env.NODE_ENV !== 'production' && (
                    <p className="text-xs text-warning mt-2">테스트 환경에서는 사용 불가</p>
                  )}
                </div>
                <div className="pt-2">
                  <p className="text-xs text-default-400">KG이니시스 결제</p>
                </div>
              </CardBody>
            </Card>

            {/* PayPal */}
            <Card
              isPressable
              onPress={() => setSelectedMethod("paypal")}
              className="border-2 border-default-200 hover:border-primary transition-colors"
            >
              <CardBody className="p-6 text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#0070ba]/10 flex items-center justify-center">
                    <Wallet className="w-8 h-8 text-[#0070ba]" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">PayPal</h4>
                  <p className="text-sm text-default-500">페이팔 계정</p>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-default-400">해외 결제 지원</p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        <div className="bg-default-100 rounded-lg p-4 text-sm text-default-600">
          <p className="font-semibold mb-2">🔒 안전한 결제</p>
          <ul className="space-y-1 text-xs">
            <li>• 카드 정보는 PortOne에 안전하게 암호화되어 저장됩니다</li>
            <li>• Sivera는 카드 번호를 직접 저장하지 않습니다</li>
            <li>• 14일 무료 체험 후 자동 결제됩니다</li>
            <li>• 언제든지 결제수단을 변경하거나 구독을 해지할 수 있습니다</li>
          </ul>
        </div>
      </div>
    );
  }

  // 카드 등록 처리
  if (selectedMethod === "card") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="light"
            size="sm"
            onPress={() => setSelectedMethod(null)}
            isDisabled={isLoading}
          >
            ← 뒤로
          </Button>
          <h3 className="font-semibold text-lg">카드 정보 입력</h3>
        </div>

        <div className="bg-default-100 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-6 h-6 text-primary" />
            <div>
              <h4 className="font-semibold">신용카드 · 체크카드</h4>
              <p className="text-sm text-default-500">국내/해외 카드 모두 사용 가능</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-4">
            <Input
              label="이름"
              placeholder="홍길동"
              value={inicisName}
              onValueChange={setInicisName}
              isRequired
              variant="bordered"
              description="카드 소유자 이름을 입력하세요"
            />
            <Input
              label="이메일"
              type="email"
              placeholder="example@sivera.io"
              value={inicisEmail}
              onValueChange={setInicisEmail}
              isRequired
              variant="bordered"
              description="결제 알림을 받을 이메일 주소"
            />
            <Input
              label="전화번호"
              type="tel"
              placeholder="01012345678"
              value={inicisPhone}
              onValueChange={setInicisPhone}
              isRequired
              variant="bordered"
              description="하이픈 없이 숫자만 입력하세요"
            />
          </div>
          
          <p className="text-sm text-default-600">
            정보 확인 후 '등록하기' 버튼을 클릭하면 안전한 결제창이 열립니다.
            KG이니시스 결제 시스템을 통해 카드 정보를 안전하게 등록할 수 있습니다.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="flat"
            onPress={() => setSelectedMethod(null)}
            isDisabled={isLoading}
          >
            취소
          </Button>
          <Button
            color="primary"
            size="lg"
            onPress={handleCardRegistration}
            isLoading={isLoading}
            isDisabled={isLoading || !inicisName.trim() || !inicisEmail.trim() || !inicisPhone.trim()}
          >
            {isLoading ? "처리 중..." : "카드 등록하기"}
          </Button>
        </div>
      </div>
    );
  }

  // PayPal 등록 처리
  if (selectedMethod === "paypal") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="light"
            size="sm"
            onPress={() => setSelectedMethod(null)}
          >
            ← 뒤로
          </Button>
          <h3 className="font-semibold text-lg">PayPal 계정 연결</h3>
        </div>

        <div className="bg-default-100 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-6 h-6 text-[#0070ba]" />
            <div>
              <h4 className="font-semibold">PayPal 정기결제</h4>
              <p className="text-sm text-default-500">안전하고 편리한 해외 결제</p>
            </div>
          </div>
          <p className="text-sm text-default-600 mb-4">
            아래 PayPal 버튼을 클릭하여 계정을 연결해주세요.
            PayPal 로그인 후 자동으로 정기결제가 설정됩니다.
          </p>
        </div>

        {/* PayPal 버튼 렌더링 영역 */}
        <div 
          ref={paypalContainerRef}
          className="portone-ui-container min-h-[100px] flex items-center justify-center rounded-xl overflow-hidden bg-transparent"
          style={{
            isolation: 'isolate',
          }}
        >
          <p className="text-sm text-default-400">PayPal 버튼 로딩 중...</p>
        </div>

        <div className="text-center">
          <Button
            variant="light"
            size="sm"
            onPress={() => setSelectedMethod(null)}
          >
            다른 결제수단 선택
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
