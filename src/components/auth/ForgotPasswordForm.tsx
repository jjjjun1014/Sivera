"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

import { useDictionary } from "@/hooks/use-dictionary";
import { toast } from "@/utils/toast";
import { useAuth } from "@/contexts/auth-context";
import { validateEmail } from "@/lib/services/auth.service";
import { TOAST_MESSAGES, withDescription } from "@/constants/toast-messages";

export function ForgotPasswordForm() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const { dictionary: dict } = useDictionary();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error(TOAST_MESSAGES.AUTH.EMAIL_INVALID);
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(email);

      if (result.success) {
        toast.success(TOAST_MESSAGES.AUTH.EMAIL_SENT);
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(
          withDescription(
            TOAST_MESSAGES.AUTH.PASSWORD_RESET_FAILED,
            result.error || "알 수 없는 오류가 발생했습니다."
          )
        );
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(TOAST_MESSAGES.COMMON.GENERIC_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <Input
          isRequired
          label={dict.auth.forgotPassword.email}
          name="email"
          placeholder={dict.auth.forgotPassword.emailPlaceholder}
          startContent={<FaEnvelope className="text-default-400" />}
          type="email"
          variant="bordered"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
          {dict.auth.forgotPassword.submit}
        </Button>

        <Link
          className="flex items-center gap-1 justify-center text-default-500"
          href="/login"
          size="sm"
        >
          <FaArrowLeft size={12} />
          {dict.auth.forgotPassword.backToLogin}
        </Link>
      </div>
    </form>
  );
}
