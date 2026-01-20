---
paths: "**/*"
---

# PAL MCP Server ルール

## 概要

**PAL MCP Server**はマルチモデルMCPサーバー。
Claude Code, GeminiCLI, CodexCLIから複数AIモデルを統一インターフェースで使用。

GitHub: https://github.com/BeehiveInnovations/pal-mcp-server (10,000+ stars)

## 対応プロバイダー

| プロバイダー | モデル例 |
|-------------|---------|
| Anthropic | Claude 3.5, Claude 4 |
| OpenAI | GPT-4o, GPT-5, O3 |
| Google | Gemini Pro, Gemini Flash |
| Azure | Azure OpenAI |
| Grok | xAI Grok |
| Ollama | ローカルモデル |
| OpenRouter | 50+モデル |

## インストール

```bash
git clone https://github.com/BeehiveInnovations/pal-mcp-server.git
cd pal-mcp-server
./run-server.sh
```

自動でClaude Desktop, Claude Code等を検出・設定。

## 主な機能

### CLIサブエージェント

Claude CodeからCodex/Gemini CLIサブエージェントを起動可能。
重いタスクを別コンテキストにオフロード。

### マルチモデルオーケストレーション

```
Claude → Gemini Pro（分析）
      → O3（推論）
      → GPT-5（生成）
```

タスクに最適なモデルを自動選択。

### コンテキスト拡張

Claudeのコンテキストが一杯になったら、
Gemini Pro（100万トークン）にハンドオフ可能。

### コンテキスト復活

他モデルが会話を「思い出させる」ことで、
コンテキストリセット後もシームレスに継続。

## 使用場面

| 場面 | PAL MCPの活用 |
|------|--------------|
| 長文処理 | Gemini Proにハンドオフ |
| 高速処理 | Gemini Flash使用 |
| 強い推論 | O3使用 |
| プライバシー重視 | Ollama使用 |
| コードレビュー | マルチパス分析 |

## Claude Code Router (CCR) との併用

CCRとPAL MCPは補完関係：
- CCR: リクエストルーティング
- PAL MCP: サブエージェント・マルチモデル協調

両方の設定が可能。
