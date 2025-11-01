"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { FaLock, FaKey } from "react-icons/fa";

import { useDictionary } from "@/hooks/use-dictionary";
import { toast } from "@/utils/toast";
import { useAuth } from "@/contexts/auth-context";
import { validatePassword } from "@/lib/services/auth.service";
import { TOAST_MESSAGES, withDescription } from "@/constants/toast-messages";
import { PasswordRequirements } from "@/components/common/PasswordRequirements";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { confirmResetPassword } = useAuth();
  const { dictionary: dict } = useDictionary();
  
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 비밀번호 유효성 검사
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      toast.error(
        withDescription(TOAST_MESSAGES.AUTH.PASSWORD_INVALID, passwordValidation.errors[0])
      );
      return;
    }

    // 비밀번호 확인
    if (newPassword !== confirmPassword) {
      toast.error(TOAST_MESSAGES.AUTH.PASSWORD_MISMATCH);
      return;
    }

    setIsLoading(true);

    try {
      const result = await confirmResetPassword({
        email,
        code,
        newPassword,
      });

      if (result.success) {
        toast.success(TOAST_MESSAGES.AUTH.PASSWORD_RESET_SUCCESS);
        router.push("/login");
      } else {
        toast.error(
          withDescription(
            TOAST_MESSAGES.AUTH.PASSWORD_RESET_FAILED,
            result.error || "알 수 없는 오류가 발생했습니다."
          )
        );
      }
    } catch (error) {
      console.error("Confirm reset password error:", error);
      toast.error(TOAST_MESSAGES.COMMON.GENERIC_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">
          {dict.auth.resetPassword.title}
        </h1>
        <p className="text-default-500 mt-2">
          {dict.auth.resetPassword.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="email"
          label={dict.auth.email}
          placeholder={dict.auth.emailPlaceholder}
          value={email}
          onValueChange={setEmail}
          isRequired
          variant="bordered"
          isDisabled={isLoading}
        />

        <Input
          type="text"
          label="인증 코드"
          placeholder="이메일로 받은 6자리 코드"
          value={code}
          onValueChange={setCode}
          startContent={<FaKey className="text-default-400" />}
          isRequired
          variant="bordered"
          isDisabled={isLoading}
        />

        <Input
          type="password"
          label={dict.auth.resetPassword.newPassword}
          placeholder="8자 이상, 대소문자/숫자/특수문자 포함"
          value={newPassword}
          onValueChange={setNewPassword}
          startContent={<FaLock className="text-default-400" />}
          isRequired
          variant="bordered"
          isDisabled={isLoading}
        />

        <Input
          type="password"
          label={dict.auth.resetPassword.confirmPassword}
          placeholder="새 비밀번호를 다시 입력"
          value={confirmPassword}
          onValueChange={setConfirmPassword}
          startContent={<FaLock className="text-default-400" />}
          isRequired
          variant="bordered"
          isDisabled={isLoading}
        />

        <PasswordRequirements />

        <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
          {dict.auth.resetPassword.submit}
        </Button>
      </form>
    </div>
  );
}
