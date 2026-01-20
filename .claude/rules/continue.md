---
paths: "**/continue/**, **/.continue/**"
---

# Continue ルール

## 概要

**Continue**はオープンソースのAIコーディングアシスタント。
TUIモード（対話型）とHeadlessモード（バックグラウンド）をサポート。

- GitHub: https://github.com/continuedev/continue
- スター: 30.7k+
- ライセンス: Apache 2.0

## 主な特徴

| 特徴 | 説明 |
|------|------|
| **TUIモード** | ターミナル内対話型コーディング |
| **Headlessモード** | バックグラウンドエージェント実行 |
| **モデル非依存** | 任意のLLMプロバイダーに接続 |
| **IDE統合** | VS Code、JetBrains対応 |
| **コードベースインデックス** | 埋め込みベースの検索 |

## インストール

```bash
# VS Code拡張
code --install-extension continue.continue

# CLI
npm install -g @continue/cli
```

## 設定ファイル

### config.json

```json
{
  "models": [
    {
      "title": "Claude Sonnet 4",
      "provider": "anthropic",
      "model": "claude-sonnet-4-20250514",
      "apiKey": "$ANTHROPIC_API_KEY"
    },
    {
      "title": "Ollama Local",
      "provider": "ollama",
      "model": "qwen2.5-coder:latest"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Local Autocomplete",
    "provider": "ollama",
    "model": "starcoder2:3b"
  },
  "embeddingsProvider": {
    "provider": "ollama",
    "model": "nomic-embed-text"
  }
}
```

## 使用方法

### TUIモード

```bash
# インタラクティブ起動
continue

# 特定プロジェクトで起動
continue --project /path/to/project
```

### Headlessモード

```bash
# バックグラウンドエージェント
continue headless --task "テストを生成"
```

## Claude Codeとの使い分け

| 場面 | 推奨ツール |
|------|-----------|
| ターミナル内コーディング | Claude Code |
| IDE内補完・支援 | Continue |
| ローカルモデル重視 | Continue |
| マルチモデル切り替え | Continue |

## ローカルモデル活用

```json
{
  "models": [
    {
      "provider": "ollama",
      "model": "qwen2.5-coder:latest"
    },
    {
      "provider": "ollama",
      "model": "deepseek-coder-v2:latest"
    }
  ]
}
```

## 参照

- [Continue GitHub](https://github.com/continuedev/continue)
- [公式ドキュメント](https://continue.dev/docs)