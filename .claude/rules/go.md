---
paths: "**/*.go"
---

# Go言語開発ルール

## 概要

Go言語を使用したプロジェクトのベストプラクティスとルールを定義します。

## 開発環境

| ツール | バージョン | 用途 |
|--------|-----------|------|
| **Go** | 1.25+ | コンパイラ・ランタイム |
| **gopls** | latest | Language Server |
| **dlv** | latest | Delve デバッガー |
| **staticcheck** | latest | 静的解析 |
| **goimports** | latest | import自動整理 |

## パス設定

```
GOROOT: C:\Program Files\Go
GOPATH: C:\Users\Owner\go
GOBIN:  C:\Users\Owner\go\bin
```

## プロジェクト作成

```bash
# 新規プロジェクト
mkdir myproject && cd myproject
go mod init myproject

# 依存関係追加
go get github.com/example/package

# 依存関係整理
go mod tidy
```

## コマンド一覧

| コマンド | 説明 |
|----------|------|
| `go build` | ビルド |
| `go run .` | 実行 |
| `go test ./...` | テスト実行 |
| `go fmt ./...` | フォーマット |
| `go vet ./...` | 静的解析 |
| `staticcheck ./...` | 詳細な静的解析 |
| `go mod tidy` | 依存関係整理 |

## コーディング規約

### 命名規則

| 種類 | 規則 | 例 |
|------|------|-----|
| パッケージ | 小文字、短く | `http`, `json` |
| 関数（公開） | PascalCase | `GetUser` |
| 関数（非公開） | camelCase | `getUserID` |
| 定数 | PascalCase | `MaxRetries` |
| 変数 | camelCase | `userName` |

### エラーハンドリング

```go
// 良い例
result, err := doSomething()
if err != nil {
    return fmt.Errorf("failed to do something: %w", err)
}

// 悪い例（エラー無視）
result, _ := doSomething()
```

### 構造体

```go
// フィールドはグループ化
type User struct {
    // 識別子
    ID        int64
    UUID      string

    // 基本情報
    Name      string
    Email     string

    // タイムスタンプ
    CreatedAt time.Time
    UpdatedAt time.Time
}
```

## パフォーマンス

### スライス初期化

```go
// 良い例（容量指定）
slice := make([]string, 0, expectedSize)

// 悪い例
var slice []string
for i := 0; i < n; i++ {
    slice = append(slice, item) // 再アロケーション発生
}
```

### 文字列結合

```go
// 良い例
var builder strings.Builder
for _, s := range items {
    builder.WriteString(s)
}
result := builder.String()

// 悪い例
result := ""
for _, s := range items {
    result += s // 毎回新しい文字列を生成
}
```

## 並行処理

### Goroutine

```go
// errgroup使用
g, ctx := errgroup.WithContext(ctx)
for _, item := range items {
    item := item // ループ変数キャプチャ
    g.Go(func() error {
        return process(ctx, item)
    })
}
if err := g.Wait(); err != nil {
    return err
}
```

### チャネル

```go
// バッファ付きチャネル推奨
ch := make(chan Result, 10)

// 必ずクローズ
defer close(ch)
```

## テスト

### 構造

```
project/
├── handler.go
├── handler_test.go      # 同じパッケージ
├── handler_internal_test.go  # 内部テスト
└── testdata/            # テストデータ
```

### テーブル駆動テスト

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive", 1, 2, 3},
        {"negative", -1, -2, -3},
        {"zero", 0, 0, 0},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := Add(tt.a, tt.b)
            if result != tt.expected {
                t.Errorf("got %d, want %d", result, tt.expected)
            }
        })
    }
}
```

## 推奨ライブラリ

| 用途 | ライブラリ |
|------|-----------|
| Web | chi, echo, fiber |
| CLI | cobra, urfave/cli |
| ログ | slog (標準), zap, zerolog |
| DB | sqlx, ent, gorm |
| テスト | testify, gomock |
| 設定 | viper, envconfig |

## 禁止事項

| 禁止 | 代替 |
|------|------|
| `panic`の乱用 | エラーを返す |
| グローバル変数 | 依存性注入 |
| `interface{}` | ジェネリクス |
| init()の乱用 | 明示的初期化 |

## Go vs Rust vs Zig 使い分け

| 用途 | 言語 | 理由 |
|------|------|------|
| CLIツール | Zig | 最速ビルド、シングルバイナリ |
| Webサービス | Go | 標準ライブラリ充実、並行処理 |
| システム | Rust | メモリ安全、最高性能 |
| GUI | Rust+gpui | ネイティブ性能 |

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2026年1月11日 | 初版作成 |
