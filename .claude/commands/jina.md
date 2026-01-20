---
description: Jina ReaderでURL/検索をLLM向けに変換
allowed-tools: WebFetch, Read, Write
argument-hint: [read|search] <URL or query>
---

Jina AI Readerを使用してWebコンテンツをLLM向けマークダウンに変換します。

## 引数別動作

### `read <URL>` - URL読み込み

指定URLをマークダウンに変換：

```
/jina read https://example.com
```

実行内容：
1. `https://r.jina.ai/<URL>` でWebFetch実行
2. マークダウン形式で結果を表示

### `search <query>` - Web検索

クエリでWeb検索し上位5件を取得：

```
/jina search Claude API latest
```

実行内容：
1. クエリをURLエンコード
2. `https://s.jina.ai/<encoded_query>` でWebFetch実行
3. 検索結果をマークダウンで表示

### オプション

#### サイト内検索

```
/jina search Claude API site:docs.anthropic.com
```

→ `https://s.jina.ai/Claude%20API?site=docs.anthropic.com`

#### 画像キャプション付き

```
/jina read https://example.com --images
```

→ `x-with-generated-alt: true` ヘッダー付きで取得

## 使用例

```bash
# GitHubリポジトリ読み込み
/jina read https://github.com/jina-ai/reader

# 最新API情報検索
/jina search Anthropic Claude API 2025

# 公式ドキュメント内検索
/jina search authentication site:docs.anthropic.com

# PDF読み込み
/jina read https://example.com/document.pdf
```

## エンドポイント

| 機能 | URL |
|------|-----|
| Read | `https://r.jina.ai/{URL}` |
| Search | `https://s.jina.ai/{query}` |

## 注意事項

- 検索クエリはURLエンコードが必要
- PDF、SPA、動的サイトも対応
- 無料・本番利用可能

$ARGUMENTS で操作とターゲットを指定。
