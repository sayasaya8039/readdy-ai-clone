---
paths: "**/routes/**, **/router/**"
---

# TanStack Router ルール

## 概要

TanStack Routerは**型安全性を最優先**としたReact/Solidアプリケーション向けルーター。
React RouterやNext.js App Routerの代替として使用。

## ⚠️ 積極的に使う場面

**以下の場面ではTanStack Routerを優先的に使用すること：**

| 場面 | 理由 |
|------|------|
| **SPAでの型安全なルーティング** | 100%型推論、ナビゲーションエラー防止 |
| **検索パラメータを多用するアプリ** | URLにuseState、自動パース/シリアライズ |
| **複雑なネストレイアウト** | ネストルート、レイアウトルート対応 |
| **データローディング最適化** | 組み込みSWRキャッシュ、プリフェッチ |
| **TanStack Query併用時** | 深い統合、シームレスなデータ管理 |

## 使用優先順位

| 優先度 | ルーター | 用途 |
|--------|---------|------|
| **1（最優先）** | **TanStack Router** | SPA、型安全性重視、Vite + React |
| 2 | Next.js App Router | SSR/SSG、フルスタック |
| 3 | React Router | レガシー、シンプルなSPA |

## インストール

```bash
bun add @tanstack/react-router
bun add -D @tanstack/router-plugin @tanstack/router-devtools
```

## Vite設定

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
  ],
})
```

## 基本構造

### ファイルベースルーティング（推奨）

```
src/
├── routes/
│   ├── __root.tsx        # ルートレイアウト
│   ├── index.tsx         # / ページ
│   ├── about.tsx         # /about ページ
│   ├── posts/
│   │   ├── index.tsx     # /posts ページ
│   │   └── $postId.tsx   # /posts/:postId ページ
│   └── _layout/          # パスレスレイアウト
│       └── settings.tsx
├── routeTree.gen.ts      # 自動生成
└── main.tsx
```

### ルート定義

```typescript
// routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div>
      <nav>{/* ナビゲーション */}</nav>
      <Outlet />
    </div>
  ),
})
```

```typescript
// routes/posts/$postId.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId')({
  // 型安全なパラメータ
  loader: async ({ params }) => {
    return fetchPost(params.postId) // params.postId は string 型
  },
  component: PostComponent,
})

function PostComponent() {
  const { postId } = Route.useParams()
  const post = Route.useLoaderData()
  return <div>{post.title}</div>
}
```

## 検索パラメータ（Search Params）

**URLにuseState** - TanStack Routerの最大の特徴：

```typescript
// routes/products.tsx
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  page: z.number().default(1),
  filter: z.string().optional(),
  sort: z.enum(['name', 'price', 'date']).default('name'),
})

export const Route = createFileRoute('/products')({
  validateSearch: searchSchema,
  component: ProductsComponent,
})

function ProductsComponent() {
  // 型安全な検索パラメータ
  const { page, filter, sort } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <button onClick={() => navigate({ search: { page: page + 1 } })}>
      次のページ
    </button>
  )
}
```

## データローディング

### 組み込みローダー

```typescript
export const Route = createFileRoute('/users')({
  loader: async () => {
    const users = await fetchUsers()
    return { users }
  },
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: ({ error }) => <div>Error: {error.message}</div>,
  component: UsersComponent,
})
```

### TanStack Query連携

```typescript
import { useSuspenseQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/users')({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(usersQueryOptions())
  },
  component: UsersComponent,
})

function UsersComponent() {
  const { data: users } = useSuspenseQuery(usersQueryOptions())
  return <UserList users={users} />
}
```

## ナビゲーション

### Link コンポーネント

```typescript
import { Link } from '@tanstack/react-router'

// 型安全なリンク - 存在しないルートはエラー
<Link to="/posts/$postId" params={{ postId: '123' }}>
  記事を見る
</Link>

// 検索パラメータ付き
<Link to="/products" search={{ page: 2, sort: 'price' }}>
  価格順で見る
</Link>
```

### プログラマティックナビゲーション

```typescript
const navigate = useNavigate()

// 型安全なナビゲーション
navigate({ to: '/posts/$postId', params: { postId: '123' } })

// 検索パラメータ更新
navigate({ search: (prev) => ({ ...prev, page: prev.page + 1 }) })
```

## 認証・ガード

```typescript
// routes/__root.tsx
export const Route = createRootRoute({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
})
```

## DevTools

```typescript
// main.tsx
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <TanStackRouterDevtools router={router} />
    </>
  )
}
```

## ベストプラクティス

| 項目 | ガイドライン |
|------|-------------|
| ルーティング方式 | ファイルベース推奨（自動型生成） |
| 検索パラメータ | Zodでバリデーション |
| データ取得 | TanStack Queryと併用 |
| 型安全性 | `routeTree.gen.ts`を常に最新に |
| エラー処理 | `errorComponent`を必ず定義 |

## React Router からの移行

| React Router | TanStack Router |
|--------------|-----------------|
| `useParams()` | `Route.useParams()` |
| `useSearchParams()` | `Route.useSearch()` |
| `useNavigate()` | `Route.useNavigate()` or `useNavigate()` |
| `<Outlet />` | `<Outlet />` (同じ) |
| `loader` | `loader` (同じ概念) |

## 注意事項

- **routeTree.gen.ts**: 自動生成ファイル、手動編集禁止
- **型エラー**: ルート追加後は `bun run dev` で再生成
- **SSR**: TanStack Startを使用（別パッケージ）
