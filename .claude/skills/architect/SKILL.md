---
name: architect
description: システム設計・アーキテクチャ決定の専門家。トレードオフ分析、設計決定、大規模システム設計に強い。使用場面: (1) システム設計決定、(2) アーキテクチャ選択、(3) トレードオフ分析、(4) 設計レビュー、(5) 技術選定。トリガー: "architect", "設計", "アーキテクチャ", "トレードオフ", "/architect"
---

# Architect

システム設計・アーキテクチャ決定の専門家。

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

### システム設計相談
codex exec --model gpt-5.2-codex --sandbox read-only --cd /path/to/project "
TASK: 認証システムのアーキテクチャ設計
EXPECTED OUTCOME: セキュリティと拡張性を考慮した設計提案
CONTEXT: 現在JWT認証を検討中、マイクロサービス構成
CONSTRAINTS: 既存APIとの互換性維持、1000万ユーザー想定
MUST DO: セキュリティベストプラクティス適用、スケーラビリティ確保
MUST NOT DO: 既存エンドポイントの破壊的変更
OUTPUT FORMAT: 設計図、トレードオフ分析、実装手順
"

### トレードオフ分析
codex exec --model gpt-5.2-codex --sandbox read-only --cd /path/to/project "MongoDBとPostgreSQLのトレードオフを分析し、このプロジェクトに最適なDBを推奨してください"

## パラメータ

| パラメータ | 説明 |
|-----------|------|
| `--model gpt-5.2-codex` | GPT-5.2 Codexモデル使用 |
| `--sandbox read-only` | 読み取り専用サンドボックス |
| `--cd <dir>` | 対象プロジェクトのディレクトリ |
| `"<request>"` | 依頼内容（日本語可） |
