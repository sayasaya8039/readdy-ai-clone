#!/bin/bash

# URLクローンAPIをテスト
curl -X POST https://readdy-ai-workers.sayasaya.workers.dev/api/clone-from-url \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "prompt": "Convert this website to React code with Tailwind CSS"
  }' | jq
