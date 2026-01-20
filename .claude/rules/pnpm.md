---
paths: "**/*"
---

# pnpm / bnmp パッケージマネージャールール

## 概要

**bnmp**（利用可能時）または**pnpm**を優先パッケージマネージャーとして使用。
**npm/npxコマンドは自動的にbnmpにリダイレクトされる。**

## 優先順位

| 順位 | ツール | 条件 |
|------|--------|------|
| 1 | **bnmp** | 全環境で利用可能（最優先） |
| 2 | **pnpm** | bnmp非対応機能のみ |
| 3 | bun | pnpm非対応時 |
| 4 | npm | レガシー（bnmpにリダイレクト） |

## bnmp グローバルパス

```
C:/Users/Owner/.local/bin/bnmp.exe
```

## コマンド対応表

| npm | pnpm | bnmp |
|-----|------|------|
| npm install | pnpm install | bnmp i |
| npm i <pkg> | pnpm add <pkg> | bnmp a <pkg> |
| npm i -D <pkg> | pnpm add -D <pkg> | bnmp a -D <pkg> |
| npm uninstall | pnpm remove | bnmp rm |
| npx <pkg> | pnpx <pkg> | bnmp exec/dlx |

## bnmpを使う場面（全てのJS/TSプロジェクト）

| 場面 | 使用 |
|------|------|
| 依存関係インストール | bnmp i |
| パッケージ追加 | bnmp a <pkg> |
| パッケージ削除 | bnmp rm <pkg> |
| スクリプト実行 | bnmp run <script> |
| lint/format | bnmp lint / bnmp format |

## pnpmを使う場面（bnmp非対応機能のみ）

| 場面 | 使用 |
|------|------|
| モノレポworkspace | pnpm workspace |
| グローバルツール | pnpm add -g |
| pnpm固有機能 | pnpm |
