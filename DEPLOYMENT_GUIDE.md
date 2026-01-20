# Readdy AI Clone - デプロイメントガイド

このガイドでは、Readdy AI CloneアプリケーションをVercel、Cloudflare Pages、またはGitHub Pagesにデプロイする方法を説明します。

## 前提条件

- ✅ Node.js 20以上がインストール済み
- ✅ プロジェクトがビルド済み（`npm run build` 実行済み）
- ✅ Cloudflare Workers APIがデプロイ済み
- ✅ 必要なAPIキーを取得済み（OpenAI、Supabase）

## オプション1: Vercelへのデプロイ（推奨）

### 方法A: Vercel Dashboard（最も簡単）

1. [Vercel](https://vercel.com) にアクセスしてログイン
2. **New Project** をクリック
3. GitHubリポジトリをインポート、またはローカルプロジェクトをアップロード
4. プロジェクト設定:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (デフォルト)
   - **Build Command**: `npm run build` (自動検出)
   - **Output Directory**: `.next` (自動検出)
5. **Deploy** をクリック
6. デプロイが完了したらURLを確認（例: `https://your-app.vercel.app`）

### 方法B: Vercel CLI

```bash
# Vercel CLIをインストール（未インストールの場合）
npm install -g vercel

# プロジェクトディレクトリで実行
cd D:\NEXTCLOUD\Web_app\Web_readdy_ai

# ログイン
vercel login

# デプロイ（初回は対話式で設定）
vercel

# 本番環境へのデプロイ
vercel --prod
```

### Vercel環境変数の設定

Vercelダッシュボードで以下の環境変数を設定（任意）:

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `NEXT_PUBLIC_WORKERS_API_URL` | `https://readdy-ai-workers.sayasaya.workers.dev` | Workers APIのURL |

> **注意**: フロントエンドのAPIキーはユーザーがブラウザで入力するため、環境変数として設定する必要はありません（BYOK設計）。

## オプション2: Cloudflare Pagesへのデプロイ

### 方法A: Cloudflare Dashboard

1. [Cloudflare Dashboard](https://dash.cloudflare.com) にログイン
2. **Workers & Pages** > **Pages** > **Create a project**
3. **Connect to Git** を選択してGitHubリポジトリを接続
4. ビルド設定:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
5. **Save and Deploy**

### 方法B: Wrangler CLI

```bash
# Wrangler CLIでPages機能を使用
cd D:\NEXTCLOUD\Web_app\Web_readdy_ai

# ビルド
npm run build

# Pagesにデプロイ
npx wrangler pages deploy .next --project-name=readdy-ai-clone

# または、静的エクスポートを使用
npm run build && npm run export
npx wrangler pages deploy out --project-name=readdy-ai-clone
```

### Next.jsの静的エクスポート設定（必要な場合）

`next.config.js` を編集:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

その後:
```bash
npm run build
# outディレクトリが生成される
```

## オプション3: GitHub Pagesへのデプロイ

### ステップ1: 静的エクスポートの設定

1. `next.config.js` を作成/編集:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/readdy-ai-clone', // リポジトリ名に合わせる
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

2. `package.json` にエクスポートスクリプトを追加:

```json
{
  "scripts": {
    "export": "next build"
  }
}
```

### ステップ2: ビルドとデプロイ

```bash
# ビルドと静的エクスポート
npm run export

# outディレクトリが生成される
# GitHub Pagesにpush
git add out
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix out origin gh-pages
```

### ステップ3: GitHub Pagesを有効化

1. GitHubリポジトリの **Settings** > **Pages**
2. **Source**: `Deploy from a branch`
3. **Branch**: `gh-pages` / `root`
4. **Save**

数分後、`https://<username>.github.io/readdy-ai-clone/` でアクセス可能になります。

## デプロイ後の確認事項

### 1. Workers APIへの接続確認

ブラウザの開発者ツールを開いて、以下を確認:

```javascript
// Console
fetch('https://readdy-ai-workers.sayasaya.workers.dev/health')
  .then(r => r.json())
  .then(console.log)
```

期待される結果:
```json
{
  "status": "ok",
  "timestamp": "2025-01-21T..."
}
```

### 2. APIキー設定の確認

1. デプロイされたアプリにアクセス
2. **設定** ページを開く
3. 以下のAPIキーを入力:
   - OpenAI API Key
   - Supabase URL
   - Supabase Service Role Key
4. **保存** をクリック

### 3. 各機能のテスト

#### テキストからコード生成
1. **新規プロジェクト** をクリック
2. プロジェクト名を入力
3. **テキスト** モードを選択
4. プロンプトを入力: "Create a simple landing page"
5. **作成開始** をクリック

#### 画像からUI生成
1. **新規プロジェクト** をクリック
2. **画像** モードを選択
3. UIデザイン画像をアップロード
4. **作成開始** をクリック

#### URLクローン
1. **新規プロジェクト** をクリック
2. **URL** モードを選択
3. URLを入力: `https://example.com`
4. **作成開始** をクリック

### 4. デプロイ機能のテスト

1. プロジェクトを作成/編集
2. **デプロイ** ボタンをクリック
3. デプロイ先を選択（Vercel/GitHub Pages/Cloudflare Pages）
4. 必要なAPIキー/トークンを入力（設定済みの場合は不要）
5. **デプロイ** をクリック

## カスタムドメインの設定

### Vercel

1. Vercelダッシュボードでプロジェクトを選択
2. **Settings** > **Domains**
3. カスタムドメインを追加
4. DNS設定で指示されたレコードを追加

### Cloudflare Pages

1. Cloudflare Dashboard > **Pages** > プロジェクトを選択
2. **Custom domains** > **Set up a custom domain**
3. ドメインを入力（Cloudflare管理ドメインの場合は自動設定）

### GitHub Pages

1. リポジトリ **Settings** > **Pages**
2. **Custom domain** にドメインを入力
3. DNS設定:
   ```
   Type: CNAME
   Name: www (または @)
   Value: <username>.github.io
   ```

## パフォーマンス最適化

### 1. 画像最適化

Next.jsの `<Image>` コンポーネントを使用（静的エクスポート時は `unoptimized: true` が必要）

### 2. コード分割

動的インポートを使用:
```typescript
import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
  loading: () => <p>Loading...</p>
})
```

### 3. キャッシュ戦略

Vercel/Cloudflare Pagesは自動的にCDNキャッシュを最適化します。

## トラブルシューティング

### エラー: "Failed to fetch Workers API"

**原因**: CORSエラー、またはWorkers APIがダウンしている

**対処法**:
1. Workers APIのURLが正しいか確認
2. `workers/api/src/index.ts` でCORS設定を確認:
   ```typescript
   app.use('*', cors({
     origin: '*',
     allowMethods: ['GET', 'POST', 'OPTIONS'],
   }))
   ```

### エラー: "Module not found"

**原因**: 依存関係が不足している

**対処法**:
```bash
npm install
npm run build
```

### Vercelデプロイエラー: "Build failed"

**原因**: Node.jsバージョンの不一致、または環境変数の不足

**対処法**:
1. `package.json` に `engines` フィールドを追加:
   ```json
   {
     "engines": {
       "node": ">=20.0.0"
     }
   }
   ```
2. Vercelダッシュボードで **Settings** > **General** > **Node.js Version** を20.xに設定

### GitHub Pagesで404エラー

**原因**: `basePath` が正しく設定されていない

**対処法**:
`next.config.js` の `basePath` をリポジトリ名と一致させる:
```javascript
basePath: '/your-repo-name'
```

## 本番環境のセキュリティチェックリスト

- [ ] すべてのAPIキーが暗号化されている（Cloudflare Workers）
- [ ] CORS設定が適切（必要なオリジンのみ許可）
- [ ] HTTPSが有効
- [ ] 環境変数がGitにコミットされていない
- [ ] APIレート制限が設定されている
- [ ] エラーメッセージに機密情報が含まれていない
- [ ] CSP（Content Security Policy）ヘッダーが設定されている

## 継続的デプロイ（CI/CD）

### GitHub Actions（推奨）

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Vercel Git Integration（最も簡単）

GitHubリポジトリを接続すると、`main` ブランチへのpush時に自動デプロイされます。

## サポート

デプロイに関する詳細情報:

- [Vercel Documentation](https://vercel.com/docs)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [GitHub Pages Documentation](https://docs.github.com/pages)
