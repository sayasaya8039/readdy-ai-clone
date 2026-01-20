export interface GenerateCodeOptions {
  prompt: string
  apiUrl: string
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
  const { prompt, apiUrl, model = 'gpt-4o', temperature = 0.7, maxTokens = 2000 } = options

  try {
    const response = await fetch(`${apiUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        model,
        temperature,
        max_tokens: maxTokens
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    const result = await response.json()

    return {
      success: result.success,
      code: result.code,
      usage: result.usage
    }
  } catch (error) {
    console.error('Code generation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラー'
    }
  }
}
