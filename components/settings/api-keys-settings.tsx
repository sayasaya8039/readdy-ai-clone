"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApiKeys } from '@/lib/contexts/api-keys-context'
import type { ApiKeyType } from '@/types/api-keys'

export default function ApiKeysSettings() {
  const router = useRouter()
  const { apiKeys, setApiKey, clearApiKeys, hasAllRequiredKeys } = useApiKeys()
  const [showKeys, setShowKeys] = useState(false)

  const handleChange = (key: ApiKeyType, value: string) => {
    setApiKey(key, value)
  }

  const handleSaveAndContinue = () => {
    if (hasAllRequiredKeys()) {
      router.push('/')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">API Keys Settings</h2>
      <p className="text-gray-600 mb-6">Your API keys are stored locally.</p>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-900">OpenAI API Key *</label>
            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"><span>Get Key</span></a>
          </div>
          <input type={showKeys ? 'text' : 'password'} value={apiKeys.openai} onChange={(e) => handleChange('openai', e.target.value)} placeholder="sk-..." className="w-full px-3 py-2 border rounded-md text-gray-900"/>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-900">Supabase URL *</label>
            <a href="https://supabase.com/dashboard/projects" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800">Dashboard</a>
          </div>
          <input type="text" value={apiKeys.supabaseUrl} onChange={(e) => handleChange('supabaseUrl', e.target.value)} placeholder="https://..." className="w-full px-3 py-2 border rounded-md text-gray-900"/>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-900">Supabase Anon Key *</label>
            <a href="https://supabase.com/dashboard/projects" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800">Get Keys</a>
          </div>
          <input type={showKeys ? 'text' : 'password'} value={apiKeys.supabaseAnonKey} onChange={(e) => handleChange('supabaseAnonKey', e.target.value)} placeholder="eyJ..." className="w-full px-3 py-2 border rounded-md text-gray-900"/>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-900">Supabase Service Key *</label>
            <a href="https://supabase.com/dashboard/projects" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800">Get Keys</a>
          </div>
          <input type={showKeys ? 'text' : 'password'} value={apiKeys.supabaseKey} onChange={(e) => handleChange('supabaseKey', e.target.value)} placeholder="eyJ..." className="w-full px-3 py-2 border rounded-md text-gray-900"/>
        </div>
      </div>
      <div className="mt-6 flex justify-between">
        <button onClick={() => setShowKeys(!showKeys)} className="text-sm text-blue-600 hover:underline">{showKeys ? 'Hide' : 'Show'} Keys</button>
        <div className="space-x-2">
          <button onClick={clearApiKeys} className="px-4 py-2 border text-gray-700 rounded-md">Clear</button>
          <button onClick={handleSaveAndContinue} disabled={!hasAllRequiredKeys()} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300">Save</button>
        </div>
      </div>
      {hasAllRequiredKeys() && (<div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md"><p className="text-sm text-green-800">All keys configured</p></div>)}
    </div>
  )
}
