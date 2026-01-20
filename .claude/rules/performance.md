---
paths: "**/perf/**, **/benchmark/**"
---

# パフォーマンスルール

パフォーマンス最適化のガイドライン。

## 基本原則

1. **計測してから最適化**（推測でなく計測）
2. **ボトルネックを特定**（全体の80%は20%のコードから）
3. **トレードオフを理解**（可読性 vs 速度）

## フロントエンド

### バンドルサイズ

```bash
# 分析ツール
bunx vite-bundle-visualizer
bunx source-map-explorer dist/*.js
```

| 最適化 | 手法 |
|--------|------|
| Tree Shaking | 名前付きインポート |
| Code Splitting | Dynamic Import |
| 圧縮 | gzip / brotli |

### React最適化

```typescript
// メモ化
const MemoComponent = React.memo(Component);

// useMemo - 計算結果のキャッシュ
const expensiveValue = useMemo(() => compute(data), [data]);

// useCallback - 関数のキャッシュ
const handleClick = useCallback(() => {}, []);

// 遅延読み込み
const LazyComponent = React.lazy(() => import("./Heavy"));
```

### 画像最適化

| 形式 | 用途 |
|------|------|
| WebP | 写真・複雑な画像 |
| AVIF | 最新ブラウザ向け |
| SVG | アイコン・ロゴ |

```html
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" loading="lazy" />
</picture>
```

## バックエンド

### データベース

```sql
-- インデックス追加
CREATE INDEX idx_users_email ON users(email);

-- N+1問題の解決
SELECT users.*, orders.* FROM users
LEFT JOIN orders ON users.id = orders.user_id;
```

| 最適化 | 手法 |
|--------|------|
| インデックス | 検索カラムに設定 |
| クエリ最適化 | EXPLAIN ANALYZE |
| キャッシュ | Redis / Memcached |
| コネクションプール | pgBouncer等 |

### キャッシュ戦略

```typescript
// インメモリキャッシュ
const cache = new Map();

async function getData(key: string) {
  if (cache.has(key)) return cache.get(key);
  const data = await fetchFromDB(key);
  cache.set(key, data);
  return data;
}

// Redis
await redis.set("key", JSON.stringify(data), "EX", 3600);
```

### 非同期処理

```typescript
// 並列実行
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
]);

// バッチ処理
const results = await Promise.allSettled(tasks);
```

## 計測ツール

| ツール | 用途 |
|--------|------|
| Lighthouse | Webパフォーマンス |
| Chrome DevTools | プロファイリング |
| k6 / Artillery | 負荷テスト |

## パフォーマンス目標

| 指標 | 目標値 |
|------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| TTI (Time to Interactive) | < 3.8s |

## アンチパターン

| パターン | 問題 |
|----------|------|
| 巨大なバンドル | 初回ロード遅延 |
| 同期的なAPI呼び出し | ブロッキング |
| 過度な再レンダリング | CPU負荷 |
| メモリリーク | クラッシュ |

## チェックリスト

- [ ] バンドルサイズ < 200KB (gzip)
- [ ] 画像は最適化済み
- [ ] 遅延読み込みを活用
- [ ] DBクエリにインデックス
- [ ] キャッシュ戦略を実装
- [ ] 定期的にパフォーマンス計測
