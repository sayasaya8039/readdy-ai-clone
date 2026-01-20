---
paths: "**/opencode/**"
---

# OpenCode AIコーディングエージェント

## 概要

**OpenCode**はSST製オープンソースAIコーディングエージェント。
ターミナルベースで動作し、Claude/OpenAI/Google/ローカルモデルに対応。

- GitHub: https://github.com/sst/opencode
- **41,000+ stars** / 450+ contributors
- **400,000+** 月間アクティブユーザー

## 主な特徴

| 特徴 | 説明 |
|------|------|
| **プロバイダー非依存** | Claude, OpenAI, Google, Ollama対応 |
| **TUIフォーカス** | Bubble Tea製ターミナルUI |
| **MCPサポート** | Model Context Protocol対応 |
| **LSPサポート** | Language Server Protocol統合 |
| **クライアント/サーバー** | モバイルアプリからリモート制御可能 |
| **デスクトップアプリ** | GUI版も利用可能 |

## インストール

```bash
# npm（推奨）
npm i -g opencode-ai@latest

# Homebrew (macOS/Linux)
brew install opencode

# curl
curl -fsSL https://opencode.ai/install.sh | sh

# Windows (scoop)
scoop install opencode

# Windows (chocolatey)
choco install opencode
```

## エージェントモード

| モード | 説明 | 用途 |
|--------|------|------|
| `build` | フルアクセス開発 | コード作成・編集・実行 |
| `plan` | 読み取り専用分析 | コードレビュー・設計 |

**Tab**キーでエージェント切り替え。

## MCPサポート

OpenCodeはMCPを実装し、外部ツールとの連携が可能。

```bash
# MCP設定
opencode config mcp add <server-name>
```

## @general サブエージェント

複雑な検索やマルチステップタスクを処理。

## Claude Code との比較

| 機能 | Claude Code | OpenCode |
|------|------------|----------|
| プロバイダー | Claude専用 | マルチプロバイダー |
| UI | TUI | TUI + デスクトップ |
| MCP | ✅ | ✅ |
| ライセンス | プロプライエタリ | オープンソース |

## 使用場面

| 場面 | 推奨 |
|------|------|
| マルチモデル切り替え | OpenCode |
| ローカルモデル使用 | OpenCode + Ollama |
| オープンソース必須 | OpenCode |

## 参照

- [公式サイト](https://opencode.ai)
- [GitHub](https://github.com/sst/opencode)
- [ドキュメント](https://opencode.ai/docs)
