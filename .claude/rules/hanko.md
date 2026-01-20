---
paths: "**/hanko/**, **/auth/**"
---

Hanko（パスワードレス認証）の実装を支援します。

## Hankoとは

- **パスキー優先認証**: WebAuthn/FIDO2対応
- **OAuth/SAML**: Google、GitHub、SAML SSO
- **Web Components**: `<hanko-auth>`, `<hanko-profile>`
- **オープンソース**: Auth0/Clerkの代替

## サブコマンド

### `/hanko init`

```bash
# フロントエンド依存関係追加
bun add @teamhanko/hanko-elements
```

### `/hanko setup`

1. Hanko Cloud アカウント作成
2. プロジェクト作成・API URL取得
3. 環境変数設定

### `/hanko component`

React/TypeScript用コンポーネント生成：

```typescript
// components/auth/HankoAuth.tsx
import { useEffect } from 'react'
import { register } from '@teamhanko/hanko-elements'

export function HankoAuth() {
  useEffect(() => {
    register(import.meta.env.VITE_HANKO_API_URL)
  }, [])
  
  return <hanko-auth />
}
```

### `/hanko cloud`

Hanko Cloud設定ガイドを表示

## 環境変数テンプレート

```env
VITE_HANKO_API_URL=https://xxx.hanko.io
```

## 実行内容

1. **$ARGUMENTS** に応じた操作を実行
2. context7で最新のHanko APIを確認
3. 必要なコンポーネント・設定を生成
4. セキュリティベストプラクティスを適用

---

## 追加ルール（rules統合）

# Hanko認証ルール

## Hankoとは

**Hankoはパスワードレス認証を中心としたオープンソース認証プラットフォーム**

Auth0/Clerkの代替として、パスキー・OAuth・SAML SSOをサポート。

## 認証選択の優先度

| 優先度 | 認証方式 | 用途 |
|--------|----------|------|
| **1** | **Hanko** | パスキー優先、モダン認証 |
| 2 | Supabase Auth | Supabase利用時 |
| 3 | Firebase Auth | Firebase利用時 |
| 4 | 独自実装 | 特殊要件のみ |

## インストール

```bash
# フロントエンド
bun add @teamhanko/hanko-elements

# バックエンド（Go）
go get github.com/teamhanko/hanko
```

## フロントエンド実装

### React/TypeScript

```typescript
import { register } from '@teamhanko/hanko-elements'

const hankoApi = import.meta.env.VITE_HANKO_API_URL

register(hankoApi).catch(console.error)

// ログインコンポーネント
export function Login() {
  return <hanko-auth />
}

// プロフィールコンポーネント
export function Profile() {
  return <hanko-profile />
}
```

### 認証状態の確認

```typescript
import { Hanko } from '@teamhanko/hanko-elements'

const hanko = new Hanko(hankoApi)

// セッション確認
const isValid = await hanko.session.isValid()

// ユーザー情報取得
const user = await hanko.user.getCurrent()

// ログアウト
await hanko.user.logout()
```

## Docker Compose（セルフホスト）

```yaml
services:
  hanko:
    image: ghcr.io/teamhanko/hanko:latest
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgres://...
      - SECRETS_SESSION=your-secret
```

## 環境変数

```env
VITE_HANKO_API_URL=https://xxx.hanko.io
# または
HANKO_API_URL=http://localhost:8000
```

## Hanko Cloud vs セルフホスト

| 観点 | Hanko Cloud | セルフホスト |
|------|-------------|-------------|
| 設定 | 簡単 | Docker必要 |
| コスト | 無料枠あり | インフラ費用 |
| 制御 | 制限あり | 完全制御 |

## 推奨事項

- **パスキー優先**: パスワードレスをデフォルトに
- **フォールバック**: メール認証も併用
- **セッション**: HTTPOnly Cookieを使用
