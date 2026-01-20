---
paths: "**/*.py"
---

---
paths: "**/*.py"
---

# Python開発ルール

## コーディングスタイル

### PEP 8準拠
- インデント: スペース4つ
- 行の長さ: 最大120文字（厳格な場合は79文字）
- インポート順序: 標準ライブラリ → サードパーティ → ローカル

```python
# インポート順序の例
import os
import sys
from typing import List, Optional

import requests
from pydantic import BaseModel

from myapp.models import User
from myapp.utils import format_date
```

### 型ヒント必須
```python
def get_user(user_id: int) -> Optional[User]:
    """ユーザーを取得する"""
    pass

def calculate_total(items: List[dict], tax_rate: float = 0.1) -> float:
    """合計金額を計算する"""
    pass
```

### docstring（日本語）
```python
def process_data(data: dict, validate: bool = True) -> dict:
    """
    データを処理する。

    Args:
        data: 処理対象のデータ
        validate: バリデーションを行うかどうか

    Returns:
        処理済みのデータ

    Raises:
        ValueError: データが不正な場合
    """
    pass
```

## エラーハンドリング

### 具体的な例外を使用
```python
# Good
try:
    user = get_user(user_id)
except UserNotFoundError:
    logger.warning(f"ユーザーが見つかりません: {user_id}")
    return None

# Bad - 広すぎる例外キャッチ
try:
    user = get_user(user_id)
except Exception:
    pass
```

### カスタム例外
```python
class AppError(Exception):
    """アプリケーション基底例外"""
    pass

class UserNotFoundError(AppError):
    """ユーザーが見つからない場合の例外"""
    def __init__(self, user_id: int):
        self.user_id = user_id
        super().__init__(f"ユーザーID {user_id} が見つかりません")
```

## ログ出力

### loggingモジュールを使用
```python
import logging

logger = logging.getLogger(__name__)

def process_order(order_id: int) -> None:
    logger.info(f"注文処理開始: {order_id}")
    try:
        # 処理
        logger.info(f"注文処理完了: {order_id}")
    except Exception as e:
        logger.error(f"注文処理エラー: {order_id}", exc_info=True)
        raise
```

## 非同期処理

### async/await
```python
import asyncio
import aiohttp

async def fetch_data(url: str) -> dict:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.json()

async def fetch_all(urls: List[str]) -> List[dict]:
    tasks = [fetch_data(url) for url in urls]
    return await asyncio.gather(*tasks)
```

## テスト

### pytest推奨
```python
import pytest
from myapp.services import calculate_total

class TestCalculateTotal:
    def test_空のリストの場合_0を返す(self):
        assert calculate_total([]) == 0

    def test_商品が1つの場合_その金額を返す(self):
        items = [{"price": 100, "quantity": 1}]
        assert calculate_total(items) == 100

    def test_税率を指定した場合_税込み金額を返す(self):
        items = [{"price": 100, "quantity": 1}]
        assert calculate_total(items, tax_rate=0.1) == 110
```

## 禁止事項
- `eval()` / `exec()` の使用（セキュリティリスク）
- `from module import *` の使用
- ミュータブルなデフォルト引数
- グローバル変数の乱用

```python
# Bad - ミュータブルなデフォルト引数
def append_item(item, items=[]):  # 危険！
    items.append(item)
    return items

# Good
def append_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```
