#!/bin/bash

# Cloudflare Workers Secrets設定スクリプト
# 使用方法: ./setup-secrets.sh

echo "================================"
echo "Cloudflare Workers Secrets設定"
echo "================================"
echo ""

# OpenAI API Key
echo "OpenAI API Keyを入力してください:"
wrangler secret put OPENAI_API_KEY

# Supabase URL
echo ""
echo "Supabase URLを入力してください (例: https://xxx.supabase.co):"
wrangler secret put SUPABASE_URL

# Supabase Service Role Key
echo ""
echo "Supabase Service Role Keyを入力してください:"
wrangler secret put SUPABASE_SERVICE_ROLE_KEY

echo ""
echo "================================"
echo "設定完了！"
echo "================================"
echo ""
echo "デプロイを実行して変更を反映してください:"
echo "  bnmp run deploy"
echo ""
