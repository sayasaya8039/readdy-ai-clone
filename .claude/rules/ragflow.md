---
paths: "**/rag/**, **/ragflow/**"
---

# RAGFlow ルール

## 概要

**RAGFlow**はRAG（検索拡張生成）とエージェント機能を融合したオープンソースエンジン。
LLMに高品質なコンテキストレイヤーを提供。

GitHub: https://github.com/infiniflow/ragflow (~70,000 stars)

## 主な機能

| 機能 | 説明 |
|------|------|
| Deep Document Understanding | PDF/Word/PPTの深い理解 |
| Chunking Strategy | 複数のチャンキング戦略 |
| Agentic Workflow | エージェントワークフロー |
| MCP Support | MCPプロトコル対応 |

## MCPによるClaude Code連携

### MCP設定

```json
{
  "mcpServers": {
    "ragflow": {
      "command": "uvx",
      "args": ["ragflow-mcp-server"],
      "env": {
        "RAGFLOW_BASE_URL": "http://localhost:9380",
        "RAGFLOW_API_KEY": "your-api-key"
      }
    }
  }
}
```

### MCPツール

| ツール | 説明 |
|--------|------|
| query_knowledge | ナレッジベース検索 |
| upload_document | ドキュメントアップロード |
| list_datasets | データセット一覧 |

## セットアップ

### Docker Compose

```bash
git clone https://github.com/infiniflow/ragflow.git
cd ragflow/docker
docker compose up -d
```

## ナレッジベース構築

### ドキュメント対応形式

| 形式 | 拡張子 |
|------|--------|
| PDF | .pdf |
| Word | .docx, .doc |
| PowerPoint | .pptx, .ppt |
| Excel | .xlsx, .xls |
| テキスト | .txt, .md |
| 画像 | .png, .jpg (OCR) |

### チャンキング戦略

| 戦略 | 用途 |
|------|------|
| Naive | 固定長分割 |
| Paper | 学術論文向け |
| Book | 書籍向け |
| QA | Q&A形式 |
| Table | 表データ |

## ユースケース

1. **社内ナレッジ検索** - 社内文書のRAG
2. **カスタマーサポート** - FAQ + 製品マニュアル
3. **法務** - 契約書分析
4. **研究** - 論文検索・要約
