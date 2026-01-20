---
paths: "**/windows/**, **/*.exe"
---

---
paths: "**/*.rs, **/*.cpp, **/*.py, **/Cargo.toml, **/CMakeLists.txt, **/electron/**"
---

# Windowsアプリケーション開発ルール

## 言語選択

### 優先順位: Electron → Tauri → Python → Rust → C++

| 優先度 | 言語 | フレームワーク | 用途 |
|--------|------|----------------|------|
| **1位** | **Electron** | Electron Forge | Web技術でGUI、豊富なnpmエコシステム |
| **2位** | **Tauri** | Tauri + React | 軽量バイナリ、Rustバックエンド |
| **3位** | **Python** | PyQt6/PySide6 | 簡易ツール、AI/ML連携 |
| **4位** | **Rust** | egui/iced | 純ネイティブGUI、最高性能 |
| **5位** | **C++** | Qt/wxWidgets | 既存C++ライブラリ活用 |

### 選択フローチャート

```
新規Windowsアプリ開発
    │
    ├─ Web技術でUIを作りたい?
    │   ├─ 豊富なライブラリ・プラグイン活用 → Electron
    │   └─ 軽量さ・セキュリティ重視 → Tauri
    │
    ├─ AI/ML連携? → Python
    │
    ├─ 純ネイティブGUI? → Rust
    │
    └─ 既存C++ライブラリ必須? → C++
```

## Electron（第1選択）

### プロジェクトセットアップ

```bash
# Electron Forge（推奨）
npx create-electron-app my-app --template=webpack-typescript
cd my-app
npm install
npm start
```

### プロジェクト構成

```text
my-app/
├── src/
│   ├── main.ts           # メインプロセス
│   ├── preload.ts        # プリロードスクリプト
│   └── renderer.ts       # レンダラープロセス
├── forge.config.ts
└── package.json
```

### セキュリティルール

| 設定 | 値 | 理由 |
|------|-----|------|
| `contextIsolation` | `true` | コンテキスト分離 |
| `nodeIntegration` | `false` | Node.js APIの直接アクセス禁止 |

## Tauri（第2選択）

### プロジェクトセットアップ

```bash
cargo install create-tauri-app
cargo create-tauri-app my-app
cd my-app
cargo tauri dev
```

### 利点

- 軽量バイナリ（Electronより小さい）
- Rustバックエンドで高速処理
- メモリ安全性

## Python（第3選択）

### プロジェクトセットアップ

```bash
uv init my-app
cd my-app
uv add PyQt6
```

### main.py

```python
import sys
from PyQt6.QtWidgets import QApplication, QMainWindow

__version__ = "1.0.0"

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle(f"MyApp v{__version__}")
        self.setMinimumSize(400, 300)

def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
```

### EXE化

```bash
pyinstaller --onefile --windowed --name=MyApp src/main.py
```

## Rust（第4選択）

### egui

```bash
cargo new my-app
cd my-app
cargo add eframe egui
```

## C++（第5選択）

### Qt

```bash
mkdir my-app && cd my-app
# CMakeLists.txtを作成
cmake ..
cmake --build .
```

## ビルド出力規則

- `dist/` `build/` は使用禁止
- **アプリ名のフォルダに出力**

```text
MyApp/
├── MyApp.exe
└── README.md
```

## リリース

```bash
gh release create v1.0.0 ./MyApp/MyApp.exe --title "v1.0.0" --notes "初回リリース"
```

## 禁止事項

- 管理者権限の不必要な要求
- ハードコードされた認証情報
- 未署名バイナリの配布（可能なら署名）
