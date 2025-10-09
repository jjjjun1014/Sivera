"use client";

import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

import { useDictionary } from "@/hooks/use-dictionary";
import { toast } from "@/utils/toast";

export function ForgotPasswordForm() {
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
