---
paths: "**/browser-use/**"
---

# Browser-Use ルール

## Browser-Useとは

**AIエージェントがブラウザを操作するためのPythonライブラリ**

Playwright上で動作し、LLMがWebサイトを自律的に操作可能。

## ブラウザ自動化の優先度

| 優先度 | ツール | 用途 |
|--------|--------|------|
| **1** | **browser-use** | AIエージェントによる自動化 |
| 2 | Playwright | 通常のE2Eテスト・スクレイピング |
| 3 | Puppeteer | Node.js環境でのブラウザ操作 |
| 4 | Selenium | レガシーシステム |

## インストール

```bash
# uv推奨
uv add browser-use
uv sync
uvx browser-use install  # Chromiumインストール
```

## 基本使用例

```python
from browser_use import Agent, Browser
from langchain_anthropic import ChatAnthropic
import asyncio

async def main():
    # ブラウザ初期化
    browser = Browser()
    
    # LLM設定（Claude推奨）
    llm = ChatAnthropic(model="claude-sonnet-4-20250514")
    
    # エージェント作成
    agent = Agent(
        task="GitHubでbrowser-useリポジトリのスター数を調べる",
        llm=llm,
        browser=browser,
    )
    
    # 実行
    result = await agent.run()
    print(result)

asyncio.run(main())
```

## カスタムツール追加

```python
from browser_use import Agent, tool

@tool
def save_to_file(content: str, filename: str):
    """ファイルに保存"""
    with open(filename, 'w') as f:
        f.write(content)
    return f"Saved to {filename}"

agent = Agent(
    task="データを収集してresult.txtに保存",
    llm=llm,
    browser=browser,
    tools=[save_to_file],
)
```

## 設定オプション

```python
from browser_use import Browser, BrowserConfig

browser = Browser(
    config=BrowserConfig(
        headless=True,           # ヘッドレスモード
        disable_security=False,  # セキュリティ維持
        extra_chromium_args=[],  # 追加引数
    )
)
```

## ユースケース

| タスク | 適性 |
|--------|------|
| フォーム自動入力 | ◎ |
| データ収集・リサーチ | ◎ |
| ECサイト操作 | ○ |
| ログインが必要な操作 | ○ |
| CAPTCHAがあるサイト | △ |

## 環境変数

```env
ANTHROPIC_API_KEY=sk-ant-...
# または
OPENAI_API_KEY=sk-...
```

## 注意事項

- **レート制限**: サイトのrobots.txtを尊重
- **認証情報**: 環境変数で管理、ハードコード禁止
- **ヘッドレス**: 本番環境ではheadless=True
- **エラーハンドリング**: タイムアウト・リトライを実装
