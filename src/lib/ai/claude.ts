/**
 * Claude AI API Client
 *
 * 프론트엔드에서 직접 Claude API를 호출하여 AI 기능을 제공합니다.
 * 백엔드 없이 클라이언트 사이드에서 동작합니다.
 */

import Anthropic from '@anthropic-ai/sdk';

// 클라이언트 초기화 (브라우저 환경)
const getClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn('NEXT_PUBLIC_ANTHROPIC_API_KEY is not set');
    return null;
  }

  return new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true, // 브라우저에서 직접 호출 허용
  });
};

/**
 * AI 챗봇 응답 생성
 * @param message 사용자 메시지
 * @param context 현재 페이지/캠페인 컨텍스트
 * @returns AI 응답 텍스트
 */
export async function getChatResponse(
  message: string,
  context?: {
    currentPage?: string;
    campaigns?: any[];
    selectedMetrics?: string[];
    userRole?: string;
  }
): Promise<string> {
  const client = getClient();

  if (!client) {
    return '죄송합니다. AI 서비스가 설정되지 않았습니다. 환경 변수를 확인해주세요.';
  }

  try {
    const systemPrompt = `당신은 Sivera 광고 관리 플랫폼의 AI 어시스턴트입니다.
사용자의 광고 캠페인 관리를 도와주고, 데이터 분석 및 최적화 제안을 제공합니다.

현재 컨텍스트:
${context ? JSON.stringify(context, null, 2) : '없음'}

응답 시 다음을 준수하세요:
1. 간결하고 명확하게 답변
2. 실행 가능한 조언 제공
3. 한국어로 답변
4. 데이터가 있으면 구체적인 수치 활용
5. 이모지 사용으로 가독성 향상 (💡, 📊, ⚠️ 등)`;

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      system: systemPrompt,
    });

    const textContent = response.content.find((block) => block.type === 'text');
    return textContent && 'text' in textContent ? textContent.text : '응답을 생성할 수 없습니다.';
  } catch (error) {
    console.error('Claude API Error:', error);

    if (error instanceof Error) {
      if (error.message.includes('rate_limit')) {
        return '⚠️ 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
      }
      if (error.message.includes('invalid_api_key')) {
        return '⚠️ API 키가 유효하지 않습니다. 관리자에게 문의하세요.';
      }
    }

    return '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.';
  }
}

/**
 * 캠페인 분석 및 인사이트 생성
 * @param campaigns 분석할 캠페인 목록
 * @returns 분석 결과 및 제안
 */
export async function analyzeCampaigns(campaigns: any[]): Promise<string> {
  const client = getClient();

  if (!client) {
    return '죄송합니다. AI 서비스가 설정되지 않았습니다.';
  }

  const campaignSummary = campaigns.map((c) => ({
    name: c.name,
    budget: c.budget,
    spent: c.spent,
    roas: c.roas,
    cpa: c.cpa,
    status: c.status,
  }));

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: `다음 광고 캠페인 데이터를 분석하고 인사이트를 제공해주세요:

${JSON.stringify(campaignSummary, null, 2)}

다음 형식으로 답변해주세요:
1. 📊 전체 성과 요약 (1-2문장)
2. ⚠️ 주의가 필요한 캠페인 (ROAS < 2.0 또는 CPA 높음)
3. ✅ 성과가 좋은 캠페인 (ROAS > 3.0)
4. 💡 구체적인 최적화 제안 (3-5개)

간결하고 실행 가능한 조언을 제공해주세요.`,
        },
      ],
    });

    const textContent = response.content.find((block) => block.type === 'text');
    return textContent && 'text' in textContent ? textContent.text : '분석을 완료할 수 없습니다.';
  } catch (error) {
    console.error('Claude API Error:', error);
    return '죄송합니다. 캠페인 분석 중 오류가 발생했습니다.';
  }
}

/**
 * 스마트 제안 생성 (캠페인 이름, 예산 등)
 * @param type 제안 타입
 * @param input 사용자 입력
 * @param historicalData 과거 데이터
 * @returns 제안 내용
 */
export async function getSmartSuggestion(
  type: 'campaign_name' | 'budget' | 'keyword',
  input: string,
  historicalData?: any[]
): Promise<string> {
  const client = getClient();

  if (!client) {
    return '';
  }

  try {
    let prompt = '';

    if (type === 'campaign_name') {
      prompt = `사용자가 "${input}" 캠페인을 생성하려고 합니다.
과거 캠페인: ${JSON.stringify(historicalData?.map((d) => d.name) || [])}

유사한 캠페인이 있다면 통합을 제안하거나, 더 나은 이름을 제안해주세요. (1-2문장)`;
    } else if (type === 'budget') {
      prompt = `사용자가 새 캠페인에 ${input}원 예산을 설정하려고 합니다.
과거 유사 캠페인 평균 예산: ${historicalData ? JSON.stringify(historicalData) : '없음'}

적절한 예산인지 평가하고 추천 예산을 제안해주세요. (1-2문장)`;
    } else if (type === 'keyword') {
      prompt = `사용자가 "${input}" 키워드를 추가하려고 합니다.
관련성 높은 추가 키워드를 3-5개 제안해주세요. (쉼표로 구분)`;
    }

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    });

    const textContent = response.content.find((block) => block.type === 'text');
    return textContent && 'text' in textContent ? textContent.text : '';
  } catch (error) {
    console.error('Claude API Error:', error);
    return '';
  }
}
