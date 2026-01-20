export interface ApiKeys {
  openai: string
  supabaseUrl: string
  supabaseAnonKey: string
  supabaseKey: string
  stripeSecret?: string
  vercelToken?: string
  cloudflareWorkersApiUrl?: string
  cloudflareAccountId?: string
  cloudflareApiToken?: string
}

export type ApiKeyType = keyof ApiKeys