---
paths: "**/biome.json, **/biome.jsonc"
---

# Biome → bnmp リダイレクト

> **注意**: biomeコマンドは自動的にbnmpにリダイレクトされます。

## bnmp lint/format を優先使用

| biome | bnmp（リダイレクト先） |
|-------|----------------------|
| biome lint | bnmp lint |
| biome format | bnmp format |
| biome check | bnmp check |
| biome ci | bnmp check |

## bnmp コマンド

```bash
# リント
bnmp lint [paths]
bnmp lint --fix [paths]

# フォーマット
bnmp format [paths]
bnmp format --check [paths]

# 両方
bnmp check [paths]
```

## biome.json がある場合

biome.jsonが存在するプロジェクトでは、bnmpが自動検出して使用。
bnmpは軽量なlint/formatを提供するが、biome固有の機能が必要な場合は：

```bash
# biomeを直接使う場合（bnmpリダイレクトをバイパス）
node_modules/.bin/biome check .
```

## 対応言語（bnmp lint/format）

- JavaScript / TypeScript / JSX / TSX
- (検出: console.log, var使用, 末尾空白)

## なぜbnmpか

| 比較 | bnmp | Biome |
|------|------|-------|
| 起動速度 | 非常に高速（Zig製） | 高速（Rust製） |
| 依存関係 | 不要 | node_modules必要 |
| 統合 | パッケージ管理と統合 | 単体ツール |
