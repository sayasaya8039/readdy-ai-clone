---
paths: "**/*.py, **/python/**, **/requirements.txt, **/pyproject.toml"
---

# Awesome Python 活用ルール

## 概要

[awesome-python](https://github.com/vinta/awesome-python) は230k+スターの人気リポジトリ。
Pythonの優れたフレームワーク、ライブラリ、ツールのキュレーションリスト。

## 参照すべき場面

| 場面 | アクション |
|------|-----------|
| **Pythonプロジェクト開始時** | 適切なフレームワーク・ライブラリを選定 |
| **新機能追加時** | 既存ライブラリがないか確認 |
| **技術選定時** | 複数の選択肢を比較 |
| **学習リソース探索** | ニュースレター・ポッドキャスト参照 |

## 主要カテゴリ

### Web開発

| カテゴリ | 推奨 |
|----------|------|
| **Webフレームワーク** | FastAPI, Django, Flask |
| **非同期** | aiohttp, Starlette |
| **API** | FastAPI, Hono (via Pydantic) |

### データ処理

| カテゴリ | 推奨 |
|----------|------|
| **データ分析** | Polars（高速）, Pandas |
| **数値計算** | NumPy, SciPy |
| **可視化** | Plotly, Matplotlib |

### 機械学習・AI

| カテゴリ | 推奨 |
|----------|------|
| **深層学習** | PyTorch, TensorFlow |
| **機械学習** | scikit-learn, XGBoost |
| **NLP** | Transformers, spaCy |
| **コンピュータビジョン** | OpenCV, Pillow |

### 開発ツール

| カテゴリ | 推奨 |
|----------|------|
| **パッケージ管理** | uv（最速）, Poetry |
| **リンター/フォーマッター** | Ruff（最速）, Black |
| **テスト** | pytest, Hypothesis |
| **型チェック** | mypy, Pyright |

### CLI・自動化

| カテゴリ | 推奨 |
|----------|------|
| **CLIフレームワーク** | Typer, Click |
| **タスク自動化** | Invoke, Fabric |
| **スクレイピング** | Scrapy, BeautifulSoup |

### DevOps・インフラ

| カテゴリ | 推奨 |
|----------|------|
| **構成管理** | Ansible |
| **コンテナ** | docker-py |
| **モニタリング** | Prometheus client |

## 2025-2026年 推奨スタック

| 用途 | 推奨構成 |
|------|----------|
| **Web API** | FastAPI + Pydantic + SQLAlchemy |
| **データ処理** | Polars + DuckDB |
| **ML/AI** | PyTorch + Transformers |
| **CLI** | Typer + Rich |
| **開発環境** | uv + Ruff + pytest |

## ライブラリ選定基準

| 優先度 | 条件 |
|--------|------|
| 高 | 活発なメンテナンス（最終更新1年以内） |
| 高 | 十分なスター数（1000+） |
| 高 | 型ヒント対応 |
| 中 | 豊富なドキュメント |
| 中 | 非同期対応（該当する場合） |

## 禁止・非推奨

| 非推奨 | 代替 |
|--------|------|
| pip（直接） | uv |
| Pandas（大規模データ） | Polars |
| requests（非同期） | httpx, aiohttp |
| pylint, flake8 | Ruff |
| black + isort | Ruff format |

## 参照

- [awesome-python GitHub](https://github.com/vinta/awesome-python)
- [Python公式ドキュメント](https://docs.python.org/)
- [PyPI](https://pypi.org/)
