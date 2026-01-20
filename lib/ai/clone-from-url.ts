import type { GenerateCodeResult } from './generate-code'

export interface CloneFromUrlOptions {
  url: string
  prompt?: string
  apiUrl: string
  openaiApiKey: string
}

export async function cloneFromUrl(
  options: CloneFromUrlOptions
): Promise<GenerateCodeResult> {
  const {
    url,
    prompt = 'Convert this website to React/Next.js code with Tailwind CSS',
    apiUrl,
    openaiApiKey
  } = options

  try {
    console.log('[cloneFromUrl] リクエスト開始:', { apiUrl, targetUrl: url })
    
    const response = await fetch(`${apiUrl}/api/clone-from-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OpenAI-Key': openaiApiKey
      },
      body: JSON.stringify({
        url,
        prompt
      })
    })

    console.log('[cloneFromUrl] レスポンス受信:', { status: response.status, ok: response.ok })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[cloneFromUrl] エラーレスポンス:', errorText)
      
      try {
        const error = JSON.parse(errorText)
        throw new Error(error.error || error.message || `HTTP ${response.status}`)
      } catch (parseError) {
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
    }

    const result = await response.json()
    console.log('[cloneFromUrl] 成功:', { hasCode: !!result.code, codeLength: result.code?.length })

    return {
      success: result.success !== false,
      code: result.code,
      usage: result.usage
    }
  } catch (error) {
    console.error('[cloneFromUrl] エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラー'
    }
  }
}
