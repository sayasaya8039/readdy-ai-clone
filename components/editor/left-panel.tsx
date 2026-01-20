
'use client'

import { useEditorStore } from '@/store/editor-store'

export default function LeftPanel() {
  const { currentProject, currentPage, setCurrentPage } = useEditorStore()

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {currentProject?.name || 'プロジェクト'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {currentProject?.framework === 'nextjs' ? 'Next.js' : 'React'}
        </p>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">ページ</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm">
              + 追加
            </button>
          </div>

          {currentProject?.pages.length ? (
            <div className="space-y-1">
              {currentProject.pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setCurrentPage(page)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    currentPage?.id === page.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="truncate text-sm">{page.path}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 py-8 text-center">
              ページがありません
            </p>
          )}
        </div>

        {/* Layers Section */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">レイヤー</h3>
          <div className="text-sm text-gray-500">
            レイヤー機能は開発中です
          </div>
        </div>
      </div>
    </div>
  )
}
