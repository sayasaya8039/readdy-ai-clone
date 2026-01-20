# Readdy AI Workers API

Cloudflare Workers上で動作するReaddy AIのバックエンドAPIです。

## 機能

- **コード生成**: OpenAI GPT-4oを使用したReact/Next.jsコード生成
- **プロジェクト管理**: Supabaseを使用したプロジェクトデータの永続化
- **CORS対応**: すべてのオリジンからのアクセスを許可
- **エラーハンドリング**: 適切なエラーレスポンスを返却

## デプロイ済みURL

**Production**: https://readdy-ai-workers.sayasaya.workers.dev

## エンドポイント

### GET `/`
API情報とエンドポイント一覧を返します。

### GET `/health`
ヘルスチェックエンドポイント。

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-20T16:54:07.913Z",
  "service": "Readdy AI Workers API"
}
```

### GET `/api/projects`
プロジェクト一覧を取得します（Supabase連携）。

**Response:**
```json
{
  "projects": [
    {
      "id": "uuid",
      "name": "Project Name",
      "description": "Description",
      "pages": [],
      "created_at": "2026-01-20T00:00:00Z",
      "updated_at": "2026-01-20T00:00:00Z",
      "user_id": "uuid"
    }
  ],
  "total": 1
}
```

### POST `/api/generate`
OpenAI APIを使用してコードを生成します。

**Request:**
```json
{
  "prompt": "Create a landing page with hero section",
  "model": "gpt-4o",
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**Response:**
```json
{
  "success": true,
  "code": "// Generated React/Next.js code",
  "usage": {
    "prompt_tokens": 100,
    "completion_tokens": 500,
    "total_tokens": 600
  }
}
```

## 環境変数の設定

APIを動作させるには、以下の環境変数（Secrets）を設定する必要があります。

### 必須の環境変数

| 変数名 | 説明 |
|--------|------|
| `OPENAI_API_KEY` | OpenAI APIキー（GPT-4oアクセス用） |
| `SUPABASE_URL` | SupabaseプロジェクトのURL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabaseサービスロールキー |

### 設定方法

#### 方法1: Cloudflareダッシュボード

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン
2. Workers & Pages → readdy-ai-workers を選択
3. Settings → Variables and Secrets
4. "Add variable" をクリック
5. Type: Secret を選択
6. 以下の変数を追加：
   - Name: `OPENAI_API_KEY`, Value: `sk-...`
   - Name: `SUPABASE_URL`, Value: `https://xxx.supabase.co`
   - Name: `SUPABASE_SERVICE_ROLE_KEY`, Value: `eyJ...`
7. "Deploy" をクリックして再デプロイ

#### 方法2: wrangler CLI

```bash
# OpenAI API Key
wrangler secret put OPENAI_API_KEY
# プロンプトが表示されたら、APIキーを入力

# Supabase URL
wrangler secret put SUPABASE_URL
# プロンプトが表示されたら、URLを入力

# Supabase Service Role Key
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# プロンプトが表示されたら、キーを入力
```

#### 方法3: wrangler secret bulk

```bash
# secrets.jsonを作成
cat > secrets.json << 'EOF'
{
  "OPENAI_API_KEY": "sk-your-openai-key",
  "SUPABASE_URL": "https://xxx.supabase.co",
  "SUPABASE_SERVICE_ROLE_KEY": "eyJ..."
}
EOF

# 一括登録
wrangler secret bulk secrets.json

# secrets.jsonを削除（セキュリティのため）
rm secrets.json
```

## 開発

### ローカル開発サーバー起動

```bash
bnmp run dev
# または
wrangler dev
```

### デプロイ

```bash
bnmp run deploy
# または
wrangler deploy
```

### ログ確認

```bash
bnmp run tail
# または
wrangler tail
```

## 技術スタック

- **Framework**: Hono 4.11.4
- **Runtime**: Cloudflare Workers
- **TypeScript**: 5.9.3
- **Deploy Tool**: Wrangler 3.114.17
- **AI**: OpenAI GPT-4o
- **Database**: Supabase

## セキュリティ

- すべての機密情報（APIキー）はWrangler Secretsで管理
- CORS設定により、すべてのオリジンからのアクセスを許可
- エラーメッセージは適切にマスク

## ライセンス

MIT License
