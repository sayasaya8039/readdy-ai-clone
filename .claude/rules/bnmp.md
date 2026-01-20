---
paths: "**/*"
---

# bnmp 最優先ルール

## 概要

**bnmp**（Zig製高速パッケージマネージャー）を最優先で使用。
pnpm互換でさらに高速、ディスク効率が良い。
**npm, npx, biome コマンドは自動的にbnmpにリダイレクトされる。**

## 優先順位

| 順位 | ツール | 用途 |
|------|--------|------|
| 1 | **bnmp** | 最優先（全環境で利用可能） |
| 2 | pnpm | bnmp非対応機能のみ |
| 3 | bun | pnpm非対応時 |
| 4 | npm | レガシー互換（bnmpにリダイレクト） |

## グローバルパス

```
C:/Users/Owner/.local/bin/bnmp.exe
```

## コマンド対応表

| npm/pnpm | bnmp |
|----------|------|
| npm install / pnpm install | bnmp install / bnmp i |
| npm i <pkg> / pnpm add <pkg> | bnmp add <pkg> / bnmp a <pkg> |
| npm uninstall / pnpm remove | bnmp remove / bnmp rm |
| npx <pkg> | bnmp exec / bnmp dlx |
| biome lint | bnmp lint |
| biome format | bnmp format |
| biome check | bnmp check |

## リダイレクト設定

以下のコマンドはbnmpに自動リダイレクト：
- `npm` → `bnmp`
- `npx` → `bnmp exec/dlx`
- `biome` → `bnmp lint/format/check`

## 特徴

- Content-addressable store（pnpm互換）
- Hard linksでディスク効率化
- 厳格な依存関係解決
- 高速並列ダウンロード
- Zig製で軽量・高速
- 組み込みlint/format/check機能
