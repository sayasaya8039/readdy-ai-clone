---
description: Hono + Cloudflare Workers + TypeScriptでWebアプリを構築・デプロイ
allowed-tools: Bash(bun:*), Bash(bunx:*), Bash(git:*), Read, Write, Edit, Glob, Grep, WebSearch
argument-hint: [プロジェクト名] [--api-only | --with-react]
---

Hono + Cloudflare Workers + TypeScriptでWebアプリを構築し、デプロイまで完了します。

## 概要

このスキルは以下を自動実行します：
1. プロジェクト作成
2. 開発・実装
3. テスト
4. ビルド
5. Cloudflare Workersへデプロイ

## プロジェクト作成

```bash
# Honoプロジェクト作成
bun create hono@latest $ARGUMENTS

# ディレクトリ移動
cd $ARGUMENTS

# 依存関係インストール
bun install
```

## 推奨プロジェクト構成

```text
project-name/
├── src/
│   ├── index.ts          # エントリーポイント
│   ├── routes/           # ルート定義
│   │   ├── index.ts
│   │   └── api/
│   │       └── index.ts
│   ├── middleware/       # ミドルウェア
│   │   └── auth.ts
│   ├── lib/              # ユーティリティ
│   │   └── utils.ts
│   └── types/            # 型定義
│       └── index.ts
├── wrangler.toml         # Cloudflare Workers設定
├── package.json
├── tsconfig.json
└── README.md
```

## Hono基本テンプレート

### src/index.ts
```typescript
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

type Bindings = {
  // 環境変数・KV等のバインディング
  API_KEY?: string
}

const app = new Hono<{ Bindings: Bindings }>()

// ミドルウェア
app.use('*', logger())
app.use('*', prettyJSON())
app.use('/api/*', cors())

// ルート
app.get('/', (c) => {
  return c.json({ message: 'Hello Hono!' })
})

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404ハンドラー
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

// エラーハンドラー
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: 'Internal Server Error' }, 500)
})

export default app
```

## wrangler.toml設定

```toml
name = "project-name"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
ENVIRONMENT = "production"

# KVバインディング（必要に応じて）
# [[kv_namespaces]]
# binding = "MY_KV"
# id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# D1データベース（必要に応じて）
# [[d1_databases]]
# binding = "DB"
# database_name = "my-database"
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

## 開発コマンド

| 操作 | コマンド |
|------|---------|
| 開発サーバー起動 | `bun run dev` |
| 型チェック | `bunx tsc --noEmit` |
| ビルド | `bun run build` |
| デプロイ（プレビュー） | `bunx wrangler deploy --dry-run` |
| デプロイ（本番） | `bunx wrangler deploy` |

## 実行フロー

### 1. プロジェクト作成・セットアップ
- `bun create hono@latest` でプロジェクト作成
- Cloudflare Workersテンプレートを選択
- 依存関係インストール

### 2. 実装
- ルート定義
- ミドルウェア設定
- API実装

### 3. テスト・検証
- `bun run dev` でローカル確認
- `bunx tsc --noEmit` で型チェック

### 4. デプロイ
```bash
# 本番デプロイ
bunx wrangler deploy
```

## オプション

| オプション | 説明 |
|-----------|------|
| `--api-only` | APIのみ（フロントエンドなし） |
| `--with-react` | React SPAを含める |
| `--with-d1` | D1データベースを使用 |
| `--with-kv` | KVストレージを使用 |

## デプロイ後の確認

デプロイ完了後、以下を確認：
- デプロイURL（`https://project-name.username.workers.dev`）
- ヘルスチェックエンドポイント（`/api/health`）

## 注意事項

- Cloudflare Workersの制限（CPU時間、メモリ等）を考慮
- 環境変数は `wrangler.toml` の `[vars]` または Cloudflareダッシュボードで設定
- 機密情報は `wrangler secret put` で設定

$ARGUMENTS でプロジェクト名を指定。オプションも指定可能。
