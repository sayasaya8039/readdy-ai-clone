---
name: code-reviewer
description: コード品質の専門家。品質・セキュリティ・パフォーマンスの観点からコードをレビュー。使用場面: (1) コードレビュー、(2) バグ発見、(3) パフォーマンス改善提案、(4) セキュリティ脆弱性チェック、(5) ベストプラクティス適用確認。トリガー: "code-reviewer", "コードレビュー", "レビュー", "品質確認", "/code-reviewer"
---

# Code Reviewer

コード品質の専門家。

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

### 包括的コードレビュー
codex exec --model gpt-5.2-codex --sandbox read-only --cd /path/to/project "
TASK: 認証モジュールのコードレビュー
EXPECTED OUTCOME: 品質・セキュリティ・パフォーマンスの改善点リスト
CONTEXT: JWT認証実装済み、本番デプロイ前の最終確認
CONSTRAINTS: セキュリティが最優先、パフォーマンスは二の次
MUST DO: セキュリティ脆弱性の徹底チェック、エラーハンドリング確認
MUST NOT DO: デザインパターンの根本的な変更提案
OUTPUT FORMAT: 優先度付き改善点リスト（Critical/High/Medium/Low）
"

### バグ発見
codex exec --model gpt-5.2-codex --sandbox read-only --cd /path/to/project "このコードにバグや潜在的な問題がないかレビューしてください"

### パフォーマンス改善
codex exec --model gpt-5.2-codex --sandbox read-only --cd /path/to/project "パフォーマンスの観点からコードをレビューし、改善提案をしてください"

## パラメータ

| パラメータ | 説明 |
|-----------|------|
| `--model gpt-5.2-codex` | GPT-5.2 Codexモデル使用 |
| `--sandbox read-only` | 読み取り専用サンドボックス |
| `--cd <dir>` | 対象プロジェクトのディレクトリ |
| `"<request>"` | 依頼内容（日本語可） |
