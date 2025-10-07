"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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
            <h1 className="text-3xl font-bold">이용약관</h1>
            <p className="text-sm text-default-500">
              최종 수정일: 2025년 1월 1일 | 시행일: 2025년 1월 1일
            </p>
          </CardHeader>

          <Divider />

          <CardBody className="px-6 py-6">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <h2>제1조 (목적)</h2>
              <p>
                본 약관은 Sivera(이하 "회사")가 제공하는 광고 관리 플랫폼 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>

              <h2>제2조 (정의)</h2>
              <ol>
                <li>"서비스"란 회사가 제공하는 광고 관리 플랫폼 및 관련 제반 서비스를 의미합니다.</li>
                <li>"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
                <li>"회원"이란 회사와 서비스 이용계약을 체결하고 이용자 아이디(ID)를 부여받은 자를 말합니다.</li>
              </ol>

              <h2>제3조 (약관의 명시와 개정)</h2>
              <ol>
                <li>회사는 본 약관의 내용을 이용자가 쉽게 확인할 수 있도록 서비스 초기 화면에 게시합니다.</li>
                <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.</li>
                <li>회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 서비스 초기 화면에 그 적용일자 7일 이전부터 공지합니다.</li>
              </ol>

              <h2>제4조 (서비스의 제공)</h2>
              <ol>
                <li>회사는 다음과 같은 서비스를 제공합니다:
                  <ul>
                    <li>광고 플랫폼 통합 관리 서비스</li>
                    <li>광고 캠페인 생성 및 관리</li>
                    <li>광고 성과 분석 및 리포팅</li>
                    <li>기타 회사가 추가 개발하거나 제휴계약 등을 통해 제공하는 일체의 서비스</li>
                  </ul>
                </li>
                <li>서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.</li>
                <li>회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.</li>
              </ol>

              <h2>제5조 (회원가입)</h2>
              <ol>
                <li>이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.</li>
                <li>회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다:
                  <ul>
                    <li>가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                    <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                    <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
                  </ul>
                </li>
              </ol>

              <h2>제6조 (개인정보의 보호)</h2>
              <p>
                회사는 관련 법령이 정하는 바에 따라 이용자의 개인정보를 보호하기 위해 노력합니다. 개인정보의 보호 및 이용에 대해서는 관련 법령 및 회사의 개인정보처리방침이 적용됩니다.
              </p>

              <h2>제7조 (회원의 의무)</h2>
              <ol>
                <li>회원은 다음 행위를 하여서는 안 됩니다:
                  <ul>
                    <li>신청 또는 변경 시 허위내용의 등록</li>
                    <li>타인의 정보 도용</li>
                    <li>회사가 게시한 정보의 변경</li>
                    <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                    <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                    <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                  </ul>
                </li>
              </ol>

              <h2>제8조 (서비스 이용의 제한 및 중지)</h2>
              <p>
                회사는 회원이 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.
              </p>

              <h2>제9조 (면책조항)</h2>
              <ol>
                <li>회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</li>
                <li>회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</li>
                <li>회사는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖에 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.</li>
              </ol>

              <h2>제10조 (분쟁의 해결)</h2>
              <ol>
                <li>회사와 회원은 서비스와 관련하여 발생한 분쟁을 원만하게 해결하기 위하여 필요한 모든 노력을 하여야 합니다.</li>
                <li>제1항의 노력에도 불구하고 분쟁이 해결되지 않을 경우, 양 당사자는 관할 법원에 소를 제기할 수 있습니다.</li>
              </ol>

              <Divider className="my-6" />

              <p className="text-sm text-default-500">
                <strong>부칙</strong>
                <br />
                본 약관은 2025년 1월 1일부터 시행됩니다.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
