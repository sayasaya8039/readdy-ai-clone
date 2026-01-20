export interface Env {
  OPENAI_API_KEY: string
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  ENVIRONMENT: string
}

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OpenAIRequest {
  model: string
  messages: OpenAIMessage[]
  temperature?: number
  max_tokens?: number
}


export interface OpenAIImageMessage {
  role: 'system' | 'user'
  content: string | Array<{
    type: 'text' | 'image_url'
    text?: string
    image_url?: {
      url: string
      detail?: 'low' | 'high' | 'auto'
    }
  }>
}

export interface OpenAIImageRequest {
  model: string
  messages: OpenAIImageMessage[]
  temperature?: number
  max_tokens?: number
}

export interface OpenAIResponse {
  id: string
  choices: Array<{
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface Project {
  id: string
  name: string
  description?: string
  pages: any[]
  created_at: string
  updated_at: string
  user_id: string
}


export interface URLCloneRequest {
  url: string
  prompt?: string
}
