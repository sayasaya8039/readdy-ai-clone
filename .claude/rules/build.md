---
paths: "**/*"
---

プロジェクトをビルドします。

## Bunコマンド優先

**Hono、Cloudflare Workers、TypeScript、React使用時はbunを優先:**

| 操作 | コマンド |
|------|---------|
| 依存インストール | `bun install` |
| ビルド | `bun run build` |
| 開発サーバー | `bun run dev` |
| テスト | `bun test` |
| 型チェック | `bunx tsc --noEmit` |
| lint | `bunx eslint .` |

## 実行内容

### 1. プロジェクト検出
- package.json → Bun/Node.js
- Cargo.toml → Rust
- pyproject.toml → Python

### 2. ビルド前チェック
- lint実行、型チェック

### 3. ビルド実行
- 出力先はアプリ名フォルダ（dist/は使用禁止）

## プロジェクト別コマンド

| プロジェクト | コマンド |
|-------------|---------|
| Hono/Vite/React | `bun run build` |
| Electron | `npm run make` |
| Rust | `cargo build --release` |
| Python | `pyinstaller --onefile` |

$ARGUMENTS でオプション指定（--dev, --watch, --no-lint）
