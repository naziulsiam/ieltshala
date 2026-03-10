#!/bin/bash
# Quick connection test for Supabase

echo "🧪 Testing Supabase Connection"
echo "=============================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found!"
    echo "   Create it first: cp .env.example .env.local"
    exit 1
fi

# Extract values from .env.local
SUPABASE_URL=$(grep VITE_SUPABASE_URL .env.local | cut -d '=' -f2)
SUPABASE_KEY=$(grep VITE_SUPABASE_ANON_KEY .env.local | cut -d '=' -f2)

# Check if values are set
if [ -z "$SUPABASE_URL" ] || [ "$SUPABASE_URL" = "your_supabase_project_url" ]; then
    echo "❌ VITE_SUPABASE_URL not set in .env.local"
    exit 1
fi

if [ -z "$SUPABASE_KEY" ] || [ "$SUPABASE_KEY" = "your_supabase_anon_key" ]; then
    echo "❌ VITE_SUPABASE_ANON_KEY not set in .env.local"
    exit 1
fi

echo "✅ Environment variables found"
echo ""
echo "🔗 Testing connection to:"
echo "   $SUPABASE_URL"
echo ""

# Test with curl
echo "📡 Sending test request..."
echo ""

RESPONSE=$(curl -s -X GET \
  "${SUPABASE_URL}/rest/v1/categories?select=name&limit=3" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}")

# Check if response contains error
if echo "$RESPONSE" | grep -q '"message"'; then
    echo "❌ Connection failed!"
    echo ""
    echo "Response:"
    echo "$RESPONSE" | head -20
    exit 1
fi

# Check if we got categories
if echo "$RESPONSE" | grep -q 'Education'; then
    echo "✅ Connection successful!"
    echo ""
    echo "📊 Sample data received:"
    echo "$RESPONSE" | head -100
    echo ""
    echo "=============================="
    echo "🎉 Your Supabase is ready!"
    echo "=============================="
    echo ""
    echo "Next: npm run dev"
else
    echo "⚠️  Connected but no categories found"
    echo "   You may need to run the database migration"
    echo ""
    echo "Response:"
    echo "$RESPONSE"
fi
