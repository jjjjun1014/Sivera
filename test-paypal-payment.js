/**
 * PayPal 구독 결제 테스트
 * 
 * 1. 구독 생성 (Subscription Create)
 * 2. 승인 링크 받기
 * 3. 브라우저에서 승인 후 결제 완료 확인
 */

const CLIENT_ID = 'AWdHs-mvdl1fe_FHs7G8qewN8fLCulrzaxFkhgP4t2YoDCMMvAaV8VkmpXhVUJ-oIuom02hT17ZM4Keh';
const CLIENT_SECRET = 'ECdbGrGwZnn_GNPA6VPYv-QrJP9nc6NDnlyCy9qGt6kUFZmHZU7abwYPKf-1jXdKfVHZup2Mm48Hx887';
const API_URL = 'https://api-m.sandbox.paypal.com';

// 생성된 Plan ID
const STANDARD_PLAN_ID = 'P-6LF07206FN2388234NEKBE6A';
const PRO_PLAN_ID = 'P-3S363121WW516915BNEKBE6I';

async function getAccessToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

async function createSubscription(accessToken, planId, planName) {
  console.log(`\n💳 Creating subscription for ${planName}...`);
  
  try {
    const response = await fetch(`${API_URL}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        plan_id: planId,
        subscriber: {
          name: {
            given_name: '테스트',
            surname: '사용자',
          },
          email_address: 'test-buyer@sivera.com',
        },
        application_context: {
          brand_name: 'Sivera',
          locale: 'ko-KR',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW',
          payment_method: {
            payer_selected: 'PAYPAL',
            payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
          },
          return_url: 'http://localhost:3000/payment/paypal/success',
          cancel_url: 'http://localhost:3000/payment/paypal/cancel',
        },
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Failed to create subscription:', JSON.stringify(data, null, 2));
      return null;
    }

    console.log('✅ Subscription created successfully');
    console.log(`   Subscription ID: ${data.id}`);
    console.log(`   Status: ${data.status}`);
    
    const approveLink = data.links?.find(link => link.rel === 'approve');
    if (approveLink) {
      console.log(`\n📱 Approve URL (브라우저에서 열어서 결제 승인):`);
      console.log(`   ${approveLink.href}`);
    }
    
    return {
      id: data.id,
      status: data.status,
      approveUrl: approveLink?.href,
    };
  } catch (error) {
    console.error('❌ Error creating subscription:', error.message);
    return null;
  }
}

async function getSubscriptionDetails(accessToken, subscriptionId) {
  console.log(`\n🔍 Getting subscription details...`);
  
  try {
    const response = await fetch(`${API_URL}/v1/billing/subscriptions/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Failed to get subscription:', data);
      return null;
    }

    console.log('✅ Subscription details:');
    console.log(`   ID: ${data.id}`);
    console.log(`   Status: ${data.status}`);
    console.log(`   Plan ID: ${data.plan_id}`);
    
    if (data.billing_info) {
      console.log(`   Next Billing Time: ${data.billing_info.next_billing_time}`);
      console.log(`   Last Payment:`, data.billing_info.last_payment);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error getting subscription:', error.message);
    return null;
  }
}

async function main() {
  console.log('🧪 PayPal Subscription Payment Test');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Access Token 발급
  console.log('🔐 Getting access token...');
  const accessToken = await getAccessToken();
  console.log('✅ Access token obtained\n');
  
  // Standard Plan 구독 생성
  console.log('📋 Test 1: Standard Plan ($49.99/month with 14-day trial)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const standardSub = await createSubscription(accessToken, STANDARD_PLAN_ID, 'Standard Plan');
  
  if (standardSub) {
    console.log('\n⏳ 승인 대기 중...');
    console.log('   1. 위 URL을 브라우저에서 열기');
    console.log('   2. 샌드박스 계정으로 로그인');
    console.log('      Email: sb-thru4347414172@business.example.com');
    console.log('      PW: 5AsnxA&4');
    console.log('   3. 결제 승인 클릭');
    console.log('   4. 승인 후 다시 테스트 실행하여 상태 확인\n');
  }
  
  // Pro Plan 구독 생성
  console.log('\n📋 Test 2: Pro Plan ($89.99/month with 14-day trial)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const proSub = await createSubscription(accessToken, PRO_PLAN_ID, 'Pro Plan');
  
  if (proSub) {
    console.log('\n⏳ 승인 대기 중...');
    console.log('   위와 동일하게 승인 진행\n');
  }
  
  // 결과 요약
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Test Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  if (standardSub) {
    console.log('\n✅ Standard Subscription:');
    console.log(`   ID: ${standardSub.id}`);
    console.log(`   Status: ${standardSub.status}`);
    console.log(`   Approve: ${standardSub.approveUrl}`);
  }
  
  if (proSub) {
    console.log('\n✅ Pro Subscription:');
    console.log(`   ID: ${proSub.id}`);
    console.log(`   Status: ${proSub.status}`);
    console.log(`   Approve: ${proSub.approveUrl}`);
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💡 Next Steps:');
  console.log('   1. 브라우저에서 승인 링크 열기');
  console.log('   2. 샌드박스 계정으로 로그인 및 승인');
  console.log('   3. 승인 후: node test-paypal-payment.js <subscription-id>');
  console.log('      로 상태 확인');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// CLI에서 subscription ID를 인자로 받으면 상태 조회
if (process.argv[2]) {
  const subscriptionId = process.argv[2];
  console.log('🔍 Checking subscription status...\n');
  
  getAccessToken().then(token => {
    return getSubscriptionDetails(token, subscriptionId);
  }).then(() => {
    console.log('\n✅ Check complete\n');
  });
} else {
  main().catch(error => {
    console.error('\n❌ Unexpected error:', error);
    process.exit(1);
  });
}
