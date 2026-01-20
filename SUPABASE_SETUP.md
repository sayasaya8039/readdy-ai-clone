# Supabase セットアップガイド

このプロジェクトはSupabaseをデータベースとして使用します。

## 前提条件

- Supabaseアカウント（https://supabase.com）

## セットアップ手順

### 1. Supabaseプロジェクトを作成

1. https://supabase.com/dashboard にアクセス
2. 「New Project」をクリック
3. プロジェクト名、データベースパスワード、リージョンを設定
4. 「Create new project」をクリック

### 2. データベーステーブルを作成

#### 方法A: SQL Editorで実行（推奨）

1. Supabaseダッシュボードで「SQL Editor」を開く
2. 以下のSQLファイルの内容を順番に実行：
   - `supabase/migrations/20260120194001_initial_schema.sql`
   - `supabase/migrations/20260121_disable_rls_for_development.sql`

#### 方法B: Supabase CLIを使用

```bash
# Supabase CLIのインストール
npm install -g supabase

# プロジェクトにリンク
supabase link --project-ref your-project-ref

# マイグレーション実行
supabase db push
```

### 3. API認証情報を取得

1. Supabaseダッシュボードで「Settings」→「API」を開く
2. 以下の情報をコピー：
   - **Project URL** (`https://xxxxx.supabase.co`)
   - **anon public key** (`eyJhbG...`)
   - **service_role key** (`eyJhbG...`)

### 4. アプリに設定

1. アプリの「Settings」ページを開く
2. 以下の情報を入力：
   - **Supabase URL**: Project URL
   - **Supabase Anon Key**: anon public key
   - **Supabase Service Key**: service_role key（オプション）
3. 「Save」をクリック

## トラブルシューティング

### エラー: "プロジェクトの読み込みに失敗しました"

**原因**: RLS（Row Level Security）が有効で、認証なしでデータにアクセスできない

**解決策**: 以下のSQLを実行してRLSを無効化（開発用）

```sql
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE assets DISABLE ROW LEVEL SECURITY;
ALTER TABLE agents DISABLE ROW LEVEL SECURITY;
```

### テーブルが存在しない

**解決策**: セットアップ手順2を実行してテーブルを作成

## セキュリティ注意事項

⚠️ **本番環境では以下を実装してください:**

1. **認証機能の実装**（Supabase Auth）
2. **RLSの有効化**
3. **適切なポリシーの設定**

現在の設定は開発用です。本番環境ではセキュリティリスクがあります。
