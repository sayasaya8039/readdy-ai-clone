"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ApiKeys, ApiKeyType } from '@/types/api-keys'

interface ApiKeysContextType {
  apiKeys: ApiKeys
  setApiKey: (key: ApiKeyType, value: string) => void
  clearApiKeys: () => void
  hasAllRequiredKeys: () => boolean
}

const ApiKeysContext = createContext<ApiKeysContextType | undefined>(undefined)

const STORAGE_KEY = 'readdy_api_keys'

const defaultKeys: ApiKeys = {
  openai: '',
  supabaseUrl: '',
  supabaseAnonKey: '',
  supabaseKey: '',
  stripeSecret: '',
  vercelToken: '',
  cloudflareWorkersApiUrl: 'https://readdy-ai-workers.sayasaya.workers.dev',
  cloudflareAccountId: '',
  cloudflareApiToken: '',
}

export function ApiKeysProvider({ children }: { children: React.ReactNode }) {
  const [apiKeys, setApiKeys] = useState<ApiKeys>(defaultKeys)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setApiKeys({ ...defaultKeys, ...parsed })
      }
    } catch (error) {
      console.error('Failed to load API keys:', error)
    }
  }, [])

  // Save to localStorage when keys change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apiKeys))
    } catch (error) {
      console.error('Failed to save API keys:', error)
    }
  }, [apiKeys])

  const setApiKey = (key: ApiKeyType, value: string) => {
    setApiKeys(prev => ({ ...prev, [key]: value }))
  }

  const clearApiKeys = () => {
    setApiKeys(defaultKeys)
    localStorage.removeItem(STORAGE_KEY)
  }

  const hasAllRequiredKeys = () => {
    return !!(
      apiKeys.openai &&
      apiKeys.supabaseUrl &&
      apiKeys.supabaseAnonKey &&
      apiKeys.supabaseKey
    )
  }

  return (
    <ApiKeysContext.Provider value={{ apiKeys, setApiKey, clearApiKeys, hasAllRequiredKeys }}>
      {children}
    </ApiKeysContext.Provider>
  )
}

export function useApiKeys() {
  const context = useContext(ApiKeysContext)
  if (!context) {
    throw new Error('useApiKeys must be used within ApiKeysProvider')
  }
  return context
}