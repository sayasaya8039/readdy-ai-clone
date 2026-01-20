import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database/supabase'

export interface SaveProjectOptions {
  supabaseUrl: string
  supabaseKey: string
  project: {
    id: string
    name: string
    framework: 'nextjs' | 'react'
    pages: Array<{
      id: string
      path: string
      componentCode: string
      metaTitle: string
    }>
  }
}

export async function saveProject(options: SaveProjectOptions) {
  const { supabaseUrl, supabaseKey, project } = options

  if (\!supabaseUrl || \!supabaseKey) {
    throw new Error('Supabase認証情報が設定されていません')
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey)

  try {
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .upsert({
        id: project.id,
        name: project.name,
        framework: project.framework,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (projectError) throw projectError

    const pagesData = project.pages.map(page => ({
      id: page.id,
      project_id: project.id,
      path: page.path,
      component_code: page.componentCode,
      meta_title: page.metaTitle,
      updated_at: new Date().toISOString(),
    }))

    const { error: pagesError } = await supabase
      .from('pages')
      .upsert(pagesData)

    if (pagesError) throw pagesError

    return { success: true, project: projectData }
  } catch (error) {
    console.error('保存エラー:', error)
    throw new Error(\)
  }
}

export async function loadProjects(supabaseUrl: string, supabaseKey: string) {
  if (\!supabaseUrl || \!supabaseKey) {
    throw new Error('Supabase認証情報が設定されていません')
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey)

  try {
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select(\)
      .order('updated_at', { ascending: false })

    if (projectsError) throw projectsError

    return projects.map(proj => ({
      id: proj.id,
      name: proj.name,
      framework: proj.framework as 'nextjs' | 'react',
      pages: (proj.pages || []).map(page => ({
        id: page.id,
        path: page.path,
        componentCode: page.component_code,
        metaTitle: page.meta_title || '',
      })),
      createdAt: new Date(proj.created_at),
    }))
  } catch (error) {
    console.error('読み込みエラー:', error)
    throw new Error(\)
  }
}