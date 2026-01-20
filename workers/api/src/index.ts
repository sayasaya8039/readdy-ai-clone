import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Env, OpenAIRequest, OpenAIResponse, OpenAIImageRequest, URLCloneRequest, Project } from './types'

const app = new Hono<{ Bindings: Env }>()

// CORS設定
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
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
      generate: '/api/generate'
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

    const openaiKey = c.env.OPENAI_API_KEY

    if (!openaiKey) {
      return c.json({
        error: 'OpenAI API key not configured',
        message: 'OPENAI_API_KEY must be set'
      }, 500)
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
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
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
