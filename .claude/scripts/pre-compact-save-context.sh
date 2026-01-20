#!/bin/bash

# 日本時間の日付パスを生成
DATE_PATH=$(TZ=Asia/Tokyo date +%Y/%m/%d)
BACKUP_DIR=~/ai-tasklogs/sessions/$DATE_PATH/context-backups

# バックアップディレクトリ作成
mkdir -p "$BACKUP_DIR"

# コンテキストファイルをコピー
# SESSION_ID と CONTEXT_FILE は環境変数として渡される
TIMESTAMP=$(TZ=Asia/Tokyo date +%Y%m%d-%H%M%S)
cp "$CONTEXT_FILE" "$BACKUP_DIR/${SESSION_ID}_${TIMESTAMP}_pre-compact.jsonl"

echo "Context backup saved: $BACKUP_DIR/${SESSION_ID}_${TIMESTAMP}_pre-compact.jsonl"