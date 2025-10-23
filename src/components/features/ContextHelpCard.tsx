'use client';

/**
 * Context-aware Help Card Component
 *
 * 사용자 행동을 분석하여 적절한 타이밍에 도움말을 표시합니다.
 */

import { useState, useEffect } from 'react';
import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { Bot, X, Lightbulb } from 'lucide-react';

interface HelpTip {
  id: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
}

interface ContextHelpCardProps {
  page: string;
  idleThreshold?: number; // 초 단위 (기본 10초)
}

const helpTips: Record<string, HelpTip[]> = {
  '/dashboard/platforms/google-ads/search': [
    {
      id: 'table-columns',
      title: '테이블 컬럼 정렬하기',
      description:
        '컬럼 헤더를 드래그하면 순서를 변경할 수 있어요. 우측 상단 ⚙️ 버튼으로 컬럼 표시/숨김도 가능합니다.',
    },
    {
      id: 'campaign-click',
      title: '캠페인 필터링',
      description:
        '캠페인 이름을 클릭하면 해당 캠페인의 광고그룹만 필터링되고 탭이 자동 전환돼요.',
    },
    {
      id: 'inline-edit',
      title: '빠른 편집',
      description: '캠페인 이름 옆 ✏️ 아이콘을 클릭하면 바로 수정할 수 있어요.',
    },
  ],
  '/dashboard/analytics': [
    {
      id: 'metrics-config',
      title: '메트릭 선택',
      description:
        '차트와 요약 카드에 표시할 메트릭을 선택할 수 있어요. 우측 상단 ⚙️ 버튼을 눌러보세요.',
    },
    {
      id: 'date-range',
      title: '기간 변경',
      description: '날짜 선택기로 분석 기간을 변경할 수 있어요. 최대 90일까지 조회 가능합니다.',
    },
  ],
  '/dashboard/team': [
    {
      id: 'invite-member',
      title: '팀원 초대',
      description:
        '우측 상단 "팀원 초대" 버튼으로 새 멤버를 추가할 수 있어요. 이메일로 초대장이 발송됩니다.',
    },
    {
      id: 'role-change',
      title: '역할 변경',
      description: '팀원의 역할을 변경하면 권한이 즉시 적용돼요. 관리자만 역할 변경이 가능합니다.',
    },
  ],
  default: [
    {
      id: 'ai-assistant',
      title: 'AI 도우미 사용하기',
      description:
        '우측 하단 챗봇 아이콘을 클릭하면 AI 어시스턴트와 대화할 수 있어요. 자연어로 질문해보세요!',
      actionLabel: 'AI 챗봇 열기',
    },
    {
      id: 'keyboard-shortcuts',
      title: '키보드 단축키',
      description: 'Cmd+K (Mac) 또는 Ctrl+K (Windows)로 빠른 검색을 열 수 있어요.',
    },
  ],
};

export function ContextHelpCard({ page, idleThreshold = 10 }: ContextHelpCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [idleTime, setIdleTime] = useState(0);

  const tips = helpTips[page] || helpTips.default;
  const currentTip = tips[currentTipIndex];

  // localStorage에서 dismissed 상태 확인
  useEffect(() => {
    const dismissedTips = localStorage.getItem('dismissed-help-tips');
    if (dismissedTips) {
      const dismissed = JSON.parse(dismissedTips);
      if (dismissed[page]?.includes(currentTip.id)) {
        setIsDismissed(true);
      }
    }
  }, [page, currentTip.id]);

  // 사용자 행동 추적 (idle 시간 측정)
  useEffect(() => {
    if (isDismissed) return;

    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    const resetIdleTime = () => {
      setIdleTime(0);
      setIsVisible(false);
    };

    const incrementIdleTime = () => {
      setIdleTime((prev) => {
        const newTime = prev + 1;
        if (newTime >= idleThreshold && !isVisible) {
          setIsVisible(true);
        }
        return newTime;
      });
    };

    // 마우스/키보드 이벤트 감지
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach((event) => {
      document.addEventListener(event, resetIdleTime);
    });

    // 1초마다 idle 시간 증가
    interval = setInterval(incrementIdleTime, 1000);

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, resetIdleTime);
      });
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [idleThreshold, isVisible, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);

    // localStorage에 dismissed 상태 저장
    const dismissedTips = localStorage.getItem('dismissed-help-tips');
    const dismissed = dismissedTips ? JSON.parse(dismissedTips) : {};

    if (!dismissed[page]) {
      dismissed[page] = [];
    }
    dismissed[page].push(currentTip.id);

    localStorage.setItem('dismissed-help-tips', JSON.stringify(dismissed));
    setIsDismissed(true);

    // 다음 팁으로 이동 (순환)
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
  };

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    setIsVisible(false);
    setIsDismissed(false);
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <Card className="fixed bottom-24 right-6 w-80 z-40 shadow-lg border-primary/20 border-2">
      <CardBody className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
            <Lightbulb className="text-primary" size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-sm">{currentTip.title}</h3>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={handleDismiss}
                className="min-w-6 h-6"
                aria-label="닫기"
              >
                <X size={14} />
              </Button>
            </div>
            <p className="text-sm text-default-600 mb-3">{currentTip.description}</p>
            <div className="flex gap-2">
              {currentTip.actionLabel && (
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  onPress={() => {
                    if (currentTip.actionUrl) {
                      window.location.href = currentTip.actionUrl;
                    }
                  }}
                >
                  {currentTip.actionLabel}
                </Button>
              )}
              {tips.length > 1 && (
                <Button size="sm" variant="light" onPress={handleNextTip}>
                  다음 팁
                </Button>
              )}
              <Button size="sm" variant="light" onPress={handleDismiss}>
                알겠어요
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
