# Zig開発ガイドライン

## 使用場面

| 用途 | 適性 |
|------|------|
| CLIツール | ⭐⭐⭐⭐⭐ 最適 |
| ファイル処理 | ⭐⭐⭐⭐⭐ 最適 |
| システムプログラミング | ⭐⭐⭐⭐⭐ 最適 |
| Cライブラリラッパー | ⭐⭐⭐⭐⭐ 最適 |
| WebAssembly | ⭐⭐⭐⭐ 良い |
| GUIアプリ | ⭐⭐ Rust推奨 |

## 基本コマンド

```bash
zig run file.zig       # 実行
zig build              # ビルド（build.zig使用）
zig build-exe file.zig # 実行ファイル作成
zig test file.zig      # テスト
zig fmt file.zig       # フォーマット
```

## クロスコンパイル

```bash
# Linux向け
zig build -Dtarget=x86_64-linux

# Windows向け
zig build -Dtarget=x86_64-windows

# macOS向け
zig build -Dtarget=x86_64-macos
```

## Cライブラリ連携

```zig
const c = @cImport({
    @cInclude("stdio.h");
});

pub fn main() void {
    _ = c.printf("Hello from C!\n");
}
```

## build.zig テンプレート

```zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const exe = b.addExecutable(.{
        .name = "myapp",
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    b.installArtifact(exe);

    const run_cmd = b.addRunArtifact(exe);
    const run_step = b.step("run", "Run the app");
    run_step.dependOn(&run_cmd.step);
}
```

## ベストプラクティス

1. **エラー処理**: `try`/`catch` を適切に使用
2. **メモリ管理**: アロケータを明示的に渡す
3. **comptime**: コンパイル時計算を活用
4. **テスト**: `test` ブロックで単体テスト作成

## 禁止事項

- `undefined` の意図しない使用
- メモリリーク（defer で解放忘れ防止）
- 無限ループのコンパイル時実行
