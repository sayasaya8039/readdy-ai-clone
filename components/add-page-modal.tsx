'use client'

import { useState } from 'react'
import { useEditorStore } from '@/store/editor-store'
import { useApiKeys } from '@/lib/contexts/api-keys-context'
import { generateCode } from '@/lib/openai/generate-code'

interface AddPageModalProps {
  onClose: () => void
}

export default function AddPageModal({ onClose }: AddPageModalProps) {
  const { currentProject, addPage, setCurrentPage } = useEditorStore()
  const { apiKeys } = useApiKeys()
  const [pagePath, setPagePath] = useState('')
  const [pageTitle, setPageTitle] = useState('')
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!pagePath || !pageTitle) {
      setError('パスとタイトルを入力してください')
      return
    }

    if (!currentProject) {
      setError('プロジェクトが選択されていません')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      let componentCode = ''

      if (prompt.trim()) {
        const result = await generateCode({
          prompt,
          framework: currentProject.framework,
          apiKey: apiKeys.openai
        })
        componentCode = result.componentCode
      } else {
        componentCode = `'use client'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">${pageTitle}</h1>
        <p className="text-gray-600">このページはまだ空です。</p>
      </div>
    </div>
  )
}`
      }

      const newPage = {
        id: crypto.randomUUID(),
        path: pagePath.startsWith('/') ? pagePath : `/${pagePath}`,
        componentCode,
        metaTitle: pageTitle,
        metaDescription: '',
      }

      addPage(newPage)
      setCurrentPage(newPage)
      onClose()
    } catch (err) {
      console.error('ページ生成エラー:', err)
      setError(err instanceof Error ? err.message : '不明なエラー')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">新しいページを追加</h2>
            <button
              onClick={onClose}
              className="text-gray-700 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ページパス *
            </label>
            <input
              type="text"
              value={pagePath}
              onChange={(e) => setPagePath(e.target.value)}
              placeholder="/about または about"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ページタイトル *
            </label>
            <input
              type="text"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              placeholder="例: About Us"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AIプロンプト（オプション）
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="このページの内容を説明してください...（空欄の場合は基本テンプレートが使用されます）"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isGenerating}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors"
              disabled={isGenerating}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={isGenerating}
            >
              {isGenerating ? '生成中...' : 'ページを追加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
