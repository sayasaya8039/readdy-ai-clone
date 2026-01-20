'use client'

import { useState } from 'react'
import { useEditorStore } from '@/store/editor-store'
import AddPageModal from '@/components/add-page-modal'

export default function CodePanel() {
  const { currentProject, currentPage, setCurrentPage, deletePage } = useEditorStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  if (!currentProject) return null

  const handleDeletePage = (pageId: string) => {
    if (currentProject.pages.length === 1) {
      alert('最後のページは削除できません')
      return
    }
    deletePage(pageId)
    setDeleteConfirm(null)
  }

  return (
    <>
      <div className="p-4">
        <h3 className="font-bold mb-4">ページ一覧</h3>
        
        <div className="space-y-2">
          {currentProject.pages.map((page) => (
            <div
              key={page.id}
              className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                currentPage?.id === page.id
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
              onClick={() => setCurrentPage(page)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{page.path}</div>
                  <div className="text-sm text-gray-500 mt-1 truncate">{page.metaTitle}</div>
                </div>
                
                {currentProject.pages.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteConfirm(page.id)
                    }}
                    className="ml-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                    title="削除"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              {deleteConfirm === page.id && (
                <div className="absolute inset-0 bg-white rounded-lg p-3 shadow-lg border-2 border-red-500 z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-sm font-medium mb-2">削除しますか？</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeletePage(page.id)}
                      className="flex-1 px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      削除
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="flex-1 px-2 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full mt-4 px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新しいページ
        </button>
      </div>

      {showAddModal && (
        <AddPageModal onClose={() => setShowAddModal(false)} />
      )}
    </>
  )
}
