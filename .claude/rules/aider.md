---
paths: "**/.aider*, **/aider/**"
---

# Aider 開発ルール

## 概要

**Aider**はターミナルで動作するAIペアプログラミングツール。
コードベース全体をマップして大規模プロジェクトでも効果的に動作。

GitHub: https://github.com/Aider-AI/aider (39,000+ stars)

## 特徴

| 特徴 | 説明 |
|------|------|
| **CLIベース** | ターミナルで完結 |
| **コードマップ** | リポジトリ全体を理解 |
| **Git統合** | 自動コミット生成 |
| **マルチLLM** | Claude, DeepSeek, OpenAI, ローカル対応 |
| **音声入力** | 音声でコード変更依頼可能 |

## インストール

```bash
# pipx推奨
pipx install aider-chat

# または pip
pip install aider-chat

# uv
uv tool install aider-chat
```

## 基本コマンド

```bash
# プロジェクトで起動
aider

# 特定ファイルを指定
aider src/main.py src/utils.py

# モデル指定
aider --model claude-sonnet-4-20250514

# DeepSeek使用
aider --model deepseek/deepseek-chat
```

## 使用場面

| 場面 | Aiderの活用 |
|------|-------------|
| 大規模リファクタリング | コードマップで全体把握 |
| バグ修正 | 関連ファイル自動検出 |
| 機能追加 | 既存コードスタイル踏襲 |
| ドキュメント生成 | コードから自動生成 |

## Claude Codeとの使い分け

| タスク | 推奨ツール |
|--------|-----------|
| 対話的開発 | Claude Code |
| 大規模変更 | Aider（コードマップ活用） |
| Git操作 | 両方対応 |
| 音声入力 | Aider |

## 設定ファイル

```yaml
# .aider.conf.yml
model: claude-sonnet-4-20250514
auto-commits: true
dark-mode: true
```
