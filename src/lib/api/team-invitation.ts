/**
 * 팀 초대 API
 * 
 * Lambda 함수를 호출하여 팀 초대 이메일을 발송합니다.
 */

export interface SendInvitationRequest {
  teamID: string;
  email: string;
  role: 'master' | 'team_mate' | 'viewer';
  invitedByID: string;
}

export interface SendInvitationResponse {
  success: boolean;
  message: string;
  invitationId: string;
  invitationLink?: string;
}

/**
 * 팀 초대 이메일 발송
 * 
 * @param data - 초대 정보
 * @returns 초대 결과
 * 
 * @example
 * ```ts
 * const result = await sendTeamInvitation({
 *   teamID: 'team-123',
 *   email: 'user@example.com',
 *   role: 'team_mate',
 *   invitedByID: 'user-456',
 * });
 * ```
 */
export async function sendTeamInvitation(
  data: SendInvitationRequest
): Promise<SendInvitationResponse> {
  // TODO: Lambda 함수 URL 설정 필요
  const LAMBDA_ENDPOINT = process.env.NEXT_PUBLIC_SEND_INVITATION_API || '/api/send-invitation';

  const response = await fetch(LAMBDA_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send invitation');
  }

  return response.json();
}

/**
 * 팀 초대 수락
 * 
 * @param token - 초대 토큰
 * @param userID - 사용자 ID
 * @param userEmail - 사용자 이메일
 * @returns 수락 결과
 */
export async function acceptTeamInvitation(
  token: string,
  userID: string,
  userEmail: string
): Promise<{
  success: boolean;
  teamID: string;
  role: string;
}> {
  const LAMBDA_ENDPOINT = process.env.NEXT_PUBLIC_ACCEPT_INVITATION_API || '/api/accept-invitation';

  const response = await fetch(LAMBDA_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, userID, userEmail }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to accept invitation');
  }

  return response.json();
}
