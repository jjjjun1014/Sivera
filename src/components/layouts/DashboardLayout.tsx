"use client";

import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import { Button } from "@heroui/button";
import { Badge } from "@heroui/badge";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();

  // TODO: 실제로는 API에서 읽지 않은 알림 개수를 가져와야 함
  const unreadNotifications = 3;

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-content1 border-b border-divider">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            {/* Mobile Menu Button */}
            <Button
              isIconOnly
              variant="light"
              className="lg:hidden"
              onPress={() => setSidebarOpen(true)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>

            {/* Right side - Notifications */}
            <div className="flex items-center gap-2">
              <Badge content={unreadNotifications} color="danger" shape="circle" size="sm">
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => router.push("/dashboard/notifications")}
                  aria-label="알림"
                >
                  <Bell className="w-5 h-5" />
                </Button>
              </Badge>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
}
