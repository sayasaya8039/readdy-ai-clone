---
paths: "**/*"
---

# ralph 監視ルール（必須）

> ⚠️ **長時間タスク・API呼び出しが多いタスクでは必ずralphを使用すること**

## 概要

ralphはClaude Codeの実行を監視し、API呼び出し制限やタイムアウトを管理するツールです。

## 🔴 必須コマンド

| コマンド | 説明 | 用途 |
|----------|------|------|
| `ralph --monitor` | 監視モード起動 | 常時監視 |
| `ralph --calls 50` | API呼び出し制限 | 1時間あたり50回に制限 |
| `ralph --timeout 10` | タイムアウト設定 | 10分でタイムアウト |
| `ralph --verbose` | 詳細表示 | デバッグ時 |
| `ralph --status` | 状態確認 | 現在の状態を確認 |

## 使用場面

| 場面 | 推奨設定 |
|------|----------|
| **長時間開発** | `ralph --monitor --timeout 30` |
| **API多用タスク** | `ralph --calls 50 --verbose` |
| **デバッグ** | `ralph --verbose --status` |
| **通常開発** | `ralph --monitor` |

## 完了時の出力

エラーが0件になったら以下を出力：

```
<promise>任務完遂</promise>
```

## 注意事項

- 長時間タスクでは必ず `--timeout` を設定
- API多用時は `--calls` で制限を設定
- 問題発生時は `--status` で状態確認
