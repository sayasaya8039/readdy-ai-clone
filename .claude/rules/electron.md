---
paths: "**/electron/**, **/main.js, **/preload.js"
---

# Electron 開発ルール

## プロジェクトセットアップ

### Electron Forge（推奨）

```bash
# プロジェクト作成（Node.js必須 - Bunは非対応）
npx create-electron-app my-app --template=webpack-typescript

cd my-app
npm install
```

**注意:** ElectronはBun非対応のため、Node.js/npmを使用します。

### プロジェクト構成

```text
my-app/
├── src/
│   ├── main.ts           # メインプロセス
│   ├── preload.ts        # プリロードスクリプト
│   ├── renderer.ts       # レンダラープロセス
│   └── index.html
├── forge.config.ts       # Electron Forge設定
├── package.json
└── tsconfig.json
```

---

## メインプロセス

### main.ts

```typescript
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
```

---

## プリロードスクリプト

### preload.ts（contextBridge使用）

```typescript
import { contextBridge, ipcRenderer } from 'electron'

// レンダラープロセスに公開するAPI
contextBridge.exposeInMainWorld('electronAPI', {
  // ファイル操作
  readFile: (path: string) => ipcRenderer.invoke('read-file', path),
  writeFile: (path: string, content: string) =>
    ipcRenderer.invoke('write-file', path, content),

  // ダイアログ
  showOpenDialog: () => ipcRenderer.invoke('show-open-dialog'),
  showSaveDialog: () => ipcRenderer.invoke('show-save-dialog'),

  // 通知
  showNotification: (title: string, body: string) =>
    ipcRenderer.send('show-notification', title, body),
})
```

### 型定義

```typescript
// src/types/electron.d.ts
export interface ElectronAPI {
  readFile: (path: string) => Promise<string>
  writeFile: (path: string, content: string) => Promise<void>
  showOpenDialog: () => Promise<string | null>
  showSaveDialog: () => Promise<string | null>
  showNotification: (title: string, body: string) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
```

---

## IPC通信

### メインプロセス側（main.ts）

```typescript
import { ipcMain, dialog, Notification } from 'electron'
import fs from 'fs/promises'

// ファイル読み込み
ipcMain.handle('read-file', async (event, path: string) => {
  try {
    return await fs.readFile(path, 'utf-8')
  } catch (error) {
    throw new Error(`ファイル読み込みエラー: ${error}`)
  }
})

// ファイル保存
ipcMain.handle('write-file', async (event, path: string, content: string) => {
  await fs.writeFile(path, content, 'utf-8')
})

// ファイル選択ダイアログ
ipcMain.handle('show-open-dialog', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'テキストファイル', extensions: ['txt', 'md'] },
      { name: 'すべてのファイル', extensions: ['*'] },
    ],
  })
  return result.canceled ? null : result.filePaths[0]
})

// 通知
ipcMain.on('show-notification', (event, title: string, body: string) => {
  new Notification({ title, body }).show()
})
```

### レンダラープロセス側

```typescript
// 安全にAPIを使用
async function loadFile() {
  const path = await window.electronAPI.showOpenDialog()
  if (path) {
    const content = await window.electronAPI.readFile(path)
    console.log(content)
  }
}
```

---

## ビルド・配布

### forge.config.ts

```typescript
import type { ForgeConfig } from '@electron-forge/shared-types'

const config: ForgeConfig = {
  packagerConfig: {
    name: 'MyApp',
    icon: './assets/icon',
    asar: true,
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'my_app',
        setupIcon: './assets/icon.ico',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux'],
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.ts',
        renderer: {
          config: './webpack.renderer.config.ts',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer.ts',
              name: 'main_window',
              preload: {
                js: './src/preload.ts',
              },
            },
          ],
        },
      },
    },
  ],
}

export default config
```

### ビルドコマンド

```bash
# 開発
npm run start

# パッケージング
npm run package

# 配布用ビルド
npm run make
```

---

## セキュリティルール（必須）

| 設定 | 値 | 理由 |
|------|-----|------|
| `contextIsolation` | `true` | コンテキスト分離 |
| `nodeIntegration` | `false` | Node.js APIの直接アクセス禁止 |
| `webSecurity` | `true` | 同一オリジンポリシー有効 |

### 禁止事項

- `nodeIntegration: true` の使用
- `contextIsolation: false` の使用
- `require()` のレンダラープロセスでの使用
- 信頼できないURLの読み込み

---

## バージョン表示

```typescript
// タイトルバーにバージョン表示
import { app } from 'electron'

const version = app.getVersion()
mainWindow.setTitle(`MyApp v${version}`)
```
