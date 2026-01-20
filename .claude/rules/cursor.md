---
paths: "**/.cursorrules, **/cursor/**, **/.cursor/**"
---

# Cursor AI ルール

## 概要

**Cursor**はAI搭載コードエディタ。VS Codeベースで独自AIモデル（Composer）搭載。
.cursorrules ファイルでプロジェクト固有の指示を定義。

- 公式サイト: https://cursor.com
- awesome-cursorrules: https://github.com/PatrickJS/awesome-cursorrules
- スター: 35.6k+（awesome-cursorrules）

## .cursorrules

CLAUDE.mdと同等の役割を果たす設定ファイル。

### 基本構造

```
You are an expert TypeScript developer.

## Code Style
- Use strict TypeScript
- Prefer functional programming
- Use Biome for formatting

## Project Structure
- src/: Source code
- tests/: Test files

## Libraries
- Bun for runtime
- Hono for API
- Drizzle for ORM
```

### 配置場所

| ファイル | 場所 |
|----------|------|
| `.cursorrules` | プロジェクトルート |
| `.cursor/rules/*.md` | 複数ルールファイル |

## CLAUDE.mdとの互換性

| 機能 | CLAUDE.md | .cursorrules |
|------|-----------|--------------|
| プロジェクト指示 | ✅ | ✅ |
| コードスタイル | ✅ | ✅ |
| ビルドコマンド | ✅ | ✅ |
| 禁止事項 | ✅ | ✅ |

### 相互変換

CLAUDE.md → .cursorrules は内容をほぼそのままコピー可能。

## Cursor 2.0 機能

| 機能 | 説明 |
|------|------|
| **Composer** | 独自高速コーディングモデル |
| **Plan Mode** | 実装計画立案 |
| **Background Agents** | バックグラウンド実行 |
| **MCP対応** | Model Context Protocol |

## 使い分け

| 場面 | 推奨 |
|------|------|
| ターミナル作業 | Claude Code |
| GUI編集 | Cursor |
| 大規模リファクタ | Cursor Composer |
| Git操作 | Claude Code |

## Claude Code連携

```bash
# Cursorで編集、Claude Codeでコミット
cursor .
# 編集完了後
claude "変更をコミット"
```

## 参照

- [Cursor公式](https://cursor.com)
- [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)