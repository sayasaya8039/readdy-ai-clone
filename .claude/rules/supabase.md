---
paths: "**/supabase/**, **/.env*"
---

Supabase（オープンソースFirebase代替）の開発を支援します。

## Supabaseとは

- **PostgreSQL**: フルマネージドリレーショナルDB
- **認証**: GoTrue（JWT、OAuth、Magic Link）
- **ストレージ**: S3互換ファイルストレージ
- **リアルタイム**: WebSocket購読
- **Edge Functions**: Deno Runtime
- **Auto API**: REST/GraphQL自動生成
- **pgvector**: AI/ベクトル検索対応

## Firebase → Supabase 移行ガイド

| Firebase | Supabase | 備考 |
|----------|----------|------|
| Firestore | PostgreSQL | SQLクエリ可能 |
| Firebase Auth | GoTrue | JWT、多様なプロバイダー |
| Cloud Storage | Supabase Storage | S3互換 |
| Realtime DB | Realtime | WebSocket |
| Cloud Functions | Edge Functions | Deno Runtime |

## クイックリファレンス

### CLIインストール
```bash
# グローバルインストール
bun add -g supabase

# プロジェクトローカル
bun add -D supabase
```

### プロジェクト初期化
```bash
# ローカル開発環境セットアップ
supabase init

# Supabaseプロジェクトにリンク
supabase link --project-ref <project-id>

# ローカルDB起動（Docker必須）
supabase start

# ローカルDB停止
supabase stop
```

### マイグレーション
```bash
# 新規マイグレーション作成
supabase migration new <name>

# マイグレーション適用
supabase db push

# DBリセット
supabase db reset

# 差分確認
supabase db diff
```

### Edge Functions
```bash
# 新規Function作成
supabase functions new <name>

# ローカル実行
supabase functions serve

# デプロイ
supabase functions deploy <name>
```

### 型生成
```bash
# TypeScript型定義を生成
supabase gen types typescript --local > src/types/database.ts

# リモートDBから生成
supabase gen types typescript --project-id <id> > src/types/database.ts
```

## クライアント設定

### インストール
```bash
bun add @supabase/supabase-js
```

### 初期化（TypeScript）
```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types/database'

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)
```

### 基本操作
```typescript
// SELECT
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)

// INSERT
const { data, error } = await supabase
  .from('posts')
  .insert({ title: 'Hello', content: 'World' })
  .select()

// UPDATE
const { data, error } = await supabase
  .from('posts')
  .update({ title: 'Updated' })
  .eq('id', postId)

// DELETE
const { error } = await supabase
  .from('posts')
  .delete()
  .eq('id', postId)
```

### 認証
```typescript
// サインアップ
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// ログイン
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
})

// ログアウト
await supabase.auth.signOut()

// セッション取得
const { data: { session } } = await supabase.auth.getSession()
```

### ストレージ
```typescript
// アップロード
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('user1/avatar.png', file)

// ダウンロードURL取得
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('user1/avatar.png')

// 削除
await supabase.storage
  .from('avatars')
  .remove(['user1/avatar.png'])
```

### リアルタイム購読
```typescript
// テーブル変更を購読
const channel = supabase
  .channel('posts-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'posts' },
    (payload) => console.log('Change:', payload)
  )
  .subscribe()

// 購読解除
supabase.removeChannel(channel)
```

## 環境変数

```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # サーバーサイドのみ
```

## Row Level Security (RLS)

```sql
-- RLS有効化
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- ポリシー作成（認証ユーザーのみ読み取り可）
CREATE POLICY "Users can read own posts"
ON posts FOR SELECT
USING (auth.uid() = user_id);

-- ポリシー作成（認証ユーザーのみ作成可）
CREATE POLICY "Users can create posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

## 実行内容

1. **$ARGUMENTS** の内容に応じて適切なSupabase操作を実行
2. context7で最新のSupabase APIを確認
3. 型定義を自動生成
4. RLSポリシーを適切に設定

---

## 追加ルール（rules統合）

# Supabase開発ルール

Supabase（Firebase代替）の開発ガイドライン。

## 選択基準

以下の場合はSupabaseを最優先で選択（Firebaseより優先）：

| 条件 | 理由 |
|------|------|
| リレーショナルDB必要 | PostgreSQL（SQLが使える） |
| 認証機能 | GoTrue（JWT、多様なプロバイダー） |
| ファイルストレージ | S3互換Storage |
| リアルタイム同期 | WebSocket対応 |
| Edge Functions | Deno Runtime |
| AI/ベクトル検索 | pgvector統合 |
| セルフホスト | オープンソース（Docker対応） |
| コスト重視 | 無料枠が大きい |

## プロジェクト初期化

```bash
# Supabase CLI
bunx supabase init
bunx supabase start  # ローカル開発

# クライアント
bun add @supabase/supabase-js
```

## クライアント設定

```typescript
// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## データベース操作

```typescript
// 取得
const { data, error } = await supabase
  .from("users")
  .select("*")
  .eq("status", "active")
  .order("created_at", { ascending: false });

// 挿入
const { data, error } = await supabase
  .from("users")
  .insert({ name: "John", email: "john@example.com" })
  .select();

// 更新
const { data, error } = await supabase
  .from("users")
  .update({ name: "Jane" })
  .eq("id", 1)
  .select();

// 削除
const { error } = await supabase
  .from("users")
  .delete()
  .eq("id", 1);

// リレーション
const { data } = await supabase
  .from("posts")
  .select(`
    *,
    author:users(name, email)
  `);
```

## 認証

```typescript
// サインアップ
const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "password",
});

// サインイン
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password",
});

// OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: "google",
});

// サインアウト
await supabase.auth.signOut();

// セッション取得
const { data: { session } } = await supabase.auth.getSession();

// ユーザー取得
const { data: { user } } = await supabase.auth.getUser();
```

## ストレージ

```typescript
// アップロード
const { data, error } = await supabase.storage
  .from("avatars")
  .upload(`${userId}/avatar.png`, file);

// ダウンロード
const { data } = supabase.storage
  .from("avatars")
  .getPublicUrl(`${userId}/avatar.png`);

// 削除
const { error } = await supabase.storage
  .from("avatars")
  .remove([`${userId}/avatar.png`]);
```

## リアルタイム

```typescript
// チャンネル購読
const channel = supabase
  .channel("room1")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "messages" },
    (payload) => {
      console.log("New message:", payload.new);
    }
  )
  .subscribe();

// 購読解除
supabase.removeChannel(channel);
```

## Row Level Security (RLS)

```sql
-- ポリシー有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 読み取りポリシー
CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (auth.uid() = id);

-- 書き込みポリシー
CREATE POLICY "Users can update own data"
ON users FOR UPDATE
USING (auth.uid() = id);
```

## Edge Functions

```typescript
// supabase/functions/hello/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { name } = await req.json();
  return new Response(
    JSON.stringify({ message: `Hello ${name}!` }),
    { headers: { "Content-Type": "application/json" } }
  );
});
```

```bash
# デプロイ
bunx supabase functions deploy hello
```

## マイグレーション

```bash
# 新規マイグレーション
bunx supabase migration new create_users

# マイグレーション適用
bunx supabase db push

# リセット
bunx supabase db reset
```

## 型生成

```bash
# 型定義生成
bunx supabase gen types typescript --local > src/types/database.ts
```

```typescript
import { Database } from "./types/database";

const supabase = createClient<Database>(url, key);
```

## ベストプラクティス

| 項目 | ガイドライン |
|------|-------------|
| RLS | 必ず有効化 |
| 型安全 | 型生成を使用 |
| エラー処理 | error をチェック |
| 環境変数 | APIキーは環境変数で管理 |
