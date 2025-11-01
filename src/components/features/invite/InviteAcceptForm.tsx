/**
 * Invite Accept Form
 * 
 * 팀 초대 수락 폼
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { FaUsers, FaEnvelope, FaUserTag, FaCalendar } from 'react-icons/fa';

import { toast } from '@/utils/toast';
import { useAuth } from '@/contexts/auth-context';
import {
  getInvitation,
  acceptInvitation,
  getTeam,
} from '@/lib/services/team.service';
import type { TeamInvitation, Team } from '@/types/amplify';

interface InviteAcceptFormProps {
  inviteToken?: string;
  defaultEmail?: string;
}

export default function InviteAcceptForm({
  inviteToken,
  defaultEmail,
}: InviteAcceptFormProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [invitation, setInvitation] = useState<TeamInvitation | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!inviteToken) {
      setError('초대 토큰이 없습니다.');
      setLoading(false);
      return;
    }

    loadInvitation();
  }, [inviteToken]);

  const loadInvitation = async () => {
    if (!inviteToken) return;

    try {
      setLoading(true);
      const result = await getInvitation(inviteToken);

      if (!result.data) {
        setError('초대를 찾을 수 없습니다.');
        return;
      }

      setInvitation(result.data);

      // 팀 정보도 가져오기
      const teamResult = await getTeam(result.data.teamID);
      if (teamResult.data) {
        setTeam(teamResult.data);
      }

      // 초대 상태 확인
      if (result.data.status !== 'pending') {
        setError('이미 처리된 초대입니다.');
        return;
      }

      // 만료 확인
      if (new Date(result.data.expiresAt) < new Date()) {
        setError('초대가 만료되었습니다.');
        return;
      }

      // 이메일 확인
      if (user && user.email !== result.data.email) {
        setError('초대된 이메일과 현재 로그인한 이메일이 다릅니다.');
        return;
      }
    } catch (error) {
      console.error('Error loading invitation:', error);
      setError('초대 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!invitation || !user) return;

    setAccepting(true);

    try {
      const result = await acceptInvitation(invitation.id, user.id);

      if (result.success) {
        toast.success({
          title: '초대 수락 완료',
          description: `${team?.name || '팀'}에 합류했습니다.`,
        });
        router.push('/dashboard/analytics');
      } else {
        toast.error({
          title: '초대 수락 실패',
          description: result.error || '알 수 없는 오류가 발생했습니다.',
        });
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast.error({
        title: '오류',
        description: '초대 수락 중 문제가 발생했습니다.',
      });
    } finally {
      setAccepting(false);
    }
  };

  const handleDecline = () => {
    router.push('/dashboard/analytics');
  };

  // 로딩 상태
  if (loading || authLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-default-500">초대 정보를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Card className="bg-danger-50 dark:bg-danger-900/20">
        <CardBody className="text-center py-8">
          <p className="text-danger text-lg mb-4">{error}</p>
          <Button color="primary" onPress={() => router.push('/login')}>
            로그인하기
          </Button>
        </CardBody>
      </Card>
    );
  }

  // 로그인 필요
  if (!user) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <p className="text-lg mb-4">
            초대를 수락하려면 로그인이 필요합니다.
          </p>
          <Button
            color="primary"
            onPress={() =>
              router.push(
                `/login?returnUrl=/invite?token=${inviteToken}&email=${
                  invitation?.email || defaultEmail || ''
                }`
              )
            }
          >
            로그인하기
          </Button>
        </CardBody>
      </Card>
    );
  }

  // 초대 정보 표시
  if (!invitation || !team) {
    return null;
  }

  const roleLabels = {
    master: '마스터',
    team_mate: '팀원',
    viewer: '뷰어',
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardBody className="space-y-4">
          <div className="flex items-center gap-3">
            <FaUsers className="text-3xl text-primary" />
            <div>
              <h2 className="text-2xl font-bold">{team.name}</h2>
            </div>
          </div>

          <Divider />

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-default-400" />
              <div>
                <p className="text-sm text-default-500">초대 이메일</p>
                <p className="font-medium">{invitation.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaUserTag className="text-default-400" />
              <div>
                <p className="text-sm text-default-500">부여될 역할</p>
                <p className="font-medium">{roleLabels[invitation.role]}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaCalendar className="text-default-400" />
              <div>
                <p className="text-sm text-default-500">만료일</p>
                <p className="font-medium">
                  {new Date(invitation.expiresAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex gap-4">
        <Button
          color="primary"
          size="lg"
          className="flex-1"
          onPress={handleAccept}
          isLoading={accepting}
          isDisabled={accepting}
        >
          초대 수락
        </Button>
        <Button
          color="default"
          variant="bordered"
          size="lg"
          className="flex-1"
          onPress={handleDecline}
          isDisabled={accepting}
        >
          거절
        </Button>
      </div>

      <div className="bg-default-100 p-4 rounded-lg text-sm">
        <p className="font-semibold mb-2">역할 권한 안내:</p>
        <ul className="space-y-1 text-default-600">
          <li>
            <strong>마스터:</strong> 팀의 모든 권한 (멤버 관리, 설정 변경 등)
          </li>
          <li>
            <strong>팀원:</strong> 캠페인 생성/수정, 데이터 조회
          </li>
          <li>
            <strong>뷰어:</strong> 데이터 조회만 가능
          </li>
        </ul>
      </div>
    </div>
  );
}
