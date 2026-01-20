---
paths: "**/astro.config.*, **/*.astro"
---

Astro（高速コンテンツサイトフレームワーク）の開発を支援します。

## Astroとは

- **Islands Architecture**: 静的HTML + 必要な部分だけJS
- **Zero JS by default**: デフォルトでJavaScriptなし、超高速
- **UI非依存**: React, Vue, Svelte, Solid, Preact等を混在可能
- **Content Collections**: 型安全なコンテンツ管理
- **SSG/SSR両対応**: 静的生成とサーバーレンダリング

## 対応プラットフォーム

| デプロイ先 | インテグレーション |
|-----------|-------------------|
| Cloudflare | `@astrojs/cloudflare` |
| Vercel | `@astrojs/vercel` |
| Netlify | `@astrojs/netlify` |
| Node.js | `@astrojs/node` |

## クイックリファレンス

### プロジェクト作成
```bash
# 新規プロジェクト
bun create astro@latest

# テンプレート指定
bun create astro@latest -- --template blog
bun create astro@latest -- --template docs
bun create astro@latest -- --template portfolio
```

### 開発コマンド
```bash
# 開発サーバー
bun run dev

# ビルド
bun run build

# プレビュー
bun run preview

# 型チェック
bunx astro check
```

### インテグレーション追加
```bash
# React追加
bunx astro add react

# Tailwind追加
bunx astro add tailwind

# Cloudflareアダプター追加
bunx astro add cloudflare

# MDX追加
bunx astro add mdx

# sitemap追加
bunx astro add sitemap
```

## ファイル構造

```
src/
├── pages/          # ルーティング（.astro, .md, .mdx）
├── components/     # コンポーネント
├── layouts/        # レイアウト
├── content/        # Content Collections
├── styles/         # グローバルスタイル
└── assets/         # 画像等の静的アセット
public/             # そのまま配信される静的ファイル
astro.config.mjs    # Astro設定
```

## Content Collections

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
```

## Islands（クライアントディレクティブ）

```astro
<!-- デフォルト: サーバーのみ（JSなし） -->
<MyComponent />

<!-- ページ読み込み時にハイドレート -->
<MyComponent client:load />

<!-- ビューポートに入ったらハイドレート -->
<MyComponent client:visible />

<!-- アイドル時にハイドレート -->
<MyComponent client:idle />

<!-- メディアクエリに一致したらハイドレート -->
<MyComponent client:media="(max-width: 768px)" />
```

## Astroを選ぶべき場面

| 用途 | 理由 |
|------|------|
| ブログ | Content Collections + MDX |
| ドキュメント | Starlight（公式テーマ） |
| ポートフォリオ | 軽量 + 高速 |
| LP/マーケティング | SEO最適化 + 高速 |
| Eコマース | Server Islands対応 |

## 実行内容

1. **$ARGUMENTS** の内容に応じて適切なAstro操作を実行
2. context7で最新のAstro APIを確認
3. 必要に応じてインテグレーション追加
4. ビルド・型チェックを実行

---

## 追加ルール（rules統合）

# Astro開発ルール

Astroフレームワークの開発ガイドライン。

## 選択基準

以下の場合はAstroを最優先で選択：

| 条件 | 理由 |
|------|------|
| コンテンツ中心サイト | Islands Architectureで高速 |
| ブログ・ドキュメント | Content Collections標準搭載 |
| ポートフォリオ・LP | Zero JS by defaultで軽量 |
| 複数UI混在 | React + Vue + Svelte共存可能 |
| SEO重視 | 静的HTML優先で最適化 |

## プロジェクト構成

```
src/
├── pages/           # ファイルベースルーティング
│   ├── index.astro
│   └── blog/
│       └── [slug].astro
├── layouts/         # レイアウトコンポーネント
├── components/      # UIコンポーネント
├── content/         # Content Collections
│   └── blog/
│       └── post-1.md
├── styles/          # グローバルスタイル
└── lib/             # ユーティリティ
```

## 基本的なページ

```astro
---
// コンポーネントスクリプト（サーバーサイド）
import Layout from "../layouts/Layout.astro";
import Card from "../components/Card.astro";

const title = "My Page";
const posts = await fetch("https://api.example.com/posts").then(r => r.json());
---

<Layout title={title}>
  <h1>{title}</h1>
  {posts.map((post) => (
    <Card title={post.title} href={post.url} />
  ))}
</Layout>

<style>
  h1 {
    color: #333;
  }
</style>
```

## Content Collections

```typescript
// src/content/config.ts
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
```

```astro
---
// src/pages/blog/[slug].astro
import { getCollection, getEntry } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<article>
  <h1>{post.data.title}</h1>
  <Content />
</article>
```

## Islands Architecture

```astro
---
import ReactCounter from "../components/Counter.tsx";
---

<!-- 静的HTML（JSなし） -->
<h1>Static Content</h1>

<!-- Reactコンポーネント（インタラクティブ） -->
<ReactCounter client:load />

<!-- 遅延読み込み -->
<ReactCounter client:visible />

<!-- アイドル時に読み込み -->
<ReactCounter client:idle />
```

## client ディレクティブ

| ディレクティブ | 動作 |
|---------------|------|
| `client:load` | ページ読み込み時に即座にハイドレート |
| `client:idle` | ブラウザがアイドル状態になったら |
| `client:visible` | ビューポートに入ったら |
| `client:media` | メディアクエリがマッチしたら |
| `client:only` | サーバーレンダリングなし |

## インテグレーション

```bash
# React
bun astro add react

# Tailwind CSS
bun astro add tailwind

# Cloudflare
bun astro add cloudflare
```

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  integrations: [react(), tailwind()],
  output: "server",
  adapter: cloudflare(),
});
```

## ビルド・デプロイ

```bash
# 開発サーバー
bun run dev

# ビルド
bun run build

# プレビュー
bun run preview

# Cloudflareデプロイ
wrangler pages deploy dist/
```

## ベストプラクティス

| 項目 | ガイドライン |
|------|-------------|
| JS最小化 | 必要な箇所のみclient:*を使用 |
| 画像最適化 | `<Image />` コンポーネント使用 |
| 型安全 | Content Collectionsでスキーマ定義 |
| SSG優先 | 可能な限り静的生成 |
