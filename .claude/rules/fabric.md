---
paths: "**/fabric/**, **/prompts/**"
---

# fabric ルール

## 概要

**fabric**はAIでヒューマン能力を拡張するオープンソースフレームワーク。
クラウドソースされたAIプロンプト（Patterns）をどこでも使用可能。

GitHub: https://github.com/danielmiessler/fabric (36,800+ stars)

## インストール

```bash
# Go経由
go install github.com/danielmiessler/fabric@latest

# pipx経由
pipx install fabric-ai
```

## 初期設定

```bash
# 初期化（APIキー設定）
fabric --setup
```

## 基本使用法

### パイプラインでの使用

```bash
# テキスト要約
cat article.txt | fabric --pattern summarize

# YouTube動画の要約
yt --transcript "https://youtube.com/..." | fabric --pattern summarize

# コード分析
cat code.py | fabric --pattern analyze_code
```

## 主要Patterns

| Pattern | 用途 |
|---------|------|
| summarize | テキスト要約 |
| extract_wisdom | 重要ポイント抽出 |
| analyze_code | コード分析 |
| improve_writing | 文章改善 |
| create_summary | 構造化要約 |
| extract_insights | インサイト抽出 |
| rate_content | コンテンツ評価 |

## Claude Code連携

### fabricをClaude Codeから呼び出し

```bash
# Claude Code内で
fabric --pattern summarize --text "$(cat README.md)"
```

### カスタムPattern作成

```bash
mkdir -p ~/.config/fabric/patterns/my_pattern
# system.mdにプロンプトを記述
```

## 対応LLMプロバイダー

| プロバイダー | 設定 |
|-------------|------|
| OpenAI | OPENAI_API_KEY |
| Anthropic | ANTHROPIC_API_KEY |
| Ollama | OLLAMA_HOST |
| Azure | AZURE_OPENAI_* |
| AWS Bedrock | AWS認証情報 |
| Together AI | TOGETHER_API_KEY |

## 高度な使用法

### モデル指定

```bash
fabric --pattern summarize --model claude-3-5-sonnet
```

## ユースケース

1. **コンテンツ要約** - 記事、動画、ポッドキャスト
2. **コードレビュー** - 自動コード分析
3. **文章改善** - ブログ、ドキュメント
4. **学習** - 技術書籍の要約・整理
