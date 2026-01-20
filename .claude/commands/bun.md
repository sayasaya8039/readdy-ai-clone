---
description: Bunコマンドのクイックリファレンス
allowed-tools: Bash(bun:*), Bash(bunx:*), Read
argument-hint: [サブコマンド]
---

Bunのオールインワン機能を活用した開発支援。

## 概要

Bunは JavaScript/TypeScript 向けの高速オールインワンツールキット。
- **ランタイム**: Node.jsの25倍高速
- **パッケージマネージャー**: npmの25倍高速
- **バンドラー**: esbuildより高速
- **テストランナー**: Jest互換

## クイックリファレンス

### パッケージ管理
```bash
bun install              # 依存関係インストール
bun add react            # パッケージ追加
bun add -d typescript    # 開発依存
bun remove lodash        # パッケージ削除
bun update               # 更新
```

### スクリプト実行
```bash
bun run dev              # package.jsonスクリプト
bun index.ts             # ファイル直接実行
bun --watch index.ts     # ウォッチモード
bunx create-vite my-app  # パッケージ実行（npx相当）
```

### テスト
```bash
bun test                 # テスト実行
bun test --watch         # ウォッチモード
bun test --coverage      # カバレッジ
```

### バンドル
```bash
bun build ./src/index.ts --outdir ./dist
bun build ./src/index.ts --compile --outfile myapp
```

### プロジェクト作成
```bash
bun init                       # 新規プロジェクト
bun create vite my-app         # Viteプロジェクト
bun create hono@latest my-api  # Honoプロジェクト
```

## npm対応表

| npm | Bun |
|-----|-----|
| `npm install` | `bun install` |
| `npm install <pkg>` | `bun add <pkg>` |
| `npm run <script>` | `bun run <script>` |
| `npx <pkg>` | `bunx <pkg>` |

$ARGUMENTS でサブコマンドを指定して実行。
