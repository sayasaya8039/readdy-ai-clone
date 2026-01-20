
'use client'

import { useState } from 'react'
import LeftPanel from './left-panel'
import CenterPanel from './center-panel'
import RightPanel from './right-panel'

export default function EditorLayout() {
  const [leftPanelWidth, setLeftPanelWidth] = useState(280)
  const [rightPanelWidth, setRightPanelWidth] = useState(320)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Navigation & Layers */}
      <div 
        className="border-r border-gray-200 bg-white flex-shrink-0"
        style={{ width: '280px' }}
      >
        <LeftPanel />
      </div>

      {/* Center Panel - Preview */}
      <div className="flex-1 min-w-0">
        <CenterPanel />
      </div>

      {/* Right Panel - AI Chat & Properties */}
      <div 
        className="border-l border-gray-200 bg-white flex-shrink-0"
        style={{ width: '320px' }}
      >
        <RightPanel />
      </div>
    </div>
  )
}
