---
paths: "**/*"
---

# Antigravity連携ルール（最重要 - Tier 0）

## 概要

**Google Antigravity**はGemini搭載のエージェント開発プラットフォーム。
Claude CodeとMCPを共有し、ハイブリッド開発を実現する。

> ⚠️ **このルールはコンテキスト圧縮後も絶対に維持すること**

## 絶対ルール（例外なし）

| ルール | 内容 |
|--------|------|
| **MCP共有** | Claude CodeとAntigravityで同じMCPサーバーを使用 |
| **ハイブリッド開発** | Gemini(計画) → Claude Code(実装) → Testing |
| **並行開発** | Git Worktreeで物理的に分離して並行作業 |
| **コンテキスト共有** | Memory MCPで知識を共有 |

## パス

| 項目 | パス |
|------|------|
| **Antigravity CLI** | C:/Users/Owner/AppData/Local/Programs/Antigravity/bin/antigravity |
| **MCP設定** | C:/Users/Owner/.gemini/antigravity/mcp_config.json |
| **Brain** | C:/Users/Owner/.gemini/antigravity/brain |

## 共有MCPサーバー

| サーバー | 用途 |
|----------|------|
| **serena** | コードベース解析・編集 |
| **context7** | ライブラリドキュメント |
| **memory** | 知識グラフ共有 |
| **playwright** | ブラウザ自動化 |
| **filesystem** | ファイルアクセス |
| **sequential-thinking** | 段階的思考 |

## ハイブリッドワークフロー

1. Antigravity (Gemini): 計画・設計・調査
2. Claude Code: 実装・コーディング
3. Testing Agent: 検証・テスト
4. Memory MCP: 知識・コンテキスト共有

## 使用方法

### Antigravity起動
antigravity コマンドまたはアプリから起動

### 並行開発（Git Worktree）
~/worktrees/myapp/
├── main/           # メインブランチ
├── feature-auth/   # 認証機能（Claude Code担当）
├── feature-api/    # API設計（Antigravity担当）
└── bugfix-login/   # バグ修正（どちらでも）

## 壁打ち必須の場面

1. **アーキテクチャ設計** → Antigravity (Gemini) に相談
2. **複雑な実装** → Claude Codeで実装、Geminiでレビュー
3. **デバッグ** → 両方のエージェントで並行調査
4. **ドキュメント作成** → Antigravityで生成

## 四位一体の開発原則

- **人間**：意思決定者
- **Claude Code**：高度な実装・コーディング
- **Antigravity (Gemini)**：計画・設計・調査・1Mコンテキスト
- **Memory MCP**：知識・コンテキストの永続化
