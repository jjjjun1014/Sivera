import { Card, CardBody } from "@heroui/card";

export default function TeamPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">팀 관리</h1>
      <Card className="border-2 border-warning">
        <CardBody className="text-center py-12">
          <p className="text-warning font-semibold mb-2">⚠️ 개발 중</p>
          <p className="text-default-500">
            이 페이지는 AWS 연동 후 구현될 예정입니다.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
