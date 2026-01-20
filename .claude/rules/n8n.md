---
paths: "**/n8n/**, **/workflow/**"
---

# n8n ルール

## 概要

**n8n**はオープンソースのワークフロー自動化プラットフォーム。
400+のインテグレーションとAIネイティブアプローチでLLMをワークフローに統合。

GitHub: https://github.com/n8n-io/n8n (150,000+ stars)

## MCPによるClaude Code連携

n8nはModel Context Protocol (MCP)をネイティブサポート。

### MCP設定（Claude Code用）

```json
{
  "mcpServers": {
    "n8n": {
      "command": "npx",
      "args": ["-y", "n8n-mcp"],
      "env": {
        "N8N_BASE_URL": "http://localhost:5678",
        "N8N_API_KEY": "your-api-key"
      }
    }
  }
}
```

### 利用可能なMCPツール

| ツール | 説明 |
|--------|------|
| list_workflows | ワークフロー一覧取得 |
| create_workflow | ワークフロー作成 |
| execute_workflow | ワークフロー実行 |
| get_executions | 実行履歴取得 |

## n8n Skills（Claude Code用）

```bash
# n8n-skillsをクローン
git clone https://github.com/czlonkowski/n8n-skills.git ~/.claude/skills/n8n
```

## 基本コマンド

```bash
# n8nインストール
bun add n8n

# n8n起動
bunx n8n start

# バックグラウンド起動
bunx n8n start --tunnel
```

## ワークフロー作成パターン

### トリガーノード

| ノード | 用途 |
|--------|------|
| Webhook | HTTP受信 |
| Schedule | 定期実行 |
| Manual | 手動実行 |

### AIノード

| ノード | 用途 |
|--------|------|
| AI Agent | LLMエージェント |
| AI Completion | テキスト補完 |
| AI Summarize | 要約 |
| AI Transform | データ変換 |

## ユースケース

1. **CI/CDパイプライン** - GitHub→ビルド→デプロイ
2. **データ同期** - DB間同期、APIデータ取得
3. **AI自動化** - メール分類、要約生成
4. **通知** - Slack/Discord連携
