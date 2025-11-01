"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Checkbox } from "@heroui/checkbox";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";

import { toast } from "@/utils/toast";
import { useDictionary } from "@/hooks/use-dictionary";
import { useAuth } from "@/contexts/auth-context";
import { useAuthForm } from "@/hooks/auth/use-auth-form";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordComponents";
import TermsOfServiceContent from "@/app/terms/TermsOfServiceContent";
import PrivacyPolicyContent from "@/app/privacy/PrivacyPolicyContent";
import CookiePolicyContent from "@/app/cookies/CookiePolicyContent";
import { TOAST_MESSAGES, withDescription } from "@/constants/toast-messages";

interface AuthFormProps {
  initialMode?: "login" | "signup";
  returnUrl?: string;
  defaultEmail?: string;
  inviteToken?: string;
}

export function AuthForm({
  initialMode = "login",
  defaultEmail,
  returnUrl = "/dashboard/analytics",
}: AuthFormProps) {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const { formData, updateField, validateForm } = useAuthForm({ email: defaultEmail });
  const [isSignUp, setIsSignUp] = useState(initialMode === "signup");
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasReadAllTerms, setHasReadAllTerms] = useState(false);
  const [readTerms, setReadTerms] = useState({
    terms: false,
    privacy: false,
    cookies: false,
  });
  
  // 이메일 인증 관련 상태
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  const { dictionary: dict } = useDictionary();

  // 모든 약관을 읽었는지 확인
  useEffect(() => {
    if (readTerms.terms && readTerms.privacy && readTerms.cookies) {
      setHasReadAllTerms(true);
    }
  }, [readTerms]);

  // 스크롤을 끝까지 내렸는지 확인하는 함수
  const handleScroll = (e: React.UIEvent<HTMLDivElement>, type: 'terms' | 'privacy' | 'cookies') => {
    const element = e.currentTarget;
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;

    if (isAtBottom && !readTerms[type]) {
      setReadTerms(prev => ({ ...prev, [type]: true }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.log('🔵 handleSubmit called', { isSignUp, formData });
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    if (isSignUp && !isTermsAgreed) {
      console.log('❌ Terms not agreed');
      toast.error(TOAST_MESSAGES.AUTH.TERMS_REQUIRED);
      return;
    }

    console.log('✅ Starting auth process');
    setIsLoading(true);

    try {
      if (isSignUp) {
        console.log('📝 Attempting signup...');
        // 회원가입
        const result = await signUp({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName || undefined,
        });

        console.log('📝 Signup result:', result);

        if (result.success) {
          toast.success(TOAST_MESSAGES.AUTH.SIGNUP_SUCCESS);
          setVerificationEmail(formData.email);
          setShowVerificationModal(true);
        } else {
          toast.error(
            withDescription(
              TOAST_MESSAGES.AUTH.SIGNUP_FAILED,
              result.error || "알 수 없는 오류가 발생했습니다."
            )
          );
        }
      } else {
        console.log('🔐 Attempting login...');
        // 로그인
        const result = await signIn({
          email: formData.email,
          password: formData.password,
        });

        console.log('🔐 Login result:', result);

        if (result.success) {
          console.log('✅ Login successful, showing toast and redirecting...');
          toast.success(TOAST_MESSAGES.AUTH.LOGIN_SUCCESS);
          
          // AuthContext가 user를 로드할 때까지 대기
          console.log('⏳ Waiting for user to load...');
          await new Promise(resolve => setTimeout(resolve, 800));
          
          console.log('🚀 Redirecting to:', returnUrl);
          window.location.href = returnUrl;
        } else {
          console.error('❌ Login failed:', result.error);
          const errorMessage = result.error || "알 수 없는 오류가 발생했습니다.";
          console.error('❌ Error message to display:', errorMessage);
          toast.error(
            withDescription(TOAST_MESSAGES.AUTH.LOGIN_FAILED, errorMessage)
          );
        }
      }
    } catch (error) {
      console.error('❌ Auth error:', error);
      toast.error(TOAST_MESSAGES.COMMON.GENERIC_ERROR);
    } finally {
      console.log('🏁 Auth process finished');
      setIsLoading(false);
    }
  };

  const handleTermsLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowTermsModal(true);
  };

  const handleModalClose = () => {
    setShowTermsModal(false);
  };

  const handleAgreeTerms = () => {
    if (hasReadAllTerms) {
      setIsTermsAgreed(true);
      setShowTermsModal(false);
    } else {
      toast.warning({
        title: "약관을 모두 읽어주세요",
        description: "모든 약관을 끝까지 스크롤하여 읽어야 동의할 수 있습니다.",
      });
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">
          {isSignUp ? dict.auth.signup.title : dict.auth.login.title}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="email"
          type="email"
          label={isSignUp ? dict.auth.signup.email : dict.auth.login.email}
          placeholder={isSignUp ? dict.auth.signup.emailPlaceholder : dict.auth.login.emailPlaceholder}
          value={formData.email}
          onValueChange={(value) => updateField('email', value)}
          startContent={<FaEnvelope className="text-default-400" />}
          isRequired
          variant="bordered"
          isDisabled={isLoading}
        />

        {isSignUp && (
          <Input
            name="fullName"
            type="text"
            label="이름"
            placeholder="홍길동"
            value={formData.fullName}
            onValueChange={(value) => updateField('fullName', value)}
            startContent={<FaUser className="text-default-400" />}
            variant="bordered"
            isDisabled={isLoading}
          />
        )}

        <Input
          name="password"
          type="password"
          label={isSignUp ? dict.auth.signup.password : dict.auth.login.password}
          placeholder={isSignUp ? dict.auth.signup.passwordPlaceholder : dict.auth.login.passwordPlaceholder}
          value={formData.password}
          onValueChange={(value) => updateField('password', value)}
          startContent={<FaLock className="text-default-400" />}
          isRequired
          variant="bordered"
          isDisabled={isLoading}
        />

        {isSignUp && <PasswordStrengthIndicator password={formData.password} />}

        {isSignUp && (
          <div className="space-y-2">
            <Checkbox
              isSelected={isTermsAgreed}
              onValueChange={(checked) => {
                if (!checked) {
                  setIsTermsAgreed(false);
                } else {
                  setShowTermsModal(true);
                }
              }}
              size="sm"
            >
              <span className="text-sm">
                {dict.auth.signup.agreeToTerms}{" "}
                <button
                  type="button"
                  className="text-primary underline hover:text-primary-600"
                  onClick={handleTermsLinkClick}
                >
                  이용약관, 개인정보처리방침, 쿠키정책
                </button>
              </span>
            </Checkbox>
            {!hasReadAllTerms && isTermsAgreed && (
              <p className="text-xs text-warning ml-6">
                약관을 모두 읽고 동의해주세요
              </p>
            )}
          </div>
        )}

        <Button
          type="submit"
          color="primary"
          className="w-full"
          size="lg"
          isLoading={isLoading}
          isDisabled={isLoading}
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
              ? dict.auth.signup.hasAccount
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

      {/* 약관 모달 */}
      <Modal
        isOpen={showTermsModal}
        onClose={handleModalClose}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-2xl font-bold">이용약관 및 정책</h2>
          </ModalHeader>
          <ModalBody>
            <Tabs aria-label="Terms tabs" fullWidth>
              <Tab
                key="terms"
                title={
                  <div className="flex items-center gap-2">
                    <span>이용약관</span>
                    {readTerms.terms && <span className="text-success">✓</span>}
                  </div>
                }
              >
                <Card>
                  <CardBody
                    className="max-h-[60vh] overflow-y-auto"
                    onScroll={(e) => handleScroll(e, 'terms')}
                  >
                    <TermsOfServiceContent />
                    {!readTerms.terms && (
                      <div className="sticky bottom-0 bg-linear-to-t from-background to-transparent pt-8 pb-2 text-center">
                        <p className="text-sm text-warning">
                          약관을 끝까지 스크롤하여 읽어주세요
                        </p>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </Tab>
              <Tab
                key="privacy"
                title={
                  <div className="flex items-center gap-2">
                    <span>개인정보처리방침</span>
                    {readTerms.privacy && <span className="text-success">✓</span>}
                  </div>
                }
              >
                <Card>
                  <CardBody
                    className="max-h-[60vh] overflow-y-auto"
                    onScroll={(e) => handleScroll(e, 'privacy')}
                  >
                    <PrivacyPolicyContent />
                    {!readTerms.privacy && (
                      <div className="sticky bottom-0 bg-linear-to-t from-background to-transparent pt-8 pb-2 text-center">
                        <p className="text-sm text-warning">
                          약관을 끝까지 스크롤하여 읽어주세요
                        </p>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </Tab>
              <Tab
                key="cookies"
                title={
                  <div className="flex items-center gap-2">
                    <span>쿠키정책</span>
                    {readTerms.cookies && <span className="text-success">✓</span>}
                  </div>
                }
              >
                <Card>
                  <CardBody
                    className="max-h-[60vh] overflow-y-auto"
                    onScroll={(e) => handleScroll(e, 'cookies')}
                  >
                    <CookiePolicyContent />
                    {!readTerms.cookies && (
                      <div className="sticky bottom-0 bg-linear-to-t from-background to-transparent pt-8 pb-2 text-center">
                        <p className="text-sm text-warning">
                          약관을 끝까지 스크롤하여 읽어주세요
                        </p>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>

            {hasReadAllTerms && (
              <div className="mt-4 p-3 bg-success-50 dark:bg-success-900/20 rounded-lg text-center">
                <p className="text-success font-semibold">
                  ✓ 모든 약관을 읽으셨습니다
                </p>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={handleModalClose}>
              취소
            </Button>
            <Button
              color="primary"
              onPress={handleAgreeTerms}
              isDisabled={!hasReadAllTerms}
            >
              {hasReadAllTerms ? "모두 동의하고 계속하기" : "약관을 모두 읽어주세요"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 이메일 인증 모달 */}
      <Modal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        size="md"
        isDismissable={false}
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-2xl font-bold">이메일 인증</h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-default-600">
                <span className="font-semibold">{verificationEmail}</span>로
                인증 코드를 전송했습니다.
              </p>
              <p className="text-sm text-default-500">
                이메일을 확인하여 6자리 인증 코드를 입력해주세요.
              </p>
              <Input
                label="인증 코드"
                placeholder="000000"
                value={verificationCode}
                onValueChange={setVerificationCode}
                maxLength={6}
                variant="bordered"
                size="lg"
                classNames={{
                  input: "text-center text-2xl tracking-widest",
                }}
                isDisabled={isVerifying}
              />
              <Button
                variant="light"
                size="sm"
                onPress={async () => {
                  setIsResending(true);
                  try {
                    const { authResendSignUpCode } = await import('@/lib/services/auth.service');
                    const result = await authResendSignUpCode(verificationEmail);
                    if (result.success) {
                      toast.success({
                        title: "인증 코드 재전송",
                        description: "이메일을 다시 확인해주세요.",
                      });
                    } else {
                      toast.error({
                        title: "재전송 실패",
                        description: result.error || "잠시 후 다시 시도해주세요.",
                      });
                    }
                  } catch (error) {
                    toast.error({
                      title: "오류",
                      description: "인증 코드 재전송 중 문제가 발생했습니다.",
                    });
                  } finally {
                    setIsResending(false);
                  }
                }}
                isLoading={isResending}
                className="w-full"
              >
                인증 코드 다시 받기
              </Button>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => {
                setShowVerificationModal(false);
                setVerificationCode("");
              }}
            >
              나중에 하기
            </Button>
            <Button
              color="primary"
              onPress={async () => {
                if (verificationCode.length !== 6) {
                  toast.error({
                    title: "입력 오류",
                    description: "6자리 인증 코드를 입력해주세요.",
                  });
                  return;
                }

                setIsVerifying(true);
                try {
                  const { authConfirmSignUp } = await import('@/lib/services/auth.service');
                  const result = await authConfirmSignUp(verificationEmail, verificationCode);
                  
                  if (result.success) {
                    toast.success({
                      title: "인증 완료",
                      description: "이메일 인증이 완료되었습니다. 로그인해주세요.",
                    });
                    setShowVerificationModal(false);
                    setVerificationCode("");
                    setIsSignUp(false); // 로그인 폼으로 전환
                  } else {
                    toast.error({
                      title: "인증 실패",
                      description: result.error || "인증 코드가 올바르지 않습니다.",
                    });
                  }
                } catch (error) {
                  toast.error({
                    title: "오류",
                    description: "인증 처리 중 문제가 발생했습니다.",
                  });
                } finally {
                  setIsVerifying(false);
                }
              }}
              isLoading={isVerifying}
              isDisabled={verificationCode.length !== 6}
            >
              인증하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
