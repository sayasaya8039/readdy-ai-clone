---
paths: "**/README.md"
---

プロジェクト構造を分析してREADME.mdを自動生成します。

## 実行内容

### 1. プロジェクト分析
- ディレクトリ構造
- package.json / pyproject.toml / Cargo.toml
- 主要ファイル・エントリポイント
- 依存関係

### 2. README生成
- プロジェクト名・説明
- インストール方法
- 使い方
- ディレクトリ構造
- ライセンス

### 3. 保存
- 既存README.mdのバックアップ
- 新しいREADME.mdを作成

## READMEテンプレート

```markdown
# プロジェクト名

簡潔な説明（1-2文）

## 機能

- 機能1
- 機能2

## インストール

\`\`\`bash
# コマンド
\`\`\`

## 使い方

\`\`\`bash
# 基本的な使い方
\`\`\`

## ディレクトリ構造

\`\`\`
project/
├── src/
└── ...
\`\`\`

## 開発

\`\`\`bash
# 開発サーバー起動
bun run dev

# ビルド
bun run build

# テスト
bun test
\`\`\`

## ライセンス

MIT
```

## 検出項目

| ファイル | 抽出情報 |
|---------|---------|
| package.json | name, description, scripts |
| pyproject.toml | name, description |
| Cargo.toml | name, description |
| .gitignore | 除外パターン |

## オプション

- `--minimal`: 最小限のREADME
- `--full`: 詳細なREADME（API仕様含む）
- `--ja`: 日本語で生成
- `--en`: 英語で生成

$ARGUMENTS でプロジェクトパスを指定。

---

## 追加スキル（mnt/skills統合）

# Skills（スキル）

Claude Codeで使用できるカスタムスキルの定義ファイル。

## スキルとは

スキルは、複数のツールやステップを組み合わせた再利用可能なワークフローです。
コマンド（`.claude/commands/`）よりも複雑なタスクを自動化できます。

## ディレクトリ構成

```
mnt/skills/
├── README.md               # このファイル
├── full-stack-app.md       # フルスタックアプリ開発
├── api-design.md           # API設計ワークフロー
├── code-audit.md           # コード監査
├── migration.md            # 技術スタック移行
├── claude-code-router.md   # CCRセットアップ
└── opus-4-5-migration.md   # Opus 4.5移行
```

## スキルの書き方

```markdown
---
name: skill-name
description: スキルの説明
tools:
  - Bash
  - Read
  - Write
  - WebSearch
---

# スキル名

## 目的
このスキルが達成すること

## 前提条件
- 必要な環境
- 必要なツール

## ワークフロー

### Step 1: 調査
...

### Step 2: 実装
...

### Step 3: 検証
...
```

## 利用可能なスキル

| スキル | 説明 |
|--------|------|
| `full-stack-app` | フルスタックアプリの新規作成 |
| `api-design` | REST/GraphQL API設計 |
| `code-audit` | セキュリティ・品質監査 |
| `migration` | フレームワーク移行 |
| `claude-code-router` | CCRセットアップ・最適化 |
| `opus-4-5-migration` | Claude Opus 4.5への移行 |
