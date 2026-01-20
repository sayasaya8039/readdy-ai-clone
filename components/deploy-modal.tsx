'use client'

import { useState } from 'react'
import { useEditorStore } from '@/store/editor-store'
import { useApiKeys } from '@/lib/contexts/api-keys-context'
import { deployToVercel } from '@/lib/vercel/deploy'
import { deployToCloudflare } from '@/lib/cloudflare/deploy'
import { deployToGitHub } from '@/lib/github/deploy'

type DeployPlatform = 'vercel' | 'github' | 'cloudflare'

interface DeployModalProps {
  onClose: () => void
}

export default function DeployModal({ onClose }: DeployModalProps) {
  const { currentProject } = useEditorStore()
  const { apiKeys } = useApiKeys()
  const [platform, setPlatform] = useState<DeployPlatform>('vercel')
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployResult, setDeployResult] = useState<{ success: boolean; url?: string; error?: string } | null>(null)

  const handleDeploy = async () => {
    if (!currentProject) return

    setIsDeploying(true)
    setDeployResult(null)

    try {
      if (platform === 'vercel') {
        const result = await deployToVercel({
          project: currentProject,
          vercelToken: apiKeys.vercelToken
        })
        setDeployResult(result)
      } else if (platform === 'github') {
        setDeployResult({ 
          success: false, 
          error: 'GitHub Pagesデプロイは実装中です' 
        })
      } else if (platform === 'cloudflare') {
        const result = await deployToCloudflare({
          project: currentProject,
          cloudflareAccountId: apiKeys.cloudflareAccountId,
          cloudflareApiToken: apiKeys.cloudflareApiToken
        })
        setDeployResult(result)
      }
    } catch (error) {
      console.error('デプロイエラー:', error)
      setDeployResult({ 
        success: false, 
        error: error instanceof Error ? error.message : '不明なエラー' 
      })
    } finally {
      setIsDeploying(false)
    }
  }

  const getPlatformButtonClass = (p: DeployPlatform) => {
    return `p-6 border-2 rounded-xl transition-all ${
      platform === p
        ? 'border-blue-500 bg-blue-50 shadow-lg'
        : 'border-gray-300 hover:border-gray-400'
    }`
  }

  const getResultClass = () => {
    if (!deployResult) return ''
    return `p-4 rounded-lg ${
      deployResult.success 
        ? 'bg-green-50 border border-green-200 text-green-700'
        : 'bg-red-50 border border-red-200 text-red-700'
    }`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">プロジェクトをデプロイ</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">デプロイ先を選択</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button onClick={() => setPlatform('vercel')} className={getPlatformButtonClass('vercel')}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-3 flex items-center justify-center">
                    <svg className="w-12 h-12" viewBox="0 0 76 76" fill="none">
                      <path d="M38 0L76 66H0L38 0Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="font-bold text-lg mb-1">Vercel</div>
                  <div className="text-xs text-gray-600">Next.jsに最適</div>
                </div>
              </button>

              <button onClick={() => setPlatform('github')} className={getPlatformButtonClass('github')}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-3 flex items-center justify-center">
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  </div>
                  <div className="font-bold text-lg mb-1">GitHub Pages</div>
                  <div className="text-xs text-gray-600">無料の静的ホスティング</div>
                </div>
              </button>

              <button onClick={() => setPlatform('cloudflare')} className={getPlatformButtonClass('cloudflare')}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 mb-3 flex items-center justify-center">
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.929 14.929l-2.858-2.858a1 1 0 010-1.414l2.858-2.858a1 1 0 011.414 0l2.858 2.858a1 1 0 010 1.414l-2.858 2.858a1 1 0 01-1.414 0zM4.071 14.929l2.858-2.858a1 1 0 000-1.414L4.071 8.929a1 1 0 00-1.414 0L.657 10.657a1 1 0 000 1.414l2.858 2.858a1 1 0 001.414 0z"/>
                    </svg>
                  </div>
                  <div className="font-bold text-lg mb-1">Cloudflare</div>
                  <div className="text-xs text-gray-600">高速CDN配信</div>
                </div>
              </button>
            </div>
          </div>

          {deployResult && (
            <div className={getResultClass()}>
              {deployResult.success ? (
                <div>
                  <div className="font-medium mb-2">✅ デプロイ成功！</div>
                  {deployResult.url && (
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">公開URL: </span>
                        <a href={deployResult.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {deployResult.url}
                        </a>
                      </div>

                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="font-medium mb-2">❌ デプロイ失敗</div>
                  <div className="text-sm">{deployResult.error}</div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors" disabled={isDeploying}>
              キャンセル
            </button>
            <button onClick={handleDeploy} disabled={isDeploying} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
              {isDeploying ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  デプロイ中...
                </span>
              ) : `${platform === 'vercel' ? 'Vercel' : platform === 'github' ? 'GitHub Pages' : 'Cloudflare Pages'}にデプロイ`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
