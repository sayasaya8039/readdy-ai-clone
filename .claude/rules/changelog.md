---
paths: "**/*"
---

Git履歴から変更履歴（CHANGELOG）を自動生成します。

## 実行内容

### 1. Git履歴取得
```bash
git log --oneline --since="YYYY-MM-DD"
git log v1.0.0..HEAD --oneline
```

### 2. コミット分類
| プレフィックス | カテゴリ |
|--------------|---------|
| `feat:`, `[feat]` | 新機能 |
| `fix:`, `[fix]` | バグ修正 |
| `refactor:`, `[refactor]` | リファクタリング |
| `docs:`, `[docs]` | ドキュメント |
| `test:`, `[test]` | テスト |
| `perf:`, `[perf]` | パフォーマンス |
| `chore:`, `[chore]` | その他 |

### 3. CHANGELOG生成

```markdown
# Changelog

## [v1.2.0] - 2025-12-26

### 新機能
- 機能A を追加

### バグ修正
- 問題B を修正

### リファクタリング
- コードC を改善
```

### 4. 保存
- CHANGELOG.md に追記（先頭に追加）

## オプション

| オプション | 説明 |
|-----------|------|
| `--since <date>` | 指定日以降の変更 |
| `--from <tag>` | 指定タグ以降の変更 |
| `--version <ver>` | バージョン番号を指定 |
| `--append` | 既存に追記 |
| `--overwrite` | 上書き |

## 使用例

```bash
# 直近1週間の変更
/changelog --since 1week

# v1.0.0以降の変更
/changelog --from v1.0.0

# 新バージョンとして生成
/changelog --version v1.2.0
```

$ARGUMENTS でバージョンまたは期間を指定。

## Keep a Changelog形式

[Keep a Changelog](https://keepachangelog.com/ja/1.0.0/) 形式に準拠:
- Added（追加）
- Changed（変更）
- Deprecated（非推奨）
- Removed（削除）
- Fixed（修正）
- Security（セキュリティ）
