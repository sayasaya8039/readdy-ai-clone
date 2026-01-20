---
paths: "**/next.config.*, **/app/**, **/pages/**"
---

# Next.js / Hono 開発ルール

## 共通ルール

### Bun優先使用（必須）

```bash
# パッケージ管理
bun install              # npm installの代わり
bun add <package>        # npm install <package>の代わり
bun add -d <package>     # 開発依存

# スクリプト実行
bun run dev              # npm run devの代わり
bun run build
bun run start

# パッケージ実行
bunx <package>           # npxの代わり
```

**Bunを使用する理由:**
- インストール速度が10倍以上高速
- TypeScript/TSXをトランスパイルなしで実行
- `bun.lockb` でより高速なロックファイル

---

## Next.js ルール

### プロジェクト作成

```bash
bunx create-next-app@latest my-app
cd my-app
bun install
```

### App Router（推奨）

```text
app/
├── layout.tsx        # ルートレイアウト
├── page.tsx          # ホームページ
├── globals.css
├── (auth)/           # ルートグループ
│   ├── login/
│   └── register/
└── api/              # APIルート
    └── users/
        └── route.ts
```

### Server Components vs Client Components

```tsx
// デフォルトはServer Component
// app/page.tsx
export default function Page() {
  return <div>Server Component</div>
}

// Client Componentが必要な場合のみ 'use client'
// app/components/Counter.tsx
'use client'
import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### データ取得

```tsx
// Server Componentでのデータ取得（推奨）
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store', // 動的データ
    // cache: 'force-cache', // 静的データ
    // next: { revalidate: 60 }, // ISR
  })
  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <div>{data.title}</div>
}
```

### APIルート

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ users: [] })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ created: body }, { status: 201 })
}
```

---

## Hono ルール

### プロジェクト作成

```bash
bun create hono@latest my-app
# テンプレート: cloudflare-workers
cd my-app
bun install
```

### 基本構成

```typescript
// src/index.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

const app = new Hono()

// ミドルウェア
app.use('*', logger())
app.use('*', cors())
app.use('*', prettyJSON())

// ルート
app.get('/', (c) => c.text('Hello Hono!'))

app.get('/api/users', (c) => {
  return c.json({ users: [] })
})

app.post('/api/users', async (c) => {
  const body = await c.req.json()
  return c.json({ created: body }, 201)
})

// エラーハンドリング
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: err.message }, 500)
})

export default app
```

### Cloudflare Workers デプロイ

```bash
# ローカル開発
bun run dev

# デプロイ
bun run deploy
# または
bunx wrangler deploy
```

### wrangler.toml

```toml
name = "my-app"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[vars]
ENVIRONMENT = "production"
```

---

## 共通の禁止事項

- `npm` / `npx` の使用（Bunを使用すること）
- `pages/` ディレクトリの使用（Next.js App Router推奨）
- `getServerSideProps` / `getStaticProps`（App Routerでは非推奨）
- `any` 型の使用
- 不要な `'use client'` の追加
