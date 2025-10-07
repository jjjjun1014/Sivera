"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Link } from "@heroui/link";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Mail, ArrowLeft } from "lucide-react";
import { isValidEmail } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // 비밀번호 재설정 이메일 전송
  const handleSendEmail = async () => {
    // 이메일 검증
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: 백엔드 API 연동
      console.log("비밀번호 재설정 이메일 전송:", email);

      // 임시: 2초 대기
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSuccess(true);
    } catch (error) {
      console.error("이메일 전송 실패:", error);
      setError("이메일 전송 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md shadow-xl bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-col gap-1 px-6 pt-6 pb-0">
            <div className="w-16 h-16 bg-success-100 dark:bg-success-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-center">이메일을 확인하세요</h1>
          </CardHeader>

          <CardBody className="px-6 py-6">
            <div className="text-center space-y-4">
              <p className="text-default-600">
                <strong>{email}</strong>로 비밀번호 재설정 링크를 전송했습니다.
              </p>
              <p className="text-sm text-default-500">
                이메일을 받지 못하셨나요? 스팸 폴더를 확인해보세요.
              </p>

              <div className="flex flex-col gap-2 pt-4">
                <Button
                  color="primary"
                  variant="flat"
                  onPress={() => router.push("/login")}
                >
                  로그인으로 돌아가기
                </Button>
                <Button
                  variant="light"
                  onPress={() => {
                    setIsSuccess(false);
                    setEmail("");
                  }}
                >
                  다시 시도하기
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-col gap-1 px-6 pt-6 pb-0">
          <h1 className="text-2xl font-bold text-center">비밀번호 찾기</h1>
          <p className="text-sm text-default-500 text-center">
            가입하신 이메일 주소를 입력하시면
            <br />
            비밀번호 재설정 링크를 보내드립니다
          </p>
        </CardHeader>

        <CardBody className="px-6 py-6">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendEmail();
            }}
          >
            {/* 이메일 입력 */}
            <Input
              label="이메일"
              placeholder="your@email.com"
              type="email"
              startContent={<Mail className="w-4 h-4 text-default-400" />}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              isInvalid={!!error}
              errorMessage={error}
              autoComplete="email"
              autoFocus
            />

            {/* 전송 버튼 */}
            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={isLoading}
            >
              재설정 링크 전송
            </Button>

            {/* 뒤로가기 */}
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-default-600 hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>로그인으로 돌아가기</span>
            </Link>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
