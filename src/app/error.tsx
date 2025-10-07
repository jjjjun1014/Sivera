"use client";

import { useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 로깅
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md shadow-xl bg-white dark:bg-gray-800">
        <CardBody className="p-8 text-center">
          <div className="w-16 h-16 bg-danger-100 dark:bg-danger-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-danger" />
          </div>
          <h1 className="text-2xl font-bold mb-2">문제가 발생했습니다</h1>
          <p className="text-default-600 mb-6">
            예상치 못한 오류가 발생했습니다.
            <br />
            다시 시도해 주세요.
          </p>
          {process.env.NODE_ENV === "development" && (
            <div className="bg-danger-50 dark:bg-danger-900/10 p-4 rounded-lg mb-6 text-left">
              <p className="text-xs text-danger font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-default-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <Button
              color="primary"
              startContent={<RefreshCcw className="w-4 h-4" />}
              onPress={reset}
            >
              다시 시도
            </Button>
            <Button
              variant="bordered"
              startContent={<Home className="w-4 h-4" />}
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
