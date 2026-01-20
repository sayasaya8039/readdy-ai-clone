---
paths: "**/*"
---

コードの品質チェックとファクトチェックを実行します。

## ファクトチェック（必須）

**開発テストの際はファクトチェックも同時に実行:**

| チェック項目 | 確認方法 | 修正 |
|-------------|---------|------|
| ライブラリAPI | context7で最新仕様確認 | 即修正 |
| 非推奨コード | 公式ドキュメント確認 | 即修正 |
| 型定義 | 最新の型定義確認 | 即修正 |
| インポート文 | 正しいパス確認 | 即修正 |

## 実行内容

### 1. リンター実行

| 言語 | 推奨（優先） | 代替 |
|------|-------------|------|
| **TypeScript/JS** | `bunx biome check .` | `bunx eslint .` |
| **Python** | `ruff check .` | - |
| **Rust** | `cargo clippy` | - |

### 2. 型チェック
- TypeScript: `bunx tsc --noEmit`
- Python: `mypy .`

### 3. ファクトチェック
- 使用ライブラリの最新仕様を確認
- 非推奨APIがないか確認
- **修正点があれば即座に修正**

## 推奨コマンド

```bash
# TypeScript/JavaScript（Biome優先）
bunx biome check --write .

# Python
ruff check --fix .

# Rust
cargo clippy --fix
```

## オプション

- `--fix`: 自動修正
- `--lint`: lintのみ
- `--type`: 型チェックのみ

$ARGUMENTS で対象を指定
