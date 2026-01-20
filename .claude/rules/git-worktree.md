---
paths: "**/.git/**, **/package.json, **/Cargo.toml"
---

# Git Worktree ルール

## 基本原則

**並行開発にはgit worktreeを使用し、ブランチ切り替えのオーバーヘッドを排除。**

## 使用タイミング

| シナリオ | 推奨 |
|----------|------|
| 複数機能の並行開発 | git worktree必須 |
| バグ修正中に別タスク | git worktree推奨 |
| レビュー用に別ブランチ確認 | git worktree推奨 |
| エージェントの並行作業 | git worktree必須 |

## 基本コマンド

### Worktree作成

```bash
# 新しいworktreeを作成
git worktree add ../project-feature feature-branch

# 新しいブランチと共にworktreeを作成
git worktree add -b new-feature ../project-new-feature main
```

### Worktree一覧

```bash
git worktree list
```

### Worktree削除

```bash
# worktreeを削除（ディレクトリも削除される）
git worktree remove ../project-feature

# 強制削除（未コミットの変更がある場合）
git worktree remove --force ../project-feature
```

## ディレクトリ構成例

```
~/projects/
├── my-app/              # メインworktree (main branch)
├── my-app-feature-a/    # feature-a worktree
├── my-app-feature-b/    # feature-b worktree
└── my-app-hotfix/       # hotfix worktree
```

## Claude Code並行実行パターン

```bash
# ターミナル1: メイン開発
cd ~/projects/my-app
claude

# ターミナル2: 別機能
cd ~/projects/my-app-feature-a
claude

# ターミナル3: バグ修正
cd ~/projects/my-app-hotfix
claude
```

## 注意事項

- 各worktreeは独立したディレクトリ
- node_modules等は各worktreeで別途インストール必要
- .gitは共有されるため、ブランチ操作に注意

## 参照

- [ykdojo/claude-code-tips Tip #16](https://github.com/ykdojo/claude-code-tips)
