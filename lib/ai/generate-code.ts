export interface GenerateCodeOptions {
  prompt: string
  apiUrl: string
  openaiApiKey: string
  model?: string
  temperature?: number
  maxTokens?: number
}

export interface GenerateCodeResult {
  success: boolean
  code?: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  error?: string
}

export async function generateCode(options: GenerateCodeOptions): Promise<GenerateCodeResult> {
  const { prompt, apiUrl, openaiApiKey, model = 'gpt-4o', temperature = 0.7, maxTokens = 2000 } = options

  try {
    console.log('[generateCode] リクエスト開始:', { apiUrl, model })
    
    const response = await fetch(`${apiUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OpenAI-Key': openaiApiKey
      },
      body: JSON.stringify({
        prompt,
        model,
        temperature,
        max_tokens: maxTokens
      })
    })

    console.log('[generateCode] レスポンス受信:', { status: response.status, ok: response.ok })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[generateCode] エラーレスポンス:', errorText)
      
      try {
        const error = JSON.parse(errorText)
        throw new Error(error.error || error.message || `HTTP ${response.status}`)
      } catch (parseError) {
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
    }

    const result = await response.json()
    console.log('[generateCode] 成功:', { hasCode: !!result.code, codeLength: result.code?.length })

    return {
      success: result.success !== false,
      code: result.code,
      usage: result.usage
    }
  } catch (error) {
    console.error('[generateCode] エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラー'
    }
  }
}
