# SKILLS.md - Claude Code スキル定義

## 概要

このファイルはClaude Codeが使用するスキル（ワークフロー）を定義します。
コンテキスト圧縮後も維持される必須スキルです。

---

## 🔴🔴🔴【絶対必須 - Tier 0】/codex スキル

> ⚠️ **/codex（Codex CLI）は最優先のAI委任システム**
> ⚠️ **このルールはコンテキスト圧縮後も絶対に維持すること**

### スキル概要

| 項目 | 内容 |
|------|------|
| **スキル名** | /codex (Codex CLI) |
| **目的** | GPTエキスパートへの委任による高品質な開発 |
| **必須度** | 絶対遵守（例外なし） |
| **優先度** | Tier 0（最優先） |

### 🔴 GPTエキスパート委任（最優先・絶対遵守）

| 場面 | GPTエキスパート | 実行方法 | 説明 |
|------|----------------|----------|------|
| **システム設計・アーキテクチャ** | **Architect** | `/architect` または `codex exec` | トレードオフ分析、設計決定 |
| **作業計画のレビュー** | **Plan Reviewer** | `/plan-reviewer` または `codex exec` | 計画の完全性・明確性検証 |
| **要件が曖昧な時** | **Scope Analyst** | `/scope-analyst` または `codex exec` | 要件分析、リスク特定 |
| **コードレビュー・バグ発見** | **Code Reviewer** | `/code-reviewer` または `codex exec` | 品質・セキュリティ・パフォーマンス |
| **セキュリティ懸念** | **Security Analyst** | `/security-analyst` または `codex exec` | 脆弱性診断、脅威モデリング |

### 🔴 7セクションフォーマット（必須）

すべての委任プロンプトに含める項目：

1. **TASK** - 具体的な目標
2. **EXPECTED OUTCOME** - 成功の定義
3. **CONTEXT** - 現状、関連コード、背景
4. **CONSTRAINTS** - 技術的制約、パターン
5. **MUST DO** - 必須要件
6. **MUST NOT DO** - 禁止事項
7. **OUTPUT FORMAT** - 出力形式

### 委任モード

| モード | サンドボックス | 用途 |
|--------|--------------|------|
| **Advisory** | read-only | 分析、推奨、レビュー |
| **Implementation** | workspace-write | 変更実行、修正 |

### 委任フロー

1. タスク開始 → Architect に設計相談【必須】
2. 計画作成後 → Plan Reviewer で検証【必須】
3. 実装完了後 → Code Reviewer でレビュー【必須】
4. セキュリティ懸念時 → Security Analyst で診断【必須】
5. 最終判断 → Claude が全意見を統合して決定

### ✅ 日本語プロンプト対応

> **GPTエキスパートへの問いかけは日本語・英語どちらでもOK**
> （2026年1月16日テスト済み：日本語プロンプト完全対応確認）

---

## 🟢【Tier 1】個別GPTエキスパートSkills（Codex CLI版）

> **Zenn記事アプローチ：MCPの可視性問題を解決**
> **出典**: https://zenn.dev/owayo/articles/63d325934ba0de

### MCP vs Skill アプローチの違い

| 項目 | MCP (mcp__codex__codex) | Skill (codex exec) |
|------|--------------------------|---------------------|
| **進捗表示** | ❌ なし（ブラックボックス） | ✅ リアルタイム表示 |
| **実行時間** | 10分～1時間待ち | 同じだが進捗が見える |
| **中断** | ❌ 不可 | ✅ 可能（Ctrl+C） |
| **エラー表示** | ❌ 見えない | ✅ ターミナルに表示 |
| **デバッグ** | ❌ 困難 | ✅ 容易 |

### 6つの個別Skills

| Skill | スラッシュコマンド | 説明 |
|-------|-------------------|------|
| **codex** | `/codex` | 汎用コードレビュー・分析 |
| **architect** | `/architect` | システム設計・アーキテクチャ決定 |
| **plan-reviewer** | `/plan-reviewer` | 実装計画の検証 |
| **code-reviewer** | `/code-reviewer` | コード品質・バグ発見 |
| **security-analyst** | `/security-analyst` | 脆弱性診断・脅威モデリング |
| **scope-analyst** | `/scope-analyst` | 要件分析・スコープ明確化 |

### 使用方法

#### スラッシュコマンド（推奨）

```bash
# システム設計相談
/architect

# コードレビュー依頼
/code-reviewer

# セキュリティチェック
/security-analyst
```

#### 手動実行

```bash
# 基本形式
codex exec --model gpt-5.2-codex --sandbox read-only --cd <project_dir> "<request>"

# 例：コードレビュー
codex exec --model gpt-5.2-codex --sandbox read-only --cd /path/to/project "このコードをレビューして、改善点を指摘してください"
```

### 各Skillの詳細

#### 1. `/codex` - 汎用コードレビュー

```bash
codex exec --full-auto --sandbox read-only --cd <project_directory> "<request>"
```

**使用場面**:
- コードベース全体の分析
- バグの調査
- リファクタリング提案
- 解消が難しい問題の調査

#### 2. `/architect` - システム設計

```bash
codex exec --model gpt-5.2-codex --sandbox read-only --cd <project_directory> "<design_request>"
```

**使用場面**:
- システム設計決定
- アーキテクチャ選択
- トレードオフ分析
- 技術選定

**7セクションフォーマット推奨**

#### 3. `/plan-reviewer` - 計画検証

```bash
codex exec --model gpt-5.2-codex --sandbox read-only --cd <project_directory> "<plan_review_request>"
```

**使用場面**:
- 実装計画のレビュー
- タスク分解の検証
- 依存関係の確認
- 曖昧性の特定

#### 4. `/code-reviewer` - コード品質

```bash
codex exec --model gpt-5.2-codex --sandbox read-only --cd <project_directory> "<code_review_request>"
```

**使用場面**:
- コード品質チェック
- バグ発見
- ベストプラクティス検証
- パフォーマンス改善提案

#### 5. `/security-analyst` - セキュリティ

```bash
codex exec --model gpt-5.2-codex --sandbox read-only --cd <project_directory> "<security_check_request>"
```

**使用場面**:
- 脆弱性診断
- OWASP Top 10チェック
- 脅威モデリング
- CVSS スコアリング

#### 6. `/scope-analyst` - 要件分析

```bash
codex exec --model gpt-5.2-codex --sandbox read-only --cd <project_directory> "<scope_analysis_request>"
```

**使用場面**:
- 曖昧な要件の明確化
- スコープ境界の定義
- リスク特定
- 追加質問の生成

### 実行例

```bash
# システム設計の相談
/architect
# プロンプト: "このWebアプリケーションのデータベース設計について、スケーラビリティとコストのトレードオフを分析してください"

# 計画のレビュー
/plan-reviewer
# プロンプト: "この実装計画に不足している項目や依存関係の問題がないか検証してください"

# コードレビュー
/code-reviewer
# プロンプト: "認証処理のコードをレビューして、セキュリティ上の問題を指摘してください"
```

---

## 🟢【有効】Perplexity スキル

> **Web検索・調査専用**

### スキル概要

| 項目 | 内容 |
|------|------|
| **スキル名** | perplexity-search |
| **目的** | 事実確認・最新情報の調査 |
| **MCPツール** | ask_perplexity |

### 使用場面

| 場面 | 説明 |
|------|------|
| **事実確認** | 最新の技術情報、ライブラリバージョン等 |
| **調査** | APIドキュメント、ベストプラクティス検索 |

---

<!--
## 🟡【無効化】multi-ai-collaboration スキル

以下のツールは現在無効化されています：

| ツール | 説明 |
|--------|------|
| ask_gemini | 設計・アーキテクチャ相談 |
| ask_zai | コードレビュー |
| ask_grok / grok_brainstorm | 創造的アイデア出し |
| ask_openai | 補助的な意見 |
| ask_all_ais | 全AIに同じ質問 |
| ai_consensus | コンセンサス取得 |
-->

---

## スキル発動条件

| スキル | 発動条件 | 優先度 |
|--------|----------|--------|
| **/codex (Codex CLI)** | 設計・計画・レビュー・セキュリティ | 🔴 Tier 0（最優先） |
| **個別GPTエキスパートSkills** | 同上（可視性が必要な場合） | 🟢 Tier 1（推奨） |
| **perplexity-search** | Web検索・調査 | 🟢 有効 |
| **python-performance** | .py ファイル編集時 | 該当時必須 |
| **go-development** | .go ファイル編集時 | 該当時必須 |
| **language-selection** | 新規プロジェクト作成時 | 該当時必須 |

---

## 🔴 コンテキスト圧縮後も絶対忘れないルール

```
╔══════════════════════════════════════════════════════════════╗
║  【Tier 0 - 最優先】/codex (Codex CLI)                       ║
║  ▶ 設計・アーキテクチャ → Architect に委任                  ║
║  ▶ 計画レビュー → Plan Reviewer に委任                      ║
║  ▶ コードレビュー → Code Reviewer に委任                    ║
║  ▶ セキュリティ → Security Analyst に委任                   ║
║  実行方法: スラッシュコマンド (/architect 等) or codex exec ║
║  【NEW】個別Skills: /architect /code-reviewer 等            ║
║  日本語プロンプト: ✅ 完全対応                              ║
╚══════════════════════════════════════════════════════════════╝
```

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2026年1月18日 | **個別GPTエキスパートSkills追加（Zenn記事アプローチ）** |
| 2026年1月18日 | **Codex CLI版Skills: /codex, /architect, /plan-reviewer, /code-reviewer, /security-analyst, /scope-analyst** |
| 2026年1月16日 | /codex 日本語プロンプト完全対応確認、Tier 0 サマリーブロック追加 |
| 2026年1月16日 | multi-AI を Perplexity 以外コメントアウト |
| 2026年1月15日 | /codex を Tier 0 最優先に変更 |
