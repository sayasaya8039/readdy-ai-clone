---
paths: "**/*"
---

コードフォーマットを実行します。

## プロジェクト検出

- biome.json: Biome使用
- package.json: JS/TSプロジェクト
- pyproject.toml: Pythonプロジェクト
- Cargo.toml: Rustプロジェクト

## 実行内容

1. **フォーマッター検出**
   - **Biome** (TypeScript/JavaScript/JSX/JSON/CSS) - 優先
   - ruff format (Python)
   - cargo fmt (Rust)

2. **フォーマット実行**
   - 対象ファイルを自動検出
   - フォーマット適用

3. **結果レポート**
   - 変更されたファイル数
   - 差分表示（オプション）

## プロジェクト別コマンド

| 言語 | 推奨（優先） | 代替 |
|------|-------------|------|
| **TypeScript/JS/JSON/CSS** | `bunx biome format --write .` | `bunx prettier --write .` |
| **Python** | `ruff format .` | - |
| **Rust** | `cargo fmt` | - |

## オプション

- `--check`: チェックのみ（変更しない）
- `--diff`: 差分を表示

$ARGUMENTS で特定ファイル/ディレクトリを指定可能。

## 設定ファイル

### Biome (biome.json) - 推奨
```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded"
    }
  }
}
```

### Ruff (pyproject.toml)
```toml
[tool.ruff]
line-length = 88

[tool.ruff.format]
quote-style = "double"
```
