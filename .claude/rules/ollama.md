---
paths: "**/ollama/**, **/Modelfile"
---

# Ollama ルール

## 概要

**Ollama**はローカルでLLMを実行するためのツール。
プライバシー保護、コスト削減、オフライン利用に最適。

- GitHub: https://github.com/ollama/ollama
- スター: 150k+
- ライセンス: MIT

## 主な特徴

| 特徴 | 説明 |
|------|------|
| **ローカル実行** | クラウド不要、プライバシー保護 |
| **マルチプラットフォーム** | macOS, Windows, Linux, Docker |
| **豊富なモデル** | 20+モデル、1B〜671Bパラメータ |
| **REST API** | OpenAI互換API |
| **マルチモーダル** | 画像対応モデル |

## インストール

```bash
# macOS
brew install ollama

# Windows
winget install Ollama.Ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh
```

## 推奨モデル

| モデル | サイズ | 用途 |
|--------|--------|------|
| qwen2.5-coder:latest | 7B | コーディング |
| deepseek-r1:latest | 7B | 推論・思考 |
| llama3.2:latest | 3B | 軽量汎用 |
| codellama:latest | 7B | コード補完 |
| nomic-embed-text | 137M | 埋め込み |

## Claude Code Router統合

```json
{
  "Providers": [
    {
      "name": "ollama",
      "api_base_url": "http://localhost:11434/v1/chat/completions",
      "api_key": "ollama",
      "models": ["qwen2.5-coder:latest", "deepseek-r1:latest"]
    }
  ],
  "Router": {
    "background": "ollama,qwen2.5-coder:latest"
  }
}
```

## 基本コマンド

```bash
# サーバー起動
ollama serve

# モデルダウンロード
ollama pull qwen2.5-coder:latest

# 実行
ollama run qwen2.5-coder

# モデル一覧
ollama list
```

## API使用

```typescript
// OpenAI互換API
const response = await fetch('http://localhost:11434/v1/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'qwen2.5-coder:latest',
    messages: [{ role: 'user', content: 'Hello' }]
  })
});
```

## カスタムモデル（Modelfile）

```dockerfile
FROM qwen2.5-coder:latest

PARAMETER temperature 0.7
PARAMETER num_ctx 32768

SYSTEM """
You are an expert TypeScript developer.
Follow these rules:
- Use strict TypeScript
- Prefer functional patterns
"""
```

```bash
ollama create my-coder -f Modelfile
```

## 使用場面

| 場面 | 推奨 |
|------|------|
| バックグラウンドタスク | Ollama（コスト0） |
| 機密コード | Ollama（ローカル） |
| オフライン環境 | Ollama |
| 高品質タスク | Claude/GPT |

## 参照

- [Ollama GitHub](https://github.com/ollama/ollama)
- [Ollama公式](https://ollama.com)
- [モデルライブラリ](https://ollama.com/library)