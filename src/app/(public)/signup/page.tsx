"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { Link } from "@heroui/link";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { isValidEmail, validatePassword } from "@/lib/utils";
import type { SignupData } from "@/types";

export default function SignupPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<SignupData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    termsAccepted: false,
    privacyAccepted: false,
    marketingAccepted: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SignupData, string>>>({});

  // 폼 검증
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SignupData, string>> = {};

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
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

    // 필수 약관 검증
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "이용약관에 동의해주세요.";
    }

    if (!formData.privacyAccepted) {
      newErrors.privacyAccepted = "개인정보처리방침에 동의해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 전체 동의 체크
  const handleAllConsent = (checked: boolean) => {
    setFormData({
      ...formData,
      termsAccepted: checked,
      privacyAccepted: checked,
      marketingAccepted: checked,
    });
  };

  // 회원가입 처리
  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // TODO: 백엔드 API 연동
      console.log("회원가입 데이터:", formData);

      // 임시: 2초 대기 후 로그인 페이지로 이동
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/login?signup=success");
    } catch (error) {
      console.error("회원가입 실패:", error);
      setErrors({
        ...errors,
        email: "회원가입 중 오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 전체 동의 여부 확인
  const isAllConsented =
    formData.termsAccepted &&
    formData.privacyAccepted &&
    formData.marketingAccepted;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 px-6 pt-6 text-center">
          <h1 className="text-2xl font-bold">회원가입</h1>
          <p className="text-sm text-default-500">
            Sivera에 오신 것을 환영합니다
          </p>
        </CardHeader>

        <CardBody className="px-6 py-4">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSignup();
            }}
          >
            {/* 이름 */}
            <Input
              label="이름 (선택)"
              placeholder="홍길동"
              variant="bordered"
              startContent={<User className="w-4 h-4 text-default-400" />}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            {/* 이메일 */}
            <Input
              isRequired
              label="이메일"
              placeholder="your@email.com"
              type="email"
              variant="bordered"
              startContent={<Mail className="w-4 h-4 text-default-400" />}
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              isInvalid={!!errors.email}
              errorMessage={errors.email}
            />

            {/* 비밀번호 */}
            <Input
              isRequired
              label="비밀번호"
              placeholder="8자 이상, 영문/숫자 포함"
              type={isVisible ? "text" : "password"}
              variant="bordered"
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
            />

            {/* 비밀번호 확인 */}
            <Input
              isRequired
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력하세요"
              type={isConfirmVisible ? "text" : "password"}
              variant="bordered"
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
            />

            <Divider className="my-2" />

            {/* 약관 동의 */}
            <div className="flex flex-col gap-3">
              <Checkbox
                isSelected={isAllConsented}
                onValueChange={handleAllConsent}
                classNames={{
                  label: "font-semibold",
                }}
              >
                전체 동의
              </Checkbox>

              <div className="flex flex-col gap-2 ml-6">
                <div className="flex items-center justify-between">
                  <Checkbox
                    isSelected={formData.termsAccepted}
                    onValueChange={(checked) => {
                      setFormData({ ...formData, termsAccepted: checked });
                      if (errors.termsAccepted)
                        setErrors({ ...errors, termsAccepted: undefined });
                    }}
                    isInvalid={!!errors.termsAccepted}
                  >
                    <span className="text-sm">
                      이용약관 동의 <span className="text-danger">(필수)</span>
                    </span>
                  </Checkbox>
                  <Link
                    href="/legal/terms"
                    target="_blank"
                    size="sm"
                    className="text-primary"
                  >
                    보기
                  </Link>
                </div>

                <div className="flex items-center justify-between">
                  <Checkbox
                    isSelected={formData.privacyAccepted}
                    onValueChange={(checked) => {
                      setFormData({ ...formData, privacyAccepted: checked });
                      if (errors.privacyAccepted)
                        setErrors({ ...errors, privacyAccepted: undefined });
                    }}
                    isInvalid={!!errors.privacyAccepted}
                  >
                    <span className="text-sm">
                      개인정보처리방침 동의{" "}
                      <span className="text-danger">(필수)</span>
                    </span>
                  </Checkbox>
                  <Link
                    href="/legal/privacy"
                    target="_blank"
                    size="sm"
                    className="text-primary"
                  >
                    보기
                  </Link>
                </div>

                <div className="flex items-center justify-between">
                  <Checkbox
                    isSelected={formData.marketingAccepted || false}
                    onValueChange={(checked) =>
                      setFormData({ ...formData, marketingAccepted: checked })
                    }
                  >
                    <span className="text-sm">
                      마케팅 수신 동의 <span className="text-default-400">(선택)</span>
                    </span>
                  </Checkbox>
                  <Link
                    href="/legal/marketing"
                    target="_blank"
                    size="sm"
                    className="text-primary"
                  >
                    보기
                  </Link>
                </div>
              </div>

              {(errors.termsAccepted || errors.privacyAccepted) && (
                <p className="text-xs text-danger ml-6">
                  필수 약관에 동의해주세요.
                </p>
              )}
            </div>

            {/* 회원가입 버튼 */}
            <Button
              fullWidth
              type="submit"
              color="primary"
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              회원가입
            </Button>
          </form>

          <Divider className="my-4" />

          {/* 로그인 링크 */}
          <div className="text-center">
            <p className="text-sm text-default-500">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" size="sm" className="cursor-pointer">
                로그인
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
