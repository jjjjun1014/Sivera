"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
      <Card radius="sm" className="w-full max-w-md shadow-xl bg-white dark:bg-gray-800">
        <CardBody className="p-8 text-center">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileQuestion className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-6xl font-bold mb-2 text-primary">404</h1>
          <h2 className="text-2xl font-bold mb-2">페이지를 찾을 수 없습니다</h2>
          <p className="text-default-600 mb-6">
            요청하신 페이지가 존재하지 않거나
            <br />
            이동되었을 수 있습니다.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/">
              <Button color="primary" radius="sm" startContent={<Home className="w-4 h-4" />}>
                홈으로
              </Button>
            </Link>
            <Button
              variant="bordered"
              radius="sm"
              startContent={<ArrowLeft className="w-4 h-4" />}
              onPress={() => window.history.back()}
            >
              이전 페이지
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
