---
paths: "**/*"
---

プロジェクトの主要ファイルを読み込み、依存環境をチェックします。

## 依存環境チェック（必須）

**CLAUDE.md読み込み時に常に依存環境が最新かをチェック:**

```bash
# JavaScript/TypeScript
bun outdated

# Python
uv pip list --outdated

# Rust
cargo outdated
```

### チェック後のアクション
- 更新が必要 → ユーザーに通知
- セキュリティ問題 → 即座に更新提案
- 非推奨パッケージ → 代替案を提示

## 実行内容

### 1. 設定ファイル読み込み
- CLAUDE.md
- .claude/settings.json
- .claude/rules/*.md

### 2. 依存環境チェック
- package.json → `bun outdated`
- pyproject.toml → `uv pip list --outdated`
- Cargo.toml → `cargo outdated`

### 3. Memory確認
- 過去の作業履歴を取得

### 4. 構造確認
- ディレクトリ構造を把握

## 読み込み対象

| ファイル | 優先度 |
|---------|--------|
| CLAUDE.md | 必須 |
| .claude/settings.json | 必須 |
| .claude/rules/*.md | 高 |
| package.json / pyproject.toml | 高（依存チェック） |

$ARGUMENTS でプロジェクトパスを指定
