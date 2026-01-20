---
paths: "**/spec/**, **/specs/**, **/speckit/**, **/.specify/**"
---

# Spec Kit - 仕様駆動開発（GitHub公式）

## 概要

**Spec Kit**はGitHub公式の仕様駆動開発ツールキット。
仕様から実装を生成する革新的アプローチで高品質なソフトウェアを迅速に構築。

## 特徴

| 特徴 | 説明 |
|------|------|
| **仕様駆動** | 仕様が実行可能になり直接実装を生成 |
| **AI統合** | Claude, Gemini, Copilot, Cursor等 20+エージェント対応 |
| **体系的プロセス** | 7段階の構造化された開発ワークフロー |

## インストール

```bash
# 推奨（永続インストール）
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# プロジェクト初期化（Windows: PYTHONUTF8=1 必須）
PYTHONUTF8=1 specify init <PROJECT_NAME> --ai claude --ignore-agent-tools --script sh

# 一時的な使用
uvx --from git+https://github.com/github/spec-kit.git specify init <PROJECT_NAME>
```

## ワークフロー

```
┌─────────────────────────────────────────────────────────────────┐
│  1. /speckit.constitution  →  プロジェクトの原則・ルールを定義  │
│           ↓                                                     │
│  2. /speckit.specify       →  何を作るか仕様を記述              │
│           ↓                                                     │
│  3. /speckit.plan          →  技術設計・アーキテクチャ策定      │
│           ↓                                                     │
│  4. /speckit.tasks         →  実装タスクに分解                  │
│           ↓                                                     │
│  5. /speckit.implement     →  コード生成・実装                  │
└─────────────────────────────────────────────────────────────────┘
```

## 各コマンドの詳細

| コマンド | 入力 | 出力 |
|----------|------|------|
| `/speckit.constitution` | プロジェクトの目的・制約 | `.specify/memory/constitution.md` |
| `/speckit.specify` | 機能要件（自然言語） | `spec.md` |
| `/speckit.plan` | spec.md | `plan.md`（技術設計） |
| `/speckit.tasks` | plan.md | `tasks.md`（タスク一覧） |
| `/speckit.implement` | tasks.md | 実際のコード |

## オプションコマンド

| コマンド | 用途 | タイミング |
|----------|------|------------|
| `/speckit.clarify` | 曖昧な箇所を質問形式で明確化 | plan前 |
| `/speckit.checklist` | 品質チェックリスト生成 | plan後 |
| `/speckit.analyze` | 成果物間の整合性チェック | implement前 |
| `/speckit.taskstoissues` | タスクをGitHub Issuesに変換 | tasks後 |

## プロジェクト構成

```
my-app/
├── .claude/
│   └── commands/
│       ├── speckit.constitution.md
│       ├── speckit.specify.md
│       ├── speckit.plan.md
│       ├── speckit.tasks.md
│       ├── speckit.implement.md
│       ├── speckit.clarify.md      (optional)
│       ├── speckit.analyze.md      (optional)
│       ├── speckit.checklist.md    (optional)
│       └── speckit.taskstoissues.md
├── .specify/
│   ├── memory/
│   │   └── constitution.md
│   └── templates/
│       ├── spec-template.md
│       ├── plan-template.md
│       ├── tasks-template.md
│       └── checklist-template.md
└── .git/
```

## 使用例

```bash
cd ~/my-app

# 1. 原則策定
/speckit.constitution
# → 「TypeScript使用」「テスト必須」等のルールを定義

# 2. 仕様記述
/speckit.specify
# → 「ユーザー登録機能を作りたい」等を自然言語で記述

# 3. 技術計画
/speckit.plan
# → APIエンドポイント、DB設計等が自動生成

# 4. タスク分解
/speckit.tasks
# → 「User モデル作成」「POST /register 実装」等に分解

# 5. 実装
/speckit.implement
# → 各タスクを順番に実装
```

## 必要環境

| 要件 | バージョン |
|------|-----------|
| Python | 3.11+ |
| uv | 最新 |
| Git | 最新 |
| AI Agent | Claude, Gemini, Copilot等 |

## リポジトリ

- GitHub: https://github.com/github/spec-kit
- ライセンス: MIT
