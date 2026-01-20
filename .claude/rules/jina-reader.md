---
paths: "**/*"
---

# Jina Reader ルール

## ⚠️ 最重要ルール

**サイトの情報を読み込む際は、Jina Readerを最優先で使用すること。**

WebFetchを直接使用する前に、必ずJina Reader経由（`r.jina.ai`または`s.jina.ai`）を使用する。

## 使用優先順位

| 優先度 | ツール | 使用方法 |
|--------|--------|----------|
| **1（最優先）** | **Jina Reader** | `WebFetch: https://r.jina.ai/{URL}` |
| **1（最優先）** | **Jina Search** | `WebFetch: https://s.jina.ai/{query}` |
| 2 | WebFetch直接 | Jina Readerが失敗した場合のみ |
| 3 | WebSearch | 簡易検索のみ |

## 概要

Jina AI ReaderはURLをLLM向けマークダウンに変換するAPIサービス。

| 機能 | エンドポイント | 用途 |
|------|---------------|------|
| **Read** | `https://r.jina.ai/{URL}` | URLをMarkdownに変換 |
| **Search** | `https://s.jina.ai/{query}` | Web検索（上位5件） |

## Read API (`r.jina.ai`)

URLをLLM向けマークダウンに変換。

### 基本使用

```
https://r.jina.ai/https://example.com
```

### 対応コンテンツ

- Webページ（JavaScript SPA含む）
- PDFファイル
- 画像（キャプション生成可能）

### リクエストヘッダー

| ヘッダー | 値 | 説明 |
|----------|-----|------|
| `x-with-generated-alt` | `true` | 画像キャプション生成 |
| `x-respond-with` | `markdown` / `html` / `text` / `screenshot` | 出力形式 |
| `x-target-selector` | CSSセレクタ | 特定要素のみ取得 |
| `x-wait-for-selector` | CSSセレクタ | 要素の読み込み待機 |
| `x-timeout` | 秒数 | タイムアウト設定 |
| `x-no-cache` | `true` | キャッシュ無効化 |

### SPA対応

ハッシュベースルーティングのSPAはPOSTで：

```bash
curl -X POST 'https://r.jina.ai/' -d 'url=https://example.com/#/route'
```

### ストリーミングモード

動的コンテンツの完全取得に有効：

```bash
curl -H "Accept: text/event-stream" https://r.jina.ai/https://example.com
```

## Search API (`s.jina.ai`)

Web検索し、上位5件をマークダウンで返却。

### 基本使用

```
https://s.jina.ai/検索クエリ（URLエンコード必須）
```

### サイト内検索

特定サイトに限定：

```
https://s.jina.ai/query?site=example.com
```

### JSON出力

```bash
curl -H "Accept: application/json" https://s.jina.ai/query
```

## 実装例

### WebFetchでJina Reader使用

```typescript
// URL読み込み - 必ずこの形式を使用
WebFetch("https://r.jina.ai/https://github.com/jina-ai/reader", "内容を要約")

// Web検索 - 必ずこの形式を使用
WebFetch("https://s.jina.ai/" + encodeURIComponent("Claude API latest"), "結果を整理")
```

## ベストプラクティス

| シナリオ | 推奨方法 |
|----------|----------|
| ドキュメント読み込み | `r.jina.ai` |
| 最新情報検索 | `s.jina.ai` |
| PDF読み込み | `r.jina.ai` |
| 動的サイト | `r.jina.ai` + ストリーミング |
| 特定要素抽出 | `r.jina.ai` + `x-target-selector` |

## なぜJina Readerを優先するか

- **LLM最適化**: マークダウン形式で返却
- **SPA対応**: JavaScript動的サイトも取得可能
- **PDF対応**: PDFファイルも直接読み込み
- **画像キャプション**: 画像説明を自動生成
- **無料・安定**: 本番環境で使用可能
- **エラー耐性**: WebFetch直接より安定

## 注意事項

- URLはエンコード済みで渡す
- 検索クエリは必ずURLエンコード
- 無料・安定・スケーラブル（本番利用可）
