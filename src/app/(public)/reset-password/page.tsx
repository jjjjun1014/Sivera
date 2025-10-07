"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Eye, EyeOff, Lock, Check } from "lucide-react";
import { validatePassword } from "@/lib/utils";
import type { ResetPasswordData } from "@/types";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const [formData, setFormData] = useState<ResetPasswordData>({
    token: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ResetPasswordData, string>>>({});

  // URL에서 토큰 가져오기
  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      // 토큰이 없으면 비밀번호 찾기 페이지로 리다이렉트
      router.push("/forgot-password");
      return;
    }
    setToken(tokenParam);
    setFormData((prev) => ({ ...prev, token: tokenParam }));
  }, [searchParams, router]);

  // 폼 검증
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ResetPasswordData, string>> = {};

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else {
      const validation = validatePassword(formData.password);
      if (!validation.isValid) {
        newErrors.password = validation.errors[0];
      }
    }

    // 비밀번호 확인 검증
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 비밀번호 재설정 처리
  const handleResetPassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // TODO: 백엔드 API 연동
      console.log("비밀번호 재설정 데이터:", {
        token: formData.token,
        password: formData.password,
      });

      // 임시: 2초 대기 후 로그인 페이지로 이동
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/login?reset=success");
    } catch (error) {
      console.error("비밀번호 재설정 실패:", error);
      setErrors({
        ...errors,
        password: "비밀번호 재설정 중 오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-col gap-1 px-6 pt-6 pb-0">
          <h1 className="text-2xl font-bold text-center">새 비밀번호 설정</h1>
          <p className="text-sm text-default-500 text-center">
            새로운 비밀번호를 입력해주세요
          </p>
        </CardHeader>

        <CardBody className="px-6 py-6">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleResetPassword();
            }}
          >
            {/* 새 비밀번호 */}
            <Input
              label="새 비밀번호"
              placeholder="8자 이상, 영문/숫자 포함"
              type={isVisible ? "text" : "password"}
              startContent={<Lock className="w-4 h-4 text-default-400" />}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  {isVisible ? (
                    <EyeOff className="w-4 h-4 text-default-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-default-400" />
                  )}
                </button>
              }
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              isInvalid={!!errors.password}
              errorMessage={errors.password}
              autoComplete="new-password"
              isRequired
            />

            {/* 비밀번호 확인 */}
            <Input
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력하세요"
              type={isConfirmVisible ? "text" : "password"}
              startContent={<Lock className="w-4 h-4 text-default-400" />}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={() => setIsConfirmVisible(!isConfirmVisible)}
                >
                  {isConfirmVisible ? (
                    <EyeOff className="w-4 h-4 text-default-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-default-400" />
                  )}
                </button>
              }
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                if (errors.confirmPassword)
                  setErrors({ ...errors, confirmPassword: undefined });
              }}
              isInvalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
              autoComplete="new-password"
              isRequired
            />

            {/* 비밀번호 요구사항 안내 */}
            <div className="bg-default-100 dark:bg-default-50 p-3 rounded-lg">
              <p className="text-xs text-default-600 font-semibold mb-2">
                비밀번호 요구사항:
              </p>
              <ul className="text-xs text-default-500 space-y-1">
                <li className="flex items-center gap-2">
                  <Check
                    className={`w-3 h-3 ${
                      formData.password.length >= 8
                        ? "text-success"
                        : "text-default-300"
                    }`}
                  />
                  최소 8자 이상
                </li>
                <li className="flex items-center gap-2">
                  <Check
                    className={`w-3 h-3 ${
                      /[A-Z]/.test(formData.password)
                        ? "text-success"
                        : "text-default-300"
                    }`}
                  />
                  대문자 포함
                </li>
                <li className="flex items-center gap-2">
                  <Check
                    className={`w-3 h-3 ${
                      /[a-z]/.test(formData.password)
                        ? "text-success"
                        : "text-default-300"
                    }`}
                  />
                  소문자 포함
                </li>
                <li className="flex items-center gap-2">
                  <Check
                    className={`w-3 h-3 ${
                      /[0-9]/.test(formData.password)
                        ? "text-success"
                        : "text-default-300"
                    }`}
                  />
                  숫자 포함
                </li>
              </ul>
            </div>

            {/* 재설정 버튼 */}
            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={isLoading}
              className="mt-2"
            >
              비밀번호 재설정
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
