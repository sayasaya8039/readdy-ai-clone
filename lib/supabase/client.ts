import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// シングルトンインスタンス
let cachedUrl: string | null = null
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient(supabaseUrl: string, supabaseAnonKey: string) {
  // キャッシュされたインスタンスがあり、同じURLの場合は再利用
  if (supabaseInstance && cachedUrl === supabaseUrl) {
    return supabaseInstance
  }

  // 新しいSupabaseクライアントを作成
  cachedUrl = supabaseUrl
  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  
  return supabaseInstance
}

// プロジェクト一覧取得
export async function getProjects(supabaseUrl: string, supabaseAnonKey: string) {
  const supabase = getSupabaseClient(supabaseUrl, supabaseAnonKey)
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// プロジェクト作成
export async function createProject(
  supabaseUrl: string,
  supabaseAnonKey: string,
  project: {
    name: string
    framework: 'nextjs' | 'react'
  }
) {
  const supabase = getSupabaseClient(supabaseUrl, supabaseAnonKey)
  
  const { data, error } = await supabase
    .from('projects')
    .insert({
      name: project.name,
      framework: project.framework,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// プロジェクト更新
export async function updateProject(
  supabaseUrl: string,
  supabaseAnonKey: string,
  projectId: string,
  updates: {
    name?: string
    framework?: 'nextjs' | 'react'
  }
) {
  const supabase = getSupabaseClient(supabaseUrl, supabaseAnonKey)
  
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single()

  if (error) throw error
  return data
}

// ページ作成
export async function createPage(
  supabaseUrl: string,
  supabaseAnonKey: string,
  page: {
    project_id: string
    path: string
    component_code: string
    meta_title?: string
    meta_description?: string
  }
) {
  const supabase = getSupabaseClient(supabaseUrl, supabaseAnonKey)
  
  const { data, error } = await supabase
    .from('pages')
    .insert(page)
    .select()
    .single()

  if (error) throw error
  return data
}

// ページ更新
export async function updatePage(
  supabaseUrl: string,
  supabaseAnonKey: string,
  pageId: string,
  updates: {
    path?: string
    component_code?: string
    meta_title?: string
    meta_description?: string
  }
) {
  const supabase = getSupabaseClient(supabaseUrl, supabaseAnonKey)
  
  const { data, error } = await supabase
    .from('pages')
    .update(updates)
    .eq('id', pageId)
    .select()
    .single()

  if (error) throw error
  return data
}
