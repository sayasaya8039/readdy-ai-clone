---
paths: "**/*.toon"
---

# TOON Format ルール

## TOONとは

**Token-Oriented Object Notation - LLM向けトークン効率化フォーマット**

JSONと比較して**40%少ないトークン**で同等のデータを表現。

## いつTOONを使うか

| 用途 | 推奨フォーマット |
|------|-----------------|
| LLMプロンプト内の構造データ | **TOON** |
| 配列が多いデータ | **TOON** |
| API通信 | JSON |
| 設定ファイル | YAML/JSON |
| 深いネスト構造 | JSON |

## 基本構文

### JSONとの比較

```json
// JSON (トークン多い)
{
  "users": [
    {"id": 1, "name": "Alice", "age": 30},
    {"id": 2, "name": "Bob", "age": 25}
  ]
}
```

```toon
# TOON (トークン40%削減)
users[2]{id,name,age}:
  1,Alice,30
  2,Bob,25
```

## 構文ルール

### 配列表記

```toon
# 配列長を明示 [N]
items[3]{name,price}:
  Apple,100
  Banana,80
  Orange,120
```

### ネスト構造

```toon
config:
  database:
    host: localhost
    port: 5432
  cache:
    enabled: true
```

### 文字列

```toon
# クォート不要（特殊文字なし）
name: Alice

# クォート必要（カンマ、改行含む）
description: "Hello, World"
```

## プロンプト内での使用例

```python
prompt = """
以下のデータを分析してください：

tasks[3]{id,title,status,priority}:
  1,認証実装,done,high
  2,UI改善,in_progress,medium
  3,テスト追加,pending,high
"""
```

## 変換ツール

```typescript
// JSON → TOON
import { jsonToToon, toonToJson } from 'toon-format'

const toon = jsonToToon(jsonData)
const json = toonToJson(toonString)
```

## 使用しない場面

- 深くネストした設定ファイル
- 人間が直接編集するファイル
- JSONスキーマ検証が必要な場合
- 純粋な表形式データ（CSVを使用）

## ファイル規約

- 拡張子: `.toon`
- エンコーディング: UTF-8
- MIMEタイプ: `text/toon`
