---
paths: "**/ccr/**, **/.claude/**"
---

# Claude Code Router (CCR) ルール

Claude Code Routerを使用したマルチモデルルーティングのガイドライン。

## 概要

CCRはClaude Codeのリクエストを異なるモデル/プロバイダーにルーティングするツール。
コスト削減、性能最適化、用途別モデル使い分けに活用。

## ⚠️ 積極的に使う場面

**CCRが利用可能な場合は、以下の場面で積極的に活用すること：**

| 場面 | ルート | 推奨設定 | メリット |
|------|--------|---------|---------|
| **Taskツールでサブエージェント起動** | `background` | Ollama/ローカル | コスト0、プライバシー保護 |
| **Plan Mode・設計検討** | `think` | DeepSeek Reasoner | 高い推論能力、低コスト |
| **大規模ファイル読み込み（60K+）** | `longContext` | Gemini 2.5 Pro | 長文処理に最適化 |
| **最新情報の調査** | `webSearch` | Gemini Flash :online | リアルタイムWeb検索 |
| **コードレビュー・リファクタ** | `default` | Claude Sonnet 4 | 高品質な分析 |

### 具体的な使用例

```
# バックグラウンドでコード分析（コスト削減）
Task tool → <CCR-SUBAGENT-MODEL>ollama,qwen2.5-coder:latest</CCR-SUBAGENT-MODEL>

# 複雑な設計判断（推論重視）
/model deepseek,deepseek-reasoner

# 大きなコードベース理解（長文処理）
/model openrouter,google/gemini-2.5-pro-preview

# 通常作業に戻る
/model openrouter,anthropic/claude-sonnet-4
```

### 自動ルーティングの活用

CCRは以下を自動判定してルーティング：
- コンテキスト長（60K超 → longContext）
- Plan Mode検出（→ think）
- Web検索要求（→ webSearch）

**手動切り替えが必要な場面：**
- 特定タスクでローカルモデルを使いたい時
- コスト重視で軽量モデルに切り替えたい時
- 推論品質重視でDeepSeek Reasonerを使いたい時

## インストール

```bash
npm install -g @musistudio/claude-code-router
```

## 基本コマンド

| コマンド | 説明 |
|----------|------|
| `ccr code` | Routerを通してClaude Code起動 |
| `ccr start` | Routerサーバー起動（バックグラウンド） |
| `ccr stop` | Routerサーバー停止 |
| `ccr restart` | サーバー再起動（設定変更後に必要） |
| `ccr status` | サーバー状態確認 |
| `ccr model` | 対話的モデル管理CLI |
| `ccr ui` | Web UI起動（ブラウザで設定管理） |
| `ccr activate` | 環境変数設定（シェルで直接claude使用可能に） |

## 設定ファイル

`~/.claude-code-router/config.json`:

```json
{
  "PROXY_URL": "http://127.0.0.1:7890",
  "LOG": true,
  "API_TIMEOUT_MS": 600000,
  "Providers": [
    {
      "name": "gemini",
      "api_base_url": "https://generativelanguage.googleapis.com/v1beta/models/",
      "api_key": "AIzaSyDwwtmUrsHorNAM1jaZYPPJ-jMJuED8zsM",
      "models": [
        "anthropic/claude-sonnet-4",
        "gemini-2.5-flash",
        "gemini-2.5-pro",
        "gemini-3.0"

      ],
      "transformer": { "use": ["gemini-3.0"] }
    },
    {
      "name": "openrouter",
      "api_base_url": "https://openrouter.ai/api/v1/chat/completions",
      "api_key": "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",
      "models": [
        "nex-agi/deepseek-v3.1-nex-n1:free",
        "z-ai/glm-4.5-air:free",
        "deepseek/deepseek-r1-0528:free",
        "xiaomi/mimo-v2-flash:free"
      ],
      "transformer": {
        "use": [
          "openrouter"
        ]
      },
    {
      "name": "ollama",
      "api_base_url": "http://localhost:11434/v1/chat/completions",
      "api_key": "ollama",
      "models": ["qwen2.5-coder:latest"]
    }
  ],
  "Router": {
    "default": "gemini,gemini-3.0",
    "background": "gemini,gemini-3.0",
    "think": "openrouter,deepseek/deepseek-r1-0528:free",
    "longContext": "openrouter,xiaomi/mimo-v2-flash:free",
    "longContextThreshold": 60000,
    "webSearch": "gemini,gemini-2.5-flash",
    "image": "gemini,gemini-3.0"  }
}
```

## ルーティング種別

| ルート | 用途 | 推奨モデル |
|--------|------|-----------|
| `default` | 通常タスク | Claude Sonnet 4 |
| `background` | バックグラウンドタスク | ローカルモデル（Ollama） |
| `think` | 推論・Plan Mode | DeepSeek Reasoner |
| `longContext` | 60K+トークン | Gemini 2.5 Pro |
| `webSearch` | Web検索 | Gemini Flash (:online) |
| `image` | 画像処理 | Vision対応モデル |

## 対応プロバイダー

| プロバイダー | 特徴 |
|-------------|------|
| **OpenRouter** | 多数のモデルを統一APIで利用 |
| **DeepSeek** | 高性能・低コストの中国製モデル |
| **Ollama** | ローカル実行（無料・高速） |
| **Gemini** | Google製、長コンテキスト対応 |
| **Volcengine** | 中国クラウド |
| **SiliconFlow** | 中国製モデルプロバイダー |

## Transformer

リクエスト/レスポンスをプロバイダーAPIに適合させる。

### 組み込みTransformer

| Transformer | 用途 |
|-------------|------|
| `openrouter` | OpenRouter API適合 |
| `deepseek` | DeepSeek API適合 |
| `gemini` | Gemini API適合 |
| `groq` | Groq API適合 |
| `maxtoken` | max_tokens制限設定 |
| `tooluse` | tool_choice最適化 |
| `reasoning` | reasoning_content処理 |
| `enhancetool` | ツール呼び出しエラー耐性 |

### Transformer設定例

```json
{
  "transformer": {
    "use": ["deepseek"],
    "deepseek-chat": {
      "use": ["tooluse"]
    }
  }
}
```

### maxtokenオプション

```json
{
  "transformer": {
    "use": [
      ["maxtoken", { "max_tokens": 16384 }]
    ]
  }
}
```

## 動的モデル切り替え

Claude Code内で `/model` コマンド使用：

```
/model openrouter,anthropic/claude-sonnet-4
/model deepseek,deepseek-reasoner
/model ollama,qwen2.5-coder:latest
```

## サブエージェントルーティング

Taskツールのプロンプト先頭に指定：

```
<CCR-SUBAGENT-MODEL>openrouter,anthropic/claude-3.5-sonnet</CCR-SUBAGENT-MODEL>
このコードを分析して最適化提案をしてください...
```

## 環境変数の活用

APIキーは環境変数で管理（セキュリティ向上）：

```json
{
  "api_key": "$OPENROUTER_API_KEY"
}
```

または `${OPENROUTER_API_KEY}` 形式も可。

## GitHub Actions連携

```yaml
- name: Start Claude Code Router
  run: |
    nohup bunx @musistudio/claude-code-router start &

- name: Run Claude Code
  uses: anthropics/claude-code-action@beta
  env:
    ANTHROPIC_BASE_URL: http://localhost:3456
  with:
    anthropic_api_key: "any-string"
```

**注意**: `"NON_INTERACTIVE_MODE": true` を設定すること。

## ベストプラクティス

| 項目 | ガイドライン |
|------|-------------|
| コスト削減 | background → Ollamaローカルモデル |
| 推論タスク | think → DeepSeek Reasoner |
| 長文処理 | longContext → Gemini Pro |
| 機密保護 | APIキーは環境変数で管理 |
| 設定変更後 | `ccr restart` で再起動 |

## トラブルシューティング

| 問題 | 対処法 |
|------|--------|
| 接続エラー | `ccr status` で状態確認 |
| 設定反映されない | `ccr restart` で再起動 |
| ログ確認 | `~/.claude-code-router/logs/` |
| UI起動 | `ccr ui` でブラウザ管理 |

---

## 追加スキル（mnt/skills統合）

---
name: claude-code-router
description: Claude Code Routerのセットアップ・最適化ワークフロー
tools:
  - Bash
  - Read
  - Write
  - WebSearch
---

# Claude Code Router セットアップスキル

Claude Code Routerを使用したマルチモデルルーティング環境の構築ワークフロー。

## 目的

- コスト削減（ローカルモデル活用）
- 用途別最適モデル選択
- 長コンテキスト対応
- 推論タスクの性能向上

## ワークフロー

### Step 1: インストール

```bash
# Claude Code Router インストール
npm install -g @musistudio/claude-code-router

# バージョン確認
ccr --version
```

### Step 2: 設定ファイル作成

`~/.claude-code-router/config.json` を作成：

```bash
mkdir -p ~/.claude-code-router
```

### Step 3: プロバイダー設定

#### 基本構成（推奨）

```json
{
  "LOG": true,
  "API_TIMEOUT_MS": 600000,
  "Providers": [
    {
      "name": "openrouter",
      "api_base_url": "https://openrouter.ai/api/v1/chat/completions",
      "api_key": "$OPENROUTER_API_KEY",
      "models": [
        "anthropic/claude-sonnet-4",
        "anthropic/claude-3.5-sonnet",
        "google/gemini-2.5-pro-preview"
      ],
      "transformer": { "use": ["openrouter"] }
    },
    {
      "name": "deepseek",
      "api_base_url": "https://api.deepseek.com/chat/completions",
      "api_key": "$DEEPSEEK_API_KEY",
      "models": ["deepseek-chat", "deepseek-reasoner"],
      "transformer": {
        "use": ["deepseek"],
        "deepseek-chat": { "use": ["tooluse"] }
      }
    },
    {
      "name": "ollama",
      "api_base_url": "http://localhost:11434/v1/chat/completions",
      "api_key": "ollama",
      "models": ["qwen2.5-coder:latest", "llama3.2:latest"]
    },
    {
      "name": "gemini",
      "api_base_url": "https://generativelanguage.googleapis.com/v1beta/models/",
      "api_key": "$GEMINI_API_KEY",
      "models": ["gemini-2.5-flash", "gemini-2.5-pro"],
      "transformer": { "use": ["gemini"] }
    }
  ],
  "Router": {
    "default": "openrouter,anthropic/claude-sonnet-4",
    "background": "ollama,qwen2.5-coder:latest",
    "think": "deepseek,deepseek-reasoner",
    "longContext": "openrouter,google/gemini-2.5-pro-preview",
    "longContextThreshold": 60000,
    "webSearch": "gemini,gemini-2.5-flash"
  }
}
```

### Step 4: 環境変数設定

```bash
# ~/.bashrc または ~/.zshrc に追加
export OPENROUTER_API_KEY="sk-or-xxx"
export DEEPSEEK_API_KEY="sk-xxx"
export GEMINI_API_KEY="xxx"
```

### Step 5: Ollamaセットアップ（オプション）

ローカルモデルでコスト削減：

```bash
# Ollamaインストール（https://ollama.com）
# モデルダウンロード
ollama pull qwen2.5-coder:latest
ollama pull llama3.2:latest

# サーバー起動
ollama serve
```

### Step 6: 起動・確認

```bash
# サーバー起動
ccr start

# 状態確認
ccr status

# Claude Code起動
ccr code
```

### Step 7: 動作確認

Claude Code内で：
```
/model openrouter,anthropic/claude-sonnet-4
```

## 用途別最適化設定

### コスト最小化構成

```json
{
  "Router": {
    "default": "deepseek,deepseek-chat",
    "background": "ollama,qwen2.5-coder:latest",
    "think": "deepseek,deepseek-reasoner",
    "longContext": "deepseek,deepseek-chat"
  }
}
```

### 品質最大化構成

```json
{
  "Router": {
    "default": "openrouter,anthropic/claude-sonnet-4",
    "background": "openrouter,anthropic/claude-3.5-sonnet",
    "think": "openrouter,anthropic/claude-sonnet-4",
    "longContext": "openrouter,google/gemini-2.5-pro-preview"
  }
}
```

### ハイブリッド構成（推奨）

```json
{
  "Router": {
    "default": "openrouter,anthropic/claude-sonnet-4",
    "background": "ollama,qwen2.5-coder:latest",
    "think": "deepseek,deepseek-reasoner",
    "longContext": "gemini,gemini-2.5-pro",
    "webSearch": "gemini,gemini-2.5-flash"
  }
}
```

## カスタムルーター

高度なルーティングロジック：

```javascript
// ~/.claude-code-router/custom-router.js
module.exports = async function router(req, config) {
  const userMessage = req.body.messages.find(m => m.role === "user")?.content;

  // コード説明は高性能モデル
  if (userMessage && userMessage.includes("explain this code")) {
    return "openrouter,anthropic/claude-sonnet-4";
  }

  // テスト生成はローカルモデル
  if (userMessage && userMessage.includes("generate tests")) {
    return "ollama,qwen2.5-coder:latest";
  }

  return null; // デフォルトルーターにフォールバック
};
```

設定に追加：
```json
{
  "CUSTOM_ROUTER_PATH": "~/.claude-code-router/custom-router.js"
}
```

## GitHub Actions連携

```yaml
- name: Prepare CCR
  run: |
    mkdir -p ~/.claude-code-router
    cat << 'EOF' > ~/.claude-code-router/config.json
    {
      "NON_INTERACTIVE_MODE": true,
      "Providers": [...],
      "Router": {...}
    }
    EOF

- name: Start CCR
  run: nohup bunx @musistudio/claude-code-router start &

- name: Run Claude Code
  uses: anthropics/claude-code-action@beta
  env:
    ANTHROPIC_BASE_URL: http://localhost:3456
```

## トラブルシューティング

| 問題 | 対処法 |
|------|--------|
| 接続エラー | `ccr status` で状態確認 |
| モデル切替失敗 | プロバイダー名・モデル名を確認 |
| Ollama接続エラー | `ollama serve` が起動しているか確認 |
| 設定反映されない | `ccr restart` で再起動 |

## チェックリスト

- [ ] CCRインストール完了
- [ ] 設定ファイル作成
- [ ] APIキー環境変数設定
- [ ] プロバイダー設定
- [ ] ルーティング設定
- [ ] Ollamaセットアップ（オプション）
- [ ] サーバー起動確認
- [ ] モデル切り替えテスト
