/**
 * AWS Bedrock AI Chat API Route
 * 
 * 서버 사이드에서 AWS Bedrock을 호출하여 AI 응답을 생성합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

// Bedrock 클라이언트 초기화
const client = new BedrockRuntimeClient({
  region: process.env.AWS_BEDROCK_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: '메시지가 필요합니다.' },
        { status: 400 }
      );
    }

    // 시스템 프롬프트 구성
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

    // Claude 3.5 Sonnet 모델 호출 (Cross-region inference profile 사용)
    const modelId = process.env.AWS_BEDROCK_MODEL_ID || 'us.anthropic.claude-3-5-sonnet-20241022-v2:0';

    const payload = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
    };

    const command = new InvokeModelCommand({
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    });

    const response = await client.send(command);

    // 응답 파싱
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    if (responseBody.content && responseBody.content.length > 0) {
      const textContent = responseBody.content.find((block: any) => block.type === 'text');
      
      return NextResponse.json({
        response: textContent?.text || '응답을 생성할 수 없습니다.',
      });
    }

    return NextResponse.json(
      { error: '응답을 생성할 수 없습니다.' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Bedrock API Error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
