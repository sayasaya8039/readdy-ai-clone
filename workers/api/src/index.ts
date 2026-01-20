import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Env, OpenAIRequest, OpenAIResponse, OpenAIImageRequest, URLCloneRequest, Project } from './types'

const app = new Hono<{ Bindings: Env }>()

// CORS設定
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-OpenAI-Key'],
  exposeHeaders: ['Content-Length'],
  maxAge: 3600,
  credentials: true,
}))

// ヘルスチェック
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Readdy AI Workers API'
  })
})

// ルート
app.get('/', (c) => {
  return c.json({
    message: 'Readdy AI Workers API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      projects: '/api/projects',
      generate: '/api/generate',
      generateFromImage: '/api/generate-from-image',
      cloneFromUrl: '/api/clone-from-url'
    }
  })
})

// プロジェクト一覧取得
app.get('/api/projects', async (c) => {
  try {
    const supabaseUrl = c.env.SUPABASE_URL
    const supabaseKey = c.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return c.json({
        error: 'Supabase credentials not configured',
        message: 'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set'
      }, 500)
    }

    // Supabase REST APIでプロジェクト一覧を取得
    const response = await fetch(`${supabaseUrl}/rest/v1/projects?select=*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`)
    }

    const projects: Project[] = await response.json()

    return c.json({
      projects,
      total: projects.length
    })
  } catch (error) {
    console.error('Projects fetch error:', error)
    return c.json({
      error: 'Failed to fetch projects',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// コード生成エンドポイント
app.post('/api/generate', async (c) => {
  try {
    const body = await c.req.json()
    const { prompt, model = 'gpt-4o', temperature = 0.7, max_tokens = 2000 } = body

    if (!prompt) {
      return c.json({ error: 'Prompt is required' }, 400)
    }

    // X-OpenAI-Keyヘッダーから取得（BYOKモード）、なければ環境変数から（フォールバック）
    const openaiKey = c.req.header('X-OpenAI-Key') || c.env.OPENAI_API_KEY

    if (!openaiKey) {
      return c.json({
        error: 'OpenAI API key not configured',
        message: 'OpenAI API key must be provided via X-OpenAI-Key header or OPENAI_API_KEY environment variable'
      }, 401)
    }

    // OpenAI APIリクエスト
    const openaiRequest: OpenAIRequest = {
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert web developer. Generate clean, modern React/Next.js code with Tailwind CSS styling. Always return valid JSX code.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature,
      max_tokens
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(openaiRequest)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OpenAI API error: ${error.error?.message || response.status}`)
    }

    const result: OpenAIResponse = await response.json()

    return c.json({
      success: true,
      code: result.choices[0].message.content,
      usage: result.usage
    })
  } catch (error) {
    console.error('Code generation error:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})


// 画像からコード生成エンドポイント
app.post('/api/generate-from-image', async (c) => {
  try {
    const body = await c.req.json()
    const { imageData, prompt = 'Convert this UI design to React/Next.js code with Tailwind CSS', model = 'gpt-4o', temperature = 0.7, max_tokens = 2000 } = body

    if (!imageData) {
      return c.json({ error: 'Image data is required' }, 400)
    }

    // X-OpenAI-Keyヘッダーから取得（BYOKモード）、なければ環境変数から（フォールバック）
    const openaiKey = c.req.header('X-OpenAI-Key') || c.env.OPENAI_API_KEY

    if (!openaiKey) {
      return c.json({
        error: 'OpenAI API key not configured',
        message: 'OpenAI API key must be provided via X-OpenAI-Key header or OPENAI_API_KEY environment variable'
      }, 401)
    }

    // OpenAI APIリクエスト（Vision）
    const openaiRequest: OpenAIImageRequest = {
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert web developer. Convert UI designs to clean, modern React/Next.js code with Tailwind CSS styling. Always return valid JSX code.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image_url',
              image_url: {
                url: imageData,
                detail: 'high'
              }
            }
          ]
        }
      ],
      temperature,
      max_tokens
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(openaiRequest)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OpenAI API error: ${error.error?.message || response.status}`)
    }

    const result: OpenAIResponse = await response.json()

    return c.json({
      success: true,
      code: result.choices[0].message.content,
      usage: result.usage
    })
  } catch (error) {
    console.error('Image code generation error:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// URLからクローンエンドポイント
app.post('/api/clone-from-url', async (c) => {
  try {
    const body = await c.req.json()
    const { url, prompt = 'Convert this website to React/Next.js code with Tailwind CSS' } = body

    if (!url) {
      return c.json({ error: 'URL is required' }, 400)
    }

    // X-OpenAI-Keyヘッダーから取得（BYOKモード）、なければ環境変数から（フォールバック）
    const openaiKey = c.req.header('X-OpenAI-Key') || c.env.OPENAI_API_KEY

    if (!openaiKey) {
      return c.json({
        error: 'OpenAI API key not configured',
        message: 'OpenAI API key must be provided via X-OpenAI-Key header or OPENAI_API_KEY environment variable'
      }, 401)
    }

    // URLのコンテンツを取得
    const targetResponse = await fetch(url)
    if (!targetResponse.ok) {
      throw new Error(`Failed to fetch URL: ${targetResponse.status}`)
    }

    const htmlContent = await targetResponse.text()

    // OpenAI APIリクエスト
    const openaiRequest: OpenAIRequest = {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert web developer. Convert website HTML to clean, modern React/Next.js code with Tailwind CSS styling. Always return valid JSX code.'
        },
        {
          role: 'user',
          content: `${prompt}

HTML Content:
${htmlContent.slice(0, 8000)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(openaiRequest)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OpenAI API error: ${error.error?.message || response.status}`)
    }

    const result: OpenAIResponse = await response.json()

    return c.json({
      success: true,
      code: result.choices[0].message.content,
      usage: result.usage
    })
  } catch (error) {
    console.error('URL clone error:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// 404ハンドラー
app.notFound((c) => {
  return c.json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  }, 404)
})

// エラーハンドラー
app.onError((err, c) => {
  console.error('Error:', err)
  return c.json({
    error: 'Internal Server Error',
    message: err.message
  }, 500)
})

export default app
