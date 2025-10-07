"use client";

import NextLink from "next/link";
import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";
import { Form } from "@heroui/form";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
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

const TID = {
  signupEmail: "signup-input-email",
  signupPassword: "signup-input-password",
  signupSubmit: "signup-submit",
  loginForm: "login-form",
  loginId: "login-input-id",
  loginPw: "login-input-pw",
  loginSubmit: "login-submit",
} as const;

function PasswordInput({
  "data-test-id": dataTestId,
  autoComplete,
  label = "비밀번호",
  name = "password",
  placeholder = "비밀번호를 입력하세요",
  isDisabled = false,
}: {
  "data-test-id"?: string;
  autoComplete: string;
  label?: string;
  name?: string;
  placeholder?: string;
  isDisabled?: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      isRequired
      data-test-id={dataTestId}
      autoComplete={autoComplete}
      label={label}
      name={name}
      placeholder={placeholder}
      isDisabled={isDisabled}
      startContent={<FaLock className="text-secondary-400" />}
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <FaEyeSlash className="text-2xl text-secondary-400 pointer-events-none" />
          ) : (
            <FaEye className="text-2xl text-secondary-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
      variant="bordered"
    />
  );
}

function LoginForm({
  defaultEmail,
  returnUrl,
}: Pick<AuthFormProps, "defaultEmail" | "returnUrl">) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
    <form data-test-id={TID.loginForm} onSubmit={handleLogin} className="grid gap-4">
      <Input
        isRequired
        autoComplete="email"
        data-test-id={TID.loginId}
        defaultValue={defaultEmail}
        isDisabled={isLoading}
        label="이메일"
        name="email"
        placeholder="your@email.com"
        startContent={<FaEnvelope className="text-secondary-400" />}
        type="email"
        variant="bordered"
      />
      <PasswordInput
        data-test-id={TID.loginPw}
        autoComplete="current-password"
        isDisabled={isLoading}
      />
      <Button
        fullWidth
        color="primary"
        data-test-id={TID.loginSubmit}
        isDisabled={isLoading}
        isLoading={isLoading}
        type="submit"
        className="mt-2 font-semibold"
      >
        로그인
      </Button>
    </form>
  );
}

function SignupForm({
  defaultEmail,
}: Pick<AuthFormProps, "defaultEmail">) {
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);

  return (
    <Form action={() => {}} className="grid gap-4">
      <Input
        isRequired
        autoComplete="email"
        data-test-id={TID.signupEmail}
        defaultValue={defaultEmail}
        label="이메일"
        name="email"
        placeholder="your@email.com"
        startContent={<FaEnvelope className="text-secondary-400" />}
        type="email"
        variant="bordered"
      />
      <PasswordInput data-test-id={TID.signupPassword} autoComplete="new-password" />
      <Checkbox
        isSelected={isTermsAgreed}
        onValueChange={setIsTermsAgreed}
        className="justify-self-start"
      >
        <span className="text-sm text-secondary-600">
          <NextLink href="/legal/terms" passHref legacyBehavior>
            <Link size="sm" className="font-medium">
              이용약관
            </Link>
          </NextLink>
          과
          <NextLink href="/legal/privacy" passHref legacyBehavior>
            <Link size="sm" className="font-medium">
              개인정보처리방침
            </Link>
          </NextLink>
          에 동의합니다
        </span>
      </Checkbox>
      <Button
        fullWidth
        color="primary"
        data-test-id={TID.signupSubmit}
        isDisabled={!isTermsAgreed}
        type="submit"
        className="mt-2 font-semibold"
      >
        회원가입
      </Button>
    </Form>
  );
}

export function AuthForm({
  initialMode = "login",
  returnUrl,
  defaultEmail,
}: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(initialMode === "signup");

  return (
    <Card className="w-full max-w-md p-4 shadow-xl rounded-2xl">
      <CardHeader className="pt-8 px-8 pb-4 text-center">
        <h1 className="text-3xl font-bold text-secondary-700">
          {isSignUp ? "회원가입" : "Sivera 로그인"}
        </h1>
        <p className="text-sm text-secondary-500 mt-2">
          {isSignUp
            ? "Sivera에 오신 것을 환영합니다!"
            : "계속하려면 로그인 정보를 입력하세요"}
        </p>
      </CardHeader>
      <CardBody className="p-8">
        {isSignUp ? (
          <SignupForm defaultEmail={defaultEmail} />
        ) : (
          <LoginForm defaultEmail={defaultEmail} returnUrl={returnUrl} />
        )}

        <Divider className="my-6" />

        <div className="text-center">
          <p className="text-sm text-secondary-500">
            {isSignUp ? "이미 계정이 있으신가요?" : "아직 계정이 없으신가요?"}{" "}
            <Link
              className="cursor-pointer font-semibold text-primary-600"
              size="sm"
              onPress={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "로그인" : "회원가입"}
            </Link>
          </p>
        </div>

        {!isSignUp && (
          <div className="text-center mt-4">
            <Link href="/forgot-password" size="sm" className="text-secondary-500">
              비밀번호를 잊으셨나요?
            </Link>
          </div>
        )}

        {!isSignUp && (
          <div className="mt-8 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
            <p className="text-xs font-semibold text-secondary-600 mb-2 text-center">
              🧪 테스트용 마스터 계정
            </p>
            <div className="text-xs text-secondary-500 space-y-1 text-center">
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
