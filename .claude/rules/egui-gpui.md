---
paths: "**/gui/**, **/ui/**, **/app/**, **/desktop/**"
---

# egui / GPUI 開発ルール

## 最重要ルール

**UI作成時は egui または gpui-component を最優先で採用すること**

---

## フレームワーク概要

| フレームワーク | リポジトリ | 特徴 |
|---------------|-----------|------|
| **egui** | https://github.com/emilk/egui | Rust製・即時モードGUI・軽量・Web対応 |
| **gpui-component** | https://github.com/longbridge/gpui-component | Zed Editor由来・GPUI基盤・高パフォーマンス |

---

## 選択基準

| ケース | 推奨 |
|--------|------|
| 軽量ツール・プロトタイプ | egui |
| 本格的デスクトップアプリ | gpui-component |
| WebAssembly対応必須 | egui |
| 高パフォーマンス要求 | gpui-component |
| クロスプラットフォーム | 両方対応 |

---

## egui 基本実装

### プロジェクト作成

```bash
cargo new my-egui-app
cd my-egui-app
cargo add eframe egui
```

### Cargo.toml

```toml
[package]
name = "my-egui-app"
version = "0.1.0"
edition = "2021"

[dependencies]
eframe = "0.29"
egui = "0.29"

# Web対応（オプション）
[target.'cfg(target_arch = "wasm32")'.dependencies]
wasm-bindgen-futures = "0.4"
```

### 基本構造

```rust
use eframe::egui;

fn main() -> eframe::Result<()> {
    let options = eframe::NativeOptions {
        viewport: egui::ViewportBuilder::default()
            .with_inner_size([400.0, 300.0]),
        ..Default::default()
    };
    
    eframe::run_native(
        "My App",
        options,
        Box::new(|_cc| Ok(Box::new(MyApp::default()))),
    )
}

#[derive(Default)]
struct MyApp {
    name: String,
    age: u32,
}

impl eframe::App for MyApp {
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        egui::CentralPanel::default().show(ctx, |ui| {
            ui.heading("My egui App");
            ui.horizontal(|ui| {
                ui.label("Name: ");
                ui.text_edit_singleline(&mut self.name);
            });
            ui.add(egui::Slider::new(&mut self.age, 0..=120).text("Age"));
            
            if ui.button("Click me").clicked() {
                println!("Button clicked!");
            }
        });
    }
}
```

### Web ビルド（trunk使用）

```bash
# index.html 作成
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>My egui App</title>
</head>
<body>
    <canvas id="canvas"></canvas>
</body>
</html>
EOF

# ビルド＆起動
trunk serve --open
```

---

## gpui-component 基本実装

### プロジェクト作成

```bash
cargo new my-gpui-app
cd my-gpui-app
cargo add gpui gpui-component
```

### 基本構造

```rust
use gpui::*;
use gpui_component::*;

fn main() {
    App::new().run(|cx: &mut AppContext| {
        cx.open_window(
            WindowOptions {
                window_bounds: Some(WindowBounds::Windowed(Bounds::centered(
                    None,
                    size(px(800.0), px(600.0)),
                    cx,
                ))),
                ..Default::default()
            },
            |cx| cx.new_view(|_cx| MyApp::new()),
        )
        .unwrap();
    });
}

struct MyApp {
    input_value: String,
}

impl MyApp {
    fn new() -> Self {
        Self {
            input_value: String::new(),
        }
    }
}

impl Render for MyApp {
    fn render(&mut self, cx: &mut ViewContext<Self>) -> impl IntoElement {
        div()
            .flex()
            .flex_col()
            .gap_4()
            .p_4()
            .child(
                h1("My GPUI App")
            )
            .child(
                Input::new()
                    .value(self.input_value.clone())
                    .on_change(cx.listener(|this, value, _cx| {
                        this.input_value = value;
                    }))
            )
            .child(
                Button::new("click-btn")
                    .label("Click me")
                    .on_click(cx.listener(|_this, _event, _cx| {
                        println!("Button clicked!");
                    }))
            )
    }
}
```

---

## 開発ツール

| ツール | コマンド | 用途 |
|--------|---------|------|
| trunk | `trunk serve` | WASM開発サーバー |
| cargo-watch | `cargo watch -x run` | ホットリロード |
| wasm-bindgen | - | JS-Rustバインディング |

---

## ビルドターゲット

| ターゲット | コマンド |
|------------|---------|
| Windows | `cargo build --release` |
| macOS | `cargo build --release --target x86_64-apple-darwin` |
| Linux | `cargo build --release --target x86_64-unknown-linux-gnu` |
| Web (WASM) | `trunk build --release` |

---

## チェックリスト

実装前：
- [ ] egui または gpui-component を選択
- [ ] 必要な依存関係を追加
- [ ] ターゲットプラットフォームを確認

実装後：
- [ ] ネイティブビルドが成功
- [ ] Web ビルドが成功（必要な場合）
- [ ] クロスプラットフォームテスト

---

## 禁止事項

| 禁止事項 | 理由 |
|----------|------|
| Electron/Tauri を第一選択にする | egui/gpui を優先 |
| React/Vue などJS UIを使用 | Rust UIを優先 |
| GTK/Qt を第一選択にする | egui/gpui を優先 |
