"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import DashboardSidebar from "./DashboardSidebar";
import { Button } from "@heroui/button";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";
import { AccountProvider } from "@/contexts/AccountContext";
import DashboardAuthGuard from "@/components/auth/DashboardAuthGuard";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <DashboardAuthGuard>
      <WorkspaceProvider>
        <AccountProvider>
          <div className="min-h-screen bg-background">
            <DashboardSidebar
              isOpen={sidebarOpen}
              isCollapsed={sidebarCollapsed}
              onClose={() => setSidebarOpen(false)}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

        {/* Main Content */}
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
          {/* Mobile Menu Button - Fixed Top */}
          <Button
            isIconOnly
            variant="light"
            className="lg:hidden fixed top-4 left-4 z-40 bg-content1 shadow-medium"
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

          {/* Page Content */}
          <main className="min-h-screen">{children}</main>
        </div>
      </div>
      </AccountProvider>
    </WorkspaceProvider>
    </DashboardAuthGuard>
  );
}
