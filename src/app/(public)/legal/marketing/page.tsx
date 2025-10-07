"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 text-default-600 hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>돌아가기</span>
        </Link>

        <Card>
          <CardHeader className="flex flex-col gap-2 px-6 pt-6 pb-4">
            <h1 className="text-3xl font-bold">마케팅 수신 동의</h1>
            <p className="text-sm text-default-500">
              최종 수정일: 2025년 1월 1일 | 시행일: 2025년 1월 1일
            </p>
          </CardHeader>

          <Divider />

          <CardBody className="px-6 py-6">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p>
                Sivera(이하 "회사")는 이용자에게 유용한 정보와 맞춤형 서비스를 제공하기 위해 마케팅 정보 수신에 대한 동의를 받고 있습니다.
              </p>

              <h2>1. 마케팅 정보 수신 동의 (선택)</h2>
              <p>
                회사는 이용자의 사전 동의 없이 광고성 정보를 발송하지 않습니다. 마케팅 정보 수신에 동의하시면 다음과 같은 정보를 받으실 수 있습니다.
              </p>

              <h2>2. 수신하는 마케팅 정보의 내용</h2>
              <ul>
                <li>신규 서비스 및 기능 안내</li>
                <li>이벤트, 프로모션, 할인 정보</li>
                <li>서비스 이용 팁 및 가이드</li>
                <li>업데이트 및 개선 사항 안내</li>
                <li>설문조사 및 이벤트 참여 요청</li>
                <li>맞춤형 광고 및 추천 서비스</li>
              </ul>

              <h2>3. 마케팅 정보 발송 방법</h2>
              <p>회사는 다음의 방법으로 마케팅 정보를 발송합니다:</p>
              <ul>
                <li><strong>이메일:</strong> 가입 시 제공한 이메일 주소로 발송</li>
                <li><strong>푸시 알림:</strong> 모바일 앱 또는 웹 브라우저를 통한 알림 (별도 동의 시)</li>
                <li><strong>서비스 내 알림:</strong> 플랫폼 내 알림센터를 통한 안내</li>
              </ul>

              <h2>4. 개인정보의 보유 및 이용기간</h2>
              <p>
                회사는 마케팅 수신 동의를 철회하거나 회원 탈퇴 시까지 이용자의 정보를 보유하며, 동의 철회 또는 회원 탈퇴 시 관련 정보를 지체 없이 파기합니다.
              </p>

              <h2>5. 마케팅 수신 동의 거부 권리 및 방법</h2>
              <ol>
                <li>이용자는 마케팅 정보 수신에 대한 동의를 거부할 권리가 있습니다.</li>
                <li>마케팅 수신 동의는 선택사항이며, 동의하지 않아도 회사의 기본 서비스를 이용하는 데 제한이 없습니다.</li>
                <li>마케팅 정보 수신에 동의한 후에도 언제든지 수신을 거부할 수 있습니다.</li>
              </ol>

              <h2>6. 수신 거부 및 철회 방법</h2>
              <p>마케팅 정보 수신을 원하지 않으실 경우, 다음의 방법으로 수신을 거부하거나 철회할 수 있습니다:</p>

              <div className="bg-default-100 dark:bg-default-50 p-4 rounded-lg my-4">
                <h3 className="text-base font-semibold mb-2">수신 거부 방법</h3>
                <ul className="list-none space-y-2">
                  <li><strong>1. 설정 페이지:</strong> 로그인 후 '설정' &gt; '알림 설정' 메뉴에서 마케팅 수신 동의를 해제할 수 있습니다.</li>
                  <li><strong>2. 이메일 하단 링크:</strong> 수신한 마케팅 이메일 하단의 '수신거부' 링크를 클릭하여 언제든지 수신을 중단할 수 있습니다.</li>
                  <li><strong>3. 고객센터:</strong> 이메일(support@sivera.com)로 수신 거부를 요청하실 수 있습니다.</li>
                </ul>
              </div>

              <h2>7. 제3자 제공 및 마케팅 활용</h2>
              <p>
                회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:
              </p>
              <ul>
                <li>이용자가 사전에 동의한 경우</li>
                <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
              </ul>

              <h2>8. 어린이의 개인정보 보호</h2>
              <p>
                회사는 만 14세 미만 아동의 개인정보를 수집하지 않으며, 만 14세 미만 아동에게는 마케팅 정보를 발송하지 않습니다.
              </p>

              <h2>9. 동의 철회에 따른 불이익</h2>
              <p>
                마케팅 정보 수신 동의를 거부하거나 철회하더라도 회사의 기본 서비스 이용에는 제한이 없습니다. 다만, 신규 서비스, 이벤트, 프로모션 정보 등을 받을 수 없습니다.
              </p>

              <h2>10. 문의</h2>
              <p>
                마케팅 정보 수신 동의와 관련하여 궁금한 사항이 있으시면 아래 연락처로 문의해 주시기 바랍니다:
              </p>

              <div className="bg-default-100 dark:bg-default-50 p-4 rounded-lg my-4">
                <p><strong>고객센터</strong></p>
                <ul className="list-none">
                  <li>이메일: support@sivera.com</li>
                  <li>운영시간: 평일 09:00 - 18:00 (주말 및 공휴일 제외)</li>
                </ul>
              </div>

              <Divider className="my-6" />

              <p className="text-sm text-default-500">
                <strong>부칙</strong>
                <br />
                본 동의서는 2025년 1월 1일부터 시행됩니다.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
