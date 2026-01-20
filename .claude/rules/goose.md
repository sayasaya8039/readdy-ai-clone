---
paths: "**/.goose/**"
---

Block製Goose AIエージェントを操作します。

## Gooseとは

- Block製ローカル・拡張可能AIエージェント
- 自律的にプロジェクト構築・デバッグ・テスト実行
- GitHub: 24,000+ stars

## サブコマンド

### `/goose start`

Gooseを起動

```bash
goose
```

### `/goose run [タスク]`

特定タスクを自律実行

```bash
goose run "新しいReactプロジェクトを作成"
```

### `/goose config`

設定を確認・編集

## インストール

```bash
# macOS/Linux
curl -fsSL https://github.com/block/goose/releases/latest/download/download_cli.sh | sh

# Windows
irm https://github.com/block/goose/releases/latest/download/download_cli.ps1 | iex
```

## 使用例

```
/goose run プロジェクトのテストを実行して失敗を修正
/goose run README.mdを作成
/goose run APIエンドポイントを追加
```

$ARGUMENTS でタスクを指定。

---

## 追加ルール（rules統合）

# Goose 開発ルール

## 概要

**Goose**はBlock製のローカル・拡張可能なオープンソースAIエージェント。
エンジニアリングタスクを自律的に実行。

GitHub: https://github.com/block/goose (24,000+ stars)

## インストール

```bash
# macOS/Linux
curl -fsSL https://github.com/block/goose/releases/latest/download/download_cli.sh | sh

# Windows PowerShell
irm https://github.com/block/goose/releases/latest/download/download_cli.ps1 | iex

# Docker
docker pull ghcr.io/block/goose:latest
```

## 主な特徴

| 特徴 | 説明 |
|------|------|
| **自律タスク実行** | プロジェクト全体を構築可能 |
| **LLM柔軟性** | 任意のLLMを使用可能 |
| **MCP統合** | Model Context Protocol対応 |
| **デュアルインターフェース** | デスクトップアプリ＆CLI |
| **コード操作** | インストール・実行・編集・テスト |

## 使用場面

| 場面 | Gooseの活用 |
|------|------------|
| プロジェクト構築 | 全体を自律的に生成 |
| デバッグ | 問題を特定して修正 |
| ワークフロー | 複数タスクをオーケストレーション |
| API連携 | 外部APIと自律的に対話 |

## Claude Codeとの使い分け

| タスク | 推奨ツール |
|--------|-----------|
| 対話的コーディング | Claude Code |
| 自律的プロジェクト構築 | Goose |
| MCP拡張 | 両方対応 |
| ローカルLLM使用 | Goose |

## ドキュメント

- 公式: https://block.github.io/goose/
- Discord: Block Gooseコミュニティ
