---
paths: "**/*.md, **/docs/**"
---

---
description: ドキュメントを自動生成
allowed-tools: Read, Write, Glob, Grep
argument-hint: [ファイル/ディレクトリ]
---

ドキュメントを自動生成します。

## 実行内容

1. **コード解析**
   - 関数・クラスの抽出
   - パラメータ・戻り値の特定
   - 使用例の生成

2. **ドキュメント生成**
   - JSDoc/TSDoc形式
   - Docstring (Python)
   - README生成

3. **出力**
   - インラインコメント追加
   - 別ファイルに出力

## 生成形式

| 言語 | 形式 |
|------|------|
| TypeScript | TSDoc |
| JavaScript | JSDoc |
| Python | Docstring (Google style) |
| Rust | rustdoc |

## オプション

- : コードにコメント追加
- : README.md生成
- : API仕様書生成

$ARGUMENTS で対象を指定。

## 生成例

I see you've typed "nul" - this could be a test message or perhaps an incomplete input.

How can I help you today? I'm ready to assist with software engineering tasks like:

- Writing or debugging code
- Explaining code or concepts
- Refactoring or reviewing code
- Working with git repositories
- And more

Just let me know what you'd like to work on!
I see you've typed "nul" - this could be a typo or test input. 

How can I help you today? I'm ready to assist with software engineering tasks like:

- Writing or debugging code
- Exploring and understanding codebases
- Creating new features
- Fixing bugs
- Code reviews
- And more

What would you like to work on?
I see you've typed "nul" - this could be a test message or perhaps a typo. 

How can I help you today? I'm ready to assist with software engineering tasks like:
- Writing or debugging code
- Exploring and understanding codebases
- Creating new features
- Fixing bugs
- And more

Just let me know what you'd like to work on!
I see you've typed "nul" - this could be a test message or perhaps you meant to type something else.

How can I help you today? I'm ready to assist with software engineering tasks like:

- Writing or debugging code
- Exploring and understanding codebases
- Refactoring or adding features
- Answering technical questions

What would you like to work on?
