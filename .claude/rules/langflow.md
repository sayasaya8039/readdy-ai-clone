---
paths: "**/langflow/**, **/workflows/**, **/agents/**"
---

# Langflow - AI ワークフロービルダー

## 概要

**Langflow**はオープンソースのローコードAIエージェント・ワークフロー構築プラットフォーム（140,000+ stars）。
ビジュアルインターフェースでAIエージェントとRAGワークフローを設計・デプロイ可能。

## 特徴

| 特徴 | 説明 |
|------|------|
| **ビジュアルビルダー** | ドラッグ＆ドロップでフロー設計 |
| **MCP対応** | v1.7でMCPサーバー/クライアント対応 |
| **全LLM対応** | OpenAI, Anthropic, Gemini等すべて対応 |
| **即時デプロイ** | APIまたはMCPサーバーとしてデプロイ |

## インストール

```bash
# uv推奨
uv pip install langflow

# または pip
pip install langflow

# 起動
langflow run
```

## Docker

```bash
docker run -it --rm -p 7860:7860 langflowai/langflow:latest
```

## MCP統合（v1.7+）

```bash
# MCPサーバーとしてデプロイ
langflow run --mcp-server

# MCPクライアントとして外部ツール利用
# フロー内でMCPノードを追加
```

### Claude Code連携

```json
{
  "mcpServers": {
    "langflow": {
      "command": "langflow",
      "args": ["run", "--mcp-server", "--port", "7860"]
    }
  }
}
```

## コンポーネント

| タイプ | 用途 |
|--------|------|
| **Agent** | AIエージェント（Tool Calling対応） |
| **Chain** | LangChainチェーン |
| **RAG** | ベクトル検索・ドキュメント処理 |
| **Tool** | 外部API・MCP連携 |
| **Memory** | 会話履歴管理 |

## エージェントパターン

### CUGA（Critic-User-Generator-Arbiter）

```
Generator → Critic → Arbiter → Output
    ↑          |
    └──────────┘
```

エンタープライズ向け信頼性重視パターン。

### ALTK（Autonomous Long-Term Knowledge）

長期記憶を持つ自律エージェント。

## Python SDK

```python
from langflow import load_flow_from_json

# フローをロード
flow = load_flow_from_json("my_flow.json")

# 実行
result = flow.run(input="質問内容")
print(result)
```

## API

```bash
# フロー実行
curl -X POST http://localhost:7860/api/v1/run/{flow_id}   -H "Content-Type: application/json"   -d '{"input_value": "質問内容"}'
```

## ユースケース

| ユースケース | 説明 |
|-------------|------|
| カスタマーサポート | FAQ自動応答・チケット分類 |
| ドキュメントQA | RAGベースの文書検索 |
| コード生成 | 要件からコード生成ワークフロー |
| データパイプライン | ETL処理の自動化 |

## リポジトリ

- GitHub: https://github.com/langflow-ai/langflow (140K+ stars)
- ドキュメント: https://docs.langflow.org
