#!/bin/bash

# 1. 액세스 토큰 발급
TOKEN=$(curl -s -X POST "https://api-m.sandbox.paypal.com/v1/oauth2/token" \
  -H "Accept: application/json" \
  -u "BAAQsDvIOY52o_hsDbaQLObpfEzITplLr2Vbzn8KQHDl7qXXdOi7c95Fk2cKOs2oRotAVFrBgl9UXkUBoA:EDrqBaO8mEoEmhcLzjXYnAnpqmmt_-mc5P_CQxVr5g9w8gOVuJZhvsCO1lu_BlkheRyEztZLgj9zkdoI" \
  -d "grant_type=client_credentials" | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])")

echo "✅ Token: ${TOKEN:0:20}..."

# 2. Standard Product 생성
echo "📦 Creating Standard Product..."
STANDARD_PRODUCT=$(curl -s -X POST "https://api-m.sandbox.paypal.com/v1/catalogs/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Sivera Standard Plan",
    "description": "Standard subscription plan",
    "type": "SERVICE",
    "category": "SOFTWARE"
  }')

STANDARD_PRODUCT_ID=$(echo $STANDARD_PRODUCT | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")
echo "✅ Standard Product ID: $STANDARD_PRODUCT_ID"

# 3. Standard Plan 생성
echo "💳 Creating Standard Plan..."
STANDARD_PLAN=$(curl -s -X POST "https://api-m.sandbox.paypal.com/v1/billing/plans" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "product_id": "'"$STANDARD_PRODUCT_ID"'",
    "name": "Standard Monthly",
    "description": "14-day free trial then $49.99/month",
    "billing_cycles": [
      {
        "frequency": {"interval_unit": "DAY", "interval_count": 14},
        "tenure_type": "TRIAL",
        "sequence": 1,
        "total_cycles": 1,
        "pricing_scheme": {"fixed_price": {"value": "0", "currency_code": "USD"}}
      },
      {
        "frequency": {"interval_unit": "MONTH", "interval_count": 1},
        "tenure_type": "REGULAR",
        "sequence": 2,
        "total_cycles": 0,
        "pricing_scheme": {"fixed_price": {"value": "49.99", "currency_code": "USD"}}
      }
    ],
    "payment_preferences": {
      "auto_bill_outstanding": true,
      "setup_fee_failure_action": "CONTINUE",
      "payment_failure_threshold": 3
    }
  }')

STANDARD_PLAN_ID=$(echo $STANDARD_PLAN | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")
echo "✅ Standard Plan ID: $STANDARD_PLAN_ID"

# 4. Pro Product 생성
echo "📦 Creating Pro Product..."
PRO_PRODUCT=$(curl -s -X POST "https://api-m.sandbox.paypal.com/v1/catalogs/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Sivera Pro Plan",
    "description": "Pro subscription plan",
    "type": "SERVICE",
    "category": "SOFTWARE"
  }')

PRO_PRODUCT_ID=$(echo $PRO_PRODUCT | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")
echo "✅ Pro Product ID: $PRO_PRODUCT_ID"

# 5. Pro Plan 생성
echo "💳 Creating Pro Plan..."
PRO_PLAN=$(curl -s -X POST "https://api-m.sandbox.paypal.com/v1/billing/plans" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "product_id": "'"$PRO_PRODUCT_ID"'",
    "name": "Pro Monthly",
    "description": "14-day free trial then $89.99/month",
    "billing_cycles": [
      {
        "frequency": {"interval_unit": "DAY", "interval_count": 14},
        "tenure_type": "TRIAL",
        "sequence": 1,
        "total_cycles": 1,
        "pricing_scheme": {"fixed_price": {"value": "0", "currency_code": "USD"}}
      },
      {
        "frequency": {"interval_unit": "MONTH", "interval_count": 1},
        "tenure_type": "REGULAR",
        "sequence": 2,
        "total_cycles": 0,
        "pricing_scheme": {"fixed_price": {"value": "89.99", "currency_code": "USD"}}
      }
    ],
    "payment_preferences": {
      "auto_bill_outstanding": true,
      "setup_fee_failure_action": "CONTINUE",
      "payment_failure_threshold": 3
    }
  }')

PRO_PLAN_ID=$(echo $PRO_PLAN | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")
echo "✅ Pro Plan ID: $PRO_PLAN_ID"

echo ""
echo "🎉 완료! .env.local에 추가하세요:"
echo "PAYPAL_PLAN_ID_STANDARD=$STANDARD_PLAN_ID"
echo "PAYPAL_PLAN_ID_PRO=$PRO_PLAN_ID"
