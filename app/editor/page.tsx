'use client'

import { useEffect, useState } from 'react'
import { useEditorStore } from '@/store/editor-store'
import { useRouter } from 'next/navigation'
import { useApiKeys } from '@/lib/contexts/api-keys-context'
import { saveProject } from '@/lib/supabase/projects'
import PreviewPanel from '@/components/editor/preview-panel'
import CodePanel from '@/components/editor/code-panel'
import AIChatPanel from '@/components/editor/ai-chat-panel'
import DeployModal from '@/components/deploy-modal'

export default function EditorPage() {
  const router = useRouter()
  const { currentProject, currentPage } = useEditorStore()
  const { apiKeys } = useApiKeys()
  const [layout, setLayout] = useState<'desktop' | 'mobile'>('desktop')
  const [isSaving, setIsSaving] = useState(false)
  const [showDeployModal, setShowDeployModal] = useState(false)

  useEffect(() => {
    if (!currentProject) {
      router.push('/')
    }
  }, [currentProject, router])

  const handleSave = async () => {
    if (!currentProject) return

    setIsSaving(true)
    try {
      await saveProject({
        supabaseUrl: apiKeys.supabaseUrl,
        supabaseKey: apiKeys.supabaseKey,
        project: currentProject
      })
      alert('プロジェクトを保存しました')
    } catch (error) {
      console.error('保存エラー:', error)
      alert(`保存に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = () => {
    if (!currentProject) return

    const exportData = {
      name: currentProject.name,
      framework: currentProject.framework,
      pages: currentProject.pages,
      createdAt: currentProject.createdAt,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentProject.name}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!currentProject || !currentPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← 戻る
            </button>
            <h1 className="text-xl font-bold">{currentProject.name}</h1>
            <span className="text-sm text-gray-700">
              {currentPage.path}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLayout('desktop')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  layout === 'desktop'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Desktop
              </button>
              <button
                onClick={() => setLayout('mobile')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  layout === 'mobile'
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mobile
              </button>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSaving ? '保存中...' : '保存'}
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400"
            >
              エクスポート
            </button>
            <button
              onClick={() => setShowDeployModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              デプロイ
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
            <CodePanel />
          </div>

          <div className="flex-1 bg-gray-100 overflow-hidden">
            <PreviewPanel layout={layout} />
          </div>

          <div className="w-96 border-l border-gray-200 bg-white overflow-y-auto">
            <AIChatPanel />
          </div>
        </div>
      </div>

      {showDeployModal && <DeployModal onClose={() => setShowDeployModal(false)} />}
    </>
  )
}
