"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete?: () => void;
  skipOnRevisit?: boolean;
}

export function SplashScreen({ onComplete, skipOnRevisit = true }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    // 재방문 체크
    if (skipOnRevisit) {
      const visited = localStorage.getItem('sivera-splash-seen');
      if (visited) {
        setHasVisited(true);
        setIsVisible(false);
        onComplete?.();
        return;
      }
    }

    // 애니메이션 타이밍
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (skipOnRevisit) {
        localStorage.setItem('sivera-splash-seen', 'true');
      }
      onComplete?.();
    }, 3000); // 3초 후 사라짐

    return () => clearTimeout(timer);
  }, [onComplete, skipOnRevisit]);

  // 이미 방문했으면 렌더링하지 않음
  if (hasVisited) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
          {/* S 로고 애니메이션 */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: [0.5, 1.2, 1],
              opacity: [0, 1, 1],
            }}
            transition={{
              duration: 1.5,
              times: [0, 0.6, 1],
              ease: "easeInOut",
            }}
            className="relative"
          >
            {/* S 로고 */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 1, 0] }}
              transition={{ duration: 1.5, times: [0, 0.5, 1], delay: 0.8 }}
              className="text-[120px] md:text-[200px] font-black text-primary"
            >
              S
            </motion.div>

            {/* IVERA 텍스트 (S 다음에 나타남) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: [0, 0, 1], x: [-20, -20, 0] }}
              transition={{ duration: 1, times: [0, 0.5, 1], delay: 1.3 }}
              className="absolute top-0 left-0 flex items-center"
            >
              <span className="text-[120px] md:text-[200px] font-black text-primary">
                S
              </span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="text-[120px] md:text-[200px] font-black bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent"
              >
                ivera
              </motion.span>
            </motion.div>
          </motion.div>

          {/* 글로우 효과 */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0, 1.5, 2],
            }}
            transition={{
              duration: 2,
              times: [0, 0.5, 1],
              ease: "easeOut",
            }}
            className="absolute w-96 h-96 bg-primary/30 rounded-full blur-[120px]"
          />

          {/* Skip 버튼 */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => {
              setIsVisible(false);
              if (skipOnRevisit) {
                localStorage.setItem('sivera-splash-seen', 'true');
              }
              onComplete?.();
            }}
            className="absolute bottom-8 right-8 px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            Skip →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
