---
paths: "**/*.rs, **/Cargo.toml"
---

# Rust開発ルール

## プロジェクトセットアップ

### Cargoプロジェクト作成
```bash
# バイナリプロジェクト
cargo new project_name

# ライブラリプロジェクト
cargo new project_name --lib

# 既存ディレクトリで初期化
cargo init
```

### Cargo.toml基本構成
```toml
[package]
name = "app_name"
version = "0.1.0"
edition = "2021"
authors = ["Your Name"]
description = "アプリケーションの説明"

[dependencies]
anyhow = "1.0"
thiserror = "1.0"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tokio = { version = "1.0", features = ["full"] }

[dev-dependencies]
pretty_assertions = "1.0"

[profile.release]
opt-level = 3
lto = true
strip = true
```

## コーディングスタイル

### 命名規則
| 対象 | 規則 | 例 |
|------|------|-----|
| 構造体 | PascalCase | `UserProfile` |
| 関数・メソッド | snake_case | `get_user_by_id` |
| 変数 | snake_case | `user_name` |
| 定数 | SCREAMING_SNAKE_CASE | `MAX_CONNECTIONS` |
| モジュール | snake_case | `user_service` |
| トレイト | PascalCase | `Drawable` |

### エラーハンドリング

#### Result/Option の活用
```rust
use anyhow::{Context, Result};
use thiserror::Error;

// カスタムエラー定義
#[derive(Error, Debug)]
pub enum AppError {
    #[error("ユーザーID {0} が見つかりません")]
    UserNotFound(u32),

    #[error("データベース接続エラー: {0}")]
    DatabaseError(#[from] sqlx::Error),

    #[error("不正な入力: {0}")]
    InvalidInput(String),
}

// Result型を返す関数
fn get_user(user_id: u32) -> Result<User, AppError> {
    if user_id == 0 {
        return Err(AppError::InvalidInput("IDは0以外を指定してください".into()));
    }
    // ...
    Ok(user)
}

// ?演算子でエラー伝播
fn process_user(user_id: u32) -> Result<()> {
    let user = get_user(user_id)?;
    println!("ユーザー: {}", user.name);
    Ok(())
}

// コンテキスト付きエラー
fn read_config() -> Result<Config> {
    let content = std::fs::read_to_string("config.toml")
        .context("設定ファイルの読み込みに失敗しました")?;
    // ...
}
```

#### Option の活用
```rust
fn find_user(name: &str) -> Option<User> {
    users.iter().find(|u| u.name == name).cloned()
}

// パターンマッチング
match find_user("Alice") {
    Some(user) => println!("見つかりました: {}", user.name),
    None => println!("見つかりませんでした"),
}

// if let
if let Some(user) = find_user("Alice") {
    println!("見つかりました: {}", user.name);
}

// unwrap_or_default / unwrap_or
let user = find_user("Alice").unwrap_or_default();
let count = get_count().unwrap_or(0);
```

## 構造体とトレイト

### 構造体定義
```rust
use serde::{Deserialize, Serialize};

/// ユーザー情報
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: u32,
    pub name: String,
    pub email: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub phone: Option<String>,
}

impl User {
    /// 新しいユーザーを作成
    pub fn new(id: u32, name: impl Into<String>, email: impl Into<String>) -> Self {
        Self {
            id,
            name: name.into(),
            email: email.into(),
            phone: None,
        }
    }

    /// フルネームを取得
    pub fn display_name(&self) -> &str {
        &self.name
    }
}

impl Default for User {
    fn default() -> Self {
        Self {
            id: 0,
            name: String::new(),
            email: String::new(),
            phone: None,
        }
    }
}
```

### トレイト実装
```rust
pub trait Validate {
    fn validate(&self) -> Result<(), ValidationError>;
}

impl Validate for User {
    fn validate(&self) -> Result<(), ValidationError> {
        if self.name.is_empty() {
            return Err(ValidationError::EmptyField("name".into()));
        }
        if !self.email.contains('@') {
            return Err(ValidationError::InvalidEmail);
        }
        Ok(())
    }
}
```

## 非同期処理

### Tokio
```rust
use tokio;

#[tokio::main]
async fn main() -> Result<()> {
    let result = fetch_data("https://api.example.com").await?;
    println!("{:?}", result);
    Ok(())
}

async fn fetch_data(url: &str) -> Result<String> {
    let response = reqwest::get(url).await?;
    let body = response.text().await?;
    Ok(body)
}

// 並列実行
async fn fetch_all(urls: Vec<&str>) -> Vec<Result<String>> {
    let futures: Vec<_> = urls.iter().map(|url| fetch_data(url)).collect();
    futures::future::join_all(futures).await
}
```

## GUI開発

### Tauri（推奨）
```rust
// src-tauri/src/main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("こんにちは、{}さん！", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("Tauriアプリケーションの起動に失敗しました");
}
```

### egui（純Rust GUI）
```rust
use eframe::egui;

struct MyApp {
    name: String,
    age: u32,
}

impl Default for MyApp {
    fn default() -> Self {
        Self {
            name: String::new(),
            age: 0,
        }
    }
}

impl eframe::App for MyApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        egui::CentralPanel::default().show(ctx, |ui| {
            ui.heading("サンプルアプリ");
            ui.horizontal(|ui| {
                ui.label("名前:");
                ui.text_edit_singleline(&mut self.name);
            });
            if ui.button("クリック").clicked() {
                println!("ボタンがクリックされました");
            }
        });
    }
}
```

## テスト

### ユニットテスト
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_user_new() {
        let user = User::new(1, "Alice", "alice@example.com");
        assert_eq!(user.id, 1);
        assert_eq!(user.name, "Alice");
    }

    #[test]
    fn test_user_validate_success() {
        let user = User::new(1, "Alice", "alice@example.com");
        assert!(user.validate().is_ok());
    }

    #[test]
    fn test_user_validate_empty_name() {
        let user = User::new(1, "", "alice@example.com");
        assert!(user.validate().is_err());
    }

    #[test]
    #[should_panic(expected = "パニックメッセージ")]
    fn test_panic() {
        panic!("パニックメッセージ");
    }
}
```

### 統合テスト
```rust
// tests/integration_test.rs
use my_app::User;

#[test]
fn test_user_workflow() {
    let user = User::new(1, "Alice", "alice@example.com");
    // 統合テスト
}
```

## ビルドとリリース

### 開発ビルド
```bash
cargo build
cargo run
cargo test
cargo clippy  # リント
cargo fmt     # フォーマット
```

### リリースビルド
```bash
cargo build --release

# Windows向けクロスコンパイル（Linux/macOSから）
cargo build --release --target x86_64-pc-windows-gnu
```

## 禁止事項

- `unwrap()` / `expect()` の安易な使用（適切なエラーハンドリングを行う）
- `unsafe` ブロックの乱用（必要最小限に）
- `clone()` の過剰使用（パフォーマンス考慮）
- 循環参照（`Rc<RefCell<T>>` のループ）
- 巨大な `main.rs`（モジュール分割する）

```rust
// Bad - unwrapの乱用
let user = get_user(id).unwrap();

// Good - 適切なエラーハンドリング
let user = get_user(id).context("ユーザー取得に失敗")?;

// Good - デフォルト値
let user = get_user(id).unwrap_or_default();
```
