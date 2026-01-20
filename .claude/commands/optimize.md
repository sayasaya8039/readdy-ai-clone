---
description: パフォーマンス分析と最適化
allowed-tools: Bash(bun:*), Bash(bunx:*), Read, Grep, Glob
argument-hint: [ファイル/ディレクトリ]
---

パフォーマンス分析と最適化提案を行います。

## 実行内容

1. **パフォーマンス分析**
   - バンドルサイズ分析
   - 依存関係の重複チェック
   - 不要なインポート検出

2. **ボトルネック特定**
   - 大きなファイル検出
   - 複雑な関数検出
   - N+1クエリパターン検出

3. **最適化提案**
   - コード分割提案
   - 遅延読み込み提案
   - メモ化提案

## 分析項目

### バンドルサイズ
```bash
bunx vite-bundle-visualizer
bunx source-map-explorer dist/*.js
```

### 依存関係
```bash
bunx depcheck
bun pm ls --all
```

### コード複雑度
- 関数の行数
- ネストの深さ
- 循環的複雑度

## 最適化パターン

### React
- `React.memo()` でメモ化
- `useMemo` / `useCallback` の適用
- 動的インポート `React.lazy()`

### 一般
- 不要な再レンダリング防止
- API呼び出しのキャッシュ
- 画像の最適化

## オプション

- `--bundle`: バンドルサイズのみ
- `--deps`: 依存関係のみ
- `--code`: コード複雑度のみ

$ARGUMENTS で対象を指定。
