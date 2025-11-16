/**
 * Error Boundary Component
 * 
 * React 컴포넌트 트리에서 발생하는 에러를 포착하여
 * 전체 앱이 크래시되는 것을 방지
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // 에러 로깅 서비스에 전송 (예: Sentry)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback이 있으면 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 에러 UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader className="flex flex-col items-center gap-2 pb-4">
              <div className="p-3 bg-danger/10 rounded-full">
                <AlertTriangle className="w-8 h-8 text-danger" />
              </div>
              <h2 className="text-2xl font-bold text-center">
                문제가 발생했습니다
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <p className="text-default-600 text-center">
                일시적인 오류가 발생했습니다. 페이지를 새로고침하거나 다시 시도해주세요.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-danger mb-2">
                    개발자 정보 (개발 환경에서만 표시)
                  </summary>
                  <div className="bg-default-100 rounded-lg p-4 overflow-auto">
                    <p className="text-xs font-mono text-danger mb-2">
                      {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="text-xs font-mono text-default-600 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              <div className="flex gap-3 justify-center pt-4">
                <Button
                  color="primary"
                  startContent={<RefreshCw className="w-4 h-4" />}
                  onPress={this.handleReset}
                >
                  다시 시도
                </Button>
                <Button
                  variant="flat"
                  startContent={<Home className="w-4 h-4" />}
                  onPress={() => {
                    window.location.href = '/dashboard/analytics';
                  }}
                >
                  홈으로
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 간단한 에러 폴백 컴포넌트
 */
export function ErrorFallback({ 
  error, 
  resetError 
}: { 
  error: Error; 
  resetError: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <AlertTriangle className="w-12 h-12 text-danger mb-4" />
      <h3 className="text-lg font-semibold mb-2">오류가 발생했습니다</h3>
      <p className="text-default-600 text-center mb-4">
        {error.message || '알 수 없는 오류가 발생했습니다'}
      </p>
      <Button color="primary" onPress={resetError}>
        다시 시도
      </Button>
    </div>
  );
}
