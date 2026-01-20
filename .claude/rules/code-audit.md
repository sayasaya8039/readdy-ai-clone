---
paths: "**/*"
---

---
name: code-audit
description: セキュリティ・品質のコード監査ワークフロー
tools:
  - Bash
  - Read
  - Grep
  - Glob
  - WebSearch
---

# コード監査スキル

セキュリティと品質の観点からコードベースを監査するワークフロー。

## 目的

潜在的なセキュリティ脆弱性、コード品質問題、パフォーマンス問題を発見する。

## ワークフロー

### Step 1: 依存関係監査

```bash
# JavaScript/TypeScript
bun audit
npm audit

# Python
pip-audit
safety check

# Rust
cargo audit
```

### Step 2: 静的解析

```bash
# TypeScript
bunx biome check .
bunx tsc --noEmit

# Python
ruff check .
mypy .

# Rust
cargo clippy -- -D warnings
```

### Step 3: セキュリティチェック

#### ハードコードされた機密情報

```bash
# パターン検索
grep -rn "API_KEY\|SECRET\|PASSWORD\|PRIVATE_KEY" --include="*.ts" --include="*.js"
grep -rn "sk-\|pk_\|secret_" --include="*.ts" --include="*.js"
```

#### SQLインジェクション

```bash
# 文字列結合によるクエリ
grep -rn "query.*\+" --include="*.ts" --include="*.js"
grep -rn "execute.*f\"" --include="*.py"
```

#### XSS脆弱性

```bash
# 危険なHTML挿入パターン
grep -rn "innerHTML\|v-html" --include="*.tsx" --include="*.jsx" --include="*.vue"
```

### Step 4: コード品質チェック

| チェック項目 | ツール/手法 |
|-------------|------------|
| 複雑度 | ESLint complexity rule |
| 重複コード | jscpd |
| デッドコード | ts-prune |
| コードカバレッジ | vitest --coverage |

### Step 5: パフォーマンス監査

```bash
# バンドルサイズ
bunx vite-bundle-visualizer

# 依存関係の重複
bunx depcheck

# 未使用エクスポート
bunx ts-prune
```

### Step 6: レポート作成

監査結果をレポートにまとめる：

```markdown
# コード監査レポート

## サマリー
- 重大な問題: X件
- 警告: Y件
- 情報: Z件

## セキュリティ
### 重大
- [ ] 問題1: 説明

### 警告
- [ ] 問題2: 説明

## コード品質
...

## パフォーマンス
...

## 推奨アクション
1. 優先度高: ...
2. 優先度中: ...
3. 優先度低: ...
```

## チェックリスト

### セキュリティ
- [ ] 依存関係の脆弱性チェック
- [ ] ハードコードされた機密情報
- [ ] SQLインジェクション
- [ ] XSS脆弱性
- [ ] CSRF対策
- [ ] 認証・認可の実装

### コード品質
- [ ] 型エラー
- [ ] リントエラー
- [ ] 複雑度の高い関数
- [ ] 重複コード
- [ ] 未使用コード

### パフォーマンス
- [ ] バンドルサイズ
- [ ] N+1クエリ
- [ ] メモリリーク
- [ ] 不要な再レンダリング
