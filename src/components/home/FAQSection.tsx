/* eslint-disable local/no-literal-strings */
import { FAQAccordion } from "./FAQAccordion";

import { title, subtitle } from "@/components/primitives";

export const FAQSection = () => {
  const faqs = [
    {
      question: "Sivera는 어떤 광고 플랫폼을 지원하나요?",
      answer:
        "현재 Google Ads, Meta Ads (Facebook, Instagram), TikTok Ads, Amazon Ads 4개 주요 플랫폼을 지원합니다. 각 플랫폼의 캠페인을 하나의 통합 대시보드에서 관리하고 성과를 실시간으로 확인할 수 있습니다.",
    },
    {
      question: "플랫폼별로 어떤 광고 유형을 관리할 수 있나요?",
      answer:
        "Google Ads는 검색광고와 쇼핑광고(Performance Max)를, Meta Ads는 일반 광고와 Advantage+ 캠페인을, TikTok Ads는 일반 광고와 GMV Max를, Amazon Ads는 Sponsored Products/Brands/Display 및 DSP를 지원합니다.",
    },
    {
      question: "팀원들과 함께 광고를 관리할 수 있나요?",
      answer:
        "네, 팀 관리 기능을 제공합니다. 팀원을 초대하고 Owner, Admin, Member, Viewer 4가지 역할을 부여할 수 있습니다. 각 역할마다 다른 권한을 가지며, 광고 계정을 안전하게 협업 관리할 수 있습니다.",
    },
    {
      question: "요금제는 어떻게 되나요?",
      answer:
        "Basic(월 $29/₩39,000) 1개 플랫폼, Standard(월 $79/₩99,000) 3개 플랫폼, Pro(월 $149/₩189,000) 5개 플랫폼을 제공합니다. 필요한 플랫폼 수에 따라 선택하실 수 있으며, PortOne을 통한 안전한 결제를 지원합니다.",
    },
    {
      question: "광고 플랫폼 계정을 어떻게 연동하나요?",
      answer:
        "각 플랫폼의 OAuth 인증을 통해 안전하게 계정을 연동합니다. 연동 후 캠페인 데이터가 자동으로 동기화되며, 대시보드에서 실시간 성과를 확인할 수 있습니다. 여러 광고 계정을 등록하여 한 번에 관리할 수도 있습니다.",
    },
    {
      question: "데이터는 얼마나 자주 업데이트되나요?",
      answer:
        "캠페인 성과 데이터는 실시간으로 동기화됩니다. 각 플랫폼의 API를 통해 최신 데이터를 가져오며, 대시보드에서 즉시 확인할 수 있습니다. 수동 동기화 버튼을 통해 언제든지 최신 데이터를 갱신할 수도 있습니다.",
    },
  ];

  return (
    <section className="px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={title({ size: "md" })}>자주 묻는 질문</h2>
          <p className={subtitle({ class: "mt-2" })}>
            궁금하신 점이 있으신가요?
          </p>
        </div>

        <FAQAccordion faqs={faqs} />
      </div>
    </section>
  );
};
