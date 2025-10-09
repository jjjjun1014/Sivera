import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import NextLink from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "대시보드 - Sivera",
  description: "광고 캠페인 통합 관리 대시보드",
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">대시보드</h1>
        <p className="text-default-500">광고 캠페인 통합 관리</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-2">총 캠페인</p>
            <p className="text-4xl font-bold">12</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-2">활성 캠페인</p>
            <p className="text-4xl font-bold text-success">8</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-2">이번 달 광고비</p>
            <p className="text-4xl font-bold">₩2.5M</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-sm text-default-500 mb-2">전환율</p>
            <p className="text-4xl font-bold text-primary">3.2%</p>
          </CardBody>
        </Card>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">플랫폼별 성과</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-lg">G</span>
                  </div>
                  <div>
                    <p className="font-medium">Google Ads</p>
                    <p className="text-sm text-default-500">5 캠페인</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₩1.2M</p>
                  <p className="text-sm text-success">+12%</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <span className="text-lg">M</span>
                  </div>
                  <div>
                    <p className="font-medium">Meta Ads</p>
                    <p className="text-sm text-default-500">4 캠페인</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₩800K</p>
                  <p className="text-sm text-success">+8%</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                    <span className="text-lg">T</span>
                  </div>
                  <div>
                    <p className="font-medium">TikTok Ads</p>
                    <p className="text-sm text-default-500">3 캠페인</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₩500K</p>
                  <p className="text-sm text-danger">-3%</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">최근 캠페인</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">여름 세일 프로모션</p>
                  <p className="text-sm text-default-500">Google Ads</p>
                </div>
                <Chip color="success" size="sm">활성</Chip>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">신제품 런칭</p>
                  <p className="text-sm text-default-500">Meta Ads</p>
                </div>
                <Chip color="success" size="sm">활성</Chip>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">브랜드 인지도 향상</p>
                  <p className="text-sm text-default-500">TikTok Ads</p>
                </div>
                <Chip color="default" size="sm">일시정지</Chip>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">재고 정리 특가</p>
                  <p className="text-sm text-default-500">Google Ads</p>
                </div>
                <Chip color="warning" size="sm">검토중</Chip>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardBody className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">통합 분석</h3>
            <p className="text-sm text-default-500 mb-4">
              플랫폼별 성과를 비교하고 분석하세요
            </p>
            <Button
              as={NextLink}
              href="/dashboard/analytics"
              color="primary"
              variant="flat"
            >
              분석 보기
            </Button>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardBody className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">플랫폼 연동</h3>
            <p className="text-sm text-default-500 mb-4">
              광고 플랫폼을 연동하세요
            </p>
            <Button
              as={NextLink}
              href="/dashboard/integrated"
              color="primary"
              variant="flat"
            >
              플랫폼 설정
            </Button>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardBody className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">팀 관리</h3>
            <p className="text-sm text-default-500 mb-4">
              팀원을 초대하고 관리하세요
            </p>
            <Button
              as={NextLink}
              href="/dashboard/team"
              color="primary"
              variant="flat"
            >
              팀 설정
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Development Notice */}
      <Card className="mt-8 border-2 border-warning">
        <CardBody className="text-center py-6">
          <p className="text-warning font-semibold mb-2">⚠️ 개발 중</p>
          <p className="text-sm text-default-500">
            이 페이지는 정적 UI입니다. AWS 연동 후 실제 데이터가 표시됩니다.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
