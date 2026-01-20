---
paths: "**/hono/**, **/api/**"
---

# Hono開発ルール

Honoフレームワークの開発ガイドライン。

## 基本構成

```
src/
├── index.ts          # エントリーポイント
├── routes/           # ルート定義
│   ├── index.ts
│   └── users.ts
├── middleware/       # ミドルウェア
├── services/         # ビジネスロジック
├── types/            # 型定義
└── utils/            # ユーティリティ
```

## プロジェクト初期化

```bash
bun create hono my-app
cd my-app
bun install
```

## 基本的なルート定義

```typescript
import { Hono } from "hono";

const app = new Hono();

// 基本ルート
app.get("/", (c) => c.text("Hello Hono!"));

// JSONレスポンス
app.get("/api/users", (c) => {
  return c.json({ users: [] });
});

// パスパラメータ
app.get("/users/:id", (c) => {
  const id = c.req.param("id");
  return c.json({ id });
});

// クエリパラメータ
app.get("/search", (c) => {
  const query = c.req.query("q");
  return c.json({ query });
});

// リクエストボディ
app.post("/users", async (c) => {
  const body = await c.req.json();
  return c.json(body, 201);
});

export default app;
```

## ミドルウェア

```typescript
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

// 組み込みミドルウェア
app.use("*", logger());
app.use("*", cors());
app.use("*", secureHeaders());

// カスタムミドルウェア
app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  console.log(`${c.req.method} ${c.req.path} - ${Date.now() - start}ms`);
});
```

## バリデーション（Zod）

```typescript
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

app.post(
  "/users",
  zValidator("json", userSchema),
  async (c) => {
    const data = c.req.valid("json");
    return c.json(data, 201);
  }
);
```

## エラーハンドリング

```typescript
import { HTTPException } from "hono/http-exception";

// エラースロー
app.get("/error", () => {
  throw new HTTPException(404, { message: "Not Found" });
});

// グローバルエラーハンドラ
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: err.message }, 500);
});

// 404ハンドラ
app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});
```

## Cloudflare Workers対応

```typescript
// wrangler.toml
// name = "my-app"
// main = "src/index.ts"
// compatibility_date = "2024-01-01"

import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
  KV: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  const value = await c.env.KV.get("key");
  return c.json({ value });
});

export default app;
```

## RPC（クライアント生成）

```typescript
// server
import { Hono } from "hono";

const app = new Hono()
  .get("/users", (c) => c.json([{ id: 1, name: "John" }]))
  .post("/users", async (c) => {
    const body = await c.req.json();
    return c.json(body, 201);
  });

export type AppType = typeof app;

// client
import { hc } from "hono/client";
import type { AppType } from "./server";

const client = hc<AppType>("http://localhost:3000");
const res = await client.users.$get();
const users = await res.json();
```

## デプロイ

```bash
# Cloudflare Workers
wrangler deploy

# Bun
bun run src/index.ts

# Node.js
node --experimental-modules dist/index.js
```

## ベストプラクティス

| 項目 | ガイドライン |
|------|-------------|
| ルート分割 | 機能ごとにファイル分割 |
| 型安全 | Bindings, Variables型を定義 |
| バリデーション | Zodで入力を検証 |
| エラー | HTTPExceptionを使用 |
