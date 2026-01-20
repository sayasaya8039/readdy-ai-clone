---
description: Sim AIワークフローの構築・実行
allowed-tools: Bash(npx:*), Bash(docker:*), Bash(bun:*), Read, Write, WebSearch
argument-hint: [init|start|deploy]
---

# Sim コマンド

AIエージェントワークフロープラットフォーム「Sim」の操作を支援します。

## サブコマンド

### `/sim init` - プロジェクト初期化

```bash
# ローカル実行（Docker必須）
npx simstudio

# 手動セットアップ
git clone https://github.com/simstudioai/sim
cd sim
bun install
```

### `/sim start` - 起動

```bash
# Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# 開発モード
bun run dev
```

### `/sim deploy` - デプロイ

```bash
# Vercelデプロイ
vercel deploy

# Dockerビルド
docker build -t my-sim .
```

## クラウド版

https://sim.ai でマネージドサービスを利用可能。

## ワークフロー構築

### 1. ビジュアルエディタ

ブラウザで `http://localhost:3000` にアクセス。
キャンバス上でノードを接続してワークフローを設計。

### 2. ノードタイプ

| ノード | 用途 |
|--------|------|
| Agent | AIエージェント実行 |
| Tool | 外部API呼び出し |
| Condition | 条件分岐 |
| Loop | 繰り返し処理 |

### 3. Copilot活用

自然言語でワークフローを生成：

```
「メール受信 → AI分類 → 自動返信」のワークフローを作成
```

## ナレッジベース

```typescript
// ドキュメントをベクトルストアに登録
const knowledge = await sim.knowledge.create({
  name: 'プロダクトドキュメント',
  documents: ['./docs/*.md']
})
```

## 技術スタック

- Next.js, ReactFlow, Tailwind CSS
- PostgreSQL + pgvector
- Bun Runtime

## リポジトリ

- GitHub: https://github.com/simstudioai/sim (24K+ stars)
- ドキュメント: https://docs.sim.ai

$ARGUMENTS でサブコマンドを指定。
