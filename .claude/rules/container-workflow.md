---
paths: "**/*"
---

# コンテナ/サンドボックス ワークフロー（リスク管理）

## 基本原則

**危険なタスクやlong-running処理は隔離環境で実行。**

## 使用タイミング

| シナリオ | 推奨 |
|----------|------|
| 未知のスクリプト実行 | 隔離環境必須 |
| 破壊的な操作のテスト | 隔離環境必須 |
| 長時間実行タスク | 隔離環境推奨 |
| ネットワーク関連のテスト | 隔離環境推奨 |

---

## 方法1: Docker（推奨）

### 簡易コンテナ実行

```bash
# 一時的なコンテナで実行
docker run --rm -it -v $(pwd):/app -w /app node:20 bash

# Python環境
docker run --rm -it -v $(pwd):/app -w /app python:3.12 bash
```

### バックグラウンド実行

```bash
docker run -d --name long-task my-image npm run build
docker logs -f long-task
docker rm long-task
```

---

## 方法2: WSL2（Windows標準・インストール不要）

### セットアップ

```powershell
# 管理者PowerShellで実行
wsl --install

# 特定ディストロをインストール
wsl --install -d Ubuntu
```

### 使用方法

```bash
# WSL内で危険なコマンドを実行
wsl -d Ubuntu -e bash -c "npm install unknown-package"

# 現在のディレクトリをWSLで開く
wsl
```

---

## 方法3: Python仮想環境（uv/venv）

### uv（推奨）

```bash
# 隔離された環境を作成
uv venv .venv-test
source .venv-test/bin/activate  # Linux/Mac
.venv-testScriptsactivate     # Windows

# テスト後に削除
deactivate
rm -rf .venv-test
```

### 標準venv

```bash
python -m venv .venv-test
.venv-testScriptsactivate
# テスト後
deactivate && rm -rf .venv-test
```

---

## 方法4: GitHub Codespaces（クラウド・インストール不要）

### 使用方法

1. GitHubリポジトリを開く
2. 「Code」→「Codespaces」→「Create codespace」
3. ブラウザ内でリスクのある操作を実行
4. 終了後にCodespaceを削除

**メリット**: ローカル環境に一切影響なし

---

## 方法5: 別ユーザーアカウント（Windows）

### セットアップ

```powershell
# 管理者PowerShellで実行
net user TestUser /add
```

### 使用方法

```powershell
# 別ユーザーとしてコマンド実行
runas /user:TestUser "cmd /c npm install unknown-package"
```

---

## 方法の選択ガイド

| 方法 | インストール | 隔離レベル | 用途 |
|------|-------------|-----------|------|
| **Docker** | 必要 | 最高 | 本番再現、完全隔離 |
| **WSL2** | Windows機能 | 高 | Linux環境テスト |
| **uv/venv** | 不要 | 中 | Python依存関係 |
| **Codespaces** | 不要 | 最高 | 一時的なテスト |
| **別ユーザー** | 不要 | 低 | 簡易的な分離 |

## 禁止事項

- ホストシステムで未知のスクリプトを直接実行
- rm -rf などの破壊的コマンドを本番環境でテスト
- 隔離なしでroot/管理者権限でテスト

## 参照

- [awesome-claude-code Tip #21](https://github.com/hesreallyhim/awesome-claude-code)
- [ykdojo/claude-code-tips](https://github.com/ykdojo/claude-code-tips)
