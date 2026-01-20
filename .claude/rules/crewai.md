---
paths: "**/crewai/**, **/agents/**"
---

CrewAIマルチエージェントプロジェクトの作成・管理を支援します。

## CrewAIとは

- **マルチエージェント協調**: 複数のAIエージェントがチームとして協働
- **役割ベース**: 各エージェントに専門的な役割を付与
- **タスク連携**: タスク間の依存関係と情報共有
- **スタンドアロン**: LangChain非依存の軽量設計

## サブコマンド

### `/crewai create [プロジェクト名]`

新規CrewAIプロジェクトを作成

```bash
crewai create crew my-project
cd my-project
uv sync
```

### `/crewai run`

プロジェクトを実行

```bash
crewai run
# または
uv run python -m my_project.main
```

### `/crewai add-agent [エージェント名]`

新しいエージェントを追加

agents.yamlに追記 + crew.pyにメソッド追加

### `/crewai add-task [タスク名]`

新しいタスクを追加

tasks.yamlに追記 + crew.pyにメソッド追加

## プロジェクト構成

```
my-project/
├── src/my_project/
│   ├── config/
│   │   ├── agents.yaml    # エージェント定義
│   │   └── tasks.yaml     # タスク定義
│   ├── tools/             # カスタムツール
│   │   └── custom_tool.py
│   ├── crew.py            # Crew統合
│   └── main.py            # エントリーポイント
├── pyproject.toml
└── .env                   # OPENAI_API_KEY等
```

## 実行内容

### create時
1. `crewai create crew` でプロジェクト生成
2. `uv sync` で依存関係インストール
3. `.env` ファイル作成（APIキー設定）
4. 基本的なエージェント・タスクの設定

### run時
1. 環境変数の確認
2. `crewai run` で実行
3. 結果の確認

### add-agent時
1. agents.yamlにエージェント定義を追加
2. crew.pyに`@agent`メソッドを追加

### add-task時
1. tasks.yamlにタスク定義を追加
2. crew.pyに`@task`メソッドを追加

## エージェント定義テンプレート

```yaml
# config/agents.yaml
new_agent:
  role: "役割名"
  goal: "このエージェントの目標"
  backstory: "背景情報・専門性の説明"
```

```python
# crew.py
@agent
def new_agent(self) -> Agent:
    return Agent(
        config=self.agents_config["new_agent"],
        tools=[],  # 必要なツールを追加
        verbose=True
    )
```

## タスク定義テンプレート

```yaml
# config/tasks.yaml
new_task:
  description: "タスクの詳細説明"
  expected_output: "期待される出力形式"
  agent: new_agent
  context:  # オプション：依存タスク
    - previous_task
```

```python
# crew.py
@task
def new_task(self) -> Task:
    return Task(config=self.tasks_config["new_task"])
```

## よく使うツール

| ツール | 用途 | インストール |
|--------|------|-------------|
| SerperDevTool | Web検索 | crewai[tools] |
| FileReadTool | ファイル読み込み | crewai[tools] |
| WebsiteSearchTool | Webサイト検索 | crewai[tools] |
| CodeInterpreterTool | コード実行 | crewai[tools] |

## 環境変数

```env
OPENAI_API_KEY=sk-...
SERPER_API_KEY=...  # Web検索用（オプション）
```

## 使用例

```bash
# 新規プロジェクト作成
/crewai create research-team

# リサーチエージェント追加
/crewai add-agent researcher

# 分析タスク追加
/crewai add-task analysis

# 実行
/crewai run
```

$ARGUMENTS で操作とオプションを指定。

---

## 追加ルール（rules統合）

# CrewAI 開発ルール

## CrewAIとは

**マルチエージェントAIオーケストレーションフレームワーク**

役割を持つ自律AIエージェントがチームとして協働し、複雑なタスクを実行。
LangChain非依存のスタンドアロン・軽量設計。

## 使用優先度

| 優先度 | フレームワーク | 用途 |
|--------|---------------|------|
| **1** | **CrewAI** | マルチエージェント協調、複雑なワークフロー |
| 2 | LangGraph | グラフベースのワークフロー |
| 3 | AutoGen | Microsoft製マルチエージェント |
| 4 | 単一Agent | シンプルなタスク |

## インストール

```bash
# uv推奨
uv add crewai
uv add 'crewai[tools]'  # ツール付き

# pip
pip install crewai
pip install 'crewai[tools]'
```

**Python 3.10以上必須**

## プロジェクト作成

```bash
# 新規プロジェクト
crewai create crew my-project
cd my-project

# 実行
crewai run
```

## プロジェクト構成

```
my-project/
├── src/my_project/
│   ├── config/
│   │   ├── agents.yaml    # エージェント定義
│   │   └── tasks.yaml     # タスク定義
│   ├── tools/             # カスタムツール
│   ├── crew.py            # Crew統合
│   └── main.py            # エントリーポイント
├── pyproject.toml
└── .env                   # APIキー
```

## 3つのコア概念

### 1. Agent（エージェント）

```yaml
# config/agents.yaml
researcher:
  role: "Senior Research Analyst"
  goal: "{topic}に関する最新情報を調査する"
  backstory: "10年以上のリサーチ経験を持つアナリスト"

writer:
  role: "Content Writer"
  goal: "調査結果を分かりやすい記事にまとめる"
  backstory: "テクニカルライティングの専門家"
```

```python
# コード定義
from crewai import Agent

researcher = Agent(
    role="Research Analyst",
    goal="最新の情報を調査する",
    backstory="経験豊富なリサーチャー",
    tools=[SerperDevTool()],
    llm="gpt-4o",
    verbose=True
)
```

### 2. Task（タスク）

```yaml
# config/tasks.yaml
research_task:
  description: "{topic}について最新のトレンドを調査する"
  expected_output: "調査結果のサマリー（箇条書き）"
  agent: researcher

writing_task:
  description: "調査結果を元に記事を作成する"
  expected_output: "500-1000文字の記事"
  agent: writer
  context:
    - research_task  # 依存タスク
```

### 3. Crew（クルー）

```python
# crew.py
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

@CrewBase
class MyProjectCrew:
    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def researcher(self) -> Agent:
        return Agent(
            config=self.agents_config["researcher"],
            tools=[SerperDevTool()]
        )

    @agent
    def writer(self) -> Agent:
        return Agent(config=self.agents_config["writer"])

    @task
    def research_task(self) -> Task:
        return Task(config=self.tasks_config["research_task"])

    @task
    def writing_task(self) -> Task:
        return Task(config=self.tasks_config["writing_task"])

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,  # 順次実行
            verbose=True
        )
```

## プロセスタイプ

| プロセス | 説明 |
|---------|------|
| `Process.sequential` | タスクを順番に実行 |
| `Process.hierarchical` | マネージャーAgentが調整 |

## Agentパラメータ

| パラメータ | デフォルト | 説明 |
|-----------|-----------|------|
| `role` | 必須 | 役割 |
| `goal` | 必須 | 目標 |
| `backstory` | 必須 | 背景情報 |
| `llm` | GPT-4 | 使用するLLM |
| `tools` | [] | 利用可能なツール |
| `max_iter` | 20 | 最大反復回数 |
| `allow_code_execution` | False | コード実行許可 |
| `reasoning` | False | 計画立案有効化 |
| `multimodal` | False | 画像処理対応 |
| `verbose` | False | 詳細ログ |

## ツール

```python
from crewai_tools import (
    SerperDevTool,      # Web検索
    FileReadTool,       # ファイル読み込み
    WebsiteSearchTool,  # Webサイト検索
    CodeInterpreterTool # コード実行
)

# カスタムツール
from crewai.tools import tool

@tool
def my_tool(query: str) -> str:
    """カスタムツールの説明"""
    return f"Result for {query}"
```

## Flows（ワークフロー）

```python
from crewai.flow.flow import Flow, listen, start

class MyFlow(Flow):
    @start()
    def first_step(self):
        return "開始"

    @listen(first_step)
    def second_step(self, result):
        return f"受信: {result}"
```

## 環境変数

```env
OPENAI_API_KEY=sk-...
SERPER_API_KEY=...  # Web検索用
```

## 実行

```python
# main.py
from my_project.crew import MyProjectCrew

def run():
    crew = MyProjectCrew()
    result = crew.crew().kickoff(inputs={"topic": "AI最新動向"})
    print(result)

if __name__ == "__main__":
    run()
```

```bash
crewai run
```

## ベストプラクティス

| 項目 | ガイドライン |
|------|-------------|
| 命名 | YAML名とPythonメソッド名を一致させる |
| 役割分担 | 各Agentに明確な専門性を持たせる |
| タスク設計 | expected_outputを具体的に記述 |
| ツール | 必要最小限のツールのみ付与 |
| エラー | verbose=Trueでデバッグ |

## 禁止事項

- APIキーのハードコード
- 1つのAgentに過剰なツール付与
- 曖昧なgoal/backstory
- 無限ループを引き起こすタスク依存
