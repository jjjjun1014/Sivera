"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
import { Pagination } from "@heroui/pagination";
import { Bell, AlertTriangle, TrendingUp, TrendingDown, DollarSign, CheckCircle, Settings } from "lucide-react";
import Link from "next/link";
import { Notification } from "@/types";
import { sampleNotifications } from "@/lib/mock-data";
import { usePagination } from "@/hooks";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [selectedTab, setSelectedTab] = useState("all");

  // 타입별 필터링
  const filteredNotifications = notifications.filter((notif) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "unread") return !notif.isRead;
    return notif.type === selectedTab;
  });

  // 페이지네이션
  const { currentPage, totalPages, paginatedData: paginatedNotifications, setCurrentPage } = usePagination(
    filteredNotifications,
    { itemsPerPage: 5 }
  );

  // 읽음 처리
  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
  };

  // 전체 읽음 처리
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
  };

  // 삭제
  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  // 타입별 아이콘
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "budget":
        return <DollarSign className="w-5 h-5" />;
      case "performance":
        return <TrendingUp className="w-5 h-5" />;
      case "campaign":
        return <Bell className="w-5 h-5" />;
      case "system":
        return <Settings className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  // 우선순위별 색상
  const getPriorityColor = (priority: string): "danger" | "warning" | "default" => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      default:
        return "default";
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">알림 센터</h1>
          <p className="text-default-500">
            {unreadCount > 0 ? `${unreadCount}개의 읽지 않은 알림이 있습니다` : "모든 알림을 확인했습니다"}
          </p>
        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <Button variant="flat" onPress={markAllAsRead}>
              전체 읽음 처리
            </Button>
          )}
          <Link href="/dashboard/settings">
            <Button variant="flat" startContent={<Settings className="w-4 h-4" />}>
              알림 설정
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <Card className="mb-6">
        <CardBody>
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            variant="underlined"
          >
            <Tab key="all" title="전체" />
            <Tab key="unread" title={`읽지 않음 (${unreadCount})`} />
            <Tab key="budget" title="예산" />
            <Tab key="performance" title="성과" />
            <Tab key="campaign" title="캠페인" />
            <Tab key="system" title="시스템" />
          </Tabs>
        </CardBody>
      </Card>

      {/* Notification List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardBody className="py-12 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-success" />
              <p className="text-lg font-semibold mb-2">모든 알림을 확인했습니다</p>
              <p className="text-default-500">새로운 알림이 도착하면 여기에 표시됩니다</p>
            </CardBody>
          </Card>
        ) : (
          paginatedNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`hover:shadow-lg transition-shadow ${
                !notification.isRead ? "border-l-4 border-l-primary" : ""
              }`}
            >
              <CardBody className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <div
                      className={`p-3 rounded-lg ${
                        notification.priority === "high"
                          ? "bg-danger/10 text-danger"
                          : notification.priority === "medium"
                          ? "bg-warning/10 text-warning"
                          : "bg-default-100 text-default-500"
                      }`}
                    >
                      {getTypeIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={`text-lg font-semibold ${
                            !notification.isRead ? "text-foreground" : "text-default-600"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                      <p className="text-default-600 mb-2">{notification.message}</p>
                      <div className="flex items-center gap-3 text-sm text-default-400">
                        <span>{notification.timestamp}</span>
                        {notification.platform && (
                          <>
                            <span>•</span>
                            <span>{notification.platform}</span>
                          </>
                        )}
                        {notification.campaignName && (
                          <>
                            <span>•</span>
                            <span>{notification.campaignName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Chip
                      size="sm"
                      variant="flat"
                      color={getPriorityColor(notification.priority)}
                    >
                      {notification.priority === "high"
                        ? "긴급"
                        : notification.priority === "medium"
                        ? "중요"
                        : "일반"}
                    </Chip>
                    {!notification.isRead && (
                      <Button
                        size="sm"
                        variant="light"
                        onPress={() => markAsRead(notification.id)}
                      >
                        읽음
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => deleteNotification(notification.id)}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredNotifications.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
            showControls
            color="primary"
          />
        </div>
      )}
    </div>
  );
}
