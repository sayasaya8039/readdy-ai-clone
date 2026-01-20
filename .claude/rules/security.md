---
paths: "**/*.env*, **/auth/**, **/security/**"
---

---
description: セキュリティチェック
allowed-tools: Bash(bun:*), Bash(npm:*), Read, Grep, Glob
argument-hint: [ファイル/ディレクトリ]
---

セキュリティチェックを実行します。

## 実行内容

1. **脆弱性スキャン**
   - 依存関係の脆弱性チェック
   - コードの脆弱性パターン検出

2. **機密情報チェック**
   - APIキー・パスワードの検出
   - .envファイルの確認
   - .gitignoreの確認

3. **レポート生成**
   - 重要度別に分類
   - 修正提案

## チェック項目

| カテゴリ | チェック内容 |
|---------|-------------|
| **XSS** | 入力値のサニタイズ |
| **SQLi** | SQLインジェクション |
| **CSRF** | トークン検証 |
| **Auth** | 認証・認可 |
| **Secrets** | 機密情報の露出 |

## コマンド

Binary file ./claude.exe matches
Binary file ./uv.exe matches

## オプション

- : 依存関係のみ
- : コードのみ
- : 機密情報のみ

$ARGUMENTS で対象を指定。

## 重要度

| レベル | 対応 |
|--------|------|
| Critical | 即座に修正 |
| High | 24時間以内 |
| Medium | 1週間以内 |
| Low | 次回リリースまで |

---

## 追加ルール（rules統合）

# セキュリティルール

セキュリティを考慮した開発ガイドライン。

## 機密情報の取り扱い

### 禁止事項

| 禁止事項 | 代替手段 |
|----------|---------|
| APIキーのハードコード | 環境変数 |
| パスワードのソースコード内記載 | シークレット管理サービス |
| 認証情報のログ出力 | マスキング |
| .envのGitコミット | .gitignore |

### 環境変数の使用

```typescript
// ❌ 禁止
const API_KEY = "sk-xxxxx";

// ✅ 推奨
const API_KEY = process.env.API_KEY;
if (!API_KEY) throw new Error("API_KEY is required");
```

### .gitignore必須項目

```
.env
.env.*
*.pem
*.key
credentials.json
secrets/
```

## 入力検証

### サニタイズ

```typescript
// SQLインジェクション対策
const query = sql`SELECT * FROM users WHERE id = ${userId}`;

// XSS対策
const safeHtml = DOMPurify.sanitize(userInput);
```

### バリデーション

```typescript
import { z } from "zod";

const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});
```

## 認証・認可

| 項目 | 推奨 |
|------|------|
| パスワード保存 | bcrypt / Argon2 |
| セッション | JWT / セキュアCookie |
| HTTPS | 必須 |
| CORS | 明示的に設定 |

## 依存関係の脆弱性

```bash
# 脆弱性チェック
bun audit
npm audit
pip-audit
cargo audit
```

## HTTPセキュリティヘッダー

```typescript
// Honoの例
app.use("*", secureHeaders());

// 手動設定
headers: {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Strict-Transport-Security": "max-age=31536000",
  "Content-Security-Policy": "default-src 'self'",
}
```

## ファイルアップロード

| チェック項目 | 対策 |
|-------------|------|
| ファイルタイプ | MIMEタイプ検証 |
| ファイルサイズ | 上限設定 |
| ファイル名 | サニタイズ |
| 保存場所 | 公開ディレクトリ外 |

## レート制限

```typescript
import { rateLimit } from "hono-rate-limit";

app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1分
    max: 100, // リクエスト数
  })
);
```

## エラーハンドリング

```typescript
// ❌ 詳細なエラーを公開
catch (error) {
  return { error: error.stack };
}

// ✅ 一般的なメッセージ
catch (error) {
  console.error(error); // ログには詳細を記録
  return { error: "An error occurred" };
}
```

## セキュリティチェックリスト

- [ ] 機密情報は環境変数で管理
- [ ] 入力値はすべて検証
- [ ] SQLはパラメータ化クエリ
- [ ] XSS対策（エスケープ/サニタイズ）
- [ ] CSRF対策（トークン）
- [ ] HTTPSを強制
- [ ] 依存関係の脆弱性チェック
- [ ] 適切なエラーハンドリング
- [ ] ログに機密情報を含めない
