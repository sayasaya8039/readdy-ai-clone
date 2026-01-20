import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database/supabase'

let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient(supabaseUrl: string, supabaseAnonKey: string) {
  // キャッシュされたインスタンスがあり、同じURLの場合は再利用
  if (supabaseInstance && supabaseInstance.supabaseUrl === supabaseUrl) {
    return supabaseInstance
  }

  // 新しいSupabaseクライアントを作成
  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  
  return supabaseInstance
}

// プロジェクト操作
export async function createProject(
  client: ReturnType<typeof createClient<Database>>,
  userId: string,
  name: string,
  framework: 'nextjs' | 'react'
) {
  const { data, error } = await client
    .from('projects')
    .insert({
      user_id: userId,
      name,
      framework,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getProjects(
  client: ReturnType<typeof createClient<Database>>,
  userId: string
) {
  const { data, error } = await client
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data
}

// ページ操作
export async function createPage(
  client: ReturnType<typeof createClient<Database>>,
  projectId: string,
  path: string,
  componentCode: string,
  metaTitle?: string,
  metaDescription?: string
) {
  const { data, error } = await client
    .from('pages')
    .insert({
      project_id: projectId,
      path,
      component_code: componentCode,
      meta_title: metaTitle,
      meta_description: metaDescription,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getPages(
  client: ReturnType<typeof createClient<Database>>,
  projectId: string
) {
  const { data, error } = await client
    .from('pages')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function updatePageCode(
  client: ReturnType<typeof createClient<Database>>,
  pageId: string,
  componentCode: string
) {
  const { data, error } = await client
    .from('pages')
    .update({ component_code: componentCode })
    .eq('id', pageId)
    .select()
    .single()

  if (error) throw error
  return data
}
