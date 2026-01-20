---
paths: "**/*"
alwaysApply: true
---

# 大容量ファイル書き込みルール（必読）

## 🔴 絶対禁止

| 禁止事項 | 理由 |
|----------|------|
| Edit / Write / Update ツール | Windows環境でエラー発生 |
| heredoc (`<< 'EOF'`) | Windows非対応 |
| 長い文字列をコマンドラインに直接渡す | 文字数制限・エスケープ問題 |

---

## 推奨ツール

### 1. safe-file-tool.js（プロダクション向け）

**パス:** `C:/Users/Owner/.local/bin/safe-file-tool.js`

```bash
# 使い方
node safe-file-tool.js copy <target> <source>       # ファイルコピー
node safe-file-tool.js replace <file> <old> <new>   # 1回置換
node safe-file-tool.js replace-all <file> <old> <new> # 全置換
node safe-file-tool.js append <file> <source>       # 追記
```

### 2. safe-write.js（短いファイル用）

**パス:** `C:/Users/Owner/.local/bin/safe-write.js`

```bash
node safe-write.js write "path/to/file.ts" "内容"
node safe-write.js replace "path/to/file.ts" "古い" "新しい"
```

---

## 長いファイルの書き込み手順

### Step 1: 一時ファイルに内容を書く

```bash
# 方法A: echo を分割
printf '%s' '前半部分...' > /tmp/_content.tmp
printf '%s' '...後半部分' >> /tmp/_content.tmp

# 方法B: Pythonで書く
python -c "
content = '''
ここに長い内容
複数行もOK
'''
with open('/tmp/_content.tmp', 'w', encoding='utf-8') as f:
    f.write(content)
"
```

### Step 2: safe-file-tool.js でコピー

```bash
node "C:/Users/Owner/.local/bin/safe-file-tool.js" copy "target.ts" "/tmp/_content.tmp"
rm /tmp/_content.tmp
```

---

## Python版（大容量対応）

```python
import os, uuid, sys

def safe_write(target, content):
    target = os.path.abspath(target)
    temp = os.path.join(os.path.dirname(target), f".tmp_{uuid.uuid4().hex}")
    try:
        with open(temp, 'w', encoding='utf-8', newline='\n') as f:
            for i in range(0, len(content), 65536):
                f.write(content[i:i+65536])
            f.flush()
            os.fsync(f.fileno())
        with open(temp, 'r', encoding='utf-8') as f:
            if f.read() != content:
                raise ValueError("Verify failed")
        os.replace(temp, target)
        print(f"OK: {target}")
    except:
        if os.path.exists(temp): os.unlink(temp)
        raise

if __name__ == "__main__":
    target = sys.argv[1]
    source = sys.argv[2]
    with open(source, 'r', encoding='utf-8') as f:
        content = f.read()
    safe_write(target, content)
```

---

## 短いファイル（100行以下）

```python
import os, uuid
content = '''ここに内容'''
target = 'file.ts'
temp = f".tmp_{uuid.uuid4().hex}"
with open(temp, 'w', encoding='utf-8') as f:
    f.write(content)
    f.flush()
    os.fsync(f.fileno())
os.replace(temp, target)
```

---

## ファイルサイズ別推奨

| サイズ | 推奨方法 |
|--------|----------|
| <1KB | safe-write.js |
| 1KB-10KB | safe-write.js または Python |
| 10KB-100KB | safe-file-tool.js + 一時ファイル |
| >100KB | Python チャンク書き込み |

---

## 安全機能

| 機能 | 実装 | 効果 |
|------|------|------|
| **原子性** | `os.replace` / `fs.renameSync` | 半端な書き込み防止 |
| **検証** | 書き込み後の読み戻し比較 | データ破損検出 |
| **クリーンアップ** | try/catch で一時ファイル削除 | ゴミファイル防止 |
| **チャンク書き込み** | 64KB単位 | メモリ効率化 |

---

## 参照

- `C:/Users/Owner/.local/bin/safe-write.js` - 基本ツール
- `C:/Users/Owner/.local/bin/safe-file-tool.js` - プロダクション向け
- file-writing.md - 基本ルール
