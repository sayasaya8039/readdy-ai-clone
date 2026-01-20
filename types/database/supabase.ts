export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          framework: 'nextjs' | 'react'
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          framework: 'nextjs' | 'react'
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          framework?: 'nextjs' | 'react'
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      pages: {
        Row: {
          id: string
          project_id: string
          path: string
          component_code: string
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          path: string
          component_code: string
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          path?: string
          component_code?: string
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      assets: {
        Row: {
          id: string
          project_id: string
          file_name: string
          file_path: string
          file_type: string
          file_size: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          file_name: string
          file_path: string
          file_type: string
          file_size: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          file_name?: string
          file_path?: string
          file_type?: string
          file_size?: number
          created_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          project_id: string
          name: string
          config: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          config: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          config?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      framework_type: 'nextjs' | 'react'
    }
  }
}
