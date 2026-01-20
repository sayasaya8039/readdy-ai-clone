'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CreateProjectModal from '@/components/create-project-modal'
import { useApiKeys } from '@/lib/contexts/api-keys-context'
import { useEditorStore } from '@/store/editor-store'
import { loadProjects } from '@/lib/supabase/projects'
import type { Project } from '@/types/project'

export default function Home() {
  const router = useRouter()
  const { apiKeys, hasAllRequiredKeys } = useApiKeys()
  const { setCurrentProject, setCurrentPage } = useEditorStore()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (hasAllRequiredKeys()) {
      loadProjectList()
    }
  }, [hasAllRequiredKeys])

  const loadProjectList = async () => {
    setIsLoading(true)
    setError('')
    try {
      const loadedProjects = await loadProjects(
        apiKeys.supabaseUrl,
        apiKeys.supabaseKey
      )
      setProjects(loadedProjects)
    } catch (err) {
      console.error('プロジェクト読み込みエラー:', err)
      setError(err instanceof Error ? err.message : '不明なエラー')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenProject = (project: Project) => {
    setCurrentProject(project)
    if (project.pages.length > 0) {
      setCurrentPage(project.pages[0])
    }
    router.push('/editor')
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Readdy AI Clone
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              AIを使ってWebサイトを簡単に作成
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium shadow-lg"
              >
                新規プロジェクト作成
              </button>
              <Link
                href="/settings"
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors text-lg font-medium"
              >
                設定
              </Link>
            </div>
          </div>

          {hasAllRequiredKeys() && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">保存済みプロジェクト</h2>
                {isLoading && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {!isLoading && projects.length === 0 && !error && (
                <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
                  <p className="text-gray-700">保存されたプロジェクトはありません</p>
                  <p className="text-sm text-gray-700 mt-2">「新規プロジェクト作成」から始めましょう</p>
                </div>
              )}

              {projects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <div key={project.id} onClick={() => handleOpenProject(project)} className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{project.framework}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{project.pages.length}ページ</div>
                      <div className="text-xs text-gray-700">{new Date(project.createdAt).toLocaleDateString('ja-JP')}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!hasAllRequiredKeys() && (
            <div className="mb-12 bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
              <p className="text-yellow-800 font-medium mb-2">プロジェクトを表示するにはAPIキーの設定が必要です</p>
              <Link href="/settings" className="text-blue-600 hover:underline">設定画面へ →</Link>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-8 bg-white border-2 border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Generate</h2>
              <p className="text-gray-600">テキストプロンプト、画像、URLからWebサイトを自動生成</p>
            </div>

            <div className="p-8 bg-white border-2 border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Edit</h2>
              <p className="text-gray-600">3パネルエディターでビジュアル編集、AIアシスタント付き</p>
            </div>

            <div className="p-8 bg-white border-2 border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Publish</h2>
              <p className="text-gray-600">コードをエクスポートして本番環境にデプロイ</p>
            </div>
          </div>
        </div>
      </main>

      {showCreateModal && <CreateProjectModal onClose={() => setShowCreateModal(false)} />}
    </>
  )
}
