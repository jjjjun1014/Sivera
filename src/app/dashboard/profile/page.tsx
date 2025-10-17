"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import { toast } from "@/utils/toast";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "사용자",
    email: "user@example.com",
    phone: "",
    company: "",
    position: "",
    avatarUrl: "https://i.pravatar.cc/150?u=user",
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // localStorage에서 프로필 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  // 프로필 저장
  const handleSaveProfile = () => {
    try {
      localStorage.setItem("userProfile", JSON.stringify(profile));
      toast.success({
        title: "프로필 저장 완료",
        description: "프로필 정보가 성공적으로 저장되었습니다.",
      });
    } catch (error) {
      toast.error({
        title: "프로필 저장 실패",
        description: "프로필 저장 중 오류가 발생했습니다.",
      });
    }
  };

  // 비밀번호 변경
  const handleChangePassword = () => {
    if (!password.current || !password.new || !password.confirm) {
      toast.error({
        title: "입력 오류",
        description: "모든 필드를 입력해주세요.",
      });
      return;
    }
    if (password.new !== password.confirm) {
      toast.error({
        title: "비밀번호 불일치",
        description: "새 비밀번호가 일치하지 않습니다.",
      });
      return;
    }
    if (password.new.length < 8) {
      toast.error({
        title: "비밀번호 길이 오류",
        description: "비밀번호는 8자 이상이어야 합니다.",
      });
      return;
    }
    // TODO: AWS 연동 후 실제 비밀번호 변경 로직
    toast.warning({
      title: "기능 준비 중",
      description: "AWS 연동 후 사용 가능합니다. Sivera 관리자에게 문의해주세요.",
    });
    setPassword({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">프로필</h1>
        <p className="text-default-500">개인 정보를 관리하세요</p>
      </div>

      <div className="space-y-6">
        {/* 프로필 사진 및 기본 정보 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">기본 정보</h2>
          </CardHeader>
          <CardBody className="space-y-6">
            {/* 프로필 사진 */}
            <div className="flex items-center gap-6">
              <Avatar
                src={profile.avatarUrl}
                className="w-24 h-24"
                name={profile.name}
              />
              <div className="flex flex-col gap-2">
                <p className="text-sm text-default-500">프로필 사진</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="flat">
                    사진 변경
                  </Button>
                  <Button size="sm" variant="light" color="danger">
                    삭제
                  </Button>
                </div>
              </div>
            </div>

            <Divider />

            {/* 기본 정보 입력 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="이름"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                radius="sm"
                variant="bordered"
              />
              <Input
                label="이메일"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                radius="sm"
                variant="bordered"
                type="email"
              />
              <Input
                label="전화번호"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                radius="sm"
                variant="bordered"
                placeholder="010-0000-0000"
              />
              <Input
                label="회사명"
                value={profile.company}
                onChange={(e) =>
                  setProfile({ ...profile, company: e.target.value })
                }
                radius="sm"
                variant="bordered"
                placeholder="회사명 (선택)"
              />
              <Input
                label="직책"
                value={profile.position}
                onChange={(e) =>
                  setProfile({ ...profile, position: e.target.value })
                }
                radius="sm"
                variant="bordered"
                placeholder="직책 (선택)"
              />
            </div>

            <div className="flex justify-end">
              <Button color="primary" onPress={handleSaveProfile}>
                프로필 저장
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* 비밀번호 변경 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">비밀번호 변경</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="현재 비밀번호"
              type="password"
              value={password.current}
              onChange={(e) =>
                setPassword({ ...password, current: e.target.value })
              }
              radius="sm"
              variant="bordered"
            />
            <Input
              label="새 비밀번호"
              type="password"
              value={password.new}
              onChange={(e) =>
                setPassword({ ...password, new: e.target.value })
              }
              radius="sm"
              variant="bordered"
              description="최소 8자 이상"
            />
            <Input
              label="새 비밀번호 확인"
              type="password"
              value={password.confirm}
              onChange={(e) =>
                setPassword({ ...password, confirm: e.target.value })
              }
              radius="sm"
              variant="bordered"
            />
            <div className="flex justify-end">
              <Button color="primary" onPress={handleChangePassword}>
                비밀번호 변경
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* 계정 정보 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">계정 정보</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">계정 생성일</p>
                <p className="text-sm text-default-500">2024년 10월 1일</p>
              </div>
            </div>
            <Divider />
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">마지막 로그인</p>
                <p className="text-sm text-default-500">2024년 10월 17일 오후 2:30</p>
              </div>
            </div>
            <Divider />
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">계정 상태</p>
                <p className="text-sm text-success">활성</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 위험 영역 */}
        <Card className="border-2 border-danger">
          <CardHeader>
            <h2 className="text-xl font-semibold text-danger">위험 영역</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">계정 삭제</p>
                <p className="text-sm text-default-500">
                  계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
                </p>
              </div>
              <Button color="danger" variant="flat">
                계정 삭제
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
