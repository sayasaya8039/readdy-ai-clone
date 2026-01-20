---
paths: "**/SKILL.md, **/skills/**, **/.claude/skills/**"
---

# Agent Skills 作成ルール

## 基本原則

**SkillsはClaude Codeが特定タスクを繰り返し実行するための設定。**

## 必須構成

### SKILL.md の最小構成

```markdown
---
name: my-skill
description: このスキルの説明（いつ使用するか）
---

# スキル名

## 使用方法

このスキルの使用方法を記述。

## 手順

1. ステップ1
2. ステップ2
3. ステップ3
```

### フォルダ構成

```
skills/
└── my-skill/
    ├── SKILL.md          # 必須: エントリーポイント
    ├── scripts/          # オプション: 実行可能スクリプト
    │   └── helper.py
    ├── references/       # オプション: 参照ドキュメント
    │   └── docs.md
    └── assets/           # オプション: テンプレート、アイコン等
        └── template.txt
```

## YAML Frontmatter

| プロパティ | 必須 | 説明 |
|-----------|------|------|
| `name` | はい | ディレクトリ名と一致 |
| `description` | はい | スキルの説明とトリガー条件 |
| `license` | いいえ | ライセンス情報 |
| `allowed-tools` | いいえ | 事前承認ツール（Claude Code専用） |
| `metadata` | いいえ | 追加メタデータ |

## 良いdescriptionの例

```yaml
description: |
  TypeScriptプロジェクトのテスト生成。
  「テストを書いて」「テスト生成」などで起動。
  Jest/Vitest環境で使用。
```

## トークン効率

- メタデータスキャン: 約100トークン
- 完全ロード時: 5,000トークン未満推奨

## 禁止事項

- スキル名とディレクトリ名の不一致
- 曖昧なdescription
- 5,000トークンを超える巨大スキル

## 参照

- [anthropics/skills](https://github.com/anthropics/skills)
- [Agent Skills Spec](https://github.com/anthropics/skills/blob/main/spec/agent-skills-spec.md)
