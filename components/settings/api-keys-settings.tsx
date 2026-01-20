"use client"

import { useState } from 'react'
import { useApiKeys } from '@/lib/contexts/api-keys-context'
import type { ApiKeyType } from '@/types/api-keys'

export default function ApiKeysSettings() {
  const { apiKeys, setApiKey, clearApiKeys, hasAllRequiredKeys } = useApiKeys()
  const [showKeys, setShowKeys] = useState(false)

  const handleChange = (key: ApiKeyType, value: string) => {
    setApiKey(key, value)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">API Keys Settings</h2>
      <p className="text-gray-600 mb-6">
        Your API keys are stored locally in your browser and never sent to our servers.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            OpenAI API Key *
          </label>
          <input
            type={showKeys ? 'text' : 'password'}
            value={apiKeys.openai}
            onChange={(e) => handleChange('openai', e.target.value)}
            placeholder="sk-..."
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Supabase URL *
          </label>
          <input
            type="text"
            value={apiKeys.supabaseUrl}
            onChange={(e) => handleChange('supabaseUrl', e.target.value)}
            placeholder="https://xxxxx.supabase.co"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Supabase Anon Key *
          </label>
          <input
            type={showKeys ? 'text' : 'password'}
            value={apiKeys.supabaseAnonKey}
            onChange={(e) => handleChange('supabaseAnonKey', e.target.value)}
            placeholder="eyJ..."
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Supabase Service Role Key *
          </label>
          <input
            type={showKeys ? 'text' : 'password'}
            value={apiKeys.supabaseKey}
            onChange={(e) => handleChange('supabaseKey', e.target.value)}
            placeholder="eyJ..."
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Stripe Secret Key (Optional)
          </label>
          <input
            type={showKeys ? 'text' : 'password'}
            value={apiKeys.stripeSecret || ''}
            onChange={(e) => handleChange('stripeSecret', e.target.value)}
            placeholder="sk_..."
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Vercel API Token (Optional)
          </label>
          <input
            type={showKeys ? 'text' : 'password'}
            value={apiKeys.vercelToken || ''}
            onChange={(e) => handleChange('vercelToken', e.target.value)}
            placeholder="xxxxx..."
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setShowKeys(!showKeys)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showKeys ? 'Hide' : 'Show'} API Keys
        </button>

        <div className="space-x-2">
          <button
            onClick={clearApiKeys}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Clear All
          </button>
          <button
            disabled={!hasAllRequiredKeys()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Save & Continue
          </button>
        </div>
      </div>

      {hasAllRequiredKeys() && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">
            ✓ All required API keys are configured
          </p>
        </div>
      )}
    </div>
  )
}