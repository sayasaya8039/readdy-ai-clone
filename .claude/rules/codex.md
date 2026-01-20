# Codex CLI 実行ルール

## 絶対遵守

**MCPツール（mcp__codex-cli__*）は使用禁止。必ず直接Bashでcodexコマンドを実行すること。**

## 実行方法

### Windows環境（推奨）

```bash
powershell.exe -NoProfile -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; codex exec --skip-git-repo-check --full-auto --cd '.' 'プロンプト' 2>&1 | Out-String"
```

### Unix/Linux環境

```bash
codex exec --skip-git-repo-check --full-auto --cd "$(pwd)" "プロンプト"
```

## 必須フラグ

| フラグ | 説明 |
|--------|------|
| `--skip-git-repo-check` | Gitリポジトリチェックをスキップ（必須） |
| `--full-auto` | 完全自動モード（承認プロンプトなし） |
| `--cd '.'` | 現在のディレクトリを作業ディレクトリとして使用 |

## タイムアウト

- デフォルト: 120秒（120000ミリ秒）
- 長い処理: 180秒以上に増やす

## GPTエキスパート

| エキスパート | スラッシュコマンド | 用途 |
|-------------|-------------------|------|
| Architect | `/architect` | システム設計・アーキテクチャ |
| Plan Reviewer | `/plan-reviewer` | 作業計画レビュー |
| Code Reviewer | `/code-reviewer` | コードレビュー・バグ発見 |
| Security Analyst | `/security-analyst` | セキュリティ診断 |
| Scope Analyst | `/scope-analyst` | 要件分析 |

## threadID受信時

```bash
codex-fetch <threadId>
```

で本文を取得（UTF-8エンコード必須）。

## 禁止事項

- ❌ MCPツール（`mcp__codex-cli__*`）の使用
- ❌ スラッシュコマンドをSkillツールで実行（直接Bashで実行）
