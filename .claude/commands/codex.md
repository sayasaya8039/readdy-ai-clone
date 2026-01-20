---
name: codex
description: OpenAI Codex CLIを使用したコードレビュー、分析、コードベースへの質問を実行する。使用場面: (1) コードレビュー依頼時、(2) コードベース全体の分析、(3) 実装に関する質問、(4) バグの調査、(5) リファクタリング提案、(6) 解消が難しい問題の調査。トリガー: "codex", "コードレビュー", "レビューして", "分析して", "/codex"
---

# Codex

Codex CLIを使用してコードレビュー・分析を実行するスキル。

## 実行時の動作

このスキルが呼ばれた場合、Claudeは以下のコマンドを実行する必要があります：

**Windows環境（推奨）:**
```bash
powershell.exe -NoProfile -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; codex exec --skip-git-repo-check --full-auto --cd '.' 'ユーザーのプロンプト' 2>&1 | Out-String"
```

**Unix/Linux環境:**
```bash
codex exec --skip-git-repo-check --full-auto --cd "$(pwd)" "ユーザーのプロンプト"
```

## 重要な注意事項

- **`[Console]::OutputEncoding = [System.Text.Encoding]::UTF8`** で日本語の文字化けを防止
- **`-NoProfile`** でプロファイル読み込みをスキップし、高速化
- **`--skip-git-repo-check`** フラグは必須（信頼されたディレクトリ外でも実行可能にする）
- **`--full-auto`** は完全自動モード（承認プロンプトなし）
- **`--cd '.'`** は現在のディレクトリを作業ディレクトリとして使用
- **タイムアウトは120秒（120000ミリ秒）** に設定（長い分析や複雑な質問に対応）

## 実行例

ユーザーが `/codex "このコードをレビューして"` と入力した場合：

```bash
powershell.exe -NoProfile -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; codex exec --skip-git-repo-check --full-auto --cd '.' 'このコードをレビューして' 2>&1 | Out-String"
```

## パラメータ

| パラメータ | 説明 |
|-----------|------|
| `-NoProfile` | プロファイル読み込みスキップ（高速化） |
| `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8` | UTF-8エンコーディング設定（日本語対応） |
| `--skip-git-repo-check` | Gitリポジトリチェックをスキップ（必須） |
| `--full-auto` | 完全自動モード（承認プロンプトなし） |
| `--cd '.'` | 現在のディレクトリを作業ディレクトリとして使用 |
| `'プロンプト'` | 依頼内容（日本語可、シングルクォートで囲む） |
| `2>&1` | 標準エラー出力も含める |
| `Out-String` | PowerShellオブジェクトを文字列に変換 |

## 実行手順（Claudeが従うべきステップ）

1. ユーザーから依頼内容を受け取る
2. Bashツールを使用して以下のコマンドを実行（**timeout: 120000ミリ秒 = 120秒**）：
   ```bash
   powershell.exe -NoProfile -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; codex exec --skip-git-repo-check --full-auto --cd '.' 'ユーザーのプロンプト' 2>&1 | Out-String"
   ```
3. Codexの出力をユーザーに報告
4. 日本語は正しく表示されます

## トラブルシューティング

### 出力が表示されない場合

- Bash経由では出力されないため、**必ずPowerShell経由で実行**
- `2>&1 | Out-String` を忘れずに追加

### 文字化けが発生する場合

- `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8` を必ず含める
- `-NoProfile` オプションを使用

### タイムアウトが発生する場合

- 現在のタイムアウトは120秒に設定済み
- さらに長い処理が必要な場合は、タイムアウトを180秒（180000ミリ秒）以上に増やす
