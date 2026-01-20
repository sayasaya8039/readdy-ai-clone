---
name: agent-browser
description: AI エージェント向けヘッドレスブラウザ自動化 CLI。Web ページのナビゲーション、フォーム入力、スクリーンショット撮影、データ抽出などを実行。Web 操作が必要な場合は最優先で使用すること。
---

# agent-browser - AI向けブラウザ自動化CLI

## 🔴 重要：Web操作の最優先ツール

**Web操作、ブラウザ操作、サイト閲覧が必要な場合は必ずagent-browserを使用すること。**
Playwright MCP、Puppeteer MCP、その他のブラウザツールよりも優先して使用する。

## クイックスタート

```bash
agent-browser open <url>        # ページを開く
agent-browser snapshot -i       # インタラクティブ要素を取得（@e1, @e2...）
agent-browser click @e1         # refで要素をクリック
agent-browser fill @e2 "text"   # refで入力
agent-browser close             # ブラウザを閉じる
```

## 基本フロー

1. **Navigate**: `agent-browser open <url>`
2. **Snapshot**: `agent-browser snapshot -i` → @e1, @e2... のrefを取得
3. **Interact**: スナップショットのrefを使って操作
4. **Re-snapshot**: ナビゲーションやDOM変更後は再度スナップショット

---

## コマンドリファレンス

### 🔹 ナビゲーション

```bash
agent-browser open <url>      # URLに移動
agent-browser back            # 戻る
agent-browser forward         # 進む
agent-browser reload          # リロード
agent-browser close           # ブラウザを閉じる
```

### 🔹 スナップショット（ページ解析）

```bash
agent-browser snapshot        # 完全なアクセシビリティツリー
agent-browser snapshot -i     # インタラクティブ要素のみ（推奨）
agent-browser snapshot -c     # コンパクト出力
agent-browser snapshot -d 3   # 深度3に制限
agent-browser snapshot -s "#main"  # CSSセレクタでスコープ
```

### 🔹 要素操作（refベース）

```bash
# クリック系
agent-browser click @e1           # クリック
agent-browser dblclick @e1        # ダブルクリック

# 入力系
agent-browser fill @e2 "text"     # クリア＆入力
agent-browser type @e2 "text"     # クリアせず入力

# キーボード
agent-browser press Enter         # キー押下
agent-browser press Control+a     # キーコンビネーション
agent-browser keydown Shift       # キーを押す
agent-browser keyup Shift         # キーを離す

# その他UI操作
agent-browser hover @e1           # ホバー
agent-browser check @e1           # チェックボックスON
agent-browser uncheck @e1         # チェックボックスOFF
agent-browser select @e1 "value"  # ドロップダウン選択
agent-browser focus @e1           # フォーカス
agent-browser scroll down 500     # スクロール
agent-browser scrollintoview @e1  # 要素を表示領域に
agent-browser drag @e1 @e2        # ドラッグ＆ドロップ
agent-browser upload @e1 "file.txt"  # ファイルアップロード
```

### 🔹 情報取得

```bash
agent-browser get text @e1        # 要素のテキスト
agent-browser get html @e1        # innerHTML
agent-browser get value @e1       # input の value
agent-browser get attr @e1 href   # 属性値
agent-browser get title           # ページタイトル
agent-browser get url             # 現在のURL
agent-browser get count "button"  # マッチする要素数
agent-browser get box @e1         # 要素のバウンディングボックス
```

### 🔹 状態チェック

```bash
agent-browser is visible @e1      # 表示されているか
agent-browser is enabled @e1      # 有効か
agent-browser is checked @e1      # チェックされているか
agent-browser is editable @e1     # 編集可能か
```

### 🔹 スクリーンショット・PDF

```bash
agent-browser screenshot          # stdout に出力
agent-browser screenshot path.png # ファイルに保存
agent-browser screenshot --full   # フルページ
agent-browser pdf output.pdf      # PDF保存
```

### 🔹 待機

```bash
agent-browser wait @e1                     # 要素が表示されるまで
agent-browser wait 2000                    # 2秒待機
agent-browser wait --text "Success"        # テキスト出現を待機
agent-browser wait --url "**/dashboard"    # URL変更を待機
agent-browser wait --load networkidle      # ネットワーク待機
agent-browser wait --load domcontentloaded # DOMロード待機
```

### 🔹 セマンティックロケータ（Find）

```bash
# ロールで検索
agent-browser find role button click --name "Submit"
agent-browser find role textbox fill --name "Email" "user@test.com"

# テキストで検索
agent-browser find text "Sign In" click

# ラベルで検索
agent-browser find label "Email" fill "user@example.com"

# プレースホルダーで検索
agent-browser find placeholder "Enter email" fill "test@test.com"

# testidで検索
agent-browser find testid "submit-btn" click
```

**アクション:** click, fill, check, uncheck, hover, text

### 🔹 JavaScript実行

```bash
agent-browser eval "document.title"
agent-browser eval "window.scrollTo(0, 100)"
```

### 🔹 ブラウザ設定

```bash
agent-browser set viewport 1920 1080    # ビューポート設定
agent-browser set device "iPhone 12"    # デバイスエミュレーション
agent-browser set geo 35.6812 139.7671  # 位置情報（東京）
agent-browser set offline on            # オフラインモード
agent-browser set media dark            # ダークモード
agent-browser set timezone "Asia/Tokyo" # タイムゾーン
agent-browser set locale ja-JP          # ロケール
```

### 🔹 クッキー・ストレージ

```bash
# クッキー
agent-browser cookies                   # 全クッキー取得
agent-browser cookies set name value    # クッキー設定
agent-browser cookies get name          # 特定クッキー取得
agent-browser cookies clear             # クッキークリア

# ローカルストレージ
agent-browser storage local             # localStorage取得
agent-browser storage local set k v     # 値設定
agent-browser storage local get k       # 値取得
agent-browser storage local clear       # クリア

# セッションストレージ
agent-browser storage session           # sessionStorage取得
```

### 🔹 認証状態の保存・復元

```bash
# ログイン状態の保存
agent-browser open https://app.example.com/login
agent-browser fill @e1 "username"
agent-browser fill @e2 "password"
agent-browser click @e3
agent-browser wait --url "**/dashboard"
agent-browser state save auth.json

# 後のセッションで復元
agent-browser state load auth.json
agent-browser open https://app.example.com/dashboard
```

### 🔹 セッション管理（並列ブラウザ）

```bash
# 複数の独立したブラウザを同時実行
agent-browser --session test1 open site-a.com
agent-browser --session test2 open site-b.com
agent-browser session list

# 環境変数でセッション指定
export AGENT_BROWSER_SESSION=mytest
agent-browser click "#btn"
```

各セッションは独立した：
- ブラウザインスタンス
- クッキー
- ナビゲーション履歴
- 認証状態

### 🔹 デバッグ

```bash
agent-browser open example.com --headed  # ブラウザウィンドウを表示
agent-browser console                    # コンソールメッセージ表示
agent-browser errors                     # ページエラー表示
agent-browser network                    # ネットワークリクエスト表示
```

---

## グローバルオプション

| オプション | 説明 |
|-----------|------|
| `--json` | JSON出力（AI/スクリプト向け） |
| `--headed` | ブラウザウィンドウを表示 |
| `--session <name>` | セッション名指定 |
| `--executable-path <path>` | カスタムブラウザバイナリ |

---

## 実践例

### 例1: フォーム送信

```bash
agent-browser open https://example.com/form
agent-browser snapshot -i
# 出力: textbox "Email" [ref=e1], textbox "Password" [ref=e2], button "Submit" [ref=e3]

agent-browser fill @e1 "user@example.com"
agent-browser fill @e2 "password123"
agent-browser click @e3
agent-browser wait --load networkidle
agent-browser snapshot -i  # 結果確認
```

### 例2: データ抽出

```bash
agent-browser open https://example.com/products
agent-browser snapshot -i --json > elements.json
agent-browser get text @e5 --json
```

### 例3: スクリーンショット自動化

```bash
agent-browser open https://example.com
agent-browser wait --load networkidle
agent-browser screenshot --full page.png
```

### 例4: セッション管理

```bash
# テスト用の2つのアカウントで並列実行
agent-browser --session user1 open app.com
agent-browser --session user1 fill @e1 "user1@test.com"
agent-browser --session user1 click @e2

agent-browser --session user2 open app.com
agent-browser --session user2 fill @e1 "user2@test.com"
agent-browser --session user2 click @e2
```

---

## ベストプラクティス

1. **snapshot -i を活用**：AIには `-i`（インタラクティブ要素のみ）が最適
2. **refベースで操作**：スナップショットから取得した @e1, @e2... を使用
3. **wait を適切に使用**：ページ遷移後は必ず wait
4. **セッション管理**：複数の認証状態やテストケースには --session
5. **state save/load**：ログイン状態を保存して再利用

---

## 環境変数

| 変数 | 説明 |
|------|------|
| `AGENT_BROWSER_HEADLESS` | true/false（デフォルト: true） |
| `AGENT_BROWSER_SESSION` | デフォルトセッション名 |
| `PLAYWRIGHT_BROWSERS_PATH` | ブラウザバイナリのパス |

---

## ライセンス

Apache-2.0

## リポジトリ

https://github.com/vercel-labs/agent-browser