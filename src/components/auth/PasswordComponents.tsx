/**
 * Common Auth Components
 * 
 * 재사용 가능한 인증 UI 컴포넌트
 */

'use client';

import { FaCheck, FaTimes } from 'react-icons/fa';
import { usePasswordValidation } from '@/hooks/auth/use-password-validation';

export function PasswordStrengthIndicator({ password }: { password: string }) {
  const validation = usePasswordValidation(password);

  if (!password) return null;

  return (
    <div className="bg-default-100 p-3 rounded-lg text-sm space-y-2">
      <p className="font-semibold">비밀번호 강도:</p>
      <div className="space-y-1">
        <CheckItem checked={validation.checks.length} label="최소 8자 이상" />
        <CheckItem checked={validation.checks.uppercase} label="대문자 포함" />
        <CheckItem checked={validation.checks.lowercase} label="소문자 포함" />
        <CheckItem checked={validation.checks.number} label="숫자 포함" />
        <CheckItem checked={validation.checks.special} label="특수문자 포함" />
      </div>
      {validation.valid && (
        <p className="text-success text-xs font-semibold mt-2">✓ 안전한 비밀번호입니다</p>
      )}
    </div>
  );
}

function CheckItem({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {checked ? (
        <FaCheck className="text-success text-xs" />
      ) : (
        <FaTimes className="text-danger text-xs" />
      )}
      <span className={checked ? 'text-success' : 'text-default-500'}>{label}</span>
    </div>
  );
}
