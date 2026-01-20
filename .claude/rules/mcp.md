---
paths: "**/*"
---

使用可能なMCPサーバーの一覧と活用方法。

## 積極的に使用すべきMCPサーバー

| MCPサーバー | 用途 | 主なツール |
|------------|------|-----------|
| **memory** | 作業履歴・知識管理 | read_graph, create_entities, add_observations |
| **github** | GitHub操作 | create_issue, create_pull_request, search_code |
| **playwright** | ブラウザ操作 | browser_navigate, browser_snapshot, browser_click |
| **filesystem** | ファイル操作 | read_file, write_file, search_files |
| **context7** | ライブラリドキュメント | resolve-library-id, get-library-docs |
| **fetch** | Web取得 | imageFetch |
| **web-search-prime** | Web検索 | webSearchPrime |
| **sequential-thinking** | 思考整理 | sequentialthinking |

## 使用タイミング

### memory（常時使用推奨）
- セッション開始時: read_graph で過去の作業確認
- 重要な決定時: add_observations で記録
- セッション終了時: create_entities で保存

### github（Git操作時）
- Issue作成/更新
- PR作成/レビュー
- コード検索

### playwright（動作確認時）
- Webアプリのテスト
- スクリーンショット取得
- フォーム操作

### context7（ライブラリ使用時）
- 最新ドキュメント取得
- API仕様確認
- コード例取得

### web-search-prime（調査時）
- 最新情報検索
- エラー解決策検索
- ベストプラクティス調査

## 使用例

```
# Memory: 作業履歴確認
mcp__memory__read_graph

# GitHub: Issue作成
mcp__github__create_issue

# Context7: Reactドキュメント取得
mcp__context7__resolve-library-id("react")
mcp__context7__get-library-docs("/facebook/react", topic="hooks")

# Web検索
mcp__web-search-prime__webSearchPrime("Hono middleware 2025")
```
