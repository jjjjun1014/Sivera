/**
 * PayPal API 테스트 스크립트
 * 
 * 1. Access Token 발급 테스트
 * 2. Product 생성 테스트
 * 3. Subscription Plan 생성 테스트
 */

const CLIENT_ID = 'AWdHs-mvdl1fe_FHs7G8qewN8fLCulrzaxFkhgP4t2YoDCMMvAaV8VkmpXhVUJ-oIuom02hT17ZM4Keh';
const CLIENT_SECRET = 'ECdbGrGwZnn_GNPA6VPYv-QrJP9nc6NDnlyCy9qGt6kUFZmHZU7abwYPKf-1jXdKfVHZup2Mm48Hx887';
const API_URL = 'https://api-m.sandbox.paypal.com';

async function getAccessToken() {
  console.log('\n🔐 Step 1: Getting PayPal Access Token...');
  
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  
  try {
    const response = await fetch(`${API_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Failed to get access token:', data);
      return null;
    }

    console.log('✅ Access Token obtained successfully');
    console.log(`   Token: ${data.access_token.substring(0, 20)}...`);
    return data.access_token;
  } catch (error) {
    console.error('❌ Error getting access token:', error.message);
    return null;
  }
}

async function createProduct(accessToken, name, description) {
  console.log(`\n📦 Step 2: Creating Product "${name}"...`);
  
  try {
    const response = await fetch(`${API_URL}/v1/catalogs/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name,
        description,
        type: 'SERVICE',
        category: 'SOFTWARE',
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Failed to create product:', data);
      return null;
    }

    console.log('✅ Product created successfully');
    console.log(`   Product ID: ${data.id}`);
    return data.id;
  } catch (error) {
    console.error('❌ Error creating product:', error.message);
    return null;
  }
}

async function createSubscriptionPlan(accessToken, productId, planName, price) {
  console.log(`\n💳 Step 3: Creating Subscription Plan "${planName}" ($${price}/month)...`);
  
  try {
    const response = await fetch(`${API_URL}/v1/billing/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        product_id: productId,
        name: planName,
        description: `${planName} with 14-day free trial`,
        billing_cycles: [
          {
            frequency: {
              interval_unit: 'DAY',
              interval_count: 14,
            },
            tenure_type: 'TRIAL',
            sequence: 1,
            total_cycles: 1,
            pricing_scheme: {
              fixed_price: {
                value: '0',
                currency_code: 'USD',
              },
            },
          },
          {
            frequency: {
              interval_unit: 'MONTH',
              interval_count: 1,
            },
            tenure_type: 'REGULAR',
            sequence: 2,
            total_cycles: 0,
            pricing_scheme: {
              fixed_price: {
                value: price,
                currency_code: 'USD',
              },
            },
          },
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee_failure_action: 'CONTINUE',
          payment_failure_threshold: 3,
        },
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Failed to create plan:', data);
      return null;
    }

    console.log('✅ Subscription plan created successfully');
    console.log(`   Plan ID: ${data.id}`);
    console.log(`   Status: ${data.status}`);
    return data.id;
  } catch (error) {
    console.error('❌ Error creating plan:', error.message);
    return null;
  }
}

async function createOneTimeOrder(accessToken, amount) {
  console.log(`\n💰 Step 4 (Optional): Creating One-Time Order ($${amount})...`);
  
  try {
    const response = await fetch(`${API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: amount,
            },
            description: 'Test payment for Sivera',
          },
        ],
        application_context: {
          return_url: 'http://localhost:3000/payment/paypal/success',
          cancel_url: 'http://localhost:3000/payment/paypal/cancel',
        },
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Failed to create order:', data);
      return null;
    }

    console.log('✅ Order created successfully');
    console.log(`   Order ID: ${data.id}`);
    console.log(`   Status: ${data.status}`);
    
    const approveLink = data.links?.find(link => link.rel === 'approve');
    if (approveLink) {
      console.log(`   Approve URL: ${approveLink.href}`);
    }
    
    return data.id;
  } catch (error) {
    console.error('❌ Error creating order:', error.message);
    return null;
  }
}

async function main() {
  console.log('🧪 PayPal API Test Starting...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // 1. Access Token 발급
  const accessToken = await getAccessToken();
  if (!accessToken) {
    console.log('\n❌ Test failed: Could not get access token');
    process.exit(1);
  }

  // 2. Standard Product 생성
  const standardProductId = await createProduct(
    accessToken,
    'Sivera Standard Plan',
    'Standard subscription plan for Sivera platform'
  );
  
  if (!standardProductId) {
    console.log('\n❌ Test failed: Could not create Standard product');
    process.exit(1);
  }

  // 3. Standard Plan 생성
  const standardPlanId = await createSubscriptionPlan(
    accessToken,
    standardProductId,
    'Standard Monthly',
    '49.99'
  );
  
  if (!standardPlanId) {
    console.log('\n❌ Test failed: Could not create Standard plan');
    process.exit(1);
  }

  // 4. Pro Product 생성
  const proProductId = await createProduct(
    accessToken,
    'Sivera Pro Plan',
    'Pro subscription plan for Sivera platform'
  );
  
  if (!proProductId) {
    console.log('\n❌ Test failed: Could not create Pro product');
    process.exit(1);
  }

  // 5. Pro Plan 생성
  const proPlanId = await createSubscriptionPlan(
    accessToken,
    proProductId,
    'Pro Monthly',
    '89.99'
  );
  
  if (!proPlanId) {
    console.log('\n❌ Test failed: Could not create Pro plan');
    process.exit(1);
  }

  // 6. 일회성 결제 테스트 (선택사항)
  await createOneTimeOrder(accessToken, '49.99');

  // 결과 요약
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 All tests passed successfully!\n');
  console.log('📋 Summary:');
  console.log(`   Standard Plan ID: ${standardPlanId}`);
  console.log(`   Pro Plan ID: ${proPlanId}`);
  console.log('\n📝 Add these to your .env.local:');
  console.log(`   PAYPAL_PLAN_ID_STANDARD=${standardPlanId}`);
  console.log(`   PAYPAL_PLAN_ID_PRO=${proPlanId}`);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main().catch(error => {
  console.error('\n❌ Unexpected error:', error);
  process.exit(1);
});
