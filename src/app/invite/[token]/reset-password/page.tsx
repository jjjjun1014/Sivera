"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "@/utils/toast";

export default function InviteResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordRequirements = [
    { label: "최소 8자 이상", check: password.length >= 8 },
    { label: "영문 포함", check: /[a-zA-Z]/.test(password) },
    { label: "숫자 포함", check: /\d/.test(password) },
    { label: "특수문자 포함", check: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const isPasswordValid = passwordRequirements.every((req) => req.check);
  const doPasswordsMatch = password === confirmPassword && confirmPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error({
        title: "비밀번호 오류",
        description: "모든 비밀번호 요구사항을 충족해야 합니다.",
      });
      return;
    }

    if (!doPasswordsMatch) {
      toast.error({
        title: "비밀번호 불일치",
        description: "비밀번호가 일치하지 않습니다.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // TODO: 백엔드 API 호출
      // await fetch(`/api/v1/auth/invite/${token}/set-password`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ password }),
      // });

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success({
        title: "비밀번호 설정 완료",
        description: "비밀번호가 성공적으로 설정되었습니다. 로그인해주세요.",
      });

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      toast.error({
        title: "비밀번호 설정 실패",
        description: "비밀번호 설정 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-2 pt-8 pb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-center">비밀번호 설정</h1>
          <p className="text-sm text-default-500 text-center">
            초대를 수락하기 위해 새 비밀번호를 설정해주세요
          </p>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 비밀번호 입력 */}
            <Input
              label="새 비밀번호"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              startContent={<Lock className="w-4 h-4 text-default-400" />}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-default-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-default-400" />
                  )}
                </button>
              }
              variant="bordered"
              radius="sm"
              isRequired
            />

            {/* 비밀번호 확인 */}
            <Input
              label="비밀번호 확인"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              startContent={<Lock className="w-4 h-4 text-default-400" />}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-default-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-default-400" />
                  )}
                </button>
              }
              variant="bordered"
              radius="sm"
              isRequired
              color={
                confirmPassword && !doPasswordsMatch ? "danger" : "default"
              }
              errorMessage={
                confirmPassword && !doPasswordsMatch
                  ? "비밀번호가 일치하지 않습니다"
                  : undefined
              }
            />

            {/* 비밀번호 요구사항 */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-default-600">
                비밀번호 요구사항:
              </p>
              <div className="space-y-1">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle
                      className={`w-4 h-4 ${
                        req.check ? "text-success" : "text-default-300"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        req.check ? "text-success" : "text-default-500"
                      }`}
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 제출 버튼 */}
            <Button
              type="submit"
              color="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              isDisabled={!isPasswordValid || !doPasswordsMatch}
            >
              비밀번호 설정 완료
            </Button>

            {/* 토큰 정보 (디버깅용) */}
            <div className="pt-4 border-t border-divider">
              <p className="text-xs text-default-400 text-center">
                초대 토큰: {token}
              </p>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
