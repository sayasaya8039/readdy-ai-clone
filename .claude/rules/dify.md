---
paths: "**/dify/**, **/agentic/**"
---

# Dify ルール

## 概要

**Dify**はプロダクション向けエージェントワークフロー開発プラットフォーム。
ビジュアルエディタでAIエージェントを構築・テスト・デプロイ。

GitHub: https://github.com/langgenius/dify (121,000+ stars)

## MCPによる双方向連携

Dify v1.6.0以降、MCPをネイティブサポート。

### Dify → 外部MCPサーバー

Difyから任意のMCPサーバーをツールとして呼び出し可能。

### Dify ← MCPクライアント

DifyのエージェントをMCPサーバーとして公開可能。

## Claude Code連携

### DifyエージェントをClaude Codeから呼び出し

```json
{
  "mcpServers": {
    "dify-agent": {
      "url": "https://api.dify.ai/v1/mcp/{workflow_id}",
      "headers": {
        "Authorization": "Bearer {API_KEY}"
      }
    }
  }
}
```

## セットアップ

### Docker Compose

```bash
git clone https://github.com/langgenius/dify.git
cd dify/docker
docker compose up -d
```

### アクセス

- Web UI: http://localhost:3000
- API: http://localhost:5001

## ワークフロータイプ

| タイプ | 用途 |
|--------|------|
| Chatbot | 対話型エージェント |
| Agent | 自律型タスク実行 |
| Workflow | 複雑なパイプライン |
| Text Generator | テキスト生成 |

## 対応LLMプロバイダー

| プロバイダー | モデル例 |
|-------------|---------|
| OpenAI | GPT-4o, GPT-4 |
| Anthropic | Claude 4, Claude 3.5 |
| Google | Gemini Pro |
| Ollama | Llama, Mistral |

## ユースケース

1. **カスタマーサポート** - RAG + エージェント
2. **ドキュメント処理** - 要約・抽出・分類
3. **コード生成** - 仕様→コード変換
4. **データ分析** - SQL生成・可視化
