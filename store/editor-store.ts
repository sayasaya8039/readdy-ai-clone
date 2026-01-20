import { create } from 'zustand'

export interface Page {
  id: string
  path: string
  componentCode: string
  metaTitle?: string
  metaDescription?: string
}

export interface Project {
  id: string
  name: string
  framework: 'nextjs' | 'react'
  pages: Page[]
  createdAt: Date
}

interface EditorState {
  // Project
  currentProject: Project | null
  setCurrentProject: (project: Project | null) => void
  
  // Page
  currentPage: Page | null
  setCurrentPage: (page: Page | null) => void
  updatePageCode: (pageId: string, code: string) => void
  addPage: (page: Page) => void
  deletePage: (pageId: string) => void
  
  // Selection
  selectedElementId: string | null
  setSelectedElementId: (id: string | null) => void
  
  // Preview Mode
  previewMode: 'desktop' | 'mobile'
  setPreviewMode: (mode: 'desktop' | 'mobile') => void
  
  // History
  history: string[]
  historyIndex: number
  addToHistory: (code: string) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

export const useEditorStore = create<EditorState>((set, get) => ({
  // Project
  currentProject: null,
  setCurrentProject: (project) => set({ currentProject: project }),
  
  // Page
  currentPage: null,
  setCurrentPage: (page) => set({ currentPage: page }),
  updatePageCode: (pageId, code) => set((state) => {
    if (!state.currentProject) return state
    
    const updatedPages = state.currentProject.pages.map(p =>
      p.id === pageId ? { ...p, componentCode: code } : p
    )
    
    return {
      currentProject: {
        ...state.currentProject,
        pages: updatedPages,
      },
      currentPage: state.currentPage?.id === pageId
        ? { ...state.currentPage, componentCode: code }
        : state.currentPage,
    }
  }),
  addPage: (page) => set((state) => {
    if (!state.currentProject) return state
    
    return {
      currentProject: {
        ...state.currentProject,
        pages: [...state.currentProject.pages, page],
      },
    }
  }),
  deletePage: (pageId) => set((state) => {
    if (!state.currentProject) return state
    
    const updatedPages = state.currentProject.pages.filter(p => p.id !== pageId)
    
    return {
      currentProject: {
        ...state.currentProject,
        pages: updatedPages,
      },
      currentPage: state.currentPage?.id === pageId 
        ? (updatedPages[0] || null)
        : state.currentPage,
    }
  }),
  
  // Selection
  selectedElementId: null,
  setSelectedElementId: (id) => set({ selectedElementId: id }),
  
  // Preview Mode
  previewMode: 'desktop',
  setPreviewMode: (mode) => set({ previewMode: mode }),
  
  // History
  history: [],
  historyIndex: -1,
  addToHistory: (code) => set((state) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1)
    newHistory.push(code)
    return {
      history: newHistory,
      historyIndex: newHistory.length - 1,
    }
  }),
  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1
      const code = state.history[newIndex]
      if (state.currentPage) {
        get().updatePageCode(state.currentPage.id, code)
      }
      return { historyIndex: newIndex }
    }
    return state
  }),
  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1
      const code = state.history[newIndex]
      if (state.currentPage) {
        get().updatePageCode(state.currentPage.id, code)
      }
      return { historyIndex: newIndex }
    }
    return state
  }),
  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
}))
