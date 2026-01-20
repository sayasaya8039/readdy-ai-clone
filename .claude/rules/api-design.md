---
paths: "**/*"
---

---
name: api-design
description: REST/GraphQL API設計ワークフロー
tools:
  - Read
  - Write
  - WebSearch
  - mcp__context7__*
---

# API設計スキル

RESTful APIまたはGraphQL APIの設計ワークフロー。

## 目的

一貫性があり、使いやすく、スケーラブルなAPIを設計する。

## ワークフロー

### Step 1: 要件分析

1. **リソースの特定**
   - 主要なエンティティを洗い出す
   - リレーションシップを定義

2. **操作の特定**
   - CRUD操作
   - カスタムアクション

3. **ユースケース確認**
   - クライアントの要件
   - パフォーマンス要件

### Step 2: スキーマ設計

#### REST API

```yaml
# OpenAPI仕様
openapi: 3.0.0
info:
  title: My API
  version: 1.0.0

paths:
  /users:
    get:
      summary: ユーザー一覧取得
      responses:
        200:
          description: 成功
    post:
      summary: ユーザー作成
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUser'

  /users/{id}:
    get:
      summary: ユーザー取得
    put:
      summary: ユーザー更新
    delete:
      summary: ユーザー削除

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        email:
          type: string
```

#### GraphQL

```graphql
type Query {
  users: [User!]!
  user(id: ID!): User
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}

type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

input CreateUserInput {
  name: String!
  email: String!
}
```

### Step 3: エンドポイント設計原則

| 原則 | 説明 |
|------|------|
| リソース指向 | 名詞を使用（`/users`、`/posts`） |
| 複数形 | コレクションは複数形（`/users`） |
| ネスト | 関連リソースは浅くネスト（`/users/{id}/posts`） |
| バージョニング | `/v1/users` または `Accept: application/vnd.api.v1+json` |

### Step 4: レスポンス設計

```typescript
// 成功レスポンス
{
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}

// エラーレスポンス
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

### Step 5: 認証・認可

| 方式 | 用途 |
|------|------|
| JWT | ステートレス認証 |
| API Key | サーバー間通信 |
| OAuth 2.0 | サードパーティ連携 |

### Step 6: ドキュメント生成

```bash
# OpenAPI → ドキュメント
bunx @redocly/cli build-docs openapi.yaml

# TypeScript型生成
bunx openapi-typescript openapi.yaml -o src/types/api.ts
```

## チェックリスト

- [ ] リソースとエンドポイントの定義
- [ ] リクエスト/レスポンススキーマ
- [ ] 認証方式の決定
- [ ] エラーハンドリング設計
- [ ] ページネーション設計
- [ ] レート制限設計
- [ ] OpenAPI仕様書作成
- [ ] ドキュメント生成
