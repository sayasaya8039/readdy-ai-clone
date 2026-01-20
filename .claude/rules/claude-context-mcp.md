---
paths: "**/*"
---

# Claude Context MCP（セマンティックコード検索）

## 概要

**claude-context**はZilliz製のMCPプラグイン。
セマンティック検索でコードベース全体をAIのコンテキストに。

GitHub: https://github.com/zilliztech/claude-context

## 主な特徴

| 特徴 | 説明 |
|------|------|
| **40%トークン削減** | 効率的なコード検索でコスト削減 |
| **セマンティック検索** | 自然言語でコード検索 |
| **ハイブリッド検索** | BM25 + ベクトル検索 |
| **多言語対応** | TS, JS, Python, Rust, Go等 |

## インストール

### Claude Codeに追加

```bash
claude mcp add claude-context \
  -e OPENAI_API_KEY=sk-your-key \
  -e MILVUS_TOKEN=your-zilliz-token \
  -- npx @zilliz/claude-context-mcp@latest
```

### ローカル版（APIキー不要）

```bash
# claude-context-local を使用
# コードは外部に送信されない
npx claude-context-local
```

## 対応プロバイダー

### Embedding

| プロバイダー | 用途 |
|-------------|------|
| OpenAI | クラウド（推奨） |
| VoyageAI | 高精度 |
| Ollama | ローカル |
| Gemini | Google |

### ベクトルDB

| DB | 用途 |
|----|------|
| Zilliz Cloud | マネージド（推奨） |
| Milvus | セルフホスト |

## 使用場面

| 場面 | 効果 |
|------|------|
| 大規模コードベース | 必要なコードのみ検索 |
| トークン節約 | 40%削減 |
| コード理解 | 関連コードを自動発見 |

## MCPツール

| ツール | 説明 |
|--------|------|
| `index` | コードベースをインデックス化 |
| `search` | 自然言語で検索 |
| `clear` | インデックスをクリア |
| `status` | インデックス状況確認 |

## 参照

- [GitHub](https://github.com/zilliztech/claude-context)
- [ローカル版](https://github.com/FarhanAliRaza/claude-context-local)
