"use client";

import { Component, ReactNode } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 에러 로깅 서비스에 전송 (예: Sentry)
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
          <Card className="w-full max-w-md">
            <CardBody className="p-8 text-center">
              <div className="w-16 h-16 bg-danger-100 dark:bg-danger-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-danger" />
              </div>
              <h1 className="text-2xl font-bold mb-2">문제가 발생했습니다</h1>
              <p className="text-default-600 mb-6">
                예상치 못한 오류가 발생했습니다.
                <br />
                페이지를 새로고침해 주세요.
              </p>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="bg-danger-50 dark:bg-danger-900/10 p-4 rounded-lg mb-6 text-left">
                  <p className="text-xs text-danger font-mono break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <div className="flex gap-3 justify-center">
                <Button
                  color="primary"
                  startContent={<RefreshCcw className="w-4 h-4" />}
                  onPress={this.handleReset}
                >
                  새로고침
                </Button>
                <Button
                  variant="bordered"
                  onPress={() => (window.location.href = "/")}
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
