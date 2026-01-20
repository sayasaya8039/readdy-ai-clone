# 本番環境デプロイ手順

## 方法1: GitHub + Vercel連携（推奨）

### ステップ1: GitHubリポジトリ作成

1. [GitHub](https://github.com/new) で新しいリポジトリを作成
   - Repository name: `readdy-ai-clone`
   - Public または Private を選択
   - "Initialize with README" は **チェックしない**

### ステップ2: リモートリポジトリに接続

```bash
cd D:\NEXTCLOUD\Web_app\Web_readdy_ai
git remote add origin https://github.com/YOUR_USERNAME/readdy-ai-clone.git
git branch -M main
git push -u origin main
```

### ステップ3: Vercelでインポート

1. [Vercel Dashboard](https://vercel.com/new) にアクセス
2. **Import Git Repository** をクリック
3. GitHubアカウントを接続（初回のみ）
4. `readdy-ai-clone` リポジトリを選択
5. **Import** をクリック
6. プロジェクト設定（自動検出）:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
7. **Deploy** をクリック

### ステップ4: デプロイ完了

数分後、以下のようなURLでアクセス可能になります：
```
https://readdy-ai-clone.vercel.app
```

または

```
https://readdy-ai-clone-your-username.vercel.app
```

## 方法2: Vercel CLI（コマンドライン）

### ステップ1: Vercel CLIインストール

```bash
npm install -g vercel
```

### ステップ2: ログイン

```bash
vercel login
```

ブラウザが開き、Vercelアカウントでログインします。

### ステップ3: デプロイ

```bash
cd D:\NEXTCLOUD\Web_app\Web_readdy_ai

# 初回デプロイ（対話式）
vercel

# 質問に回答:
# - Set up and deploy? Yes
# - Which scope? 自分のアカウントを選択
# - Link to existing project? No
# - Project name: readdy-ai-clone
# - Directory: ./ (現在のディレクトリ)

# 本番環境へのデプロイ
vercel --prod
```

## 方法3: Cloudflare Pages

### ステップ1: GitHubにプッシュ（必須）

```bash
git remote add origin https://github.com/YOUR_USERNAME/readdy-ai-clone.git
git push -u origin main
```

### ステップ2: Cloudflare Pagesでインポート

1. [Cloudflare Dashboard](https://dash.cloudflare.com) にログイン
2. **Workers & Pages** > **Pages** > **Create a project**
3. **Connect to Git** を選択
4. GitHubリポジトリを接続
5. `readdy-ai-clone` を選択
6. ビルド設定:
   - Framework preset: **Next.js**
   - Build command: `npm run build`
   - Build output directory: `.next`
7. **Save and Deploy**

デプロイ完了後のURL例：
```
https://readdy-ai-clone.pages.dev
```

## デプロイ後の確認事項

### 1. Workers APIへの接続確認

ブラウザの開発者ツール > Consoleで実行：

```javascript
fetch('https://readdy-ai-workers.sayasaya.workers.dev/health')
  .then(r => r.json())
  .then(console.log)
```

期待される結果：
```json
{
  "status": "ok",
  "timestamp": "2025-01-21T..."
}
```

### 2. APIキー設定

1. デプロイされたアプリにアクセス
2. **設定** ページを開く
3. 以下のAPIキーを入力:
   - OpenAI API Key
   - Supabase URL
   - Supabase Service Role Key
   - Cloudflare Workers API URL: `https://readdy-ai-workers.sayasaya.workers.dev`
4. **保存** をクリック

### 3. 動作テスト

#### テキストからコード生成

1. **新規プロジェクト** をクリック
2. プロジェクト名: `Production Test`
3. **テキスト** モードを選択
4. プロンプト: `Create a simple React button`
5. **作成開始** をクリック
6. コードが生成されることを確認

#### デプロイ機能テスト

1. 作成したプロジェクトで **デプロイ** をクリック
2. Vercel/GitHub Pages/Cloudflare Pagesのいずれかを選択
3. 認証情報を入力
4. デプロイが成功することを確認

## カスタムドメイン設定（オプション）

### Vercel

1. Vercelダッシュボードでプロジェクトを選択
2. **Settings** > **Domains**
3. カスタムドメインを追加
4. DNS設定でCNAMEレコードを追加:
   ```
   CNAME  www  cname.vercel-dns.com
   ```

### Cloudflare Pages

1. Cloudflare Dashboard > **Pages** > プロジェクトを選択
2. **Custom domains** > **Set up a custom domain**
3. ドメインを入力
4. Cloudflareで管理しているドメインの場合は自動設定

## 環境変数（オプション）

Vercel/Cloudflare Pagesのダッシュボードで環境変数を設定できます：

| 変数名 | 値 |
|--------|-----|
| `NEXT_PUBLIC_WORKERS_API_URL` | `https://readdy-ai-workers.sayasaya.workers.dev` |

**注意**: フロントエンドのAPIキーはユーザーがブラウザで入力するため、環境変数として設定する必要はありません（BYOK設計）。

## トラブルシューティング

### デプロイが失敗する

**原因**: 依存関係のインストールエラー

**対処法**:
```bash
# ローカルで確認
npm install
npm run build

# package-lock.json を削除して再試行
rm package-lock.json
npm install
```

### Workers APIに接続できない

**原因**: CORSエラー

**対処法**:
`workers/api/src/index.ts` でCORS設定を確認:
```typescript
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
}))
```

### 環境変数が設定されていない

Workers APIの環境変数を確認:
```bash
cd workers/api
wrangler secret list
```

## 継続的デプロイ（自動）

GitHubリポジトリと連携した場合、以下の動作が自動化されます：

- `main` ブランチへのpush → 本番環境に自動デプロイ
- プルリクエスト作成 → プレビュー環境を自動作成

## サポート

- [Vercel Documentation](https://vercel.com/docs)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**デプロイ完了後、URLをREADME.mdに追加してください！**
