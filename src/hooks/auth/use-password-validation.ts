/**
 * Password Validation Hook
 * 
 * 비밀번호 유효성 검사 훅
 */

import { useState, useEffect } from 'react';
import { validatePassword } from '@/lib/services/auth.service';

export function usePasswordValidation(password: string) {
  const [validation, setValidation] = useState({
    valid: false,
    errors: [] as string[],
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  });

  useEffect(() => {
    const result = validatePassword(password);
    
    setValidation({
      valid: result.valid,
      errors: result.errors,
      checks: {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^a-zA-Z0-9]/.test(password),
      },
    });
  }, [password]);

  return validation;
}

export function usePasswordMatch(password: string, confirmPassword: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    setMatches(password === confirmPassword && password.length > 0);
  }, [password, confirmPassword]);

  return matches;
}
