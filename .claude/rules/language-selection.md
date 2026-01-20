---
paths: "**/*"
---

---
paths: "**/*"
---

# プロジェクト言語選択ガイド

## 概要

プロジェクト開始時に適切な開発言語とフレームワークを選択するためのガイドラインです。

## クイックリファレンス

| プロジェクト種類 | 言語 | フレームワーク |
|------------------|------|----------------|
| Chrome拡張機能 | TypeScript | React + Vite |
| Webアプリ（SPA） | TypeScript | React/Svelte + Vite |
| Webアプリ（SSR） | TypeScript | Next.js/SvelteKit |
| **Windowsアプリ** | **Electron/Tauri/Python** | **下記参照** |
| CLIツール | Rust/Python | clap/argparse |
| AI/ML連携 | Python | PyQt + PyTorch |

## Windowsデスクトップアプリケーション

### 優先順位: Electron → Tauri → Python → Rust → C++

| 優先度 | 言語 | フレームワーク | 用途 |
|--------|------|----------------|------|
| **1位** | **Electron** | Electron Forge | Web技術でGUI、豊富なnpmエコシステム |
| **2位** | **Tauri** | Tauri + React | 軽量バイナリ、Rustバックエンド |
| **3位** | **Python** | PyQt6/PySide6 | 簡易ツール、AI/ML連携 |
| **4位** | **Rust** | egui/iced | 純ネイティブGUI、最高性能 |
| **5位** | **C++** | Qt/wxWidgets | 既存C++ライブラリ活用 |

### Electron（第1選択）

- Web技術（HTML/CSS/JS/React）でGUIを構築
- クロスプラットフォーム対応
- 豊富なnpmエコシステム活用
- Electron Forge推奨

### Tauri（第2選択）

- 軽量なバイナリサイズ（Electronより小さい）
- Rustバックエンドで高速処理
- セキュリティ・メモリ効率重視

### Python（第3選択）

- 簡易ツール・ユーティリティ
- AI/機械学習連携アプリ
- PyQt6/PySide6推奨、PyInstallerでEXE化

### Rust（第4選択）

- 純Rust GUIが必要な場合
- 最高のパフォーマンス
- egui/iced推奨

### C++（第5選択）

- 既存C++ライブラリの活用必須
- ゲーム開発（Unreal Engine）
- Qt推奨

## 言語別ツールチェーン

| 言語 | パッケージ | リンター | テスト |
|------|-----------|---------|--------|
| TypeScript | Bun（優先） | ESLint | Vitest |
| Python | uv（優先） | ruff | pytest |
| Rust | Cargo | clippy | cargo test |

## 禁止・非推奨

- JavaScript（TypeScriptを使用）
- Java/C#（特別な理由がない限り）
- Go（Rustで代替可能な場合）

## 例外ケース

1. **既存プロジェクト** - 既存言語を維持
2. **特定ライブラリ依存** - その言語でしか利用できない場合
3. **ユーザー指定** - ユーザーが特定言語を指定した場合
