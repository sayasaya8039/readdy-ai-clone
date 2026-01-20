#!/bin/bash

# 画像からUI生成APIをテスト
# 小さなテスト画像（1x1 透明PNG）をbase64でエンコード
IMAGE_DATA="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

curl -X POST https://readdy-ai-workers.sayasaya.workers.dev/api/generate-from-image \
  -H "Content-Type: application/json" \
  -d "{
    \"imageData\": \"$IMAGE_DATA\",
    \"prompt\": \"Convert this UI design to React code with Tailwind CSS\",
    \"model\": \"gpt-4o\",
    \"temperature\": 0.7,
    \"max_tokens\": 500
  }" | jq
