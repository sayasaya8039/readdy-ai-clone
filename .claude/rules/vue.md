---
paths: "**/*.vue, **/vue.config.*, **/vite.config.*"
---

# Vue.js 開発ルール

## 概要

[Vue.js](https://github.com/vuejs/core) は52k+スターのプログレッシブJavaScriptフレームワーク。
Vue 3はComposition APIを採用し、TypeScriptとの統合が強化されている。

## バージョン

| バージョン | 状態 | 備考 |
|------------|------|------|
| **Vue 3.5+** | 推奨 | 最新の安定版を使用 |
| Vue 2.x | 非推奨 | 2023年12月31日でEOL |

## プロジェクト作成

```bash
# Vite + Vue 3（推奨）
bnmp create vite@latest my-app -- --template vue-ts

# Nuxt 3
bnpx nuxi@latest init my-app
```

## 必須設定

### Composition API（必須）

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// リアクティブな状態
const count = ref(0)

// 算出プロパティ
const doubled = computed(() => count.value * 2)

// ライフサイクル
onMounted(() => {
  console.log('Component mounted')
})

// 関数
const increment = () => {
  count.value++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

### TypeScript設定

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "jsxImportSource": "vue"
  }
}
```

## ディレクトリ構成

```
src/
├── components/     # 再利用可能なコンポーネント
│   └── ui/         # UIコンポーネント
├── composables/    # Composition API関数
├── views/          # ページコンポーネント
├── stores/         # Pinia ストア
├── types/          # TypeScript型定義
├── utils/          # ユーティリティ関数
└── App.vue
```

## 状態管理

### Pinia（推奨）

```typescript
// stores/counter.ts
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubled = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return { count, doubled, increment }
})
```

## ルーティング

### Vue Router 4

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('@/views/Home.vue') },
    { path: '/about', component: () => import('@/views/About.vue') },
  ]
})
```

## 推奨ライブラリ

| カテゴリ | ライブラリ |
|----------|-----------|
| **状態管理** | Pinia |
| **ルーティング** | Vue Router 4 |
| **UIフレームワーク** | Radix Vue, Headless UI |
| **フォーム** | VeeValidate, FormKit |
| **HTTP** | ofetch, axios |
| **アニメーション** | @vueuse/motion |
| **ユーティリティ** | VueUse |

## コンポーネント命名規則

| 種類 | 命名 | 例 |
|------|------|-----|
| コンポーネント | PascalCase | `UserProfile.vue` |
| composable | camelCase + use | `useAuth.ts` |
| ストア | camelCase + use + Store | `useUserStore.ts` |

## Props定義（TypeScript）

```typescript
// definePropsでの型定義
interface Props {
  title: string
  count?: number
  items: string[]
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})
```

## Emits定義（TypeScript）

```typescript
const emit = defineEmits<{
  (e: 'update', value: string): void
  (e: 'delete', id: number): void
}>()
```

## 禁止事項

| 禁止 | 代替 |
|------|------|
| Options API | Composition API + `<script setup>` |
| Vuex | Pinia |
| mixins | composables |
| Vue 2.x | Vue 3.5+ |
| this.$refs | template refs |
| any型 | 適切な型定義 |

## 参照

- [Vue.js 公式](https://vuejs.org/)
- [Vue.js GitHub](https://github.com/vuejs/core)
- [Pinia](https://pinia.vuejs.org/)
- [VueUse](https://vueuse.org/)
- [Nuxt 3](https://nuxt.com/)
