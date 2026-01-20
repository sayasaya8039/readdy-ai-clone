#!/bin/bash

# コード生成APIをテスト
curl -X POST https://readdy-ai-workers.sayasaya.workers.dev/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a simple React button component with Tailwind CSS",
    "model": "gpt-4o",
    "temperature": 0.7,
    "max_tokens": 1000
  }' | jq
