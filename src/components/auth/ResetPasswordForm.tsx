"use client";

import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { FaLock } from "react-icons/fa";

import { useDictionary } from "@/hooks/use-dictionary";
import { toast } from "@/utils/toast";

export function ResetPasswordForm() {
  const { dictionary: dict } = useDictionary();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    toast.info({
      title: "개발 중",
      description: "AWS 연동 후 사용 가능합니다.",
    });

    setIsLoading(false);
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
          isRequired
          label={dict.auth.resetPassword.newPassword}
          name="password"
          placeholder={dict.auth.resetPassword.newPasswordPlaceholder}
          startContent={<FaLock className="text-default-400" />}
          type="password"
          variant="bordered"
        />

        <Input
          isRequired
          label={dict.auth.resetPassword.confirmPassword}
          name="confirmPassword"
          placeholder={dict.auth.resetPassword.confirmPasswordPlaceholder}
          startContent={<FaLock className="text-default-400" />}
          type="password"
          variant="bordered"
        />

        <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
          {dict.auth.resetPassword.submit}
        </Button>
      </form>
    </div>
  );
}
