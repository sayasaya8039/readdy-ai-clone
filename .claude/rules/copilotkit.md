---
paths: "**/copilot/**, **/react/**/*.tsx"
---

# CopilotKit ルール

## 概要

**CopilotKit**はReact UI + AIコパイロット/エージェントのためのインフラ。
「Agentic Frontend」コンセプトでAIをアプリに直接組み込み。

GitHub: https://github.com/CopilotKit/CopilotKit (26,800+ stars)

## インストール

```bash
bun add @copilotkit/react-core @copilotkit/react-ui
```

## 基本セットアップ

### プロバイダー設定

```tsx
// app/layout.tsx
import { CopilotKit } from "@copilotkit/react-core";

export default function Layout({ children }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      {children}
    </CopilotKit>
  );
}
```

### APIルート

```typescript
// app/api/copilotkit/route.ts
import { CopilotRuntime, OpenAIAdapter } from "@copilotkit/runtime";

export async function POST(req: Request) {
  const runtime = new CopilotRuntime();
  const adapter = new OpenAIAdapter();
  return runtime.response(req, adapter);
}
```

## UIコンポーネント

### チャットUI

```tsx
import { CopilotChat } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

function App() {
  return (
    <CopilotChat
      labels={{
        title: "AI Assistant",
        initial: "How can I help you?"
      }}
    />
  );
}
```

### サイドバー

```tsx
import { CopilotSidebar } from "@copilotkit/react-ui";

function App() {
  return (
    <CopilotSidebar defaultOpen={true}>
      <YourApp />
    </CopilotSidebar>
  );
}
```

## Hooks

### useCopilotAction

```tsx
import { useCopilotAction } from "@copilotkit/react-core";

function TodoList() {
  useCopilotAction({
    name: "addTodo",
    description: "Add a new todo item",
    parameters: [
      { name: "title", type: "string", required: true }
    ],
    handler: async ({ title }) => {
      addTodo(title);
    }
  });
  return <div>...</div>;
}
```

### useCopilotReadable

```tsx
import { useCopilotReadable } from "@copilotkit/react-core";

function Dashboard() {
  const [data, setData] = useState([]);
  useCopilotReadable({
    description: "Current dashboard data",
    value: data
  });
  return <div>...</div>;
}
```

## 対応エージェントフレームワーク

| フレームワーク | 統合 |
|---------------|------|
| LangChain | 対応 |
| CrewAI | 対応 |
| Microsoft Agent Framework | 対応 |
| Google Agent Development Kit | 対応 |
| AWS Strands Agents | 対応 |

## ユースケース

1. **AIアシスタント** - アプリ内チャットボット
2. **コード補完** - IDE風の補完UI
3. **データ分析** - 対話的ダッシュボード
4. **ワークフロー** - タスク自動化UI
