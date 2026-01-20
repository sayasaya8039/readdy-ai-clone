---
paths: "**/sim/**, **/workflows/**, **/agents/**"
---

# Sim - AIエージェントワークフロープラットフォーム

## 概要

**Sim**はオープンソースのAIエージェントワークフロー構築・デプロイプラットフォーム（24,000+ stars）。
ビジュアルインターフェースとAIアシスタントを組み合わせ、インテリジェントな自動化システムを構築。

## 特徴

| 特徴 | 説明 |
|------|------|
| **ビジュアルビルダー** | キャンバス上でワークフローを設計 |
| **AI Copilot** | 自然言語でノード生成・エラー修正 |
| **ナレッジ統合** | ベクトルDB連携でドキュメント活用 |
| **即時実行** | デプロイなしでワークフロー実行 |

## インストール

```bash
# クラウド版
# https://sim.ai にアクセス

# ローカル実行（Docker必須）
npx simstudio

# Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# ローカルモデル（Ollama/vLLM）
docker-compose -f docker-compose.local.yml up -d
```

## 手動セットアップ

```bash
# 必要なツール
bun install
# または
npm install

# データベース（PostgreSQL + pgvector）
docker run -d --name postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  ankane/pgvector

# 起動
bun run dev
```

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | Next.js, ReactFlow, Tailwind CSS |
| 状態管理 | Zustand |
| バックエンド | Bun Runtime |
| データベース | PostgreSQL + Drizzle ORM + pgvector |
| 認証 | Better Auth |

## ワークフロー構築

### 1. ノードタイプ

| ノード | 用途 |
|--------|------|
| **Agent** | AIエージェント実行 |
| **Tool** | 外部ツール呼び出し |
| **Condition** | 条件分岐 |
| **Loop** | 繰り返し処理 |
| **Input/Output** | データ入出力 |

### 2. Copilot活用

```
# 自然言語でノード生成
「メール受信 → 分類 → 返信」のワークフローを作成して

# エラー修正
このノードの接続エラーを修正して
```

### 3. ナレッジベース

```typescript
// ベクトルストアへのドキュメント登録
const knowledge = await sim.knowledge.create({
  name: 'プロダクトドキュメント',
  documents: ['./docs/*.md']
})

// エージェントへの紐付け
agent.useKnowledge(knowledge)
```

## Claude Code連携

```bash
# Simでワークフロー設計後、Claude Codeで実装
/init sim my-workflow

# ワークフロー定義の生成
/workflow generate
```

## ユースケース

| ユースケース | 説明 |
|-------------|------|
| カスタマーサポート | 問い合わせ分類・自動応答 |
| データパイプライン | ETL処理の自動化 |
| コンテンツ生成 | 記事・レポートの自動作成 |
| コードレビュー | PR分析・フィードバック |

## リポジトリ

- GitHub: https://github.com/simstudioai/sim
- ドキュメント: https://docs.sim.ai
