/**
 * Audit Log Storage Service
 *
 * 변경 이력을 localStorage에 저장하고 관리합니다.
 * TODO: AWS DynamoDB 연동 시 이 파일의 함수들을 AWS API 호출로 교체
 */

import { BaseStorage } from "./BaseStorage";

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: "invite" | "remove" | "role_change" | "campaign_create" | "campaign_edit" | "campaign_delete" | "budget_change" | "platform_connect" | "platform_disconnect";
  target: string;
  details: string;
  timestamp: number; // Unix timestamp
  metadata?: {
    before?: any;
    after?: any;
    platform?: string;
    campaignId?: string;
  };
}

const STORAGE_KEY = "audit_logs";
const MAX_LOGS = 1000; // localStorage 최대 저장 개수

class AuditLogStorage extends BaseStorage<AuditLogEntry[]> {
  constructor() {
    super(STORAGE_KEY);
  }

  /**
   * 모든 로그 불러오기 (BaseStorage 구현)
   */
  load(): AuditLogEntry[] | null {
    // TODO: AWS API로 교체 - GET /api/audit-logs?userId={userId}
    return this.getFromLocalStorage();
  }

  /**
   * 모든 로그 저장하기 (BaseStorage 구현)
   */
  save(data: AuditLogEntry[]): void {
    // TODO: AWS API로 교체 - POST /api/audit-logs
    this.saveToLocalStorage(data);
  }

  /**
   * 모든 로그 삭제하기
   */
  clear(): void {
    // TODO: AWS API로 교체 - DELETE /api/audit-logs?userId={userId}
    this.removeFromLocalStorage();
  }
  /**
   * 변경 이력 추가
   * TODO: AWS API Gateway + Lambda + DynamoDB로 교체
   */
  addLog(entry: Omit<AuditLogEntry, "id" | "timestamp">): AuditLogEntry {
    if (typeof window === "undefined") {
      throw new Error("Cannot access localStorage on server side");
    }

    const newEntry: AuditLogEntry = {
      ...entry,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    const logs = this.getAllLogs();
    logs.unshift(newEntry); // 최신 항목을 맨 앞에

    // 최대 개수 제한
    if (logs.length > MAX_LOGS) {
      logs.splice(MAX_LOGS);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));

    // TODO: AWS DynamoDB에 저장
    // await dynamoDBClient.putItem({
    //   TableName: 'AuditLogs',
    //   Item: {
    //     id: newEntry.id,
    //     userId: newEntry.userId,
    //     action: newEntry.action,
    //     timestamp: newEntry.timestamp,
    //     ...
    //   }
    // });

    return newEntry;
  }

  /**
   * 모든 변경 이력 조회
   * TODO: AWS API Gateway + Lambda + DynamoDB로 교체
   */
  getAllLogs(): AuditLogEntry[] {
    if (typeof window === "undefined") return [];

    try {
      return JSON.parse(data);
    } catch {
      return [];
    }

    // TODO: AWS DynamoDB에서 조회
    // const response = await apiClient.get('/audit-logs', {
    //   params: { limit: 100 }
    // });
    // return response.data.items;
  }

  /**
   * 날짜 범위로 필터링
   * TODO: AWS API에서 직접 필터링된 데이터 가져오기
   */
  getLogsByDateRange(startDate: Date, endDate: Date): AuditLogEntry[] {
    const logs = this.getAllLogs();
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();

    return logs.filter(log =>
      log.timestamp >= startTime && log.timestamp <= endTime
    );

    // TODO: AWS API에서 날짜 범위로 쿼리
    // const response = await apiClient.get('/audit-logs', {
    //   params: {
    //     startDate: startDate.toISOString(),
    //     endDate: endDate.toISOString()
    //   }
    // });
    // return response.data.items;
  }

  /**
   * 사용자별 필터링
   * TODO: AWS API에서 직접 필터링된 데이터 가져오기
   */
  getLogsByUser(userId: string): AuditLogEntry[] {
    const logs = this.getAllLogs();
    return logs.filter(log => log.userId === userId);

    // TODO: AWS API에서 사용자별로 쿼리
    // const response = await apiClient.get('/audit-logs', {
    //   params: { userId }
    // });
    // return response.data.items;
  }

  /**
   * 액션 타입별 필터링
   */
  getLogsByAction(action: AuditLogEntry["action"]): AuditLogEntry[] {
    const logs = this.getAllLogs();
    return logs.filter(log => log.action === action);
  }

  /**
   * 최근 N일 이내 로그 조회
   */
  getRecentLogs(days: number = 30): AuditLogEntry[] {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.getLogsByDateRange(startDate, endDate);
  }

  /**
   * 전체 삭제 (관리자 전용)
   */
  clearAllLogs(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * 샘플 데이터 (최초 로드 시)
   */
  private getDefaultLogs(): AuditLogEntry[] {
    return [
      {
        id: "1",
        userId: "user1",
        userName: "김민수",
        action: "invite",
        target: "new.member@company.com",
        details: "팀원 역할로 초대",
        timestamp: Date.now() - 86400000, // 1일 전
        metadata: { before: null, after: "team_mate" },
      },
      {
        id: "2",
        userId: "user1",
        userName: "김민수",
        action: "role_change",
        target: "이지은",
        details: "뷰어 → 팀원",
        timestamp: Date.now() - 172800000, // 2일 전
        metadata: { before: "viewer", after: "team_mate" },
      },
      {
        id: "3",
        userId: "user2",
        userName: "이지은",
        action: "campaign_create",
        target: "여름 세일 캠페인",
        details: "Google Ads - 검색 광고",
        timestamp: Date.now() - 259200000, // 3일 전
        metadata: { platform: "google-ads", campaignId: "camp123" },
      },
      {
        id: "4",
        userId: "user1",
        userName: "김민수",
        action: "remove",
        target: "user@company.com",
        details: "팀 규모 조정",
        timestamp: Date.now() - 432000000, // 5일 전
      },
      {
        id: "5",
        userId: "user3",
        userName: "박서준",
        action: "budget_change",
        target: "브랜드 캠페인",
        details: "₩300,000 → ₩450,000",
        timestamp: Date.now() - 518400000, // 6일 전
        metadata: { before: 300000, after: 450000, campaignId: "camp456" },
      },
    ];
  }
}

export const auditLogStorage = new AuditLogStorage();

/**
 * 액션 타입별 한글 레이블
 */
export const ACTION_LABELS: Record<AuditLogEntry["action"], string> = {
  invite: "팀원 초대",
  remove: "팀원 제거",
  role_change: "역할 변경",
  campaign_create: "캠페인 생성",
  campaign_edit: "캠페인 수정",
  campaign_delete: "캠페인 삭제",
  budget_change: "예산 변경",
  platform_connect: "플랫폼 연동",
  platform_disconnect: "플랫폼 해제",
};

/**
 * 액션 타입별 색상
 */
export const ACTION_COLORS: Record<AuditLogEntry["action"], "success" | "danger" | "warning" | "primary" | "default"> = {
  invite: "success",
  remove: "danger",
  role_change: "warning",
  campaign_create: "success",
  campaign_edit: "primary",
  campaign_delete: "danger",
  budget_change: "warning",
  platform_connect: "success",
  platform_disconnect: "danger",
};
