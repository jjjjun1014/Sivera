"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { LayoutDashboard, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default function HubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-default-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
              Sivera
            </h1>
            <span className="text-sm text-default-500">통합 대시보드</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button
                variant="light"
                startContent={<LogOut className="w-4 h-4" />}
              >
                로그아웃
              </Button>
            </Link>
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Workspace Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex gap-3">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex flex-col">
                <p className="text-md font-semibold">Workspace</p>
                <p className="text-small text-default-500">작업 공간 관리</p>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-default-600 mb-4">
                팀원을 초대하고 프로젝트를 관리하세요
              </p>
              <Button variant="flat" color="primary" size="sm">
                열기
              </Button>
            </CardBody>
          </Card>

          {/* Marketing Platform Card */}
          <Link href="/marketing/dashboard">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex gap-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <p className="text-md font-semibold">마케팅 플랫폼</p>
                  <p className="text-small text-default-500">광고 캠페인 관리</p>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-default-600 mb-4">
                  Google, Meta, Amazon 등 광고 캠페인을 통합 관리하세요
                </p>
                <Button variant="flat" color="primary" size="sm">
                  대시보드 열기
                </Button>
              </CardBody>
            </Card>
          </Link>

          {/* Settings Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex gap-3">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex flex-col">
                <p className="text-md font-semibold">설정</p>
                <p className="text-small text-default-500">계정 및 환경설정</p>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-default-600 mb-4">
                프로필, 알림, 보안 설정을 관리하세요
              </p>
              <Button variant="flat" color="default" size="sm">
                설정 열기
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">빠른 통계</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardBody>
                <p className="text-sm text-default-500 mb-1">총 캠페인</p>
                <p className="text-3xl font-bold">0</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-sm text-default-500 mb-1">활성 캠페인</p>
                <p className="text-3xl font-bold">0</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-sm text-default-500 mb-1">총 지출</p>
                <p className="text-3xl font-bold">₩0</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-sm text-default-500 mb-1">연동 플랫폼</p>
                <p className="text-3xl font-bold">0</p>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Getting Started */}
        <Card className="mt-8 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200">
          <CardBody className="p-6">
            <h3 className="text-xl font-bold mb-2">시작하기</h3>
            <p className="text-default-600 mb-4">
              첫 캠페인을 만들고 광고를 시작해보세요
            </p>
            <div className="flex gap-3">
              <Link href="/marketing/campaigns">
                <Button color="primary" size="sm">
                  캠페인 만들기
                </Button>
              </Link>
              <Link href="/marketing/integrations">
                <Button variant="bordered" size="sm">
                  플랫폼 연동하기
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
