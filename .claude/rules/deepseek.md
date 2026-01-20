---
paths: "**/*"
---

# DeepSeek ルール

## 概要

**DeepSeek-V3**は高性能オープンソースAIモデル。
671Bパラメータ、37B活性化、GPT-4o/Claude 3.5に匹敵する性能。

- GitHub: https://github.com/deepseek-ai/DeepSeek-V3
- スター: 101k+
- ライセンス: MIT（商用利用可）

## 主な特徴

| 特徴 | 説明 |
|------|------|
| **MoEアーキテクチャ** | 671B総パラメータ、37B活性化 |
| **高効率学習** | 14.8Tトークン、2.788M GPU時間 |
| **FP8混合精度** | 大規模FP8学習を初めて成功 |
| **数学・コード特化** | ベンチマークで優れた性能 |

## モデルバリエーション

| モデル | 用途 |
|--------|------|
| deepseek-chat | 汎用チャット |
| deepseek-coder | コーディング特化 |
| deepseek-reasoner | 推論・思考タスク（R1） |

## Claude Code Router統合

```json
{
  "Providers": [
    {
      "name": "deepseek",
      "api_base_url": "https://api.deepseek.com/chat/completions",
      "api_key": "$DEEPSEEK_API_KEY",
      "models": ["deepseek-chat", "deepseek-reasoner"],
      "transformer": {
        "use": ["deepseek"],
        "deepseek-chat": { "use": ["tooluse"] }
      }
    }
  ],
  "Router": {
    "think": "deepseek,deepseek-reasoner",
    "background": "deepseek,deepseek-chat"
  }
}
```

## 使用場面

| 場面 | 推奨モデル |
|------|-----------|
| **推論・設計** | deepseek-reasoner（R1） |
| **コスト削減** | deepseek-chat |
| **コード生成** | deepseek-coder |
| **長時間タスク** | deepseek-chat（低コスト） |

## API使用

```typescript
const response = await fetch('https://api.deepseek.com/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
  },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: 'Hello' }]
  })
});
```

## ローカル実行

```bash
# Ollama経由
ollama pull deepseek-r1:latest
ollama run deepseek-r1
```

## コスト比較

| プロバイダー | 入力 | 出力 |
|-------------|------|------|
| DeepSeek | $0.14/1M | $0.28/1M |
| Claude Sonnet | $3/1M | $15/1M |
| GPT-4o | $2.5/1M | $10/1M |

**DeepSeekは約20倍コスト効率が良い。**

## 参照

- [DeepSeek GitHub](https://github.com/deepseek-ai/DeepSeek-V3)
- [DeepSeek API](https://platform.deepseek.com/)