/**
 * Theme Toggle Component
 * 
 * 라이트/다크 모드 전환 토글
 */

'use client';

import { useEffect, useState } from 'react';
import { Switch } from '@heroui/switch';
import { Button } from '@heroui/button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // 마운트 후에만 렌더링 (hydration 에러 방지)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        isIconOnly
        variant="light"
        className="w-10 h-10"
        isDisabled
      >
        <Sun className="w-5 h-5" />
      </Button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <Button
      isIconOnly
      variant="light"
      onPress={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-10 h-10"
      aria-label={`${isDark ? '라이트' : '다크'} 모드로 전환`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-warning" />
      ) : (
        <Moon className="w-5 h-5 text-default-600" />
      )}
    </Button>
  );
}

/**
 * Theme Toggle Switch (Switch 스타일)
 */
export function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === 'dark';

  return (
    <Switch
      isSelected={isDark}
      onValueChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      startContent={<Sun className="w-4 h-4" />}
      endContent={<Moon className="w-4 h-4" />}
      aria-label="다크 모드 전환"
    >
      <span className="text-sm">{isDark ? '다크' : '라이트'} 모드</span>
    </Switch>
  );
}
