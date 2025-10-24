"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Checkbox } from "@heroui/checkbox";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";

import { toast } from "@/utils/toast";
import { useDictionary } from "@/hooks/use-dictionary";
import TermsOfServiceContent from "@/app/terms/TermsOfServiceContent";
import PrivacyPolicyContent from "@/app/privacy/PrivacyPolicyContent";
import CookiePolicyContent from "@/app/cookies/CookiePolicyContent";

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
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(initialMode === "signup");
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasReadAllTerms, setHasReadAllTerms] = useState(false);
  const [readTerms, setReadTerms] = useState({
    terms: false,
    privacy: false,
    cookies: false,
  });
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSignUp && !isTermsAgreed) {
      toast.error({
        title: dict.auth.signup.errors.termsRequired,
        description: dict.auth.signup.errors.termsRequiredDesc,
      });
      return;
    }

    // TODO: AWS 연동 후 실제 로그인/회원가입 로직 구현
    // 임시로 로그인 시 대시보드로 리다이렉트
    if (!isSignUp) {
      // 로그인
      toast.success({
        title: "로그인 성공 (임시)",
        description: "대시보드로 이동합니다.",
      });
      router.push("/dashboard/analytics");
    } else {
      // 회원가입
      toast.info({
        title: "개발 중",
        description: "AWS 연동 후 사용 가능합니다.",
      });
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
                {dict.auth.signup.termsAgree}{" "}
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
                      <div className="sticky bottom-0 bg-gradient-to-t from-background to-transparent pt-8 pb-2 text-center">
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
                      <div className="sticky bottom-0 bg-gradient-to-t from-background to-transparent pt-8 pb-2 text-center">
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
                      <div className="sticky bottom-0 bg-gradient-to-t from-background to-transparent pt-8 pb-2 text-center">
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
    </div>
  );
}
