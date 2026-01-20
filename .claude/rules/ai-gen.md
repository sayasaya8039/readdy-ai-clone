---
paths: "**/*"
---

AIを活用してコード・コンポーネントを生成します。

## 実行内容

### 1. 要件分析
- $ARGUMENTS から生成対象を特定
- 既存コードベースのスタイルを確認
- 必要な依存関係を特定

### 2. 最新情報収集
- WebSearchで最新のベストプラクティスを確認
- context7でライブラリの最新APIを確認

### 3. コード生成
- プロジェクトのコーディングスタイルに合わせて生成
- 型定義を含める（TypeScript）
- テストコードも生成（オプション）

### 4. 配置
- 適切なディレクトリに配置
- 必要なインポートを追加

## 生成可能なもの

### React/TypeScript
| 対象 | 例 |
|------|-----|
| コンポーネント | `Button`, `Modal`, `Form` |
| フック | `useAuth`, `useFetch` |
| ユーティリティ | `formatDate`, `validateEmail` |
| API | `fetchUsers`, `createPost` |

### Python
| 対象 | 例 |
|------|-----|
| クラス | `UserService`, `DataProcessor` |
| 関数 | `parse_data`, `send_email` |
| デコレータ | `@retry`, `@cache` |

### Rust
| 対象 | 例 |
|------|-----|
| 構造体 | `User`, `Config` |
| トレイト | `Validate`, `Serialize` |
| モジュール | `auth`, `db` |

## オプション

| オプション | 説明 |
|-----------|------|
| `--with-test` | テストコードも生成 |
| `--minimal` | 最小限の実装 |
| `--full` | 完全な実装（エラーハンドリング含む） |
| `--dry-run` | 生成結果をプレビュー |

## 使用例

```bash
/ai-gen ユーザー認証フック
/ai-gen 画像アップロードコンポーネント --with-test
/ai-gen CSVパーサー関数
```

$ARGUMENTS で生成対象を説明。
