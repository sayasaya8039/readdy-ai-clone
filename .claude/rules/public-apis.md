---
paths: "**/*"
---

# Public APIs 活用ルール

## 概要

[public-apis](https://github.com/public-apis/public-apis) は300k+スターの人気リポジトリ。
無料で使える公開APIのリストがカテゴリ別に整理されている。

## 参照すべき場面

| 場面 | アクション |
|------|-----------|
| **外部API調査** | まずpublic-apisを確認 |
| **プロトタイプ開発** | 無料APIを選定 |
| **デモアプリ作成** | 認証不要のAPIを優先 |
| **学習用プロジェクト** | 無料枠があるAPIを使用 |

## カテゴリ一覧

| カテゴリ | 例 |
|----------|-----|
| Animals | Dog API, Cat Facts |
| Anime | Jikan, AniList |
| Books | Open Library, Google Books |
| Currency | ExchangeRate-API, Fixer |
| Development | GitHub, GitLab |
| Finance | Alpha Vantage, Yahoo Finance |
| Geocoding | OpenStreetMap, Nominatim |
| Machine Learning | OpenAI, Hugging Face |
| Music | Spotify, Last.fm |
| News | NewsAPI, GNews |
| Weather | OpenWeatherMap, WeatherAPI |

## 使用方法

1. **GitHubでREADMEを確認**
   - https://github.com/public-apis/public-apis
2. **カテゴリから適切なAPIを選択**
3. **以下を確認**
   - Auth（認証方式）: apiKey, OAuth, なし
   - HTTPS対応
   - CORS対応
4. **公式ドキュメントで詳細確認**

## API選定基準

| 優先度 | 条件 |
|--------|------|
| 高 | 認証不要（No Auth） |
| 高 | HTTPS対応 |
| 高 | CORS対応 |
| 中 | 無料枠あり |
| 低 | API Key必須 |

## 注意事項

| 項目 | 内容 |
|------|------|
| **レート制限** | 各APIのレート制限を必ず確認 |
| **利用規約** | 商用利用可否を確認 |
| **本番環境** | 有料プランを検討 |
| **APIキー管理** | 環境変数で管理（ハードコード禁止） |

## 禁止事項

- APIキーをコードにハードコード
- レート制限を無視した大量リクエスト
- 利用規約違反の使用方法
- 本番環境で無料枠のみに依存

## 参照

- [public-apis GitHub](https://github.com/public-apis/public-apis)
- [API Directory](https://www.programmableweb.com/)
- [RapidAPI](https://rapidapi.com/)
