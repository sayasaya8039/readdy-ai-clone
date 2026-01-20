---
name: security-analyst
description: セキュリティ専門家。脆弱性診断、脅威モデリング、セキュリティベストプラクティス適用を支援。使用場面: (1) セキュリティ脆弱性診断、(2) 脅威モデリング、(3) 認証・認可の設計レビュー、(4) データ保護の検証、(5) セキュリティ監査。トリガー: "security-analyst", "セキュリティ", "脆弱性", "脅威", "/security-analyst"
---

# Security Analyst

セキュリティ専門家。

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

### 脆弱性診断
codex exec --model gpt-5.2-codex --sandbox read-only --cd /path/to/project "
TASK: 認証システムのセキュリティ脆弱性診断
EXPECTED OUTCOME: OWASP Top 10に基づく脆弱性リストと修正提案
CONTEXT: JWT認証実装済み、本番デプロイ前の最終確認
CONSTRAINTS: 修正は1週間以内に完了必須
MUST DO: SQLインジェクション、XSS、CSRF、認証バイパスのチェック
MUST NOT DO: パフォーマンスに大きく影響する変更提案
OUTPUT FORMAT: CVSSスコア付き脆弱性リスト、修正優先度、具体的な修正方法
"

### 脅威モデリング
codex exec --model gpt-5.2-codex --sandbox read-only --cd /path/to/project "このシステムの脅威モデリングを実施し、潜在的な攻撃シナリオを特定してください"

### 認証・認可レビュー
codex exec --model gpt-5.2-codex --sandbox read-only --cd /path/to/project "認証・認可の実装をレビューし、セキュリティ上の問題を指摘してください"

## パラメータ

| パラメータ | 説明 |
|-----------|------|
| `--model gpt-5.2-codex` | GPT-5.2 Codexモデル使用 |
| `--sandbox read-only` | 読み取り専用サンドボックス |
| `--cd <dir>` | 対象プロジェクトのディレクトリ |
| `"<request>"` | 依頼内容（日本語可） |
