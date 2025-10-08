"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { LayoutDashboard, Settings, LogOut, Bell, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function HubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-default-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Sivera
            </h1>
            <Breadcrumbs radius="sm">
              <BreadcrumbItem>Home</BreadcrumbItem>
              <BreadcrumbItem>Hub</BreadcrumbItem>
            </Breadcrumbs>
          </div>
          <div className="flex items-center gap-3">
            {/* 알림 */}
            <Badge content="5" color="primary" radius="sm">
              <Button
                isIconOnly
                variant="light"
                radius="sm"
                aria-label="알림"
              >
                <Bell className="w-5 h-5" />
              </Button>
            </Badge>

            {/* 사용자 메뉴 */}
            <Dropdown radius="sm">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="cursor-pointer"
                  src="https://i.pravatar.cc/150?u=user"
                  name="사용자"
                  size="sm"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="사용자 메뉴" variant="flat">
                <DropdownItem key="profile" startContent={<Avatar size="sm" />}>
                  프로필
                </DropdownItem>
                <DropdownItem key="settings" startContent={<Settings className="w-4 h-4" />}>
                  설정
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  className="text-danger"
                  color="danger"
                  startContent={<LogOut className="w-4 h-4" />}
                >
                  로그아웃
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">환영합니다! 👋</h2>
          <p className="text-default-600">
            통합 대시보드에서 모든 마케팅 활동을 관리하세요
          </p>
        </div>

        {/* 빠른 통계 */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card radius="sm">
            <CardBody className="p-6">
              <p className="text-sm text-default-500 mb-1">총 캠페인</p>
              <p className="text-3xl font-bold">0</p>
              <p className="text-xs text-success mt-2">+0% 이번 달</p>
            </CardBody>
          </Card>
          <Card radius="sm">
            <CardBody className="p-6">
              <p className="text-sm text-default-500 mb-1">활성 캠페인</p>
              <p className="text-3xl font-bold">0</p>
              <p className="text-xs text-success mt-2">실행 중</p>
            </CardBody>
          </Card>
          <Card radius="sm">
            <CardBody className="p-6">
              <p className="text-sm text-default-500 mb-1">총 지출</p>
              <p className="text-3xl font-bold">₩0</p>
              <p className="text-xs text-default-500 mt-2">이번 달</p>
            </CardBody>
          </Card>
          <Card radius="sm">
            <CardBody className="p-6">
              <p className="text-sm text-default-500 mb-1">연동 플랫폼</p>
              <p className="text-3xl font-bold">0</p>
              <p className="text-xs text-default-500 mt-2">4개 플랫폼 지원</p>
            </CardBody>
          </Card>
        </div>

        {/* 서비스 카드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 마케팅 플랫폼 */}
          <Link href="/dashboard/marketing">
            <Card radius="sm" className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex gap-3 p-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <p className="text-md font-semibold">마케팅 플랫폼</p>
                  <p className="text-small text-default-500">광고 캠페인 관리</p>
                </div>
              </CardHeader>
              <CardBody className="px-6 pb-6 pt-0">
                <p className="text-sm text-default-600 mb-4">
                  Google, Meta, Amazon 등 광고 캠페인을 통합 관리하세요
                </p>
                <Button variant="flat" color="primary" radius="sm" size="sm">
                  대시보드 열기
                </Button>
              </CardBody>
            </Card>
          </Link>

          {/* Workspace */}
          <Card radius="sm" className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex gap-3 p-6">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex flex-col">
                <p className="text-md font-semibold">Workspace</p>
                <p className="text-small text-default-500">작업 공간 관리</p>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6 pt-0">
              <p className="text-sm text-default-600 mb-4">
                팀원을 초대하고 프로젝트를 관리하세요
              </p>
              <Button variant="flat" color="primary" radius="sm" size="sm">
                열기
              </Button>
            </CardBody>
          </Card>

          {/* Settings */}
          <Card radius="sm" className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex gap-3 p-6">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex flex-col">
                <p className="text-md font-semibold">설정</p>
                <p className="text-small text-default-500">계정 및 환경설정</p>
              </div>
            </CardHeader>
            <CardBody className="px-6 pb-6 pt-0">
              <p className="text-sm text-default-600 mb-4">
                프로필, 알림, 보안 설정을 관리하세요
              </p>
              <Button variant="flat" color="default" radius="sm" size="sm">
                설정 열기
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* Getting Started */}
        <Card
          radius="sm"
          className="mt-8 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200"
        >
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">시작하기</h3>
                <p className="text-default-600 mb-3">
                  첫 캠페인을 만들고 광고를 시작해보세요
                </p>
                <div className="flex gap-3">
                  <Link href="/dashboard/marketing">
                    <Button color="primary" radius="sm" size="sm">
                      캠페인 만들기
                    </Button>
                  </Link>
                  <Button variant="bordered" radius="sm" size="sm">
                    플랫폼 연동하기
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
