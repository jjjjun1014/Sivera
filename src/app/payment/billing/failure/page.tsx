'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { Spinner } from '@heroui/spinner';
import { XCircle, AlertTriangle, RefreshCw, Home, HelpCircle } from 'lucide-react';

function FailureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const error = searchParams.get('error') || 'unknown';
  const message = searchParams.get('message') || '';

  const errorMessages: Record<string, { title: string; description: string; suggestion: string }> = {
    'no_billing_key': {
      title: '빌링키 발급 실패',
      description: '결제 수단 등록 중 오류가 발생했습니다.',
      suggestion: '다시 시도해주세요. 문제가 계속되면 고객센터로 문의해주세요.'
    },
    'save_failed': {
      title: '결제 정보 저장 실패',
      description: '결제 수단은 등록되었으나 정보 저장 중 오류가 발생했습니다.',
      suggestion: '잠시 후 다시 시도하거나, 고객센터로 문의해주세요.'
    },
    'user_cancelled': {
      title: '결제 수단 등록 취소',
      description: '사용자가 결제 수단 등록을 취소했습니다.',
      suggestion: '언제든 다시 등록하실 수 있습니다.'
    },
    'card_declined': {
      title: '카드 승인 거부',
      description: '카드사에서 결제를 승인하지 않았습니다.',
      suggestion: '다른 카드로 시도하거나, 카드사에 문의해주세요.'
    },
    'insufficient_funds': {
      title: '잔액 부족',
      description: '카드 잔액이 부족합니다.',
      suggestion: '다른 결제 수단을 이용하거나, 카드 한도를 확인해주세요.'
    },
    'invalid_card': {
      title: '유효하지 않은 카드',
      description: '입력하신 카드 정보가 올바르지 않습니다.',
      suggestion: '카드 정보를 다시 확인하고 재시도해주세요.'
    },
    'expired_card': {
      title: '만료된 카드',
      description: '카드 유효기간이 만료되었습니다.',
      suggestion: '다른 결제 수단을 이용해주세요.'
    },
    'paypal_error': {
      title: 'PayPal 오류',
      description: 'PayPal 연동 중 오류가 발생했습니다.',
      suggestion: 'PayPal 계정을 확인하거나, 다른 결제 수단을 이용해주세요.'
    },
    'network_error': {
      title: '네트워크 오류',
      description: '네트워크 연결 중 문제가 발생했습니다.',
      suggestion: '인터넷 연결을 확인하고 다시 시도해주세요.'
    },
    'unknown': {
      title: '알 수 없는 오류',
      description: '결제 수단 등록 중 예상치 못한 오류가 발생했습니다.',
      suggestion: '잠시 후 다시 시도하거나, 고객센터로 문의해주세요.'
    }
  };

  const errorInfo = errorMessages[error] || errorMessages['unknown'];

  const handleRetry = () => {
    // 이전 페이지로 돌아가기
    router.back();
  };

  const handleGoHome = () => {
    router.push('/dashboard/analytics');
  };

  const handleContactSupport = () => {
    // 고객센터 페이지로 이동 (나중에 구현)
    window.location.href = 'mailto:support@sivera.io?subject=결제 문제 문의';
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <Card className="max-w-2xl mx-auto border-2 border-danger/20">
        <CardBody className="py-12">
          {/* 실패 아이콘 */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-danger/10 flex items-center justify-center">
              <XCircle className="w-12 h-12 text-danger" />
            </div>
          </div>

          {/* 제목 */}
          <h1 className="text-3xl font-bold text-center mb-3 text-danger">
            {errorInfo.title}
          </h1>
          <p className="text-center text-default-600 mb-2">
            {errorInfo.description}
          </p>
          {message && (
            <p className="text-center text-sm text-default-500 mb-8">
              상세 메시지: {message}
            </p>
          )}

          {/* 안내 카드 */}
          <div className="space-y-4 mb-8">
            <div className="p-4 bg-warning/10 rounded-xl border border-warning/20">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-warning rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">해결 방법</h3>
                  <p className="text-sm text-default-700">
                    {errorInfo.suggestion}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 일반적인 문제 해결 팁 */}
          <div className="mb-6 p-4 bg-default-50 rounded-xl">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              일반적인 문제 해결 방법
            </h3>
            <ul className="space-y-2 text-sm text-default-600">
              <li>• 카드 정보(번호, 유효기간, CVC)를 정확히 입력했는지 확인하세요</li>
              <li>• 카드 한도가 충분한지 확인하세요</li>
              <li>• 해외 결제가 차단되어 있지 않은지 확인하세요</li>
              <li>• 다른 브라우저나 시크릿 모드에서 시도해보세요</li>
              <li>• PayPal의 경우, 계정에 로그인되어 있는지 확인하세요</li>
            </ul>
          </div>

          {/* 버튼 */}
          <div className="flex flex-col gap-3">
            <Button
              color="primary"
              size="lg"
              onPress={handleRetry}
              startContent={<RefreshCw className="w-4 h-4" />}
              className="w-full"
            >
              다시 시도하기
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="flat"
                size="lg"
                onPress={handleGoHome}
                startContent={<Home className="w-4 h-4" />}
              >
                홈으로
              </Button>
              <Button
                variant="flat"
                size="lg"
                color="primary"
                onPress={handleContactSupport}
                startContent={<HelpCircle className="w-4 h-4" />}
              >
                고객센터
              </Button>
            </div>
          </div>

          {/* 문의 안내 */}
          <div className="mt-8 p-4 bg-primary/5 rounded-lg">
            <p className="text-sm text-center text-default-600">
              💡 <strong>문제가 계속되나요?</strong>
              <br />
              <span className="text-xs">
                오류 코드: <code className="px-2 py-1 bg-default-100 rounded">{error}</code>
                <br />
                위 오류 코드와 함께 support@sivera.io로 문의해주세요.
                <br />
                평일 09:00-18:00 (점심시간 12:00-13:00 제외)
              </span>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function BillingFailurePage() {
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
      <FailureContent />
    </Suspense>
  );
}
