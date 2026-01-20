---
paths: "**/*"
---

# バージョン管理ルール（必須）

## 基本原則

**アプリ・拡張機能の作成・更新・変更・追記時は必ずバージョンを更新すること。**

## バージョン更新タイミング

| 変更内容 | バージョン変更 | 例 |
|----------|---------------|-----|
| **バグ修正・軽微な修正** | パッチ（Z） | 1.0.0 → 1.0.1 |
| **機能追加・改善** | マイナー（Y） | 1.0.1 → 1.1.0 |
| **破壊的変更・大規模更新** | メジャー（X） | 1.1.0 → 2.0.0 |

## セマンティックバージョニング（SemVer）

```
X.Y.Z
│ │ └─ パッチ: バグ修正、軽微な変更
│ └─── マイナー: 後方互換性のある機能追加
└───── メジャー: 破壊的変更、大規模リファクタ
```

## 必須: バージョン表記の配置

### 1. 設定ファイル

| プロジェクト | ファイル | フィールド |
|-------------|----------|-----------|
| Node.js/Bun | `package.json` | `"version": "X.Y.Z"` |
| Chrome拡張 | `manifest.json` | `"version": "X.Y.Z"` |
| Python | `pyproject.toml` | `version = "X.Y.Z"` |
| Rust | `Cargo.toml` | `version = "X.Y.Z"` |
| Electron | `package.json` | `"version": "X.Y.Z"` |
| Tauri | `tauri.conf.json` | `"version": "X.Y.Z"` |

### 2. UI内バージョン表示（必須）

**すべてのアプリ・拡張機能にUIでバージョンを表示すること：**

| 配置場所 | 推奨位置 |
|----------|---------|
| **ヘッダー/フッター** | `v1.2.3` 表記 |
| **設定画面/About** | バージョン情報セクション |
| **ポップアップ** | 拡張機能ポップアップ下部 |
| **タイトルバー** | `AppName v1.2.3` |

### 3. コード内バージョン定数

```typescript
// constants.ts または config.ts
export const APP_VERSION = '1.2.3'
export const APP_NAME = 'MyApp'
```

```python
# __init__.py または config.py
__version__ = '1.2.3'
APP_NAME = 'MyApp'
```

```rust
// lib.rs または main.rs
pub const VERSION: &str = "1.2.3";
pub const APP_NAME: &str = "MyApp";
```

## バージョン更新手順

### 1. 変更内容を判断

```
質問: 今回の変更は？
├─ バグ修正のみ → パッチ（+0.0.1）
├─ 新機能追加 → マイナー（+0.1.0）
└─ 破壊的変更 → メジャー（+1.0.0）
```

### 2. 更新すべきファイル

1. **設定ファイル**（package.json, manifest.json等）
2. **定数ファイル**（constants.ts等）
3. **CHANGELOG.md**（存在する場合）
4. **README.md**のバージョンバッジ（存在する場合）

### 3. コミットメッセージ

```bash
git commit -m "chore: bump version to X.Y.Z"
# または変更内容と一緒に
git commit -m "feat: 新機能追加 (v1.2.0)"
```

## UI表示例

### React/TypeScript

```tsx
import { APP_VERSION } from '@/constants'

export function Footer() {
  return (
    <footer className="text-sm text-gray-500">
      v{APP_VERSION}
    </footer>
  )
}
```

### Chrome拡張機能

```tsx
// manifest.jsonからバージョン取得
const manifest = chrome.runtime.getManifest()

export function Popup() {
  return (
    <div className="popup">
      {/* コンテンツ */}
      <footer className="text-xs text-gray-400 mt-4">
        v{manifest.version}
      </footer>
    </div>
  )
}
```

### Python (PyQt6)

```python
from config import __version__, APP_NAME

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle(f"{APP_NAME} v{__version__}")

        # ステータスバーにも表示
        self.statusBar().showMessage(f"Version {__version__}")
```

### Electron

```typescript
import { app } from 'electron'

// タイトルバー
mainWindow.setTitle(`${app.getName()} v${app.getVersion()}`)

// レンダラープロセスに渡す
ipcMain.handle('get-version', () => app.getVersion())
```

## チェックリスト

アプリ変更時の確認事項：

- [ ] 変更内容に応じたバージョン番号の決定
- [ ] 設定ファイル（package.json等）のバージョン更新
- [ ] 定数ファイルのバージョン更新
- [ ] UI内のバージョン表示が正しく動作
- [ ] CHANGELOG.mdの更新（存在する場合）
- [ ] コミットメッセージにバージョン記載

## 初期バージョン

新規プロジェクト作成時：

| 状態 | バージョン |
|------|-----------|
| 開発初期 | `0.1.0` |
| α版 | `0.x.x` |
| β版 | `0.9.x` |
| 正式リリース | `1.0.0` |

## 禁止事項

- バージョンを更新せずにリリース
- UIにバージョン表示がないアプリ
- 設定ファイルと定数ファイルでバージョン不一致
