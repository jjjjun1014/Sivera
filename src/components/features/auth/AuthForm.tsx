"use client";

import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";
import { Form } from "@heroui/form";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Checkbox } from "@heroui/checkbox";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { login, MASTER_ACCOUNT } from "@/lib/auth";

interface AuthFormProps {
  initialMode?: "login" | "signup";
  returnUrl?: string;
  defaultEmail?: string;
  inviteToken?: string;
}

export function AuthForm({
  initialMode = "login",
  returnUrl,
  defaultEmail,
  inviteToken,
}: AuthFormProps) {
  const AC_EMAIL = "email" as const;
  const AC_NEW_PASSWORD = "new-password" as const;
  const AC_CURRENT_PASSWORD = "current-password" as const;
  const TID = {
    signupEmail: "signup-input-email",
    signupPassword: "signup-input-password",
    signupSubmit: "signup-submit",
    loginForm: "login-form",
    loginId: "login-input-id",
    loginPw: "login-input-pw",
    loginSubmit: "login-submit",
  } as const;

  const [isSignUp, setIsSignUp] = useState(initialMode === "signup");
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const router = useRouter();

  // Handle login with client action
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const success = login(email, password);
      if (success) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        router.push(returnUrl || "/hub");
      } else {
        alert("이메일 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch {
      alert("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-col gap-1 px-6 pt-6 text-center">
        <h1 className="text-2xl font-bold">
          {isSignUp ? "회원가입" : "로그인"}
        </h1>
        {isSignUp && (
          <p className="text-sm text-default-500">
            Sivera에 오신 것을 환영합니다
          </p>
        )}
      </CardHeader>
      <CardBody className="px-6 py-4">
        {isSignUp ? (
          <Form action={() => {}}>
            <div className="flex flex-col gap-4 items-center w-full min-w-sm mx-auto">
              <Input
                isRequired
                autoComplete={AC_EMAIL}
                data-test-id={TID.signupEmail}
                defaultValue={defaultEmail}
                label="이메일"
                name="email"
                placeholder="your@email.com"
                startContent={<FaEnvelope className="text-default-400" />}
                type="email"
                variant="bordered"
              />
              <Input
                isRequired
                autoComplete={AC_NEW_PASSWORD}
                data-test-id={TID.signupPassword}
                label="비밀번호"
                name="password"
                placeholder="비밀번호를 입력하세요"
                startContent={<FaLock className="text-default-400" />}
                type="password"
                variant="bordered"
              />

              <Checkbox
                isSelected={isTermsAgreed}
                onValueChange={setIsTermsAgreed}
              >
                <span className="text-sm">
                  이용약관 및 개인정보처리방침에 동의합니다
                </span>
              </Checkbox>

              <Button
                fullWidth
                color="primary"
                data-test-id={TID.signupSubmit}
                isDisabled={!isTermsAgreed}
                type="submit"
              >
                회원가입
              </Button>
            </div>
          </Form>
        ) : (
          <form data-test-id={TID.loginForm} onSubmit={handleLogin}>
            <div className="flex flex-col gap-4 items-center w-full min-w-sm mx-auto">
              <Input
                isRequired
                autoComplete={AC_EMAIL}
                data-test-id={TID.loginId}
                defaultValue={defaultEmail}
                isDisabled={isLoading}
                label="이메일"
                name="email"
                placeholder="your@email.com"
                startContent={<FaEnvelope className="text-default-400" />}
                type="email"
                variant="bordered"
              />
              <Input
                isRequired
                autoComplete={AC_CURRENT_PASSWORD}
                data-test-id={TID.loginPw}
                isDisabled={isLoading}
                label="비밀번호"
                name="password"
                placeholder="비밀번호를 입력하세요"
                startContent={<FaLock className="text-default-400" />}
                type="password"
                variant="bordered"
              />

              <Button
                fullWidth
                color="primary"
                data-test-id={TID.loginSubmit}
                isDisabled={isLoading}
                isLoading={isLoading}
                type="submit"
              >
                로그인
              </Button>
            </div>
          </form>
        )}

        <Divider className="my-4" />

        <div className="text-center">
          <p className="text-sm text-default-500">
            {isSignUp ? "이미 계정이 있으신가요?" : "아직 계정이 없으신가요?"}{" "}
            <Link
              className="cursor-pointer"
              size="sm"
              onPress={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "로그인" : "회원가입"}
            </Link>
          </p>
        </div>

        {!isSignUp && (
          <div className="text-center mt-2">
            <Link href="/forgot-password" size="sm">
              비밀번호 찾기
            </Link>
          </div>
        )}

        {/* 테스트용 마스터 계정 */}
        {!isSignUp && (
          <div className="mt-4 p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800">
            <p className="text-xs font-semibold text-warning-800 dark:text-warning-200 mb-2">
              🧪 테스트용 마스터 계정
            </p>
            <div className="text-xs text-warning-700 dark:text-warning-300 space-y-1">
              <p>
                <strong>이메일:</strong> {MASTER_ACCOUNT.email}
              </p>
              <p>
                <strong>비밀번호:</strong> {MASTER_ACCOUNT.password}
              </p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
