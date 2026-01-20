# Svelte 5 開発ガイドライン

## 使用場面

| 用途 | 適性 |
|------|------|
| インタラクティブUI | ⭐⭐⭐⭐⭐ 最適 |
| SPA/MPA | ⭐⭐⭐⭐⭐ 最適 |
| SSR/SSG | ⭐⭐⭐⭐⭐ 最適（SvelteKit） |
| コンポーネントライブラリ | ⭐⭐⭐⭐ 良い |
| 小〜中規模アプリ | ⭐⭐⭐⭐⭐ 最適 |

## Svelte 5 Runes（必須）

### $state - リアクティブ状態

```svelte
<script>
  let count = $state(0);
  let user = $state({ name: 'John', age: 25 });
</script>

<button onclick={() => count++}>
  Count: {count}
</button>
```

### $derived - 派生値（computed）

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
  
  // 複雑な派生値
  let message = $derived.by(() => {
    if (count > 10) return 'Large';
    return 'Small';
  });
</script>
```

### $effect - 副作用

```svelte
<script>
  let count = $state(0);
  
  $effect(() => {
    console.log('Count changed:', count);
    // クリーンアップ
    return () => console.log('Cleanup');
  });
</script>
```

### $props - コンポーネントプロップ

```svelte
<script>
  let { name, age = 18 } = $props();
</script>

<p>{name} is {age} years old</p>
```

### $bindable - 双方向バインディング

```svelte
<script>
  let { value = $bindable() } = $props();
</script>

<input bind:value />
```

## SvelteKit コマンド

```bash
# プロジェクト作成
bnmp dlx sv create my-app

# 開発サーバー
bnmp run dev

# ビルド
bnmp run build

# プレビュー
bnmp run preview
```

## ディレクトリ構造（SvelteKit）

```
src/
├── lib/           # 共有コンポーネント・ユーティリティ
│   ├── components/
│   └── utils/
├── routes/        # ページルーティング
│   ├── +page.svelte
│   ├── +layout.svelte
│   └── api/       # APIルート
│       └── +server.ts
└── app.html       # HTMLテンプレート
```

## ベストプラクティス

| ルール | 内容 |
|--------|------|
| Runes使用 | Svelte 5では$state/$derived/$effectを使用 |
| TypeScript | `<script lang="ts">`を推奨 |
| コンポーネント分割 | 1コンポーネント200行以下 |
| CSS | スコープ付きCSS（デフォルト）を活用 |
| SSR | SvelteKitのSSRを活用（SEO向上） |

## 禁止事項

| 禁止 | 代替 |
|------|------|
| let宣言のみ（Svelte 4式） | $state()を使用 |
| reactive宣言($:) | $derived()を使用 |
| onMount内での状態変更 | $effect()を使用 |
| store（旧API） | Runes APIを使用 |

## コンポーネント例

```svelte
<script lang="ts">
  interface Props {
    title: string;
    items?: string[];
  }
  
  let { title, items = [] } = $props<Props>();
  let search = $state('');
  
  let filtered = $derived(
    items.filter(item => 
      item.toLowerCase().includes(search.toLowerCase())
    )
  );
</script>

<div class="container">
  <h1>{title}</h1>
  <input bind:value={search} placeholder="Search..." />
  <ul>
    {#each filtered as item}
      <li>{item}</li>
    {/each}
  </ul>
</div>

<style>
  .container {
    padding: 1rem;
  }
</style>
```

## SvelteKit ルーティング

| ファイル | 用途 |
|----------|------|
| +page.svelte | ページUI |
| +page.ts | ページデータ（load関数） |
| +page.server.ts | サーバーサイドデータ |
| +layout.svelte | レイアウト |
| +error.svelte | エラーページ |
| +server.ts | APIエンドポイント |

## フォームアクション

```svelte
<!-- +page.svelte -->
<form method="POST" action="?/create">
  <input name="title" />
  <button>Create</button>
</form>
```

```typescript
// +page.server.ts
export const actions = {
  create: async ({ request }) => {
    const data = await request.formData();
    const title = data.get('title');
    // 処理
  }
};
```
