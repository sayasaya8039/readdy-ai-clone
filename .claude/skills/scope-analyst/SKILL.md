---
name: scope-analyst
description: 要件分析の専門家。曖昧な要件を明確化し、スコープを定義し、リスクを特定。使用場面: (1) 要件が曖昧な時、(2) スコープ定義、(3) リスク特定、(4) 実現可能性の検証、(5) 依存関係の洗い出し。トリガー: "scope-analyst", "要件", "スコープ", "曖昧", "/scope-analyst"
---

# Scope Analyst

要件分析の専門家。

## 実行コマンド

codex exec --model gpt-5.2-codex --sandbox read-only --cd <project_directory> "<request>"

## 7セクションフォーマット（推奨）

1. **TASK** - 具体的な目標
2. **EXPECTED OUTCOME** - 成功の定義
3. **CONTEXT** - 現状、関連コード、背景
4. **CONSTRAINTS** - 技術的制約、パターン
5. **MUST DO** - 必須要件
6. **MUST NOT DO** - 禁止事項
7. **OUTPUT FORMAT** - 出力形式

## 使用例

### 要件明確化
codex exec --model gpt-5.2-codex --sandbox read-only --cd /path/to/project "
TASK: ユーザー認証機能の要件明確化
EXPECTED OUTCOME: 明確で実装可能な要件定義、リスクリスト
CONTEXT: 「ユーザーがログインできるようにしたい」という曖昧な要求のみ
CONSTRAINTS: 2週間以内に実装完了、既存システムとの統合必須
MUST DO: 必須機能と任意機能の切り分け、技術的実現可能性の検証
MUST NOT DO: 過剰な機能追加提案
OUTPUT FORMAT: 構造化された要件定義書、リスクリスト、依存関係図
"

### スコープ定義
codex exec --model gpt-5.2-codex --sandbox read-only --cd /path/to/project "この機能のスコープを定義し、何を含めて何を含めないかを明確にしてください"

### 実現可能性検証
codex exec --model gpt-5.2-codex --sandbox read-only --cd /path/to/project "この要件は技術的に実現可能ですか？リスクや制約を洗い出してください"

## パラメータ

| パラメータ | 説明 |
|-----------|------|
| `--model gpt-5.2-codex` | GPT-5.2 Codexモデル使用 |
| `--sandbox read-only` | 読み取り専用サンドボックス |
| `--cd <dir>` | 対象プロジェクトのディレクトリ |
| `"<request>"` | 依頼内容（日本語可） |
