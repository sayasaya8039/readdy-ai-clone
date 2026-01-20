import type { GenerateCodeResult } from './generate-code'

export interface GenerateFromImageOptions {
  imageData: string  // base64 or data URL
  prompt?: string
  apiUrl: string
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
    model = 'gpt-4o',
    temperature = 0.7,
    maxTokens = 2000
  } = options

  try {
    const response = await fetch(`${apiUrl}/api/generate-from-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        imageData,
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
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate code from image'
    }
  }
}
