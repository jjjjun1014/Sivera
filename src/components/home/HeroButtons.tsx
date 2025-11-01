"use client";

import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

import log from "@/utils/logger";
import { useAuth } from "@/contexts/auth-context";

interface HeroButtonsProps {
  primaryButtonText: string;
  secondaryButtonText?: string; // Optional for backward compatibility
}

export function HeroButtons({
  primaryButtonText,
}: HeroButtonsProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const { user, loading } = useAuth();

  const handleNavigation = (path: string, action: string) => {
    log.info("Navigation initiated", {
      module: "HeroButtons",
      action,
      targetPath: path,
      fromPath: "/",
    });
    router.push(path);
  };

  // 로그인된 사용자는 대시보드로
  const targetPath = user ? "/dashboard/analytics" : "/signup";
  const buttonText = user ? "대시보드로 이동" : primaryButtonText;

  return (
    <motion.div
      animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      className="flex justify-center"
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
      transition={prefersReducedMotion ? undefined : { duration: 0.5, delay: 0.2 }}
      data-testid="hero-buttons"
      role="group"
      aria-label="Hero action buttons"
    >
      <motion.div
        transition={
          prefersReducedMotion
            ? undefined
            : { type: "spring", stiffness: 400, damping: 17 }
        }
        whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
      >
        <Button
          color="primary"
          size="lg"
          variant="shadow"
          onPress={() => handleNavigation(targetPath, user ? "dashboard" : "start-free")}
          data-testid="hero-primary-button"
          aria-label={buttonText}
          isLoading={loading}
        >
          {buttonText}
        </Button>
      </motion.div>
    </motion.div>
  );
}
