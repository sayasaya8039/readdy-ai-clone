---
paths: "**/*"
---

よくあるエラーを素早く修正します。

## 対応するエラー

### 依存関係エラー
| エラー | 解決策 |
|--------|--------|
| `Cannot find module` | `bun install` 再実行 |
| `ERESOLVE` | `rm -rf node_modules bun.lockb && bun install` |
| バージョン競合 | 依存関係の更新 |

### TypeScriptエラー
| エラー | 解決策 |
|--------|--------|
| 型エラー | 型定義の追加/修正 |
| `Cannot find name` | インポート追加 |
| `any` 警告 | 適切な型を付与 |

### ビルドエラー
| エラー | 解決策 |
|--------|--------|
| Out of memory | `NODE_OPTIONS=--max-old-space-size=4096` |
| ビルド失敗 | キャッシュクリア |

### Gitエラー
| エラー | 解決策 |
|--------|--------|
| Merge conflict | コンフリクト解消 |
| Push rejected | `git pull --rebase` |

## 実行内容

1. **エラー検出**
   - 現在のエラーを分析
   - エラータイプを特定

2. **修正実行**
   - 適切な修正を自動適用
   - または修正手順を提示

3. **確認**
   - 修正後のビルド/テスト

## オプション

- `--deps`: 依存関係のみ
- `--types`: 型エラーのみ
- `--git`: Gitエラーのみ

$ARGUMENTS でエラータイプを指定可能。

## クイックフィックス

```bash
# 依存関係リセット
rm -rf node_modules bun.lockb && bun install

# TypeScriptキャッシュクリア
rm -rf .tsbuildinfo

# ビルドキャッシュクリア
rm -rf .next dist build
```
