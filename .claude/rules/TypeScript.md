---
paths: "**/*.ts, **/*.tsx"
---

---
paths: "src/**/*.ts, src/**/*.tsx"
---

# TypeScript開発ルール

## 型定義
- `any` の使用は原則禁止（やむを得ない場合はコメントで理由を記載）
- 明示的な型定義を優先
- インターフェースと型エイリアスを適切に使い分ける

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

// Avoid
const user: any = { ... };
```

## API開発ルール
- 全APIエンドポイントは入力検証必須
- 標準エラーレスポンス形式を使用
- リクエスト・レスポンスの型を定義

```typescript
// エラーレスポンス形式
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
```

## 命名規則
- インターフェース: PascalCase（`I` プレフィックスは付けない）
- 型エイリアス: PascalCase
- 列挙型: PascalCase、メンバーはUPPER_SNAKE_CASE

## null/undefined
- `null` と `undefined` を明確に区別
- オプショナルチェイニング `?.` を活用
- Nullish合体演算子 `??` を使用

## 非同期処理
- `async/await` を優先
- エラーハンドリングは `try/catch` で適切に処理
- Promise.all で並列実行を活用
