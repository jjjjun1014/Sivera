"use client";

import { useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";

const menuItems = [
  {
    key: "analytics",
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    key: "notifications",
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    ),
  },
  {
    key: "google-ads",
    label: "Google Ads",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    subItems: [
      { key: "google-ads-dashboard", label: "Dashboard", href: "/dashboard/platforms/google-ads/dashboard" },
      { key: "google-ads-search", label: "Search", href: "/dashboard/platforms/google-ads/search" },
      { key: "google-ads-display", label: "Display", href: "/dashboard/platforms/google-ads/display" },
      { key: "google-ads-shopping", label: "Shopping", href: "/dashboard/platforms/google-ads/shopping" },
      { key: "google-ads-pmax", label: "Performance Max", href: "/dashboard/platforms/google-ads/performance-max" },
    ],
  },
  {
    key: "meta-ads",
    label: "Meta Ads",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
        />
      </svg>
    ),
    subItems: [
      { key: "meta-ads-dashboard", label: "Dashboard", href: "/dashboard/platforms/meta-ads/dashboard" },
      { key: "meta-ads-standard", label: "Standard", href: "/dashboard/platforms/meta-ads/standard" },
      { key: "meta-ads-advantage", label: "Advantage+", href: "/dashboard/platforms/meta-ads/advantage-plus" },
    ],
  },
  {
    key: "tiktok-ads",
    label: "TikTok Ads",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    subItems: [
      { key: "tiktok-ads-dashboard", label: "Dashboard", href: "/dashboard/platforms/tiktok-ads/dashboard" },
      { key: "tiktok-ads-standard", label: "Standard", href: "/dashboard/platforms/tiktok-ads/standard" },
      { key: "tiktok-ads-gmv", label: "GMV Max", href: "/dashboard/platforms/tiktok-ads/gmv-max" },
    ],
  },
  {
    key: "amazon-ads",
    label: "Amazon Ads",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
    subItems: [
      { key: "amazon-ads-dashboard", label: "Dashboard", href: "/dashboard/platforms/amazon-ads/dashboard" },
      { key: "amazon-ads-products", label: "Sponsored Products", href: "/dashboard/platforms/amazon-ads/sponsored-products" },
      { key: "amazon-ads-brands", label: "Sponsored Brands", href: "/dashboard/platforms/amazon-ads/sponsored-brands" },
      { key: "amazon-ads-display", label: "Sponsored Display", href: "/dashboard/platforms/amazon-ads/sponsored-display" },
      { key: "amazon-ads-dsp", label: "DSP", href: "/dashboard/platforms/amazon-ads/dsp" },
    ],
  },
  {
    key: "integrated",
    label: "Integrations",
    href: "/dashboard/integrated",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    key: "team",
    label: "Team",
    href: "/dashboard/team",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    key: "settings",
    label: "Settings",
    href: "/dashboard/settings",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

interface DashboardSidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

export default function DashboardSidebar({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (key: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-content1 border-r border-divider z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "lg:w-20" : "w-64"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-divider">
            <div className="flex items-center gap-2">
              {/* Desktop Toggle Button */}
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="hidden lg:flex"
                onPress={onToggleCollapse}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"}
                  />
                </svg>
              </Button>

              {/* Logo - only show when expanded */}
              {!isCollapsed && (
                <NextLink href="/dashboard/analytics" className="lg:block hidden">
                  <span className="text-lg font-bold">Sivera</span>
                </NextLink>
              )}
            </div>

            {/* Mobile Close Button */}
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="lg:hidden"
              onPress={onClose}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const hasSubItems = 'subItems' in item && item.subItems;
                const isExpanded = expandedItems.has(item.key);
                const isActive = hasSubItems
                  ? item.subItems?.some((sub: any) => pathname === sub.href)
                  : pathname === item.href;

                return (
                  <li key={item.key}>
                    {hasSubItems ? (
                      <>
                        <button
                          onClick={() => toggleExpand(item.key)}
                          className={`flex items-center justify-between w-full gap-3 px-4 py-3 rounded-lg transition-colors ${
                            isActive
                              ? "bg-default-100"
                              : "hover:bg-default-100"
                          } ${isCollapsed ? "lg:justify-center" : ""}`}
                          title={isCollapsed ? item.label : ""}
                        >
                          <div className="flex items-center gap-3">
                            {item.icon}
                            <span className={`font-medium transition-opacity duration-300 ${isCollapsed ? "lg:opacity-0 lg:hidden" : "opacity-100"}`}>
                              {item.label}
                            </span>
                          </div>
                          {!isCollapsed && (
                            <svg
                              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </button>
                        {isExpanded && !isCollapsed && (
                          <ul className="ml-4 mt-1 space-y-1 border-l-2 border-default-200 pl-4">
                            {item.subItems.map((subItem: any) => {
                              const isSubActive = pathname === subItem.href;
                              return (
                                <li key={subItem.key}>
                                  <NextLink
                                    href={subItem.href}
                                    onClick={onClose}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                      isSubActive
                                        ? "bg-primary text-primary-foreground font-medium"
                                        : "hover:bg-default-100"
                                    }`}
                                  >
                                    {subItem.label}
                                  </NextLink>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </>
                    ) : (
                      <NextLink
                        href={item.href || '#'}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-default-100"
                        } ${isCollapsed ? "lg:justify-center" : ""}`}
                        title={isCollapsed ? item.label : ""}
                      >
                        {item.icon}
                        <span className={`font-medium transition-opacity duration-300 ${isCollapsed ? "lg:opacity-0 lg:hidden" : "opacity-100"}`}>
                          {item.label}
                        </span>
                      </NextLink>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-divider">
            <Dropdown placement="top">
              <DropdownTrigger>
                <Button
                  variant="flat"
                  className={`w-full ${isCollapsed ? "lg:justify-center lg:px-0" : "justify-start"}`}
                  startContent={
                    !isCollapsed ? (
                      <Avatar
                        size="sm"
                        name="사용자"
                        src="https://i.pravatar.cc/150?u=user"
                      />
                    ) : undefined
                  }
                >
                  {isCollapsed ? (
                    <Avatar
                      size="sm"
                      name="사용자"
                      src="https://i.pravatar.cc/150?u=user"
                      className="lg:block hidden"
                    />
                  ) : null}
                  <div className={`flex flex-col items-start transition-opacity duration-300 ${isCollapsed ? "lg:opacity-0 lg:hidden" : "opacity-100"}`}>
                    <span className="text-sm font-medium">사용자</span>
                    <span className="text-xs text-default-500">
                      user@example.com
                    </span>
                  </div>
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="사용자 메뉴">
                <DropdownItem key="profile" href="/dashboard/profile">
                  프로필
                </DropdownItem>
                <DropdownItem key="settings" href="/dashboard/settings">
                  설정
                </DropdownItem>
                <DropdownItem key="logout" color="danger">
                  로그아웃
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </aside>
    </>
  );
}
