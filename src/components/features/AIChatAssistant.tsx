'use client';

/**
 * AI Chat Assistant Component
 *
 * 우측 하단 플로팅 챗봇으로 사용자와 대화하며 광고 관리를 도와줍니다.
 */

import { useState, useRef, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Input } from '@heroui/input';
import { Spinner } from '@heroui/spinner';
import { Bot, Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { getChatResponse } from '@/lib/ai/claude';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatAssistantProps {
  context?: {
    currentPage?: string;
    campaigns?: any[];
    selectedMetrics?: string[];
    userRole?: string;
  };
}

export function AIChatAssistant({ context }: AIChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '안녕하세요! 👋\n광고 관리를 도와드릴 AI 어시스턴트입니다.\n\n무엇을 도와드릴까요?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 메시지 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 챗봇 열릴 때 포커스
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await getChatResponse(input, context);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // 빠른 질문 버튼
  const quickQuestions = [
    '이번 달 성과 요약해줘',
    'ROAS 낮은 캠페인 찾아줘',
    '예산 초과한 캠페인은?',
    '최적화 제안해줘',
  ];

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  if (!isOpen) {
    return (
      <Button
        isIconOnly
        color="primary"
        size="lg"
        className="fixed bottom-6 right-6 z-50 shadow-lg"
        onPress={() => setIsOpen(true)}
        aria-label="AI 챗봇 열기"
      >
        <Bot size={24} />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card
        className={`${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        } flex flex-col shadow-2xl transition-all duration-300`}
      >
        {/* 헤더 */}
        <CardHeader className="flex items-center justify-between gap-2 border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <Bot className="text-primary" size={20} />
            <div>
              <p className="font-semibold text-sm">Sivera AI Assistant</p>
              {!isMinimized && <p className="text-xs text-default-500">광고 관리 도우미</p>}
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={toggleMinimize}
              aria-label={isMinimized ? '펼치기' : '최소화'}
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </Button>
            <Button isIconOnly size="sm" variant="light" onPress={handleClose} aria-label="닫기">
              <X size={16} />
            </Button>
          </div>
        </CardHeader>

        {/* 메시지 목록 */}
        {!isMinimized && (
          <>
            <CardBody className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-2 whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-default-100 text-default-900'
                    }`}
                  >
                    <div className="text-sm">{msg.content}</div>
                    <div
                      className={`text-xs mt-1 ${
                        msg.role === 'user' ? 'text-primary-foreground/70' : 'text-default-400'
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-default-100 rounded-lg px-4 py-3 flex items-center gap-2">
                    <Spinner size="sm" />
                    <span className="text-sm text-default-500">답변 생성 중...</span>
                  </div>
                </div>
              )}

              {/* 빠른 질문 (메시지가 적을 때만 표시) */}
              {messages.length <= 2 && !loading && (
                <div className="pt-2">
                  <p className="text-xs text-default-500 mb-2">💡 빠른 질문:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((q, i) => (
                      <Button
                        key={i}
                        size="sm"
                        variant="flat"
                        className="text-xs"
                        onPress={() => handleQuickQuestion(q)}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardBody>

            {/* 입력 창 */}
            <CardFooter className="border-t p-4">
              <div className="flex gap-2 w-full">
                <Input
                  ref={inputRef}
                  placeholder="메시지를 입력하세요... (Shift+Enter로 줄바꿈)"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  classNames={{
                    input: 'text-sm',
                  }}
                />
                <Button
                  isIconOnly
                  color="primary"
                  onPress={handleSend}
                  isDisabled={!input.trim() || loading}
                  aria-label="전송"
                >
                  <Send size={18} />
                </Button>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
