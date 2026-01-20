import type { Project } from '@/types/project'

export interface DeployToCloudflareOptions {
  project: Project
  cloudflareAccountId?: string
  cloudflareApiToken?: string
}

export interface DeployToCloudflareResult {
  success: boolean
  url?: string
  error?: string
}

export async function deployToCloudflare(options: DeployToCloudflareOptions): Promise<DeployToCloudflareResult> {
  const { project, cloudflareAccountId, cloudflareApiToken } = options

  if (!cloudflareAccountId || !cloudflareApiToken) {
    return {
      success: false,
      error: 'Cloudflare Account IDとAPI Tokenが設定されていません。設定画面で設定してください。'
    }
  }

  try {
    // プロジェクトファイルを準備
    const files = await prepareProjectFiles(project)
    
    // Cloudflare Pages APIでデプロイ
    const deploymentUrl = await uploadToCloudflarePages(
      files,
      project.name,
      cloudflareAccountId,
      cloudflareApiToken
    )
    
    return {
      success: true,
      url: deploymentUrl
    }
  } catch (error) {
    console.error('Cloudflare Pages デプロイエラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラー'
    }
  }
}

async function prepareProjectFiles(project: Project): Promise<Record<string, string>> {
  const files: Record<string, string> = {}

  // index.html
  files['index.html'] = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/main.js"></script>
</body>
</html>`

  // main.js - すべてのページをレンダリング
  let mainJsContent = `// ${project.name}\n\n`
  
  project.pages.forEach((page, index) => {
    mainJsContent += `// Page ${index + 1}: ${page.name}\n`
    mainJsContent += `const page${index}HTML = \`${page.content}\`;\n\n`
  })

  mainJsContent += `
// ページレンダリング
const rootElement = document.getElementById('root');
if (rootElement) {
  rootElement.innerHTML = page0HTML; // 最初のページを表示
}
`

  files['main.js'] = mainJsContent

  return files
}

async function uploadToCloudflarePages(
  files: Record<string, string>,
  projectName: string,
  accountId: string,
  apiToken: string
): Promise<string> {
  // Cloudflare Pages API (Direct Upload)
  const sanitizedName = projectName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  
  // Step 1: Create deployment
  const createResponse = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${sanitizedName}/deployments`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        branch: 'main',
        files: Object.keys(files).reduce((acc, path) => {
          acc[path] = {
            content: files[path]
          }
          return acc
        }, {} as Record<string, { content: string }>)
      })
    }
  )

  if (!createResponse.ok) {
    const error = await createResponse.json()
    throw new Error(`Cloudflare Pages API error: ${error.errors?.[0]?.message || createResponse.status}`)
  }

  const deploymentData = await createResponse.json()
  const deploymentUrl = deploymentData.result?.url || `https://${sanitizedName}.pages.dev`

  return deploymentUrl
}
