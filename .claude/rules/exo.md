---
paths: "**/exo/**, **/distributed/**, **/cluster/**"
---

# Exo - 分散AIクラスタフレームワーク

## 概要

**Exo**は日常デバイスを活用した分散AIクラスタフレームワーク（38,000+ stars）。
スマートフォン、PC、スマートウォッチなどを接続し、大規模LLMを分散実行。

GitHub: https://github.com/exo-explore/exo

## 特徴

| 特徴 | 説明 |
|------|------|
| **P2P分散** | マスター/ワーカーなし |
| **自動ネットワーク** | デバイス自動検出・接続 |
| **スマート分散** | トポロジー解析・最適シャーディング |
| **RDMA対応** | Thunderbolt 5でレイテンシ99%削減 |
| **MLX基盤** | Apple Silicon最適化・高効率推論 |

## パフォーマンス

| 構成 | 高速化 |
|------|--------|
| 2デバイス | 1.8x |
| 4デバイス | 3.2x |

## 対応モデル

| カテゴリ | モデル |
|----------|--------|
| LLM | LLaMA 3.3 (3B-405B), Mistral, Qwen, DeepSeek |
| Vision | LLaVA |
| Coding | DeepSeek Coder, Qwen Coder |
| Reasoning | DeepSeek R1 |

## インストール

### pip

pip install exo

### macOS (ソースから)

brew install uv macmon node
git clone https://github.com/exo-explore/exo
cd exo/dashboard && npm install && npm run build && cd ..
uv run exo

### Linux (Ubuntu/Debian)

sudo apt install python3-pip python3-venv nodejs npm
git clone https://github.com/exo-explore/exo
cd exo/dashboard && npm install && npm run build && cd ..
uv run exo

## 使用方法

### クラスター起動

# ノード1（Mac Studio）
exo run

# ノード2（MacBook）- 自動接続
exo run

### モデル実行

exo run llama-3.3-70b
exo run deepseek-v3

### ダッシュボード

http://localhost:52415

### API（OpenAI互換）

curl http://localhost:52415/v1/chat/completions   -H "Content-Type: application/json"   -d '{"model": "llama-3.1-70b", "messages": [{"role": "user", "content": "Hello"}]}'

## Claude Code連携

# Exoクラスタ経由でローカルLLM使用
/model exo,llama-3.1-70b

# CCR設定でExoを追加
ccr provider add exo http://localhost:52415/v1

## ハードウェア要件

| モデルサイズ | 推奨構成 |
|-------------|---------|
| 3B-7B | 1-2デバイス（M1/M2 Mac） |
| 13B-30B | 2-3デバイス（M2/M3 Mac） |
| 70B | 3-4デバイス（M2 Ultra以上） |
| 405B | 6+デバイス（M3 Ultra） |

## ユースケース

1. **プライベートLLM** - クラウド不要のローカル推論
2. **コスト削減** - 既存デバイスの活用
3. **低レイテンシ** - ローカルネットワーク内処理
4. **プライバシー** - データが外部に出ない
