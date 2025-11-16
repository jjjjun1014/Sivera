/**
 * 전역 검색 컴포넌트 (Cmd+K)
 * 
 * 캠페인, 팀원, 페이지 등을 검색할 수 있는 프론트엔드 검색
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/modal';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Kbd } from '@heroui/kbd';
import { useRouter } from 'next/navigation';
import { Search, FileText, Users, BarChart3, Settings, ArrowRight } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category: 'page' | 'campaign' | 'team' | 'setting';
  url: string;
  icon: React.ReactNode;
}

const SEARCH_DATA: SearchResult[] = [
  // 페이지
  {
    id: 'analytics',
    title: '통합 분석',
    description: '모든 플랫폼의 광고 성과 확인',
    category: 'page',
    url: '/dashboard/analytics',
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    id: 'platforms',
    title: '플랫폼 관리',
    description: '광고 플랫폼 연동 관리',
    category: 'page',
    url: '/dashboard/platforms',
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: 'team',
    title: '팀 관리',
    description: '팀원 초대 및 권한 관리',
    category: 'page',
    url: '/dashboard/team',
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: 'settings',
    title: '설정',
    description: '계정 및 프로필 설정',
    category: 'page',
    url: '/dashboard/settings',
    icon: <Settings className="w-4 h-4" />,
  },
];

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 검색 결과 필터링
  const filteredResults = useMemo(() => {
    if (!query.trim()) return SEARCH_DATA;

    const lowerQuery = query.toLowerCase();
    return SEARCH_DATA.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          handleSelect(filteredResults[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex]);

  // 검색 결과 선택
  const handleSelect = (result: SearchResult) => {
    router.push(result.url);
    onClose();
    setQuery('');
    setSelectedIndex(0);
  };

  // 모달이 닫힐 때 초기화
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const getCategoryLabel = (category: string) => {
    const labels = {
      page: '페이지',
      campaign: '캠페인',
      team: '팀',
      setting: '설정',
    };
    return labels[category as keyof typeof labels] || category;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      placement="top"
      classNames={{
        base: 'mt-[10vh]',
      }}
    >
      <ModalContent>
        <ModalHeader className="pb-2">
          <div className="flex items-center gap-2 w-full">
            <Search className="w-5 h-5 text-default-400" />
            <Input
              autoFocus
              variant="flat"
              placeholder="검색어를 입력하세요..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              classNames={{
                input: 'text-base',
                inputWrapper: 'border-none shadow-none',
              }}
            />
          </div>
        </ModalHeader>
        <ModalBody className="pb-6">
          {filteredResults.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-default-500 text-sm">검색 결과가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredResults.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                    index === selectedIndex
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-default-100'
                  }`}
                >
                  <div className="p-2 bg-default-100 rounded-lg shrink-0">
                    {result.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{result.title}</p>
                    {result.description && (
                      <p className="text-xs text-default-500 truncate">
                        {result.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-default-400">
                      {getCategoryLabel(result.category)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-default-300" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* 키보드 단축키 안내 */}
          <div className="pt-4 border-t border-divider mt-4">
            <div className="flex items-center justify-center gap-4 text-xs text-default-500">
              <div className="flex items-center gap-1">
                <Kbd keys={['up', 'down']}>↑↓</Kbd>
                <span>이동</span>
              </div>
              <div className="flex items-center gap-1">
                <Kbd>Enter</Kbd>
                <span>선택</span>
              </div>
              <div className="flex items-center gap-1">
                <Kbd>Esc</Kbd>
                <span>닫기</span>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

/**
 * 전역 검색 트리거 훅
 */
export function useGlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
  };
}
