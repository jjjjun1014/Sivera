'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { Spinner } from '@heroui/spinner';
import { CheckCircle, CreditCard, Calendar, ArrowRight } from 'lucide-react';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URL 파라미터에서 정보 가져오기
  const billingKey = searchParams.get('billingKey');
  const plan = searchParams.get('plan') || 'standard';
  const seats = searchParams.get('seats') || '1';

  useEffect(() => {
    // 빌링키 발급 성공 처리
    // TODO: 백엔드 API로 빌링키 저장 요청
    const processBillingKey = async () => {
      if (!billingKey) {
        // 빌링키가 없으면 실패 페이지로
        router.replace('/payment/billing/failure?error=no_billing_key');
        return;
      }

      try {
        // TODO: 백엔드 API 호출
        // await fetch('/api/billing/save', {
        //   method: 'POST',
        //   body: JSON.stringify({ billingKey, plan, seats })
        // });

        // 임시: 2초 대기 후 완료 처리
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsProcessing(false);
      } catch (error) {
        setError('빌링키 저장에 실패했습니다.');
      } finally {
        setIsProcessing(false);
      }
    };

    processBillingKey();
  }, [billingKey, plan, seats, router]);

  const handleGoToSettings = () => {
    router.push('/dashboard/settings?tab=billing');
  };

  if (isProcessing) {
    return (
      <div className="container mx-auto px-6 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardBody className="py-12 flex flex-col items-center gap-4">
            <Spinner size="lg" color="primary" />
            <h2 className="text-xl font-semibold">결제 수단 등록 중...</h2>
            <p className="text-default-500 text-center">
              잠시만 기다려주세요. 결제 정보를 안전하게 저장하고 있습니다.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <Card className="max-w-2xl mx-auto border-2 border-success/20">
        <CardBody className="py-12">
          {/* 성공 아이콘 */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
          </div>

          {/* 제목 */}
          <h1 className="text-3xl font-bold text-center mb-3">
            결제 수단 등록 완료! 🎉
          </h1>
          <p className="text-center text-default-600 mb-8">
            14일 무료 체험이 시작되었습니다
          </p>

          {/* 안내 카드 */}
          <div className="space-y-4 mb-8">
            <div className="p-4 bg-success/10 rounded-xl border border-success/20">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-success rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">무료 체험 기간</h3>
                  <p className="text-sm text-default-700">
                    {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    까지 무료로 모든 기능을 사용하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary rounded-lg">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">자동 결제 안내</h3>
                  <p className="text-sm text-default-700">
                    무료 체험 종료 3일 전에 이메일로 알려드립니다.
                    체험 기간 중 언제든 취소 가능하며, 취소 시 비용이 청구되지 않습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 다음 단계 */}
          <div className="mb-6 p-4 bg-default-50 rounded-xl">
            <h3 className="font-semibold mb-3">✨ 이제 다음 기능을 사용할 수 있습니다</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>AI 챗봇 어시스턴트</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>API 접근 권한</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>무제한 데이터 보관</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>무제한 광고 계정 연결</span>
              </li>
            </ul>
          </div>

          {/* 버튼 */}
          <div className="flex flex-col gap-3">
            <Button
              color="primary"
              size="lg"
              onPress={handleGoToSettings}
              endContent={<ArrowRight className="w-4 h-4" />}
              className="w-full"
            >
              설정 페이지로 이동
            </Button>
            <Button
              variant="flat"
              size="lg"
              onPress={() => router.push('/dashboard/analytics')}
              className="w-full"
            >
              대시보드로 이동
            </Button>
          </div>

          {/* 문의 안내 */}
          <p className="text-xs text-center text-default-500 mt-6">
            문의사항이 있으시면 support@sivera.io로 연락주세요
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

export default function BillingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-6 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardBody className="py-12 flex justify-center">
            <Spinner size="lg" />
          </CardBody>
        </Card>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
