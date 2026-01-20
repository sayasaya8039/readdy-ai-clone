---
paths: "**/*"
---

# Activepieces ルール

## 概要

**Activepieces**はAIファースト自動化プラットフォーム。
AIエージェント＋MCP＋ワークフロー自動化を統合。

GitHub: https://github.com/activepieces/activepieces (19,000+ stars)

## 特徴

| 特徴 | 説明 |
|------|------|
| **400+ MCPサーバー** | AIエージェント用の最大MCPツールキット |
| **280+ Pieces** | 全てMCPとして利用可能 |
| **AIファースト** | ネイティブAIピース＆AI SDK |
| **TypeScript** | npmパッケージとしてフル拡張可能 |
| **MIT License** | Community Editionはオープンソース |

## インストール

```bash
# Docker Compose
docker compose up -d

# または公式インストーラー
npx activepieces@latest
```

## MCPとの統合

Activepiecesのピースは自動的にMCPサーバーとして利用可能：
- Claude Desktop
- Cursor
- Windsurf

```json
// Claude Desktop設定例
{
  "mcpServers": {
    "activepieces": {
      "command": "npx",
      "args": ["@activepieces/mcp-server"]
    }
  }
}
```

## 使用場面

| 場面 | Activepiecesの活用 |
|------|-------------------|
| ワークフロー自動化 | ノーコードで構築 |
| AIエージェント作成 | AI SDKで独自エージェント |
| MCP拡張 | 400+サーバーを即座に利用 |
| SaaS連携 | 280+コネクタ |

## AI SDK

```typescript
import { AI } from '@activepieces/ai-sdk';

const agent = new AI({
  provider: 'openai',
  model: 'gpt-4o'
});

await agent.run('タスクを実行');
```

## n8nとの比較

| 項目 | Activepieces | n8n |
|------|-------------|-----|
| MCPサポート | ネイティブ（400+） | 限定的 |
| AIエージェント | ネイティブSDK | プラグイン |
| ライセンス | MIT | Apache 2.0 |
