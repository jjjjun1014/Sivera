"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import DashboardSidebar from "./DashboardSidebar";
import { Button } from "@heroui/button";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import { WorkspaceSwitcher } from "@/components/workspace/WorkspaceSwitcher";
import DashboardAuthGuard from "@/components/auth/DashboardAuthGuard";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  // 사업체 스위처를 숨길 경로들
  const hideWorkspaceSwitcherPaths = ["/dashboard/integrated", "/dashboard/team", "/dashboard/settings"];
  const showWorkspaceSwitcher = !hideWorkspaceSwitcherPaths.some(path => pathname.startsWith(path));

  return (
    <DashboardAuthGuard>
      <WorkspaceProvider>
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

              {/* Workspace Switcher */}
              {showWorkspaceSwitcher && (
                <div className="hidden lg:flex items-center gap-4">
                  <WorkspaceSwitcher />
                </div>
              )}

              {/* Right side - Empty for now */}
              <div className="flex items-center gap-2">
                {/* Notifications are accessible via sidebar menu */}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        </div>
      </div>
    </WorkspaceProvider>
    </DashboardAuthGuard>
  );
}
