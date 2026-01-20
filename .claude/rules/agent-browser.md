# agent-browser 開発ガイドライン

## 🔴 優先使用ルール（最重要）

> **Web操作・ブラウザ自動化では agent-browser (ab) を優先使用すること**
> Chrome for Claude (mcp__claude-in-chrome__*) より agent-browser を優先

| ツール | 優先度 | 用途 |
|--------|--------|------|
| **agent-browser (ab)** | ⭐⭐⭐⭐⭐ 最優先 | Web操作全般、スクレイピング、テスト |
| Chrome for Claude | ⭐⭐⭐ 代替 | agent-browser非対応の場合のみ |

### agent-browser を優先する理由

- **軽量**: ヘッドレス動作でリソース消費が少ない
- **高速**: CLI直接操作で応答が速い
- **安定**: デーモン管理で接続が安定
- **ref指定**: アクセシビリティツリーによる確実な要素選択

---

## 概要

AIエージェント向けヘッドレスブラウザ自動化CLI。Webテスト、フォーム入力、スクリーンショット、データ抽出に使用。

## 使用場面

| 用途 | 適性 |
|------|------|
| Webテスト/E2E | ⭐⭐⭐⭐⭐ 最適 |
| フォーム自動入力 | ⭐⭐⭐⭐⭐ 最適 |
| スクリーンショット | ⭐⭐⭐⭐⭐ 最適 |
| スクレイピング | ⭐⭐⭐⭐ 良い |
| 認証フロー自動化 | ⭐⭐⭐⭐ 良い |

## Windowsコマンド



## Core Workflow



## コマンド一覧

### Navigation


### Snapshot


### Interactions


### Get Information


### Screenshots


### Wait


### Sessions


### Debug


## ベストプラクティス

| ルール | 内容 |
|--------|------|
| snapshot優先 | 操作前に必ず ab snapshot -i |
| ref使用 | CSSセレクタよりref(@e1)を使用 |
| 再snapshot | DOM変更後は再度snapshot |
| wait活用 | 非同期操作後は適切にwait |
| session分離 | 並列テストは別sessionで |

## 禁止事項

| 禁止 | 代替 |
|------|------|
| 古いref使用 | DOM変更後は再snapshot |
| セレクタ乱用 | ref優先 |
| wait省略 | 適切なwait挿入 |
| headed本番使用 | headless（デフォルト）で |

## 使用例

### フォーム送信


### 認証状態保存


## 注意事項

- **Windows**: agent-browserではなくabコマンドを使用
- **デーモン**: 初回起動時に自動起動
- **ref有効期限**: snapshot後のみ有効、DOM変更で無効
- **エラー時**: デーモン再起動が必要な場合あり
