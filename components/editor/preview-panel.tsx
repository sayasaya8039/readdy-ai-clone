'use client'

import { useEffect, useRef, useState } from 'react'
import { useEditorStore } from '@/store/editor-store'

interface PreviewPanelProps {
  layout: 'desktop' | 'mobile'
}

export default function PreviewPanel({ layout }: PreviewPanelProps) {
  const { currentPage } = useEditorStore()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!currentPage || !iframeRef.current) return

    setError('')

    const componentCode = currentPage.componentCode
    
    const htmlContent = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    #root { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-type="module">
    const { useState, useEffect, useRef } = React;
    
    try {
      ${componentCode}
      
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(App));
    } catch (err) {
      document.getElementById('root').innerHTML = \`
        <div style="padding: 2rem; background: #fee; border: 2px solid #fcc; border-radius: 8px; margin: 2rem;">
          <h2 style="color: #c00; margin-bottom: 1rem;">レンダリングエラー</h2>
          <pre style="background: #fff; padding: 1rem; border-radius: 4px; overflow: auto;">\${err.message}</pre>
        </div>
      \`;
      console.error('Preview error:', err);
    }
  </script>
</body>
</html>`

    if (iframeRef.current) {
      iframeRef.current.srcdoc = htmlContent
    }
  }, [currentPage?.componentCode])

  if (!currentPage) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-700">ページが選択されていません</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div
        className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
          layout === 'mobile' ? 'w-[375px] h-[667px]' : 'w-full h-full'
        }`}
      >
        {error && (
          <div className="bg-red-50 border-b border-red-200 p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          sandbox="allow-scripts"
          title="Component Preview"
        />
      </div>

      <div className="mt-4 text-sm text-gray-700">
        {layout === 'mobile' ? '375 × 667 (iPhone SE)' : 'Desktop View'}
      </div>
    </div>
  )
}
