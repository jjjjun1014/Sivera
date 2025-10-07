"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
            <h1 className="text-3xl font-bold">개인정보처리방침</h1>
            <p className="text-sm text-default-500">
              최종 수정일: 2025년 1월 1일 | 시행일: 2025년 1월 1일
            </p>
          </CardHeader>

          <Divider />

          <CardBody className="px-6 py-6">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p>
                Sivera(이하 "회사")는 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보보호법 등 관련 법령상의 개인정보보호 규정을 준수하며, 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보처리방침을 수립·공개합니다.
              </p>

              <h2>1. 수집하는 개인정보의 항목</h2>
              <p>회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:</p>

              <h3>가. 회원가입 시</h3>
              <ul>
                <li><strong>필수항목:</strong> 이메일 주소, 비밀번호</li>
                <li><strong>선택항목:</strong> 이름, 프로필 사진</li>
              </ul>

              <h3>나. 서비스 이용 과정에서 자동으로 생성되어 수집될 수 있는 정보</h3>
              <ul>
                <li>IP 주소, 쿠키, 서비스 이용 기록, 방문 기록, 불량 이용 기록</li>
                <li>기기 정보(OS 종류, 브라우저 종류 등)</li>
              </ul>

              <h2>2. 개인정보의 수집 및 이용목적</h2>
              <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다:</p>
              <ul>
                <li><strong>회원 관리:</strong> 회원제 서비스 이용에 따른 본인확인, 개인 식별, 불량회원의 부정 이용 방지와 비인가 사용 방지, 가입 의사 확인, 분쟁 조정을 위한 기록보존</li>
                <li><strong>서비스 제공:</strong> 광고 관리 서비스 제공, 콘텐츠 제공, 맞춤 서비스 제공</li>
                <li><strong>마케팅 및 광고:</strong> 신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공</li>
              </ul>

              <h2>3. 개인정보의 보유 및 이용기간</h2>
              <p>
                회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다:
              </p>

              <h3>가. 회사 내부 방침에 의한 정보보유 사유</h3>
              <ul>
                <li>부정이용기록: 1년 (부정 이용 방지)</li>
              </ul>

              <h3>나. 관련 법령에 의한 정보보유 사유</h3>
              <ul>
                <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                <li>접속에 관한 기록: 3개월 (통신비밀보호법)</li>
              </ul>

              <h2>4. 개인정보의 파기절차 및 방법</h2>
              <p>
                회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다.
              </p>

              <h3>가. 파기절차</h3>
              <p>
                이용자가 회원가입 등을 위해 입력한 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라 일정 기간 저장된 후 파기됩니다.
              </p>

              <h3>나. 파기방법</h3>
              <ul>
                <li>전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.</li>
                <li>종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</li>
              </ul>

              <h2>5. 이용자 및 법정대리인의 권리와 그 행사방법</h2>
              <ol>
                <li>이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며, 회원 탈퇴를 요청할 수 있습니다.</li>
                <li>개인정보 조회 및 수정은 '설정' 메뉴에서, 회원 탈퇴는 고객센터를 통해 가능합니다.</li>
                <li>이용자가 개인정보의 오류에 대한 정정을 요청한 경우, 정정을 완료하기 전까지 해당 개인정보를 이용 또는 제공하지 않습니다.</li>
              </ol>

              <h2>6. 개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항</h2>
              <p>
                회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용 정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.
              </p>
              <ul>
                <li><strong>쿠키의 사용 목적:</strong> 이용자의 접속 빈도나 방문 시간 등을 분석, 이용자의 취향과 관심분야를 파악 및 자취 추적, 각종 이벤트 참여 정도 및 방문 회수 파악 등을 통한 타겟 마케팅 및 개인 맞춤 서비스 제공</li>
                <li><strong>쿠키의 설치·운영 및 거부:</strong> 웹브라우저 상단의 도구 > 인터넷 옵션 > 개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을 거부할 수 있습니다.</li>
              </ul>

              <h2>7. 개인정보 보호책임자</h2>
              <p>
                회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>

              <div className="bg-default-100 dark:bg-default-50 p-4 rounded-lg my-4">
                <p><strong>개인정보 보호책임자</strong></p>
                <ul className="list-none">
                  <li>이름: [담당자명]</li>
                  <li>직책: [직책]</li>
                  <li>이메일: privacy@sivera.com</li>
                </ul>
              </div>

              <h2>8. 개인정보 처리방침의 변경</h2>
              <p>
                이 개인정보처리방침은 2025년 1월 1일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
              </p>

              <Divider className="my-6" />

              <p className="text-sm text-default-500">
                <strong>부칙</strong>
                <br />
                본 방침은 2025년 1월 1일부터 시행됩니다.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
