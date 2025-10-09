"use client";

import { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Checkbox } from "@heroui/checkbox";

import { toast } from "@/utils/toast";
import { useDictionary } from "@/hooks/use-dictionary";

interface AuthFormProps {
  initialMode?: "login" | "signup";
  returnUrl?: string;
  defaultEmail?: string;
  inviteToken?: string;
}

export function AuthForm({
  initialMode = "login",
  defaultEmail,
}: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(initialMode === "signup");
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const { dictionary: dict } = useDictionary();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSignUp && !isTermsAgreed) {
      toast.error({
        title: dict.auth.signup.errors.termsRequired,
        description: dict.auth.signup.errors.termsRequiredDesc,
      });
      return;
    }

    toast.info({
      title: "개발 중",
      description: "AWS 연동 후 사용 가능합니다.",
    });
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">
          {isSignUp ? dict.auth.signup.title : dict.auth.login.title}
        </h1>
        <p className="text-default-500 mt-2">
          {isSignUp
            ? dict.auth.signup.subtitle
            : dict.auth.login.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="email"
          type="email"
          label={dict.auth.email}
          placeholder={dict.auth.emailPlaceholder}
          defaultValue={defaultEmail}
          startContent={<FaEnvelope className="text-default-400" />}
          isRequired
          variant="bordered"
        />

        <Input
          name="password"
          type="password"
          label={dict.auth.password}
          placeholder={dict.auth.passwordPlaceholder}
          startContent={<FaLock className="text-default-400" />}
          isRequired
          variant="bordered"
        />

        {isSignUp && (
          <Checkbox
            isSelected={isTermsAgreed}
            onValueChange={setIsTermsAgreed}
            size="sm"
          >
            <span className="text-sm">
              {dict.auth.signup.termsAgree}{" "}
              <Link href="/terms" size="sm" underline="always">
                {dict.footer.terms}
              </Link>
              ,{" "}
              <Link href="/privacy" size="sm" underline="always">
                {dict.footer.privacy}
              </Link>
              ,{" "}
              <Link href="/cookies" size="sm" underline="always">
                {dict.footer.cookies}
              </Link>
            </span>
          </Checkbox>
        )}

        <Button
          type="submit"
          color="primary"
          className="w-full"
          size="lg"
        >
          {isSignUp ? dict.auth.signup.submit : dict.auth.login.submit}
        </Button>

        {!isSignUp && (
          <div className="text-center">
            <Link href="/forgot-password" size="sm">
              {dict.auth.login.forgotPassword}
            </Link>
          </div>
        )}

        <Divider className="my-4" />

        <div className="text-center">
          <p className="text-sm text-default-500">
            {isSignUp
              ? dict.auth.signup.haveAccount
              : dict.auth.login.noAccount}
          </p>
          <Button
            variant="light"
            color="primary"
            onPress={() => setIsSignUp(!isSignUp)}
            className="mt-2"
          >
            {isSignUp
              ? dict.auth.login.title
              : dict.auth.signup.title}
          </Button>
        </div>
      </form>
    </div>
  );
}
