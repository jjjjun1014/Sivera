'use client';

/**
 * Smart Suggestion Input Component
 *
 * AI가 입력 내용을 분석하여 스마트한 제안을 제공하는 입력 필드입니다.
 */

import { useState, useEffect, useRef } from 'react';
import { Input } from '@heroui/input';
import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Sparkles, Lightbulb } from 'lucide-react';
import { getSmartSuggestion } from '@/lib/ai/claude';

interface SmartSuggestionInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  suggestionType: 'campaign_name' | 'budget' | 'keyword';
  historicalData?: any[];
  disabled?: boolean;
  className?: string;
}

export function SmartSuggestionInput({
  label,
  placeholder,
  value,
  onChange,
  suggestionType,
  historicalData = [],
  disabled = false,
  className,
}: SmartSuggestionInputProps) {
  const [suggestion, setSuggestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();

  // 입력값 변경 시 AI 제안 요청 (디바운스 적용)
  useEffect(() => {
    if (!value || value.length < 3) {
      setSuggestion('');
      setShowSuggestion(false);
      return;
    }

    // 이전 타이머 취소
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // 1초 후 AI 제안 요청
    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const aiSuggestion = await getSmartSuggestion(suggestionType, value, historicalData);
        if (aiSuggestion) {
          setSuggestion(aiSuggestion);
          setShowSuggestion(true);
        }
      } catch (error) {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 1000);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [value, suggestionType, historicalData]);

  // 로컬 데이터 기반 즉시 제안 (캠페인 이름 유사도 체크)
  const getLocalSuggestions = () => {
    if (suggestionType !== 'campaign_name' || !historicalData || value.length < 2) {
      return [];
    }

    return historicalData
      .filter((item) => {
        const name = item.name?.toLowerCase() || '';
        const inputLower = value.toLowerCase();
        return (
          name.includes(inputLower) &&
          name !== value &&
          calculateSimilarity(name, inputLower) > 0.5
        );
      })
      .slice(0, 3);
  };

  const localSuggestions = getLocalSuggestions();

  // 문자열 유사도 계산 (간단한 Levenshtein distance)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  };

  const handleApplySuggestion = (suggestedValue: string) => {
    onChange(suggestedValue);
    setShowSuggestion(false);
    setSuggestion('');
  };

  const handleDismiss = () => {
    setShowSuggestion(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        endContent={
          isLoading ? (
            <div className="flex items-center gap-1">
              <Sparkles size={16} className="text-secondary animate-pulse" />
              <span className="text-xs text-secondary">AI 분석 중...</span>
            </div>
          ) : suggestion || localSuggestions.length > 0 ? (
            <Chip size="sm" color="secondary" variant="flat" startContent={<Lightbulb size={12} />}>
              AI 제안
            </Chip>
          ) : null
        }
      />

      {/* 로컬 제안 (유사한 캠페인명) */}
      {localSuggestions.length > 0 && !showSuggestion && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-20 shadow-lg">
          <CardBody className="p-3">
            <div className="flex items-start gap-2">
              <Lightbulb size={16} className="text-warning mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-default-600 mb-2">
                  💡 유사한 캠페인이 이미 있어요. 통합하시겠어요?
                </p>
                <div className="space-y-1">
                  {localSuggestions.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 p-2 bg-default-100 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        {item.roas !== undefined && (
                          <p className="text-xs text-default-500">
                            ROAS: {item.roas.toFixed(2)} | 예산: ₩
                            {item.budget?.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="flat"
                        color="secondary"
                        onPress={() => handleApplySuggestion(item.name)}
                      >
                        사용
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* AI 제안 */}
      {showSuggestion && suggestion && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-20 shadow-lg border-2 border-secondary">
          <CardBody className="p-3">
            <div className="flex items-start gap-2">
              <Sparkles size={16} className="text-secondary mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-secondary mb-1">AI 제안</p>
                <p className="text-sm text-default-700 mb-3 whitespace-pre-wrap">{suggestion}</p>
                <div className="flex gap-2">
                  {suggestionType === 'budget' && suggestion.includes('₩') && (
                    <Button
                      size="sm"
                      color="secondary"
                      variant="flat"
                      onPress={() => {
                        // 추천 예산 추출 (간단한 정규식)
                        const match = suggestion.match(/₩([\d,]+)/);
                        if (match) {
                          const amount = match[1].replace(/,/g, '');
                          onChange(amount);
                        }
                        handleDismiss();
                      }}
                    >
                      추천 예산 적용
                    </Button>
                  )}
                  <Button size="sm" variant="light" onPress={handleDismiss}>
                    닫기
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
