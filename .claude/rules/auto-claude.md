---
paths: "**/auto-claude/**, **/spec/**, **/.autoclaude/**"
---

# Auto-Claude 自律型マルチエージェントフレームワーク

## 概要

**Auto-Claude**は自律型マルチエージェントコーディングシステム。
目標を記述するだけで、計画・実装・検証を自動実行。

- GitHub: https://github.com/AndyMik90/Auto-Claude
- バージョン: 2.7.2+
- ライセンス: AGPL-3.0

## 主な特徴

| 特徴 | 説明 |
|------|------|
| **自律実行** | 目標記述のみで完全自動開発 |
| **並列エージェント** | 最大12個の同時ターミナル |
| **Git Worktree分離** | メインブランチを保護 |
| **QAパイプライン** | 自動コード検証 |
| **AI競合解決** | マージ競合をAIが解決 |
| **Memory Layer** | セッション間インサイト保持 |
| **Kanbanボード** | タスク進捗可視化 |

## 要件

| 必要なもの | バージョン |
|-----------|-----------|
| Claude Pro/Max | サブスクリプション必須 |
| Claude Code CLI | 最新版 |
| Git | 初期化済みリポジトリ |
| Python | 3.12+ |

## インストール

```bash
# Claude Code CLIをインストール
npm install -g @anthropic-ai/claude-code

# Auto-Claudeをダウンロード
# https://github.com/AndyMik90/Auto-Claude/releases

# プラットフォーム別インストーラーを実行
```

## 使用方法

### GUIモード

1. Auto-Claudeアプリを起動
2. Gitリポジトリフォルダを選択
3. OAuthで認証
4. タスクを作成 → 自動実行開始

### CLIモード（ヘッドレス/CI）

```bash
# インタラクティブモード
python spec_runner.py --interactive

# 特定のspecを実行
python run.py --spec [number]

# 実行 + レビュー + マージ
python run.py --spec [number] --review --merge
```

## 環境変数

| 変数 | 説明 | 必須 |
|------|------|------|
| `CLAUDE_CODE_OAUTH_TOKEN` | 認証トークン | ✅ |
| `GRAPHITI_ENABLED` | Memory Layer有効化 | - |
| `GITLAB_TOKEN` | GitLab連携 | - |
| `LINEAR_API_KEY` | Linear連携 | - |
| `AUTO_BUILD_MODEL` | モデル上書き | - |

## セキュリティ

3層保護:
1. OSサンドボックス
2. プロジェクトディレクトリへのファイルシステム制限
3. 検出された技術スタックに基づく動的コマンド許可リスト

## 使用場面

| 場面 | 推奨 |
|------|------|
| 大規模機能開発 | Auto-Claude |
| 複数タスク並列処理 | Auto-Claude |
| 自動QA・検証 | Auto-Claude |
| シンプルなタスク | 通常のClaude Code |

## 統合サービス

| サービス | 機能 |
|----------|------|
| GitHub | Issue取り込み、PR作成 |
| GitLab | MR作成 |
| Linear | タスク同期 |

## 参照

- [GitHub](https://github.com/AndyMik90/Auto-Claude)
- [Releases](https://github.com/AndyMik90/Auto-Claude/releases)
