---
paths: "**/*"
---

---
name: migration
description: 技術スタック移行ワークフロー
tools:
  - Bash
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - WebSearch
  - mcp__context7__*
---

# 技術スタック移行スキル

フレームワークやライブラリの移行を安全に行うワークフロー。

## 目的

既存のコードベースを新しい技術スタックに段階的に移行する。

## よくある移行パターン

| From | To | 複雑度 |
|------|-----|--------|
| CRA → Vite | 低 |
| Next.js → Astro | 中 |
| Firebase → Supabase | 高 |
| ESLint+Prettier → Biome | 低 |
| npm → Bun | 低 |
| Express → Hono | 中 |

## ワークフロー

### Step 1: 現状分析

1. **依存関係の把握**
   ```bash
   cat package.json
   bun pm ls
   ```

2. **コードベースの規模**
   ```bash
   find . -name "*.ts" -o -name "*.tsx" | wc -l
   cloc .
   ```

3. **テストカバレッジ**
   ```bash
   bun test --coverage
   ```

### Step 2: 移行計画

```markdown
# 移行計画

## 目標
- 移行先技術: XXX
- 完了目標: YYYY年MM月DD日

## フェーズ

### Phase 1: 準備（1週目）
- [ ] 新技術の調査
- [ ] POC作成
- [ ] 移行スクリプト作成

### Phase 2: 段階的移行（2-3週目）
- [ ] 共通コンポーネント移行
- [ ] ページ移行
- [ ] API移行

### Phase 3: 完了（4週目）
- [ ] 旧コード削除
- [ ] テスト実行
- [ ] デプロイ

## リスク
- リスク1: 対策
- リスク2: 対策
```

### Step 3: 並行運用環境

```typescript
// 段階的移行のためのフィーチャーフラグ
const USE_NEW_STACK = process.env.USE_NEW_STACK === "true";

if (USE_NEW_STACK) {
  // 新しい実装
} else {
  // 旧実装
}
```

### Step 4: 自動変換

#### ESLint → Biome

```bash
# 設定ファイル移行
bunx @biomejs/biome migrate eslint --write

# ESLint削除
bun remove eslint eslint-config-* eslint-plugin-*
rm .eslintrc.*
```

#### npm → Bun

```bash
# lockファイル削除
rm package-lock.json

# Bunでインストール
bun install

# スクリプト更新
# npm run → bun run
```

### Step 5: テスト実行

```bash
# 移行前後で同じテストが通ることを確認
bun test

# E2Eテスト
bun run test:e2e
```

### Step 6: ロールバック計画

```bash
# Gitブランチ戦略
git checkout -b migration/to-new-stack
git checkout main  # ロールバック時
```

## 移行例: Firebase → Supabase

### 1. Supabaseプロジェクト作成

```bash
bunx supabase init
```

### 2. データ移行スクリプト

```typescript
// scripts/migrate-firebase-to-supabase.ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { createClient } from "@supabase/supabase-js";

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateCollection(name: string) {
  const snapshot = await getDocs(collection(db, name));
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  const { error } = await supabase.from(name).insert(data);
  if (error) throw error;
}

await migrateCollection("users");
await migrateCollection("posts");
```

### 3. 認証移行

- Firebase Auth → Supabase Auth
- ユーザーデータのエクスポート/インポート

### 4. クライアントコード更新

```typescript
// Before (Firebase)
import { doc, getDoc } from "firebase/firestore";
const docSnap = await getDoc(doc(db, "users", id));

// After (Supabase)
const { data } = await supabase.from("users").select().eq("id", id).single();
```

## チェックリスト

- [ ] 現状の依存関係を把握
- [ ] 移行計画を作成
- [ ] POCで動作確認
- [ ] データ移行スクリプト作成
- [ ] 段階的にコード移行
- [ ] テスト実行
- [ ] ロールバック手順確認
- [ ] 本番デプロイ
- [ ] 旧コード削除
