---
paths: "**/*.tsx, **/*.jsx, **/components/**"
---

---
paths: "**/*.tsx, **/*.jsx, **/components/**"
---

# React開発ルール

## コンポーネント設計

### 関数コンポーネント推奨
```tsx
// Good - 関数コンポーネント
const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div>
      <h1>{user.name}</h1>
    </div>
  );
};

// Avoid - クラスコンポーネント（レガシー）
class UserProfile extends React.Component { ... }
```

### コンポーネントの構成順序
```tsx
const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // 1. useState - 状態定義
  const [state, setState] = useState(initialValue);

  // 2. useRef
  const ref = useRef(null);

  // 3. useMemo / useCallback（パフォーマンス最適化）
  const memoizedValue = useMemo(() => compute(prop1), [prop1]);

  // 4. useEffect - 副作用
  useEffect(() => {
    // 処理
    return () => {
      // クリーンアップ
    };
  }, [dependencies]);

  // 5. イベントハンドラ
  const handleClick = useCallback(() => {
    // 処理
  }, []);

  // 6. 早期リターン（ローディング、エラー等）
  if (isLoading) return <Loading />;
  if (error) return <Error message={error} />;

  // 7. メインのJSX
  return (
    <div>
      {/* コンテンツ */}
    </div>
  );
};
```

## Hooks のルール

### カスタムフックの作成
```tsx
// ファイル名: useUser.ts
export const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await api.getUser(userId);
        setUser(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  return { user, loading, error };
};
```

### useEffect の依存配列
```tsx
// Good - 依存配列を正しく指定
useEffect(() => {
  fetchData(userId);
}, [userId]);

// Bad - 依存配列の欠落
useEffect(() => {
  fetchData(userId);  // userIdが変わっても再実行されない
}, []);

// Bad - 不要な依存で無限ループ
useEffect(() => {
  setData({ ...data, loaded: true });
}, [data]);  // dataが変わるたびに実行
```

## パフォーマンス最適化

### React.memo
```tsx
// 不要な再レンダリングを防ぐ
const ExpensiveComponent = React.memo<Props>(({ data }) => {
  // 重い処理
  return <div>{/* ... */}</div>;
});
```

### useMemo / useCallback
```tsx
// 計算結果のメモ化
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);

// 関数のメモ化（子コンポーネントに渡す場合）
const handleSubmit = useCallback((data: FormData) => {
  onSubmit(data);
}, [onSubmit]);
```

## 状態管理

### ローカル状態 vs グローバル状態
```tsx
// ローカル状態 - コンポーネント内で完結
const [isOpen, setIsOpen] = useState(false);

// グローバル状態 - 複数コンポーネントで共有
// Zustand / Jotai / Context を使用
```

### フォーム状態
```tsx
// react-hook-form 推奨
import { useForm } from 'react-hook-form';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email', { required: '必須です' })} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
};
```

## 禁止事項
- インラインスタイルの乱用（Tailwind CSS / CSS Modules 推奨）
- index を key に使用（リストが変更される場合）
- useEffect 内での直接的な状態更新による無限ループ
- 過度なprops drilling（Context / 状態管理ライブラリを使用）

```tsx
// Bad - indexをkeyに使用
{items.map((item, index) => (
  <Item key={index} data={item} />  // 危険！
))}

// Good - ユニークなIDを使用
{items.map((item) => (
  <Item key={item.id} data={item} />
))}
```

## ファイル構成
```
components/
├── UserProfile/
│   ├── index.tsx          # エクスポート
│   ├── UserProfile.tsx    # メインコンポーネント
│   ├── UserProfile.test.tsx
│   └── useUserProfile.ts  # カスタムフック
```
