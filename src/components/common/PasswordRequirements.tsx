/**
 * Password Requirements Component
 * 
 * 비밀번호 요구사항을 표시하는 공통 컴포넌트
 */

'use client';

export function PasswordRequirements() {
  return (
    <div className="bg-default-100 p-3 rounded-lg text-sm">
      <p className="font-semibold mb-2">비밀번호 요구사항:</p>
      <ul className="space-y-1 text-default-600">
        <li>• 최소 8자 이상</li>
        <li>• 대문자 포함</li>
        <li>• 소문자 포함</li>
        <li>• 숫자 포함</li>
        <li>• 특수문자 포함</li>
      </ul>
    </div>
  );
}
