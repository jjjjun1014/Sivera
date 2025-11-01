/**
 * Auth Form Hook
 * 
 * 인증 폼 상태 관리 훅
 */

import { useState } from 'react';
import { validateEmail } from '@/lib/services/auth.service';

export interface AuthFormData {
  email: string;
  password: string;
  fullName?: string;
  confirmPassword?: string;
}

export function useAuthForm(initialData?: Partial<AuthFormData>) {
  const [formData, setFormData] = useState<AuthFormData>({
    email: initialData?.email || '',
    password: initialData?.password || '',
    fullName: initialData?.fullName || '',
    confirmPassword: initialData?.confirmPassword || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AuthFormData, string>>>({});

  const updateField = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof AuthFormData, string>> = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = '올바른 이메일 주소를 입력해주세요';
    }

    if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 최소 8자 이상이어야 합니다';
    }

    // confirmPassword가 실제로 입력된 경우에만 검증 (빈 문자열이 아닌 경우)
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setFormData({
      email: '',
      password: '',
      fullName: '',
      confirmPassword: '',
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    updateField,
    validateForm,
    reset,
    setFormData,
  };
}
