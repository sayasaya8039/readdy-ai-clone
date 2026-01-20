---
name: plan-reviewer
description: 作業計画の検証専門家。計画の完全性・明確性を検証し、見落としや曖昧さを指摘。使用場面: (1) 実装計画レビュー、(2) タスク分解の妥当性確認、(3) 依存関係の検証、(4) リスク特定、(5) スコープ確認。トリガー: "plan-reviewer", "計画", "レビュー", "タスク分解", "/plan-reviewer"
---

# Plan Reviewer

作業計画の検証専門家。

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

### 実装計画レビュー
codex exec --model gpt-5.2-codex --sandbox read-only --cd /path/to/project "
TASK: 認証機能実装計画のレビュー
EXPECTED OUTCOME: 計画の見落とし・曖昧さの指摘、改善提案
CONTEXT: JWT認証実装予定、以下の計画を作成済み（計画内容を記載）
CONSTRAINTS: 2週間以内に実装完了、既存APIへの影響最小化
MUST DO: セキュリティリスクの洗い出し、依存関係の確認
MUST NOT DO: 計画の大幅な変更提案（微調整のみ）
OUTPUT FORMAT: 問題点リスト、優先度付き改善提案
"

### タスク分解の検証
codex exec --model gpt-5.2-codex --sandbox read-only --cd /path/to/project "この実装計画のタスク分解は適切ですか？見落としや曖昧な部分を指摘してください"

## パラメータ

| パラメータ | 説明 |
|-----------|------|
| `--model gpt-5.2-codex` | GPT-5.2 Codexモデル使用 |
| `--sandbox read-only` | 読み取り専用サンドボックス |
| `--cd <dir>` | 対象プロジェクトのディレクトリ |
| `"<request>"` | 依頼内容（日本語可） |
