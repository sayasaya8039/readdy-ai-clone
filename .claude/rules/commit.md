---
paths: "**/.git/**"
---

Git操作を自動化してコミット・プッシュを実行します。

## 現在の状態

- Git status: !`git status`
- 直近のコミット: !`git log --oneline -5`

## 実行内容

1. `git status` で変更ファイルを確認
2. `git diff` で変更内容を確認
3. 変更内容を分析して適切なプレフィックスを選択
4. 日本語で簡潔なコミットメッセージを作成
5. 以下を実行:
   ```bash
   git add .
   git commit -m "[種類] 変更内容"
   git pull origin main --rebase
   git push origin main
   ```

## コミットプレフィックス

| プレフィックス | 用途 |
|---------------|------|
| `[feat]` | 新機能追加 |
| `[fix]` | バグ修正 |
| `[refactor]` | リファクタリング |
| `[docs]` | ドキュメント更新 |
| `[test]` | テスト追加・修正 |
| `[chore]` | 設定・ビルド関連 |
| `[style]` | フォーマット変更 |
| `[perf]` | パフォーマンス改善 |

## 引数

$ARGUMENTS が指定された場合はそのメッセージを使用。

## 注意事項

- コミット前に必ずバージョン更新を確認
- 機密情報（.env, *.pem等）がステージングされていないか確認
- pushに失敗した場合は `git pull --rebase` を試行
