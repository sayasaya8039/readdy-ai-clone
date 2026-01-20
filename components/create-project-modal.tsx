'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEditorStore } from '@/store/editor-store'
import { useApiKeys } from '@/lib/contexts/api-keys-context'
import { generateCode } from '@/lib/ai/generate-code'
import { generateFromImage } from '@/lib/ai/generate-from-image'
import { cloneFromUrl } from '@/lib/ai/clone-from-url'

type GenerationMode = 'text' | 'image' | 'url'

export default function CreateProjectModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const { setCurrentProject, setCurrentPage } = useEditorStore()
  const { apiKeys, hasAllRequiredKeys } = useApiKeys()
  const [step, setStep] = useState<'info' | 'prompt'>('info')
  
  const [projectName, setProjectName] = useState('')
  const [framework, setFramework] = useState<'nextjs' | 'react'>('nextjs')
  const [mode, setMode] = useState<GenerationMode>('text')
  const [prompt, setPrompt] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [targetUrl, setTargetUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateProject = async () => {
    if (!hasAllRequiredKeys()) {
      alert('APIキーを設定してください')
      router.push('/settings')
      return
    }

    setIsGenerating(true)
    setError('')
    
    try {
      const apiUrl = apiKeys.cloudflareWorkersApiUrl || 'https://readdy-ai-workers.sayasaya.workers.dev'
      let generatedCode = ''

      if (mode === 'text') {
        const result = await generateCode({
          prompt: prompt,
          apiUrl,
          openaiApiKey: apiKeys.openai,
          model: 'gpt-4o',
          temperature: 0.7,
          maxTokens: 2000
        })

        if (!result.success) {
          throw new Error(result.error || 'コード生成に失敗しました')
        }

        generatedCode = result.code || ''
      } else if (mode === 'image') {
        if (!imagePreview) {
          throw new Error('画像を選択してください')
        }

        const result = await generateFromImage({
          imageData: imagePreview,
          prompt: prompt,
          apiUrl,
          openaiApiKey: apiKeys.openai,
          model: 'gpt-4o',
          temperature: 0.7,
          maxTokens: 2000
        })

        if (!result.success) {
          throw new Error(result.error || '画像からのコード生成に失敗しました')
        }

        generatedCode = result.code || ''
      } else if (mode === 'url') {
        if (!targetUrl) {
          throw new Error('URLを入力してください')
        }

        const result = await cloneFromUrl({
          url: targetUrl,
          prompt: prompt,
          apiUrl,
          openaiApiKey: apiKeys.openai
        })

        if (!result.success) {
          throw new Error(result.error || 'URLからのクローンに失敗しました')
        }

        generatedCode = result.code || ''
      }

      const newProject = {
        id: crypto.randomUUID(),
        name: projectName,
        framework,
        pages: [{
          id: crypto.randomUUID(),
          path: '/',
          componentCode: generatedCode,
          metaTitle: projectName,
        }],
        createdAt: new Date(),
      }

      setCurrentProject(newProject)
      setCurrentPage(newProject.pages[0])
      router.push('/editor')
      onClose()
    } catch (error) {
      console.error('生成エラー:', error)
      setError(error instanceof Error ? error.message : '予期しないエラーが発生しました')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">新規プロジェクト作成</h2>
            <button
              onClick={onClose}
              className="text-gray-700 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {step === 'info' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">プロジェクト名</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: マイポートフォリオ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">フレームワーク</label>
                <select
                  value={framework}
                  onChange={(e) => setFramework(e.target.value as 'nextjs' | 'react')}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="nextjs">Next.js (推奨)</option>
                  <option value="react">React</option>
                </select>
              </div>

              <button
                onClick={() => setStep('prompt')}
                disabled={!projectName}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                次へ
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">生成方法を選択</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setMode('text')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      mode === 'text'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">✏️</div>
                      <div className="text-sm font-medium">テキスト</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setMode('image')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      mode === 'image'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🖼️</div>
                      <div className="text-sm font-medium">画像</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setMode('url')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      mode === 'url'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center opacity-50">
                      <div className="text-2xl mb-2">🔗</div>
                      <div className="text-sm font-medium">URL</div>
                    </div>
                  </button>
                </div>
              </div>

              {mode === 'text' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    どんなWebサイトを作りたいですか？
                  </label>
                  <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-32 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例: モダンなポートフォリオサイトを作成してください。ヘッダー、ヒーローセクション、プロジェクト一覧、コンタクトフォームを含めてください。"
                />
                </div>
              )}

              {mode === 'image' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      UIデザイン画像をアップロード
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {imagePreview && (
                    <div className="border rounded-lg p-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full h-auto max-h-64 mx-auto"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      追加の指示（任意）
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full h-20 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="例: レスポンシブ対応にしてください"
                    />
                  </div>
                </div>
              )}

              {mode === 'url' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      クローンするWebサイトのURL
                    </label>
                    <input
                      type="url"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="例: https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      追加の指示（任意）
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full h-20 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="例: ダークモードに対応してください"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('info')}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400"
                  disabled={isGenerating}
                >
                  戻る
                </button>
                <button
                  onClick={handleCreateProject}
                  disabled={(mode === 'text' && !prompt) || (mode === 'image' && !imagePreview) || isGenerating}
                  className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      生成中...
                    </span>
                  ) : '作成開始'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
