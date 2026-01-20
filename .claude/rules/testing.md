---
paths: "**/*.test.*, **/*.spec.*, **/tests/**"
---

# テストルール

テスト作成・実行・自動生成のガイドライン。

## テストフレームワーク

| 言語 | フレームワーク | コマンド |
|------|---------------|---------|
| TypeScript | Vitest / Bun Test | bun test |
| Python | pytest | pytest |
| Rust | cargo test | cargo test |

## テストファイル配置

src/
├── utils/
│   ├── helper.ts
│   └── helper.test.ts    # 同一ディレクトリ
└── __tests__/            # または専用ディレクトリ
    └── helper.test.ts

配置パターン：
- src/utils/formatDate.ts → src/utils/formatDate.test.ts
- src/components/Button.tsx → src/components/Button.test.tsx

## テスト命名規則

describe("関数名/クラス名", () => {
  it("正常系: 期待する動作", () => {});
  it("異常系: エラーケース", () => {});
  it("境界値: エッジケース", () => {});
});

## テストの種類

| 種類 | 目的 | 割合目安 |
|------|------|---------|
| ユニットテスト | 関数単位の動作確認 | 70% |
| 統合テスト | モジュール間連携 | 20% |
| E2Eテスト | ユーザー操作の模擬 | 10% |

## テスト自動生成

### 実行内容

1. **対象ファイル分析**
   - 関数・クラスの抽出
   - 入出力の型を特定
   - 依存関係を確認

2. **テストケース生成**
   - 正常系テスト
   - 異常系テスト
   - エッジケーステスト

3. **テストファイル作成**
   - 適切な場所にファイル作成
   - モック・スタブの設定

### 生成されるテスト

**正常系**
- 期待通りの入力で正しい出力
- 各分岐のカバー

**異常系**
- 不正な入力でエラー
- null/undefined処理
- 空配列・空文字列

**エッジケース**
- 境界値
- 大きなデータ
- 同時実行

## カバレッジ目標

| レベル | カバレッジ | 対象 |
|--------|-----------|------|
| 必須 | 80%+ | ビジネスロジック |
| 推奨 | 60%+ | ユーティリティ |
| 任意 | - | UI/設定ファイル |

## モック・スタブ

import { vi, describe, it, expect } from "vitest";

// 関数モック
vi.mock("./api", () => ({
  fetchData: vi.fn().mockResolvedValue({ data: "test" }),
}));

// スパイ
const spy = vi.spyOn(console, "log");

## テスト実行

# 全テスト
bun test

# 特定ファイル
bun test src/utils/helper.test.ts

# ウォッチモード
bun test --watch

# カバレッジ
bun test --coverage

## オプション（自動生成用）

- --unit: ユニットテストのみ
- --integration: 統合テストのみ
- --coverage: カバレッジ目標を指定

## ベストプラクティス

| 項目 | ガイドライン |
|------|-------------|
| 独立性 | テスト間で状態を共有しない |
| 再現性 | 毎回同じ結果になる |
| 速度 | 1テスト100ms以内 |
| 可読性 | テスト名で内容が分かる |

## アンチパターン

| パターン | 問題 |
|----------|------|
| 実装詳細のテスト | リファクタリングで壊れる |
| 過度なモック | 実際の動作と乖離 |
| フレーキーテスト | 不安定で信頼できない |

## CI/CD統合

# GitHub Actions
- name: Run tests
  run: bun test --coverage
