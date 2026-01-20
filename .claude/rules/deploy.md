---
paths: "**/wrangler.toml, **/deploy/**"
---

Cloudflare Workersへのデプロイを自動化します。

## Bunコマンド優先

**Hono、Cloudflare Workers、TypeScript使用時はbunを優先:**

| 操作 | コマンド |
|------|---------|
| 依存インストール | `bun install` |
| ビルド | `bun run build` |
| 開発サーバー | `bun run dev` |
| デプロイ | `bunx wrangler deploy` |
| 型チェック | `bunx tsc --noEmit` |

## 実行内容

### 1. 事前チェック
- wrangler.toml の存在確認
- 未コミット変更の確認

### 2. ビルド・デプロイ
```bash
bun install
bun run build
bunx wrangler deploy
```

## プロジェクト種類別

| 種類 | ビルド | デプロイ |
|------|--------|----------|
| Hono | `bun run build` | `bunx wrangler deploy` |
| Vite+React | `bun run build` | `bunx wrangler pages deploy ./dist` |
| Next.js | `bun run build` | `bunx wrangler pages deploy ./out` |

$ARGUMENTS でオプション指定（--preview, --dry-run）
