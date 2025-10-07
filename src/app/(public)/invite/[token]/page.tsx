"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { Eye, EyeOff, Lock, User, Mail, Check } from "lucide-react";
import { validatePassword } from "@/lib/utils";
import type { InviteData } from "@/types";

export default function InvitePage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [inviteInfo, setInviteInfo] = useState<{
    email: string;
    teamName: string;
    inviterName: string;
  } | null>(null);

  const [formData, setFormData] = useState<InviteData>({
    token: token,
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof InviteData, string>>>({});

  // 초대 토큰 검증
  useEffect(() => {
    const validateToken = async () => {
      setIsValidating(true);
      try {
        // TODO: 백엔드 API로 토큰 검증
        console.log("초대 토큰 검증:", token);

        // 임시: 2초 대기 후 더미 데이터 설정
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // 더미 초대 정보
        const dummyInviteInfo = {
          email: "invited@example.com",
          teamName: "Acme Corp",
          inviterName: "홍길동",
        };

        setInviteInfo(dummyInviteInfo);
        setFormData((prev) => ({
          ...prev,
          email: dummyInviteInfo.email,
        }));
        setIsValidToken(true);
      } catch (error) {
        console.error("토큰 검증 실패:", error);
        setIsValidToken(false);
      } finally {
        setIsValidating(false);
      }
    };

    if (token) {
      validateToken();
    }
  }, [token]);

  // 폼 검증
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof InviteData, string>> = {};

    // 이름 검증
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "이름은 2자 이상 입력해주세요.";
    }

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

  // 초대 수락 및 계정 생성
  const handleAcceptInvite = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // TODO: 백엔드 API 연동
      console.log("초대 수락 데이터:", formData);

      // 임시: 2초 대기 후 대시보드로 이동
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/hub?invite=success");
    } catch (error) {
      console.error("초대 수락 실패:", error);
      setErrors({
        ...errors,
        password: "초대 수락 중 오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 토큰 검증 중
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md shadow-xl bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-col gap-1 px-6 pt-6 pb-0">
            <Skeleton className="w-3/5 rounded-lg mx-auto">
              <div className="h-8 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
          </CardHeader>
          <CardBody className="px-6 py-6 space-y-3">
            <Skeleton className="w-full rounded-lg">
              <div className="h-10 w-full rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-full rounded-lg">
              <div className="h-10 w-full rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-full rounded-lg">
              <div className="h-10 w-full rounded-lg bg-default-200"></div>
            </Skeleton>
          </CardBody>
        </Card>
      </div>
    );
  }

  // 유효하지 않은 토큰
  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md shadow-xl bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-col gap-1 px-6 pt-6 pb-0">
            <h1 className="text-2xl font-bold text-center text-danger">
              유효하지 않은 초대 링크
            </h1>
          </CardHeader>
          <CardBody className="px-6 py-6">
            <div className="text-center space-y-4">
              <p className="text-default-600">
                초대 링크가 만료되었거나 유효하지 않습니다.
              </p>
              <Button
                color="primary"
                onPress={() => router.push("/login")}
              >
                로그인으로 이동
              </Button>
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
          <h1 className="text-2xl font-bold text-center">팀 초대</h1>
          <p className="text-sm text-default-500 text-center">
            <strong>{inviteInfo?.inviterName}</strong>님이{" "}
            <strong>{inviteInfo?.teamName}</strong>에 초대했습니다
          </p>
        </CardHeader>

        <CardBody className="px-6 py-6">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleAcceptInvite();
            }}
          >
            {/* 이메일 (읽기 전용) */}
            <Input
              label="이메일"
              value={formData.email}
              startContent={<Mail className="w-4 h-4 text-default-400" />}
              isReadOnly
              variant="flat"
            />

            {/* 이름 */}
            <Input
              label="이름"
              placeholder="홍길동"
              startContent={<User className="w-4 h-4 text-default-400" />}
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              isInvalid={!!errors.name}
              errorMessage={errors.name}
              isRequired
            />

            {/* 비밀번호 */}
            <Input
              label="비밀번호"
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

            {/* 초대 수락 버튼 */}
            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={isLoading}
              className="mt-2"
            >
              초대 수락하고 계정 만들기
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
