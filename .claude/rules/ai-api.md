---
paths: "**/openai/**, **/anthropic/**, **/gemini/**, **/ai/**"
---

# AI API 開発ルール

## 最重要ルール

**API実装時は必ずWebSearchで最新モデル名を確認すること**

AI APIは頻繁に更新されるため、古いモデル名を使用すると動作しない可能性があります。

---

## OpenAI API

### 最新モデル確認

```bash
# 実装前に必ず確認
WebSearch: "OpenAI API latest models 2025"
```

### 基本実装

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function chat(message: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',  // 最新モデルを使用
    messages: [
      { role: 'system', content: 'あなたは親切なアシスタントです。' },
      { role: 'user', content: message },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  })

  return response.choices[0].message.content ?? ''
}
```

### ストリーミング

```typescript
async function* chatStream(message: string) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: message }],
    stream: true,
  })

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content
    if (content) yield content
  }
}
```

---

## Anthropic API

### 最新モデル確認

```bash
# 実装前に必ず確認
WebSearch: "Anthropic Claude API latest models 2025"
```

### 基本実装

```typescript
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

async function chat(message: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',  // 最新モデルを使用
    max_tokens: 1024,
    messages: [{ role: 'user', content: message }],
    system: 'あなたは親切なアシスタントです。',
  })

  const textBlock = response.content.find(block => block.type === 'text')
  return textBlock?.text ?? ''
}
```

### ストリーミング

```typescript
async function* chatStream(message: string) {
  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: message }],
  })

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield event.delta.text
    }
  }
}
```

---

## Google Gemini API

### 最新モデル確認

```bash
# 実装前に必ず確認
WebSearch: "Google Gemini API latest models 2025"
```

### 基本実装

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function chat(message: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const result = await model.generateContent(message)
  return result.response.text()
}
```

### ストリーミング

```typescript
async function* chatStream(message: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const result = await model.generateContentStream(message)

  for await (const chunk of result.stream) {
    yield chunk.text()
  }
}
```


## DeepSeek API

### 最新モデル確認

```bash
# 実装前に必ず確認
WebSearch: "DeepSeek API latest models 2025"
```

### 概要

DeepSeek-V3は671Bパラメータの強力なMoEモデル（101K+ stars）。
MIT ライセンスでオープンソース公開。GPT-4レベルの性能をオープンソースで実現。

### 基本実装

```typescript
import OpenAI from 'openai'

// DeepSeekはOpenAI互換API
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
})

async function chat(message: string): Promise<string> {
  const response = await deepseek.chat.completions.create({
    model: 'deepseek-chat',  // または deepseek-reasoner
    messages: [
      { role: 'system', content: 'あなたは親切なアシスタントです。' },
      { role: 'user', content: message },
    ],
    temperature: 0.7,
    max_tokens: 4096,
  })

  return response.choices[0].message.content ?? ''
}
```

### ストリーミング

```typescript
async function* chatStream(message: string) {
  const stream = await deepseek.chat.completions.create({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: message }],
    stream: true,
  })

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content
    if (content) yield content
  }
}
```

### DeepSeek Reasoner（推論特化）

```typescript
// 推論タスク向け
const response = await deepseek.chat.completions.create({
  model: 'deepseek-reasoner',  // 深い推論向け
  messages: [{ role: 'user', content: '複雑な推論問題...' }],
})
```

### モデル一覧

| モデル | 用途 | 特徴 |
|--------|------|------|
| deepseek-chat | 汎用チャット | 高速・コスト効率 |
| deepseek-reasoner | 推論特化 | 複雑な問題解決 |
| deepseek-coder | コード生成 | プログラミング特化 |

### 料金（2025年12月時点）

| モデル | 入力 | 出力 |
|--------|------|------|
| deepseek-chat | $0.14/1M tokens | $0.28/1M tokens |
| deepseek-reasoner | $0.55/1M tokens | $2.19/1M tokens |

---
---

## 共通ルール

### APIキー管理

```typescript
// 環境変数から取得（ハードコード禁止）
const apiKey = process.env.OPENAI_API_KEY

// ユーザーが設定できるUI
interface Settings {
  openaiApiKey?: string
  anthropicApiKey?: string
  geminiApiKey?: string
}

async function getApiKey(provider: string): Promise<string> {
  const settings = await loadSettings()
  const key = settings[`${provider}ApiKey`]
  if (!key) throw new Error(`${provider}のAPIキーが設定されていません`)
  return key
}
```

### エラーハンドリング

```typescript
async function safeChat(message: string): Promise<string> {
  try {
    return await chat(message)
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      switch (error.status) {
        case 401:
          throw new Error('APIキーが無効です')
        case 429:
          throw new Error('レート制限に達しました。しばらく待ってからお試しください')
        case 500:
          throw new Error('サーバーエラーが発生しました')
        default:
          throw new Error(`APIエラー: ${error.message}`)
      }
    }
    throw error
  }
}
```

### レート制限対策

```typescript
import pRetry from 'p-retry'

async function chatWithRetry(message: string): Promise<string> {
  return pRetry(
    () => chat(message),
    {
      retries: 3,
      onFailedAttempt: (error) => {
        console.log(`リトライ中... (${error.attemptNumber}/3)`)
      },
    }
  )
}
```

---

## 禁止事項

| 禁止事項 | 理由 |
|----------|------|
| APIキーのハードコード | セキュリティリスク |
| 古いモデル名の使用 | 動作しない可能性 |
| エラーハンドリングなし | ユーザー体験悪化 |
| 無制限のリクエスト | コスト増大 |

### 使用禁止のモデル名

```
# これらは古いため使用禁止
- gpt-3.5-turbo（gpt-4oを使用）
- gpt-4（gpt-4oを使用）
- claude-2（claude-sonnet-4を使用）
- claude-instant（claude-haiku-3を使用）
- gemini-pro（gemini-2.0-flashを使用）
```

---

## チェックリスト

実装前：
- [ ] WebSearchで最新モデル名を確認
- [ ] APIキーは環境変数から取得
- [ ] エラーハンドリングを実装

実装後：
- [ ] レート制限対策を実装
- [ ] ユーザーがAPIキーを設定できるUI
- [ ] コスト表示機能（任意）
