import { OpenAI } from 'openai'

export interface GenerateCodeOptions {
  prompt: string
  framework: 'nextjs' | 'react'
  apiKey: string
}

export interface GenerateCodeResult {
  componentCode: string
  imports: string[]
  dependencies?: string[]
}

export async function generateCode(options: GenerateCodeOptions): Promise<GenerateCodeResult> {
  const { prompt, framework, apiKey } = options

  if (!apiKey) {
    throw new Error('OpenAI APIキーが設定されていません')
  }

  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  })

  const systemPrompt = `あなたは優秀なReact/Next.js開発者です。
ユーザーのプロンプトに基づいて、${framework === 'nextjs' ? 'Next.js App Router' : 'React'}コンポーネントを生成してください。

要件:
- TypeScriptを使用
- Tailwind CSSでスタイリング
- レスポンシブデザイン対応
- 最新のReact Hooksを使用
- コンポーネント名は必ず"App"にする
- コンポーネントは単一ファイルで完結
- 必要なimport文を含める（ReactとフックはReactパッケージからインポート）
- 'use client'ディレクティブを適切に使用
- export default function App() の形式で出力

出力形式:
\`\`\`typescript
'use client'

import { useState } from 'react'

export default function App() {
  // コンポーネントコード
}
\`\`\`
`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-2024-11-20',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    })

    const generatedCode = completion.choices[0]?.message?.content || ''

    const codeMatch = generatedCode.match(/```(?:typescript|tsx)?\n([\s\S]*?)\n```/)
    const cleanCode = codeMatch ? codeMatch[1] : generatedCode

    const imports = extractImports(cleanCode)

    return {
      componentCode: cleanCode,
      imports,
      dependencies: extractDependencies(imports)
    }
  } catch (error) {
    console.error('OpenAI API エラー:', error)
    throw new Error(`コード生成に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
  }
}

function extractImports(code: string): string[] {
  const importRegex = /^import\s+.*?from\s+['"](.+?)['"];? ?$/gm
  const imports: string[] = []
  let match

  while ((match = importRegex.exec(code)) !== null) {
    imports.push(match[1])
  }

  return imports
}

function extractDependencies(imports: string[]): string[] {
  return imports.filter(imp => !imp.startsWith('.') && !imp.startsWith('/') && imp !== 'react' && imp !== 'react-dom')
}

export async function generateMultiPageCode(
  pages: Array<{ path: string; description: string }>,
  apiKey: string
): Promise<Array<{ path: string; code: string }>> {
  const results = []

  for (const page of pages) {
    const prompt = `パス "${page.path}" のページを作成してください.

説明: ${page.description}`

    try {
      const result = await generateCode({
        prompt,
        framework: 'nextjs',
        apiKey
      })

      results.push({
        path: page.path,
        code: result.componentCode
      })
    } catch (error) {
      console.error(`ページ ${page.path} の生成に失敗:`, error)
      results.push({
        path: page.path,
        code: `// エラー: ${error instanceof Error ? error.message : '生成失敗'}`
      })
    }
  }

  return results
}

export interface GenerateFromImageOptions {
  imageUrl: string
  prompt?: string
  apiKey: string
}

export async function generateFromImage(options: GenerateFromImageOptions): Promise<GenerateCodeResult> {
  const { imageUrl, prompt = 'この画像のUIを再現するReactコンポーネントを作成してください', apiKey } = options

  if (!apiKey) {
    throw new Error('OpenAI APIキーが設定されていません')
  }

  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  })

  const systemPrompt = `あなたは優秀なReact開発者です。
画像を見て、そのUIを再現するReactコンポーネントを生成してください。

要件:
- TypeScriptを使用
- Tailwind CSSでスタイリング
- レスポンシブデザイン対応
- 最新のReact Hooksを使用
- コンポーネント名は必ず"App"にする
- 'use client'ディレクティブを使用
- export default function App() の形式で出力

出力形式:
\`\`\`typescript
'use client'

import { useState } from 'react'

export default function App() {
  // コンポーネントコード
}
\`\`\`
`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-2024-11-20',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    })

    const generatedCode = completion.choices[0]?.message?.content || ''
    const codeMatch = generatedCode.match(/```(?:typescript|tsx)?\n([\s\S]*?)\n```/)
    const cleanCode = codeMatch ? codeMatch[1] : generatedCode
    const imports = extractImports(cleanCode)

    return {
      componentCode: cleanCode,
      imports,
      dependencies: extractDependencies(imports)
    }
  } catch (error) {
    console.error('Image-to-UI エラー:', error)
    throw new Error(`画像からのコード生成に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
  }
}
