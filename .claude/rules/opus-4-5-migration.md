---
paths: "**/*"
---

# Claude Opus 4.5 移行ルール

Sonnet 4.x / Opus 4.1 から Opus 4.5 への移行ガイドライン。

## 概要

Opus 4.5は最新のClaudeモデル。既存コードやプロンプトを移行する際のルール。

## モデル文字列

### プラットフォーム別 Opus 4.5 モデル文字列

| プラットフォーム | モデル文字列 |
|-----------------|-------------|
| Anthropic API (1P) | `claude-opus-4-5-20251101` |
| AWS Bedrock | `anthropic.claude-opus-4-5-20251101-v1:0` |
| Google Vertex AI | `claude-opus-4-5@20251101` |
| Azure AI Foundry | `claude-opus-4-5-20251101` |

### 置換対象（移行元）

| モデル | Anthropic API | AWS Bedrock | Vertex AI |
|--------|--------------|-------------|-----------|
| Sonnet 4.0 | `claude-sonnet-4-20250514` | `anthropic.claude-sonnet-4-20250514-v1:0` | `claude-sonnet-4@20250514` |
| Sonnet 4.5 | `claude-sonnet-4-5-20250929` | `anthropic.claude-sonnet-4-5-20250929-v1:0` | `claude-sonnet-4-5@20250929` |
| Opus 4.1 | `claude-opus-4-1-20250422` | `anthropic.claude-opus-4-1-20250422-v1:0` | `claude-opus-4-1@20250422` |

**注意**: Haiku 4.5 (`claude-haiku-4-5-20251001`) は移行対象外。

## Beta Headers

### 削除が必要

```python
# 1Mコンテキストベータは Opus 4.5 では未サポート
# Note: 1M context beta (context-1m-2025-08-07) not yet supported with Opus 4.5
```

`context-1m-2025-08-07` を削除し、コメントを残す。

## Effort パラメータ

Opus 4.5では `effort` パラメータを追加（推奨: `"high"`）。

| Effort | 用途 |
|--------|------|
| `high` | 最高性能、深い推論（デフォルト推奨） |
| `medium` | コスト/レイテンシと性能のバランス |
| `low` | シンプル・高ボリュームクエリ |

### 実装例

```python
response = client.messages.create(
    model="claude-opus-4-5-20251101",
    max_tokens=1024,
    betas=["effort-2025-11-24"],
    output_config={
        "effort": "high"
    },
    messages=[...]
)
```

```typescript
const response = await client.messages.create({
  model: "claude-opus-4-5-20251101",
  max_tokens: 1024,
  betas: ["effort-2025-11-24"],
  output_config: {
    effort: "high"
  },
  messages: [...]
});
```

## Opus 4.5 の行動特性と対策

### 1. ツール過剰トリガー

Opus 4.5はシステムプロンプトに敏感。過度に強調した表現を和らげる。

| Before | After |
|--------|-------|
| `CRITICAL: You MUST...` | `Use this when...` |
| `ALWAYS call...` | `Call...` |
| `You are REQUIRED to...` | `You should...` |
| `NEVER skip...` | `Don't skip...` |

### 2. 過剰エンジニアリング防止

不要なファイル作成、過度な抽象化を防ぐスニペット：

```
- Avoid over-engineering. Only make changes that are directly requested or clearly necessary.
- Don't add features, refactor code, or make "improvements" beyond what was asked.
- Don't create helpers, utilities, or abstractions for one-time operations.
- The right amount of complexity is the minimum needed for the current task.
```

### 3. コード探索の促進

コードを読まずに提案することを防ぐスニペット：

```
ALWAYS read and understand relevant files before proposing code edits.
Do not speculate about code you have not inspected.
If the user references a specific file/path, you MUST open and inspect it before explaining or proposing fixes.
```

### 4. フロントエンドデザイン品質

AIっぽい見た目を防ぐスニペット（`<frontend_aesthetics>` タグで追加）：
- 個性的なフォント選択（Inter, Arial避ける）
- 一貫したカラーテーマ
- 適切なアニメーション
- 背景に深みを持たせる

### 5. "think" 感度

Extended Thinkingが無効の場合、"think"という単語に敏感。

| Before | After |
|--------|-------|
| `think about` | `consider` |
| `think through` | `evaluate` |
| `I think` | `I believe` |
| `thinking` | `reasoning` / `considering` |

## 移行ワークフロー

1. コードベースでモデル文字列を検索
2. モデル文字列を Opus 4.5 に更新
3. 未サポートのベータヘッダーを削除
4. effort パラメータを追加（`"high"` 推奨）
5. 変更内容をまとめる
6. 問題発生時はプロンプト調整を提案

## 注意事項

- プロンプト調整は問題報告時のみ適用
- デフォルトはモデル文字列の更新のみ
- スニペット追加時は既存構造に合わせて統合

---

## 追加スキル（mnt/skills統合）

---
name: opus-4-5-migration
description: Claude Opus 4.5への移行ワークフロー
tools:
  - Bash
  - Read
  - Edit
  - Grep
  - Glob
---

# Claude Opus 4.5 移行スキル

Sonnet 4.x / Opus 4.1 から最新の Claude Opus 4.5 への移行を自動化。

## 目的

- モデル文字列の一括更新
- 未サポートベータヘッダーの削除
- effort パラメータの追加
- プロンプト最適化（必要時）

## 前提条件

- Git管理されたコードベース
- Python/TypeScript/JavaScript プロジェクト
- Anthropic SDK 使用

## ワークフロー

### Step 1: 現状分析

コードベースをスキャンして移行対象を特定：

```bash
# Anthropic API モデル文字列
grep -rn "claude-sonnet-4-20250514" .
grep -rn "claude-sonnet-4-5-20250929" .
grep -rn "claude-opus-4-1-20250422" .

# AWS Bedrock
grep -rn "anthropic.claude-sonnet-4" .
grep -rn "anthropic.claude-opus-4-1" .

# Vertex AI
grep -rn "claude-sonnet-4@" .
grep -rn "claude-opus-4-1@" .

# 未サポートベータ
grep -rn "context-1m-2025-08-07" .
```

### Step 2: モデル文字列更新

プラットフォーム別に更新：

#### Anthropic API (1P)

```python
# Before
model="claude-sonnet-4-20250514"
model="claude-opus-4-1-20250422"

# After
model="claude-opus-4-5-20251101"
```

#### AWS Bedrock

```python
# Before
model="anthropic.claude-sonnet-4-20250514-v1:0"

# After
model="anthropic.claude-opus-4-5-20251101-v1:0"
```

#### Google Vertex AI

```python
# Before
model="claude-sonnet-4@20250514"

# After
model="claude-opus-4-5@20251101"
```

#### Azure AI Foundry

```python
# Before
model="claude-sonnet-4-20250514"

# After
model="claude-opus-4-5-20251101"
```

### Step 3: ベータヘッダー削除

1Mコンテキストベータを削除してコメントを残す：

```python
# Before
betas=["context-1m-2025-08-07"]

# After
# Note: 1M context beta (context-1m-2025-08-07) not yet supported with Opus 4.5
```

### Step 4: Effort パラメータ追加

性能最大化のため effort パラメータを追加：

```python
response = client.messages.create(
    model="claude-opus-4-5-20251101",
    max_tokens=1024,
    betas=["effort-2025-11-24"],
    output_config={
        "effort": "high"
    },
    messages=[...]
)
```

```typescript
const response = await client.messages.create({
  model: "claude-opus-4-5-20251101",
  max_tokens: 1024,
  betas: ["effort-2025-11-24"],
  output_config: {
    effort: "high"
  },
  messages: [...]
});
```

### Step 5: 動作検証

```bash
# テスト実行
npm test
# または
pytest
```

### Step 6: プロンプト調整（問題発生時のみ）

Opus 4.5 の行動特性に対応：

#### ツール過剰トリガー対策

強調表現を和らげる：

| Before | After |
|--------|-------|
| `CRITICAL: You MUST...` | `Use this when...` |
| `ALWAYS call...` | `Call...` |
| `NEVER skip...` | `Don't skip...` |

#### 過剰エンジニアリング防止

以下のスニペットを追加：

```
- Avoid over-engineering. Only make changes that are directly requested.
- Don't add features beyond what was asked.
- Don't create helpers or abstractions for one-time operations.
```

#### "think" 感度対策

Extended Thinking無効時、"think"を別の表現に：

| Before | After |
|--------|-------|
| `think about` | `consider` |
| `think through` | `evaluate` |
| `I think` | `I believe` |

## Effort レベル選択ガイド

| Effort | 用途 | コスト |
|--------|------|--------|
| `high` | 最高性能、深い推論 | 高 |
| `medium` | バランス | 中 |
| `low` | シンプル・高ボリュームクエリ | 低 |

## 移行対象外

- **Haiku 4.5** (`claude-haiku-4-5-20251001`) - 移行不要

## チェックリスト

- [ ] モデル文字列スキャン完了
- [ ] モデル文字列更新完了
- [ ] 1Mベータ削除完了
- [ ] effort パラメータ追加完了
- [ ] テスト実行完了
- [ ] 動作確認完了
- [ ] (オプション) プロンプト調整完了
