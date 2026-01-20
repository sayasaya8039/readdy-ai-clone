---
paths: "**/*"
---

# Claude Quickstarts ルール

## 概要

**Claude Quickstarts**はAnthropic公式のスタータープロジェクト集。
Claude APIを使った本番対応アプリケーションを迅速に構築。

GitHub: https://github.com/anthropics/claude-quickstarts (13,000+ stars)

## プロジェクト一覧

| プロジェクト | 説明 |
|-------------|------|
| **Customer Support Agent** | ナレッジベース統合AIサポート |
| **Financial Data Analyst** | 金融データ分析・可視化 |
| **Computer Use Demo** | デスクトップ自動化デモ |
| **Browser Tools API Demo** | Playwrightでブラウザ自動化 |
| **Autonomous Coding Agent** | Claude Agent SDKで自律コーディング |

## セットアップ

```bash
# クローン
git clone https://github.com/anthropics/claude-quickstarts.git

# プロジェクトディレクトリへ
cd claude-quickstarts/<project-name>

# 依存関係インストール
pip install -r requirements.txt

# APIキー設定
export ANTHROPIC_API_KEY="your-api-key"

# 実行
python main.py
```

## 使用場面

| 要件 | 使用するQuickstart |
|------|-------------------|
| カスタマーサポート構築 | customer-support-agent |
| データ分析ツール | financial-data-analyst |
| デスクトップ自動化 | computer-use-demo |
| ブラウザ自動化 | browser-tools-api-demo |
| 自律コーディング | autonomous-coding-agent |

## 関連リソース

- [Claude API Docs](https://docs.claude.com)
- [Claude Cookbooks](https://github.com/anthropics/claude-cookbooks)
- [Anthropic Discord](https://www.anthropic.com/discord)
