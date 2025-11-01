/**
 * Set Password Form for Invited Users
 * 
 * 초대받은 사용자의 초기 비밀번호 설정
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { FaLock, FaEnvelope, FaUser } from 'react-icons/fa';

import { toast } from '@/utils/toast';
import { validatePassword, validateEmail } from '@/lib/services/auth.service';
import { authSignUp } from '@/lib/services/auth.service';
import { getInvitation, acceptInvitation } from '@/lib/services/team.service';
import { TOAST_MESSAGES, withDescription } from '@/constants/toast-messages';
import { PasswordRequirements } from '@/components/common/PasswordRequirements';

interface SetPasswordFormProps {
  inviteToken?: string;
  email?: string;
}

function SetPasswordForm({ inviteToken, email: defaultEmail }: SetPasswordFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [invitationValid, setInvitationValid] = useState(false);
  const [formData, setFormData] = useState({
    email: defaultEmail || '',
    fullName: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (inviteToken) {
      verifyInvitation();
    }
  }, [inviteToken]);

  const verifyInvitation = async () => {
    if (!inviteToken) return;

    try {
      const result = await getInvitation(inviteToken);
      
      if (!result.data) {
        toast.error({
          title: '초대 오류',
          description: '유효하지 않은 초대 링크입니다.',
        });
        router.push('/login');
        return;
      }

      if (result.data.status !== 'pending') {
        toast.error({
          title: '초대 오류',
          description: '이미 처리된 초대입니다.',
        });
        router.push('/login');
        return;
      }

      if (new Date(result.data.expiresAt) < new Date()) {
        toast.error({
          title: '초대 만료',
          description: '초대가 만료되었습니다.',
        });
        router.push('/login');
        return;
      }

      setFormData(prev => ({ ...prev, email: result.data!.email }));
      setInvitationValid(true);
    } catch (error) {
      console.error('Invitation verification error:', error);
      toast.error({
        title: '오류',
        description: '초대 확인 중 문제가 발생했습니다.',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!validateEmail(formData.email)) {
      toast.error(TOAST_MESSAGES.AUTH.EMAIL_INVALID);
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      toast.error(
        withDescription(TOAST_MESSAGES.AUTH.PASSWORD_INVALID, passwordValidation.errors[0])
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(TOAST_MESSAGES.AUTH.PASSWORD_MISMATCH);
      return;
    }

    setLoading(true);

    try {
      // 1. 회원가입
      const signUpResult = await authSignUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName || undefined,
      });

      if (!signUpResult.success) {
        toast.error({
          title: '회원가입 실패',
          description: signUpResult.error || '알 수 없는 오류가 발생했습니다.',
        });
        setLoading(false);
        return;
      }

      // 2. 초대 수락 (userId 필요)
      if (inviteToken && signUpResult.userId) {
        const acceptResult = await acceptInvitation(inviteToken, signUpResult.userId);
        
        if (acceptResult.success) {
          toast.success({
            title: '환영합니다!',
            description: '팀에 성공적으로 합류했습니다. 이메일 인증 후 로그인해주세요.',
          });
          router.push(`/login?email=${encodeURIComponent(formData.email)}`);
        } else {
          toast.warning({
            title: '계정 생성 완료',
            description: '초대 수락에 실패했습니다. 관리자에게 문의해주세요.',
          });
          router.push('/login');
        }
      } else {
        toast.success({
          title: '회원가입 완료',
          description: '이메일 인증 후 로그인해주세요.',
        });
        router.push(`/login?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (error) {
      console.error('Set password error:', error);
      toast.error({
        title: '오류',
        description: '비밀번호 설정 중 문제가 발생했습니다.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!invitationValid && inviteToken) {
    return (
      <Card className="bg-warning-50 dark:bg-warning-900/20">
        <CardBody className="text-center py-8">
          <p className="text-lg">초대 링크를 확인하는 중...</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        label="이메일"
        placeholder="your@email.com"
        value={formData.email}
        onValueChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
        startContent={<FaEnvelope className="text-default-400" />}
        isRequired
        isDisabled={!!defaultEmail}
        variant="bordered"
      />

      <Input
        type="text"
        label="이름"
        placeholder="홍길동"
        value={formData.fullName}
        onValueChange={(value) => setFormData(prev => ({ ...prev, fullName: value }))}
        startContent={<FaUser className="text-default-400" />}
        variant="bordered"
        isDisabled={loading}
      />

      <Input
        type="password"
        label="비밀번호"
        placeholder="8자 이상, 대소문자/숫자/특수문자 포함"
        value={formData.password}
        onValueChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
        startContent={<FaLock className="text-default-400" />}
        isRequired
        variant="bordered"
        isDisabled={loading}
      />

      <Input
        type="password"
        label="비밀번호 확인"
        placeholder="비밀번호를 다시 입력"
        value={formData.confirmPassword}
        onValueChange={(value) => setFormData(prev => ({ ...prev, confirmPassword: value }))}
        startContent={<FaLock className="text-default-400" />}
        isRequired
        variant="bordered"
        isDisabled={loading}
      />

      <PasswordRequirements />

      <Button
        type="submit"
        color="primary"
        className="w-full"
        size="lg"
        isLoading={loading}
        isDisabled={loading}
      >
        비밀번호 설정하고 시작하기
      </Button>

      <div className="text-center text-sm text-default-500">
        이미 계정이 있으신가요?{' '}
        <a href="/login" className="text-primary hover:underline">
          로그인
        </a>
      </div>
    </form>
  );
}

export default SetPasswordForm;
