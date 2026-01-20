---
paths: "**/*"
---

---
name: full-stack-app
description: フルスタックアプリの新規作成ワークフロー
tools:
  - Bash
  - Read
  - Write
  - WebSearch
  - mcp__context7__*
---

# フルスタックアプリ開発スキル

Astro + Hono + Supabaseを使用したフルスタックアプリの新規作成ワークフロー。

## 目的

モダンな技術スタックでフルスタックWebアプリケーションを構築する。

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | Astro + React |
| API | Hono (Cloudflare Workers) |
| データベース | Supabase (PostgreSQL) |
| 認証 | Supabase Auth |
| デプロイ | Cloudflare Pages/Workers |

## ワークフロー

### Step 1: 要件確認

1. アプリの目的・機能を明確化
2. 必要なデータモデルを設計
3. 認証要件を確認

### Step 2: プロジェクト作成

```bash
# Astroプロジェクト作成
bun create astro@latest my-app --template minimal
cd my-app

# 依存関係追加
bun add @astrojs/react @astrojs/tailwind @supabase/supabase-js hono
bun add -D @astrojs/cloudflare

# インテグレーション設定
bun astro add react tailwind cloudflare
```

### Step 3: Supabase設定

```bash
# Supabase初期化
bunx supabase init
bunx supabase start

# 型生成
bunx supabase gen types typescript --local > src/types/database.ts
```

### Step 4: API作成

```typescript
// src/pages/api/[...route].ts
import { Hono } from "hono";
import type { APIRoute } from "astro";

const app = new Hono()
  .basePath("/api")
  .get("/health", (c) => c.json({ status: "ok" }));

export const ALL: APIRoute = (context) => {
  return app.fetch(context.request);
};
```

### Step 5: 認証実装

1. Supabase Authプロバイダー設定
2. ログイン/サインアップページ作成
3. 認証ガード実装

### Step 6: データベース

1. マイグレーション作成
2. RLSポリシー設定
3. CRUD操作実装

### Step 7: デプロイ

```bash
# ビルド
bun run build

# Cloudflare Pagesデプロイ
wrangler pages deploy dist/
```

## チェックリスト

- [ ] プロジェクト構造の確認
- [ ] 環境変数の設定
- [ ] データベーススキーマ作成
- [ ] RLSポリシー設定
- [ ] 認証フロー実装
- [ ] APIエンドポイント実装
- [ ] フロントエンドUI実装
- [ ] テスト実行
- [ ] デプロイ
