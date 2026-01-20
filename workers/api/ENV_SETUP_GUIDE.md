# Cloudflare Workers 環境変数設定ガイド

このガイドでは、Readdy AI Workers APIに必要な環境変数の設定方法を説明します。

## 必要な環境変数

| 変数名 | 説明 | セキュリティレベル |
|--------|------|-------------------|
| `OPENAI_API_KEY` | OpenAI APIキー（GPT-4o使用） | 🔒 機密 |
| `SUPABASE_URL` | SupabaseプロジェクトURL | 🔓 公開可 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabaseサービスロールキー | 🔒 機密 |

## 方法1: Cloudflare Dashboard（推奨）

### ステップ1: Cloudflare Dashboardにアクセス

1. [Cloudflare Dashboard](https://dash.cloudflare.com) にログイン
2. 左サイドバーから **Workers & Pages** を選択
3. デプロイ済みの `readdy-ai-workers` を見つけてクリック

### ステップ2: 環境変数を設定

1. **Settings** タブをクリック
2. **Variables and Secrets** セクションまでスクロール
3. **Environment Variables** で **Add variable** をクリック

### ステップ3: 各変数を追加

#### OpenAI API Key（機密情報）
- Variable name: `OPENAI_API_KEY`
- Type: **Encrypt** を選択（鍵マークをクリック）
- Value: 取得したOpenAI APIキーを貼り付け
- **Add variable** をクリック

#### Supabase URL
- Variable name: `SUPABASE_URL`
- Type: Text（暗号化不要）
- Value: `https://xxxxx.supabase.co` 形式のURL
- **Add variable** をクリック

#### Supabase Service Role Key（機密情報）
- Variable name: `SUPABASE_SERVICE_ROLE_KEY`
- Type: **Encrypt** を選択
- Value: 取得したサービスロールキーを貼り付け
- **Add variable** をクリック

### ステップ4: 変更を保存

- **Save** または **Deploy** ボタンをクリック
- Workerが自動的に再デプロイされます

## 方法2: Wrangler CLI（開発者向け）

コマンドラインからの設定を好む場合：

```bash
# Workers API ディレクトリに移動
cd workers/api

# 各シークレットを対話式で設定
wrangler secret put OPENAI_API_KEY
# → プロンプトが表示されるのでAPIキーを入力してEnter

wrangler secret put SUPABASE_URL
# → Supabase URLを入力してEnter

wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# → サービスロールキーを入力してEnter
```

### Wrangler CLIのインストール（未インストールの場合）

```bash
npm install -g wrangler
# または
pnpm add -g wrangler
```

## APIキーの取得方法

### 1. OpenAI API Key

#### 取得手順

1. [OpenAI Platform](https://platform.openai.com) にアクセス
2. アカウントにログインまたは新規登録
3. 右上のアカウントメニューをクリック
4. **API keys** を選択
5. **Create new secret key** をクリック
6. 名前を入力（例: "Readdy AI Workers"）
7. **Create secret key** をクリック
8. ⚠️ **表示されたキーをすぐにコピー**（再表示できません）

#### キー形式
```
sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
または
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### 課金設定
- OpenAI APIは従量課金制です
- [Billing Settings](https://platform.openai.com/account/billing) で支払い方法を設定
- 使用量制限の設定を推奨（例: 月$10まで）

### 2. Supabase URL と Service Role Key

#### 取得手順

1. [Supabase Dashboard](https://supabase.com/dashboard) にアクセス
2. アカウントにログインまたは新規登録
3. プロジェクトを選択（新規作成の場合は **New Project** をクリック）
4. 左サイドバーから **Settings** > **API** を選択
5. **Project URL** をコピー
6. **Project API keys** セクションで **service_role** キーをコピー

#### URL形式
```
https://xxxxxxxxxxxxx.supabase.co
```

#### Service Role Key形式
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...（長い文字列）
```

⚠️ **注意**: `service_role` キーは全権限を持つため、絶対に公開しないでください。`anon` キーではなく `service_role` キーを使用してください。

## 設定確認

### テスト1: デプロイ確認

```bash
cd workers/api
wrangler deploy
```

成功メッセージが表示されればOKです。

### テスト2: APIエンドポイント動作確認

#### テキストからコード生成

```bash
curl -X POST https://readdy-ai-workers.sayasaya.workers.dev/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a simple React button component",
    "model": "gpt-4o",
    "temperature": 0.7,
    "max_tokens": 500
  }'
```

#### 画像からコード生成

```bash
bash workers/api/test-generate-from-image.sh
```

#### URLクローン

```bash
bash workers/api/test-clone-from-url.sh
```

### 期待される結果

成功時のレスポンス例：
```json
{
  "success": true,
  "code": "import React from 'react';\n\nexport default function Button() {\n  return <button>Click me</button>;\n}",
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 30,
    "total_tokens": 80
  }
}
```

エラー時のレスポンス例：
```json
{
  "error": "OpenAI API key not configured"
}
```

## トラブルシューティング

### エラー: "OpenAI API key not configured"

**原因**: `OPENAI_API_KEY` が設定されていない、または誤っている

**対処法**:
1. Cloudflare Dashboardで変数が正しく設定されているか確認
2. 暗号化（Encrypt）が有効になっているか確認
3. APIキーが正しい形式（`sk-proj-...` または `sk-...`）か確認
4. 再デプロイを試す: `wrangler deploy`

### エラー: "Insufficient quota"

**原因**: OpenAIの使用量制限に達した、または支払い方法が未設定

**対処法**:
1. [OpenAI Usage](https://platform.openai.com/usage) で使用状況を確認
2. [Billing Settings](https://platform.openai.com/account/billing) で支払い方法を設定
3. 使用量制限を引き上げる

### エラー: "Failed to fetch from Supabase"

**原因**: Supabase認証情報が誤っている

**対処法**:
1. `SUPABASE_URL` が正しい形式か確認（`https://xxxxx.supabase.co`）
2. `SUPABASE_SERVICE_ROLE_KEY` が `anon` キーではなく `service_role` キーか確認
3. Supabaseプロジェクトが有効化されているか確認

### Wrangler CLIエラー: "Not authenticated"

**対処法**:
```bash
wrangler login
# ブラウザが開き、Cloudflareアカウントでログイン
```

## セキュリティのベストプラクティス

### ✅ すべきこと

- 環境変数は常に **Encrypt（暗号化）** を使用
- APIキーは絶対にGitにコミットしない
- 開発環境と本番環境で異なるAPIキーを使用
- OpenAI APIの使用量制限を設定
- 定期的にAPIキーをローテーション

### ❌ してはいけないこと

- APIキーをコード内にハードコードしない
- `anon` キーを `service_role` キーとして使用しない
- 環境変数をパブリックリポジトリにコミットしない
- APIキーを平文で保存しない
- 不要なアクセス権限を付与しない

## 次のステップ

環境変数の設定が完了したら：

1. ✅ フロントエンドのビルドとデプロイ
2. ✅ 全機能の統合テスト
3. ✅ ドキュメントの完成
4. ✅ 本番環境へのデプロイ

## サポート

問題が解決しない場合：

- [Cloudflare Workers ドキュメント](https://developers.cloudflare.com/workers/)
- [OpenAI API ドキュメント](https://platform.openai.com/docs)
- [Supabase ドキュメント](https://supabase.com/docs)
