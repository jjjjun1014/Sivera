import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import NextLink from "next/link";

export default function HubPage() {
  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">허브</h1>
        <p className="text-default-500">광고 캠페인 관리 및 분석 대시보드</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <h3 className="text-xl font-semibold">캠페인 관리</h3>
          </CardHeader>
          <CardBody>
            <p className="text-default-500 mb-4">
              모든 플랫폼의 광고 캠페인을 한 곳에서 관리하세요
            </p>
            <Button
              as={NextLink}
              href="/dashboard"
              color="primary"
              variant="flat"
              fullWidth
            >
              대시보드로 이동
            </Button>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <h3 className="text-xl font-semibold">통합 분석</h3>
          </CardHeader>
          <CardBody>
            <p className="text-default-500 mb-4">
              플랫폼별 성과를 비교하고 인사이트를 확인하세요
            </p>
            <Button
              as={NextLink}
              href="/dashboard/analytics"
              color="primary"
              variant="flat"
              fullWidth
            >
              분석 보기
            </Button>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <h3 className="text-xl font-semibold">플랫폼 연동</h3>
          </CardHeader>
          <CardBody>
            <p className="text-default-500 mb-4">
              Google Ads, Meta Ads 등 광고 플랫폼을 연동하세요
            </p>
            <Button
              as={NextLink}
              href="/dashboard/integrated"
              color="primary"
              variant="flat"
              fullWidth
            >
              플랫폼 설정
            </Button>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <h3 className="text-xl font-semibold">팀 관리</h3>
          </CardHeader>
          <CardBody>
            <p className="text-default-500 mb-4">
              팀원을 초대하고 역할을 관리하세요
            </p>
            <Button
              as={NextLink}
              href="/dashboard/team"
              color="primary"
              variant="flat"
              fullWidth
            >
              팀 설정
            </Button>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <h3 className="text-xl font-semibold">설정</h3>
          </CardHeader>
          <CardBody>
            <p className="text-default-500 mb-4">
              계정 정보 및 알림 설정을 변경하세요
            </p>
            <Button
              as={NextLink}
              href="/dashboard/settings"
              color="primary"
              variant="flat"
              fullWidth
            >
              설정 열기
            </Button>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <h3 className="text-xl font-semibold">프로필</h3>
          </CardHeader>
          <CardBody>
            <p className="text-default-500 mb-4">
              프로필 정보를 수정하세요
            </p>
            <Button
              as={NextLink}
              href="/dashboard/profile"
              color="primary"
              variant="flat"
              fullWidth
            >
              프로필 보기
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">최근 활동</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-divider">
              <div>
                <p className="font-medium">Google Ads 캠페인 업데이트</p>
                <p className="text-sm text-default-500">2024.10.09 10:30</p>
              </div>
              <Chip color="success" size="sm">완료</Chip>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-divider">
              <div>
                <p className="font-medium">Meta Ads 예산 조정</p>
                <p className="text-sm text-default-500">2024.10.08 15:20</p>
              </div>
              <Chip color="success" size="sm">완료</Chip>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">새 팀원 초대</p>
                <p className="text-sm text-default-500">2024.10.07 09:15</p>
              </div>
              <Chip color="warning" size="sm">대기중</Chip>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
