"use client";

import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-default-600 hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>홈으로 돌아가기</span>
        </Link>

        <h1 className="text-3xl font-bold mb-8">블로그</h1>

        <Card>
          <CardBody className="p-8 text-center">
            <p className="text-lg text-default-600 mb-4">
              블로그가 곧 제공됩니다.
            </p>
            <Link href="/">
              <Button color="primary">홈으로 돌아가기</Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
