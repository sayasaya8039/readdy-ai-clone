---
paths: "**/GEMINI.md, **/gemini/**, **/.gemini/**"
---

# Gemini CLI ルール

## 概要

**Gemini CLI**はGoogle製のオープンソースターミナルAIエージェント。
Gemini 2.5 Proの1Mトークンコンテキストウィンドウを活用可能。

- GitHub: https://github.com/google-gemini/gemini-cli
- スター: 89.7k+
- ライセンス: Apache 2.0

## 主な特徴

| 特徴 | 説明 |
|------|------|
| **無料枠** | 60リクエスト/分、1,000リクエスト/日 |
| **1Mコンテキスト** | Gemini 2.5 Proの大規模コンテキスト |
| **MCP対応** | Model Context Protocol統合 |
| **ビルトインツール** | Google検索、ファイル操作、シェルコマンド、Web取得 |
| **GitHub Actions** | 自動コードレビュー、Issue対応 |

## GEMINI.md

CLAUDE.mdと同様、プロジェクト固有の指示を定義するコンテキストファイル。

```markdown
# GEMINI.md

## Project Context
This is a TypeScript project using Bun.

## Code Style
- Use strict TypeScript
- Prefer functional patterns
- Use Biome for formatting

## Commands
- Build: bun run build
- Test: bun test
```

### ファイル読み込み優先順位

1. `~/.gemini/GEMINI.md` - グローバル設定
2. `./GEMINI.md` - プロジェクトルート
3. `./subdir/GEMINI.md` - サブディレクトリ

## インストール

```bash
# npm
npm install -g @anthropic-ai/gemini-cli

# Homebrew (macOS)
brew install gemini-cli
```

## 基本コマンド

| コマンド | 説明 |
|----------|------|
| `gemini` | インタラクティブモード |
| `gemini -p "prompt"` | ヘッドレス/パイプラインモード |
| `gemini chat` | チャットセッション開始 |
| `gemini code` | コーディングアシスタント |

## Claude Codeとの連携

### パイプラインモード活用

```bash
# Gemini CLIをClaude Codeから呼び出し
gemini -p "このコードをレビューして" < code.ts
```

### CLAUDE.mdへの統合

```markdown
## Gemini CLI Integration
長文コンテキスト（60K+トークン）が必要な場合：
`gemini -p` コマンドでGemini 2.5 Proの1Mコンテキストを活用
```

## Claude Code Router連携

```json
{
  "Router": {
    "longContext": "gemini,gemini-2.5-pro"
  }
}
```

## 使用場面

| 場面 | 推奨 |
|------|------|
| 大規模コードベース解析 | Gemini CLI（1Mコンテキスト） |
| 通常のコーディング | Claude Code |
| Web検索統合 | Gemini CLI（Google検索内蔵） |

## 参照

- [Gemini CLI GitHub](https://github.com/google-gemini/gemini-cli)
- [公式ドキュメント](https://google-gemini.github.io/gemini-cli/)