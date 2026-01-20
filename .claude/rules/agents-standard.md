---
paths: "**/AGENTS.md, **/agents.md, **/.github/**"
---

# AGENTS.md 標準規格（必須）

## 概要

**AGENTS.md**はAIコーディングエージェント向けのオープン標準フォーマット（13,000+ stars）。
60,000以上のOSSプロジェクトで採用。Linux Foundation傘下のAgentic AI Foundationが管理。

## 目的

| ファイル | 対象 | 内容 |
|---------|------|------|
| README.md | 人間 | クイックスタート、説明、貢献ガイド |
| **AGENTS.md** | AIエージェント | ビルド手順、テスト、コーディング規約 |

## 対応ツール

| ツール | サポート状況 |
|--------|-------------|
| Claude Code | シンボリックリンク経由 |
| GitHub Copilot | ネイティブ対応 |
| OpenAI Codex | ネイティブ対応 |
| OpenCode | ネイティブ対応 |
| Cursor | シンボリックリンク経由 |
| Amp | ネイティブ対応 |
| Gemini CLI | シンボリックリンク経由 |
| Windsurf | ネイティブ対応 |
| Replit | ネイティブ対応 |

## CLAUDE.mdとの関係

| ファイル | 用途 |
|----------|------|
| CLAUDE.md | Claude Code専用設定 |
| AGENTS.md | 全AIエージェント共通設定 |

**両方を配置することで最大の互換性を確保。**

## ファイル配置

project/
├── AGENTS.md              # ルートレベル（プロジェクト全体）
├── src/
│   └── AGENTS.md          # サブディレクトリ（src固有の指示）
└── tests/
    └── AGENTS.md          # サブディレクトリ（テスト固有の指示）

**エージェントは最も近いAGENTS.mdを参照**（.gitignoreと同様の動作）

## 書き方のベストプラクティス

### 1. コマンドを先頭に
ビルド・テストコマンドをファイル先頭に配置。

### 2. コード例を含める
説明より実際のコードスニペットが効果的。

### 3. 境界を明確に
触れてはいけないファイル・ディレクトリを明記。

### 4. サブディレクトリ対応
プロジェクト内の各ディレクトリに固有のAGENTS.mdを配置可能。

## 必須ルール

| ルール | 内容 |
|--------|------|
| **両方配置** | CLAUDE.mdとAGENTS.md両方を配置 |
| **コマンド優先** | ビルド・テストコマンドを先頭に |
| **禁止領域明記** | 触れてはいけないファイルを明記 |

## リンク

- 公式サイト: https://agents.md
- GitHub: https://github.com/agentsmd/agents.md
- OpenAI ガイド: https://developers.openai.com/codex/guides/agents-md/
- GitHubブログ: https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/
