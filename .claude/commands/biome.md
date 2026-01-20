---
description: Biome（高速Linter/Formatter）を実行
allowed-tools: Bash(bunx:*), Bash(bun:*), Read, Write, Glob
argument-hint: [サブコマンド/ファイル]
---

Biome（ESLint + Prettier の高速代替）を実行します。

## Biomeとは

- **高速**: Rustで実装、ESLint/Prettierより圧倒的に高速
- **統合**: Linter + Formatter を1ツールで
- **互換性**: Prettier 97%互換
- **340+ルール**: ESLint、typescript-eslintのルールを統合

## 対応言語

- JavaScript / TypeScript / JSX / TSX
- JSON / JSONC
- CSS
- GraphQL

## 基本コマンド

### インストール
```bash
bun add -d @biomejs/biome
```

### 初期化
```bash
bunx biome init
```

### チェック（lint + format）
```bash
# チェックのみ
bunx biome check .

# チェック + 自動修正
bunx biome check --write .
```

### フォーマット
```bash
# チェックのみ
bunx biome format .

# 自動修正
bunx biome format --write .
```

### リント
```bash
# チェックのみ
bunx biome lint .

# 安全な修正を適用
bunx biome lint --write .

# すべての修正を適用（危険な修正含む）
bunx biome lint --write --unsafe .
```

### CI用
```bash
bunx biome ci .
```

## biome.json設定例

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "complexity": {
        "noForEach": "warn"
      },
      "style": {
        "noNonNullAssertion": "warn"
      }
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "asNeeded"
    }
  },
  "files": {
    "ignore": ["node_modules", "dist", ".next"]
  }
}
```

## ESLint/Prettierからの移行

```bash
# 設定移行
bunx biome migrate eslint --write
bunx biome migrate prettier --write
```

## package.json設定例

```json
{
  "scripts": {
    "check": "biome check .",
    "check:fix": "biome check --write .",
    "format": "biome format --write .",
    "lint": "biome lint --write ."
  }
}
```

## オプション

| オプション | 説明 |
|-----------|------|
| `--write` | 修正を適用 |
| `--unsafe` | 危険な修正も適用 |
| `--staged` | ステージングされたファイルのみ |
| `--changed` | 変更されたファイルのみ |

## 使用タイミング

| 場面 | 推奨コマンド |
|------|-------------|
| 開発中 | `bunx biome check --write .` |
| コミット前 | `bunx biome check --staged` |
| CI | `bunx biome ci .` |
| PR前 | `bunx biome check --changed` |

## なぜBiomeか

| 比較 | Biome | ESLint + Prettier |
|------|-------|-------------------|
| 速度 | 非常に高速 | 遅い |
| 設定 | シンプル | 複雑 |
| ツール数 | 1つ | 2つ以上 |
| 依存関係 | 少ない | 多い |

$ARGUMENTS でサブコマンドまたはファイルを指定。
