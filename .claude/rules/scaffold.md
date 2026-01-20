---
paths: "**/*"
---

プロジェクトの足場（ファイル構造）を作成します。

## 対応するタイプ

| タイプ | コマンド | 説明 |
|--------|----------|------|
| **component** | `/scaffold component Button` | Reactコンポーネント |
| **page** | `/scaffold page Dashboard` | ページコンポーネント |
| **api** | `/scaffold api users` | APIエンドポイント |
| **hook** | `/scaffold hook useAuth` | カスタムフック |
| **util** | `/scaffold util formatDate` | ユーティリティ関数 |
| **test** | `/scaffold test Button` | テストファイル |

## 実行内容

1. **タイプに応じたファイル作成**
2. **テンプレートコード生成**
3. **関連ファイルの作成**（テスト、型定義など）

## 生成例

### component
```
src/components/Button/
├── Button.tsx
├── Button.test.tsx
├── Button.module.css
└── index.ts
```

### page
```
src/pages/Dashboard/
├── Dashboard.tsx
├── Dashboard.test.tsx
└── index.ts
```

### api (Hono)
```
src/routes/users/
├── index.ts
├── handlers.ts
└── schema.ts
```

### hook
```
src/hooks/
├── useAuth.ts
└── useAuth.test.ts
```

## オプション

- `--no-test`: テストファイルを作成しない
- `--no-style`: スタイルファイルを作成しない
- `--dir <path>`: 作成先ディレクトリを指定

$ARGUMENTS からタイプと名前を解析。

## 命名規則

- コンポーネント: PascalCase (Button, UserCard)
- フック: camelCase with use prefix (useAuth)
- ユーティリティ: camelCase (formatDate)
- API: kebab-case (user-settings)
