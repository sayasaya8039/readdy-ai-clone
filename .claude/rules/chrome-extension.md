---
paths: "**/manifest.json, **/background/**, **/popup/**, **/content/**"
---

# Chrome拡張機能開発ルール

## プロジェクト構成

### 推奨ディレクトリ構成
```text
extension_name/
├── src/
│   ├── popup/              # ポップアップUI
│   │   ├── Popup.tsx
│   │   ├── index.tsx
│   │   └── styles/
│   │       └── popup.css
│   ├── background/         # Service Worker
│   │   └── service-worker.ts
│   ├── content/            # Content Script
│   │   └── content.ts
│   ├── options/            # 設定画面
│   │   ├── Options.tsx
│   │   └── index.tsx
│   ├── lib/                # 共通ユーティリティ
│   │   ├── storage.ts
│   │   └── messaging.ts
│   └── types/              # 型定義
│       └── index.ts
├── public/
│   ├── manifest.json
│   ├── popup.html
│   ├── options.html
│   └── icons/
│       ├── icon16.png
│       ├── icon32.png
│       ├── icon48.png
│       └── icon128.png
├── ExtensionName/          # ビルド出力（アプリ名フォルダ）
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Manifest V3

### manifest.json基本構成
```json
{
  "manifest_version": 3,
  "name": "Extension Name",
  "version": "1.0.0",
  "description": "拡張機能の説明",
  "icons": {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "permissions": [
    "storage",
    "activeTab"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_title": "Extension Name",
    "default_icon": {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png"
    }
  },
  "options_page": "options.html",
  "background": {
    "service_worker": "service-worker.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ]
}
```

### 権限の最小化
```json
{
  "permissions": [
    "storage"       // ローカルストレージ
  ],
  "optional_permissions": [
    "tabs",         // 必要時にリクエスト
    "bookmarks"
  ],
  "host_permissions": [
    "https://api.example.com/*"  // 必要なドメインのみ
  ]
}
```

## TypeScript + React構成

### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'ExtensionName',  // アプリ名フォルダに出力
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'public/popup.html'),
        options: resolve(__dirname, 'public/options.html'),
        'service-worker': resolve(__dirname, 'src/background/service-worker.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  publicDir: 'public',
});
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "types": ["chrome"]
  },
  "include": ["src"]
}
```

## メッセージング

### 型定義
```typescript
// src/types/index.ts

// メッセージタイプ
export type MessageType =
  | 'GET_DATA'
  | 'SET_DATA'
  | 'EXECUTE_ACTION'
  | 'ACTION_RESULT';

// メッセージ基本型
export interface Message {
  type: MessageType;
}

// 各メッセージの型
export interface GetDataMessage extends Message {
  type: 'GET_DATA';
  key: string;
}

export interface SetDataMessage extends Message {
  type: 'SET_DATA';
  key: string;
  value: unknown;
}

export interface ExecuteActionMessage extends Message {
  type: 'EXECUTE_ACTION';
  action: string;
  params?: Record<string, unknown>;
}

// レスポンス型
export interface MessageResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

// ユニオン型
export type ExtensionMessage =
  | GetDataMessage
  | SetDataMessage
  | ExecuteActionMessage;
```

### Service Worker（Background）
```typescript
// src/background/service-worker.ts

import type { ExtensionMessage, MessageResponse } from '../types';

// メッセージリスナー
chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, sender, sendResponse) => {
    handleMessage(message, sender)
      .then(sendResponse)
      .catch((error) => {
        sendResponse({
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      });
    return true; // 非同期レスポンスのため
  }
);

async function handleMessage(
  message: ExtensionMessage,
  sender: chrome.runtime.MessageSender
): Promise<MessageResponse> {
  switch (message.type) {
    case 'GET_DATA':
      return handleGetData(message.key);
    case 'SET_DATA':
      return handleSetData(message.key, message.value);
    case 'EXECUTE_ACTION':
      return handleExecuteAction(message.action, message.params);
    default:
      return { success: false, error: '不明なメッセージタイプ' };
  }
}

async function handleGetData(key: string): Promise<MessageResponse> {
  const result = await chrome.storage.local.get(key);
  return { success: true, data: result[key] };
}

async function handleSetData(key: string, value: unknown): Promise<MessageResponse> {
  await chrome.storage.local.set({ [key]: value });
  return { success: true };
}

async function handleExecuteAction(
  action: string,
  params?: Record<string, unknown>
): Promise<MessageResponse> {
  // アクション実行ロジック
  return { success: true, data: { action, params } };
}
```

### Popup/Optionsからのメッセージ送信
```typescript
// src/lib/messaging.ts

import type { ExtensionMessage, MessageResponse } from '../types';

export async function sendMessage(message: ExtensionMessage): Promise<MessageResponse> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response: MessageResponse) => {
      if (chrome.runtime.lastError) {
        resolve({
          success: false,
          error: chrome.runtime.lastError.message,
        });
      } else {
        resolve(response);
      }
    });
  });
}

// 使用例
export async function getData(key: string): Promise<unknown> {
  const response = await sendMessage({ type: 'GET_DATA', key });
  if (!response.success) {
    throw new Error(response.error);
  }
  return response.data;
}

export async function setData(key: string, value: unknown): Promise<void> {
  const response = await sendMessage({ type: 'SET_DATA', key, value });
  if (!response.success) {
    throw new Error(response.error);
  }
}
```

## ストレージ

### ストレージユーティリティ
```typescript
// src/lib/storage.ts

interface Settings {
  theme: 'light' | 'dark';
  language: string;
  enabled: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  language: 'ja',
  enabled: true,
};

export async function getSettings(): Promise<Settings> {
  const result = await chrome.storage.local.get('settings');
  return { ...DEFAULT_SETTINGS, ...result.settings };
}

export async function saveSettings(settings: Partial<Settings>): Promise<void> {
  const current = await getSettings();
  await chrome.storage.local.set({
    settings: { ...current, ...settings },
  });
}

// Sync storage（デバイス間同期）
export async function getSyncData<T>(key: string, defaultValue: T): Promise<T> {
  const result = await chrome.storage.sync.get(key);
  return result[key] ?? defaultValue;
}
```

## Content Script

### Content Script
```typescript
// src/content/content.ts

// ページに注入される
console.log('Content script loaded');

// DOMの操作
function modifyPage() {
  const elements = document.querySelectorAll('.target-class');
  elements.forEach((el) => {
    // DOM操作
  });
}

// Backgroundとの通信
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'MODIFY_PAGE') {
    modifyPage();
    sendResponse({ success: true });
  }
  return true;
});

// ページ読み込み完了後に実行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', modifyPage);
} else {
  modifyPage();
}
```

### Content Scriptへのメッセージ送信
```typescript
// Backgroundから特定タブに送信
async function sendToTab(tabId: number, message: unknown) {
  return chrome.tabs.sendMessage(tabId, message);
}

// 現在のタブに送信
async function sendToCurrentTab(message: unknown) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    return chrome.tabs.sendMessage(tab.id, message);
  }
}
```

## Popup UI（React）

### Popup.tsx
```typescript
// src/popup/Popup.tsx

import { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../lib/storage';
import { sendMessage } from '../lib/messaging';
import './styles/popup.css';

const VERSION = '1.0.0';

export function Popup() {
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    getSettings().then((settings) => {
      setEnabled(settings.enabled);
      setLoading(false);
    });
  }, []);

  const handleToggle = async () => {
    const newValue = !enabled;
    setEnabled(newValue);
    await saveSettings({ enabled: newValue });
  };

  if (loading) {
    return <div className="popup loading">読み込み中...</div>;
  }

  return (
    <div className="popup">
      <header className="header">
        <h1>Extension Name</h1>
        <span className="version">v{VERSION}</span>
      </header>

      <main className="main">
        <label className="toggle">
          <input
            type="checkbox"
            checked={enabled}
            onChange={handleToggle}
          />
          <span>有効化</span>
        </label>
      </main>

      <footer className="footer">
        <button onClick={() => chrome.runtime.openOptionsPage()}>
          設定
        </button>
      </footer>
    </div>
  );
}
```

## アイコン作成

### 必要なサイズ
```text
icons/
├── icon16.png   # ツールバー
├── icon32.png   # Windowsタスクバー
├── icon48.png   # 拡張機能管理画面
└── icon128.png  # Chromeウェブストア
```

### SVGからPNG生成（scripts/generate-icons.ts）
```typescript
import sharp from 'sharp';
import { resolve } from 'path';

const sizes = [16, 32, 48, 128];
const inputSvg = resolve(__dirname, '../public/icons/icon.svg');
const outputDir = resolve(__dirname, '../public/icons');

async function generateIcons() {
  for (const size of sizes) {
    await sharp(inputSvg)
      .resize(size, size)
      .png()
      .toFile(resolve(outputDir, `icon${size}.png`));
    console.log(`Generated icon${size}.png`);
  }
}

generateIcons();
```

## ビルド・配布

### package.json scripts
```json
{
  "scripts": {
    "dev": "vite build --watch",
    "build": "tsc && vite build",
    "zip": "cd ExtensionName && zip -r ../extension.zip .",
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  }
}
```

### ビルド出力
```text
ExtensionName/          # distではなくアプリ名フォルダ
├── manifest.json
├── popup.html
├── options.html
├── service-worker.js
├── content.js
├── assets/
│   ├── popup.js
│   ├── popup.css
│   ├── options.js
│   └── options.css
└── icons/
    └── ...
```

## 禁止事項

- `eval()` の使用（CSP違反）
- インラインスクリプト（CSP違反）
- `<all_urls>` の安易な使用（必要最小限に）
- 過剰な権限要求
- ユーザーデータの外部送信（プライバシー）
- ハードコードされたAPIキー

```typescript
// Bad - evalの使用
eval(userInput);

// Bad - 過剰な権限
"permissions": ["tabs", "history", "bookmarks", ...]

// Good - 必要な権限のみ
"permissions": ["storage", "activeTab"]

// Bad - ハードコードされたAPIキー
const API_KEY = "sk-xxxx";

// Good - ユーザーが設定
const apiKey = await getSettings().then(s => s.apiKey);
```
