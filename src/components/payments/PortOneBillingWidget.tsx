"use client";

import { useEffect, useRef, useState } from "react";
import * as PortOne from "@portone/browser-sdk/v2";
import { Button } from "@heroui/button";
import type { BillingKeyRequest } from "@/types/payment";

interface PortOneBillingWidgetProps {
  customerId: string;
  channelKey: string; // "paypal_v2" or "card_channel_key"
  onSuccess?: (billingKey: string) => void;
  onError?: (error: Error) => void;
}

export function PortOneBillingWidget({
  customerId,
  channelKey,
  onSuccess,
  onError,
}: PortOneBillingWidgetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;

  const handleIssueBillingKey = async () => {
    if (!storeId) {
      console.error("PortOne Store ID is not configured");
      return;
    }

    setIsLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

      // PortOne V2 빌링키 발급 UI
      const response = await PortOne.requestIssueBillingKey({
        storeId,
        channelKey,
        billingKeyMethod: channelKey.includes("paypal") ? "PAYPAL" : "CARD",
        customer: {
          customerId,
        },
        redirectUrl: `${baseUrl}/payment/billing/success`,
        noticeUrls: [`${baseUrl}/api/portone/billing-webhook`],
      });

      if (response.code != null) {
        // 에러 발생
        console.error("Billing key issuance failed:", response);
        onError?.(new Error(response.message || "빌링키 발급 실패"));
        setIsLoading(false);
        return;
      }

      // 성공
      console.log("Billing key issued:", response.billingKey);
      onSuccess?.(response.billingKey);
      setIsLoading(false);
    } catch (error) {
      console.error("Billing key issuance error:", error);
      onError?.(error as Error);
      setIsLoading(false);
    }
  };

  if (!storeId) {
    return (
      <div className="p-6 text-center">
        <p className="text-danger">결제 시스템이 설정되지 않았습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-default-100 rounded-xl p-6">
        <h3 className="font-semibold mb-3">정기결제 카드/계정 등록</h3>
        <ul className="text-sm text-default-600 space-y-2">
          <li>• 국내/해외 카드 또는 페이팔 계정을 등록할 수 있습니다</li>
          <li>• 등록된 결제수단으로 매월 자동 결제됩니다</li>
          <li>• 결제 정보는 안전하게 암호화되어 보관됩니다</li>
          <li>• 언제든지 변경 및 해지할 수 있습니다</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <Button
          color="primary"
          size="lg"
          onPress={handleIssueBillingKey}
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          {isLoading ? "처리 중..." : "결제수단 등록하기"}
        </Button>
      </div>
    </div>
  );
}
