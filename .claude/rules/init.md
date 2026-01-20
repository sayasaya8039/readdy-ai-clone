---
paths: "**/*"
---

新しいプロジェクトを素早く初期化します。

## 対応するプロジェクトタイプ

| タイプ | コマンド | 説明 |
|--------|----------|------|
| **astro** | `/init astro` | Astro（コンテンツサイト） |
| **astro-blog** | `/init astro-blog` | Astro ブログテンプレート |
| **astro-docs** | `/init astro-docs` | Astro Starlight（ドキュメント） |
| **supabase** | `/init supabase` | Supabase + React/Next.js |
| **supabase-astro** | `/init supabase-astro` | Supabase + Astro |
| **web-react** | `/init web-react` | Vite + React + TypeScript |
| **web-vue** | `/init web-vue` | Vite + Vue + TypeScript |
| **hono** | `/init hono` | Hono + Cloudflare Workers |
| **extension** | `/init extension` | Chrome拡張機能 |
| **electron** | `/init electron` | Electron デスクトップアプリ |
| **python** | `/init python` | Python プロジェクト |

## Astroテンプレート

```bash
# 基本（空のプロジェクト）
bun create astro@latest

# ブログ
bun create astro@latest -- --template blog

# ドキュメント（Starlight）
bun create astro@latest -- --template starlight

# ポートフォリオ
bun create astro@latest -- --template portfolio
```

## Supabaseプロジェクト

```bash
# ローカル開発環境セットアップ
supabase init

# Supabase + Next.js
bunx create-next-app -e with-supabase

# Supabase + React (Vite)
bun create vite my-app --template react-ts
cd my-app && bun add @supabase/supabase-js

# 既存プロジェクトにSupabase追加
bun add @supabase/supabase-js
supabase init
```

### Supabase初期ファイル

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types/database'

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

```env
# .env.example
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## 実行内容

1. **プロジェクト作成**
   - 適切なテンプレートを選択
   - プロジェクト名を設定

2. **初期設定**
   - TypeScript/Python設定
   - Biome設定（ESLint/Prettier代替）
   - Git初期化

3. **基本ファイル作成**
   - README.md
   - .gitignore
   - 環境変数テンプレート

4. **開発環境準備**
   - 依存関係インストール
   - 最初のビルド確認

## オプション

```
--name <name>     プロジェクト名
--dir <path>      作成先ディレクトリ
--no-git          Git初期化をスキップ
--no-install      依存関係インストールをスキップ
--tailwind        Tailwind CSSを追加
--react           Reactインテグレーション追加（Astro用）
--cloudflare      Cloudflareアダプター追加（Astro用）
--supabase        Supabase統合を追加
```

## 使用例

```bash
# Astroサイト
/init astro --name my-site

# Astro + Supabase
/init supabase-astro --name my-app

# Supabase + Next.js
/init supabase --name my-app

# React Webアプリ + Supabase
/init web-react --name my-dashboard --supabase

# Hono API
/init hono --name my-api

# Chrome拡張
/init extension --name my-extension

# Python
/init python --name my-tool
```

$ARGUMENTS からタイプとオプションを解析して実行。
