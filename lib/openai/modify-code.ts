import { OpenAI } from 'openai'

export interface ModifyCodeOptions {
  currentCode: string
  instruction: string
  apiKey: string
}

export interface ModifyCodeResult {
  modifiedCode: string
  explanation?: string
}

export async function modifyCode(options: ModifyCodeOptions): Promise<ModifyCodeResult> {
  const { currentCode, instruction, apiKey } = options

  if (!apiKey) {
    throw new Error('OpenAI APIキーが設定されていません')
  }

  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  })

  const systemPrompt = `あなたは優秀なReact開発者です。
ユーザーの指示に基づいて、既存のReactコンポーネントコードを修正してください。

要件:
- コンポーネント名は"App"を維持
- TypeScriptを使用
- Tailwind CSSでスタイリング
- React Hooksを使用
- 'use client'ディレクティブを保持
- 必要なimport文を含める

出力形式:
修正されたコード全体を\`\`\`typescript
code
\`\`\`の形式で出力してください。
変更内容の説明は不要です（コードのみ出力）。`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-2024-11-20',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `現在のコード:

\`\`\`typescript
${currentCode}
\`\`\`

修正指示: ${instruction}`
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    })

    const response = completion.choices[0]?.message?.content || ''

    const codeMatch = response.match(/\`\`\`(?:typescript|tsx)?
([\s\S]*?)
\`\`\`/)
    const modifiedCode = codeMatch ? codeMatch[1] : response

    return {
      modifiedCode: modifiedCode.trim(),
    }
  } catch (error) {
    console.error('コード修正エラー:', error)
    throw new Error(`コード修正に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
  }
}
