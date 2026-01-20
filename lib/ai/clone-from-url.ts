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
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to clone from URL'
    }
  }
}
