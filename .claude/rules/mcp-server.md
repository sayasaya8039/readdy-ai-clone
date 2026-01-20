---
paths: "**/mcp/**, **/server/**"
---

# MCPサーバー開発ルール

MCPサーバーの開発ガイドライン。

## 基本構成

```
mcp-server/
├── src/
│   ├── index.ts          # エントリーポイント
│   ├── tools/            # ツール定義
│   │   └── *.ts
│   ├── resources/        # リソース定義
│   │   └── *.ts
│   └── prompts/          # プロンプト定義
│       └── *.ts
├── package.json
└── tsconfig.json
```

## 依存関係

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "latest"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
```

## ツール定義

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "my-server",
  version: "1.0.0",
});

// ツール登録
server.tool(
  "tool-name",
  "ツールの説明",
  {
    param1: z.string().describe("パラメータの説明"),
    param2: z.number().optional(),
  },
  async ({ param1, param2 }) => {
    // 処理
    return {
      content: [{ type: "text", text: "結果" }],
    };
  }
);

// サーバー起動
const transport = new StdioServerTransport();
await server.connect(transport);
```

## リソース定義

```typescript
server.resource(
  "resource://my-resource",
  "リソースの説明",
  async () => ({
    contents: [
      {
        uri: "resource://my-resource",
        mimeType: "text/plain",
        text: "リソースの内容",
      },
    ],
  })
);
```

## プロンプト定義

```typescript
server.prompt(
  "prompt-name",
  "プロンプトの説明",
  { topic: z.string() },
  async ({ topic }) => ({
    messages: [
      {
        role: "user",
        content: { type: "text", text: `${topic}について説明してください` },
      },
    ],
  })
);
```

## ベストプラクティス

| 項目 | ガイドライン |
|------|-------------|
| 命名 | 小文字のkebab-case（例: `fetch-data`） |
| 説明 | 日本語で明確に記述 |
| エラー | 具体的なエラーメッセージを返す |
| 型安全 | Zodでスキーマを定義 |

## デバッグ

```bash
# MCP Inspectorで確認
npx @modelcontextprotocol/inspector node dist/index.js
```

## Claude設定

`~/.claude/claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/path/to/dist/index.js"]
    }
  }
}
```

## 禁止事項

| 禁止事項 | 理由 |
|----------|------|
| 同期的な長時間処理 | タイムアウトの原因 |
| 機密情報のログ出力 | セキュリティリスク |
| 無限ループ | プロセスハング |
