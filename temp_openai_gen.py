import os

os.makedirs('lib/openai', exist_ok=True)

content = r'''import { OpenAI } from 'openai'

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

  if (\!apiKey) {
    throw new Error('OpenAI APIキーが設定されていません')
  }

  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  })

  const systemPrompt = \\typescript
// import文
// コンポーネントコード
\\

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

    const codeMatch = generatedCode.match(/\\/)
    const cleanCode = codeMatch ? codeMatch[1] : generatedCode

    const imports = extractImports(cleanCode)

    return {
      componentCode: cleanCode,
      imports,
      dependencies: extractDependencies(imports)
    }
  } catch (error) {
    console.error('OpenAI API エラー:', error)
    throw new Error(\)
  }
}

function extractImports(code: string): string[] {
  const importRegex = /^import\s+.*?from\s+['"](. +?)['"]; ?$/gm
  const imports: string[] = []
  let match

  while ((match = importRegex.exec(code)) \!== null) {
    imports.push(match[1])
  }

  return imports
}

function extractDependencies(imports: string[]): string[] {
  return imports.filter(imp => \!imp.startsWith('.') && \!imp.startsWith('/'))
}

export async function generateMultiPageCode(
  pages: Array<{ path: string; description: string }>,
  apiKey: string
): Promise<Array<{ path: string; code: string }>> {
  const results = []

  for (const page of pages) {
    const prompt = 
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
      console.error(\, error)
      results.push({
        path: page.path,
        code:       })
    }
  }

  return results
}
'''

with open('lib/openai/generate-code.ts', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

print('Created lib/openai/generate-code.ts')
