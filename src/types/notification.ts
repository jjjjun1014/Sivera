// 알림 관련 타입 정의

export type NotificationType = "budget" | "performance" | "campaign" | "system";

export type NotificationPriority = "high" | "medium" | "low";

export interface Notification {
  id: number;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  platform?: string;
  campaignName?: string;
}
