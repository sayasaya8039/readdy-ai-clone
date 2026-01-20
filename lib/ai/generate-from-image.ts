import type { GenerateCodeResult } from './generate-code'

export interface GenerateFromImageOptions {
  imageData: string
  prompt?: string
  apiUrl: string
  openaiApiKey: string
  model?: string
  temperature?: number
  maxTokens?: number
}

export async function generateFromImage(
  options: GenerateFromImageOptions
): Promise<GenerateCodeResult> {
  const {
    imageData,
    prompt = 'Convert this UI design to React/Next.js code with Tailwind CSS',
    apiUrl,
    openaiApiKey,
    model = 'gpt-4o',
    temperature = 0.7,
    maxTokens = 2000
  } = options

  try {
    console.log('[generateFromImage] リクエスト開始:', { apiUrl, model })
    
    const response = await fetch(`${apiUrl}/api/generate-from-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OpenAI-Key': openaiApiKey
      },
      body: JSON.stringify({
        imageData,
        prompt,
        model,
        temperature,
        max_tokens: maxTokens
      })
    })

    console.log('[generateFromImage] レスポンス受信:', { status: response.status, ok: response.ok })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[generateFromImage] エラーレスポンス:', errorText)
      
      try {
        const error = JSON.parse(errorText)
        throw new Error(error.error || error.message || `HTTP ${response.status}`)
      } catch (parseError) {
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
    }

    const result = await response.json()
    console.log('[generateFromImage] 成功:', { hasCode: !!result.code, codeLength: result.code?.length })

    return {
      success: result.success !== false,
      code: result.code,
      usage: result.usage
    }
  } catch (error) {
    console.error('[generateFromImage] エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラー'
    }
  }
}
