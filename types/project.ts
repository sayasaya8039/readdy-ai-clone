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
