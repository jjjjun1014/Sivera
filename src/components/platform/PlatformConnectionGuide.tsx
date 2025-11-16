/**
 * 플랫폼 연동 안내 컴포넌트
 * 
 * "연동 전" 상태일 때 표시할 안내 메시지
 */

'use client';

import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/modal';
import { useState } from 'react';
import { Link2, Bell, CheckCircle } from 'lucide-react';
import { toast } from '@/utils/toast';

interface Platform {
  id: string;
  name: string;
  icon: string;
  status: 'preparing' | 'available';
  description?: string;
}

const PLATFORMS: Platform[] = [
  {
    id: 'google',
    name: 'Google Ads',
    icon: '🔍',
    status: 'preparing',
    description: 'Google 검색 및 디스플레이 광고',
  },
  {
    id: 'meta',
    name: 'Meta Ads',
    icon: '📘',
    status: 'preparing',
    description: 'Facebook & Instagram 광고',
  },
  {
    id: 'tiktok',
    name: 'TikTok Ads',
    icon: '🎵',
    status: 'preparing',
    description: 'TikTok 비디오 광고',
  },
  {
    id: 'amazon',
    name: 'Amazon Ads',
    icon: '📦',
    status: 'preparing',
    description: 'Amazon 상품 광고',
  },
  {
    id: 'naver',
    name: 'Naver Ads',
    icon: '💚',
    status: 'preparing',
    description: '네이버 검색 광고',
  },
  {
    id: 'kakao',
    name: 'Kakao Ads',
    icon: '💬',
    status: 'preparing',
    description: '카카오 비즈니스 광고',
  },
];

export function PlatformConnectionGuide() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNotifySubmit = async () => {
    if (!email || !email.includes('@')) {
      toast.error({ title: '올바른 이메일 주소를 입력해주세요' });
      return;
    }

    setIsSubmitting(true);

    // TODO: 실제 API 연동
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success({
      title: '알림 신청 완료',
      description: '플랫폼 연동이 준비되면 이메일로 알려드리겠습니다',
    });

    setEmail('');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <>
      <Card>
        <CardBody className="p-8">
          <div className="text-center space-y-6">
            {/* 아이콘 */}
            <div className="flex justify-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <Link2 className="w-12 h-12 text-primary" />
              </div>
            </div>

            {/* 제목 */}
            <div>
              <h2 className="text-2xl font-bold mb-2">
                광고 플랫폼 연동 준비 중
              </h2>
              <p className="text-default-600">
                다양한 광고 플랫폼과의 연동을 준비하고 있습니다
              </p>
            </div>

            {/* 플랫폼 그리드 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {PLATFORMS.map((platform) => (
                <div
                  key={platform.id}
                  className="p-4 border-2 border-dashed border-default-200 rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="text-center space-y-2">
                    <span className="text-3xl block">{platform.icon}</span>
                    <p className="text-sm font-semibold">{platform.name}</p>
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
                      <span className="text-xs text-default-500">준비 중</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-4 space-y-3">
              <p className="text-sm text-default-600">
                💡 연동이 준비되면 가장 먼저 알려드릴게요
              </p>
              <Button
                color="primary"
                size="lg"
                startContent={<Bell className="w-4 h-4" />}
                onPress={onOpen}
              >
                알림 받기
              </Button>
            </div>

            {/* 추가 정보 */}
            <div className="pt-6 border-t border-divider">
              <details className="group">
                <summary className="cursor-pointer text-sm text-default-600 hover:text-default-900 transition-colors list-none flex items-center justify-center gap-2">
                  <span>연동 예정 기능 보기</span>
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="mt-4 text-left space-y-2 max-w-md mx-auto">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <p className="text-sm text-default-600">
                      실시간 광고 성과 데이터 동기화
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <p className="text-sm text-default-600">
                      통합 대시보드에서 모든 플랫폼 한눈에 관리
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <p className="text-sm text-default-600">
                      플랫폼 간 성과 비교 및 최적화 제안
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <p className="text-sm text-default-600">
                      자동 리포트 생성 및 알림
                    </p>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 알림 신청 모달 */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <span>연동 알림 신청</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-default-600 mb-4">
              광고 플랫폼 연동이 준비되면 이메일로 알려드립니다
            </p>
            <Input
              type="email"
              label="이메일 주소"
              placeholder="example@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              description="연동 소식을 받을 이메일 주소를 입력해주세요"
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              취소
            </Button>
            <Button
              color="primary"
              onPress={handleNotifySubmit}
              isLoading={isSubmitting}
            >
              알림 신청
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
