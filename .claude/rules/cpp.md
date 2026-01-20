---
paths: "**/*.cpp, **/*.hpp, **/*.c, **/*.h"
---

# C++開発ルール

## プロジェクトセットアップ

### ディレクトリ構成
```text
project_name/
├── CMakeLists.txt
├── src/
│   ├── main.cpp
│   └── app/
│       ├── app.cpp
│       └── app.hpp
├── include/
│   └── project_name/
│       └── public_header.hpp
├── tests/
│   └── test_main.cpp
├── third_party/        # 外部ライブラリ
├── build/              # ビルド出力（.gitignore対象）
└── .clang-format
```

### CMakeLists.txt基本構成
```cmake
cmake_minimum_required(VERSION 3.20)
project(app_name VERSION 1.0.0 LANGUAGES CXX)

# C++17以上を要求
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# 警告を厳しく
if(MSVC)
    add_compile_options(/W4 /WX)
else()
    add_compile_options(-Wall -Wextra -Wpedantic -Werror)
endif()

# ソースファイル
set(SOURCES
    src/main.cpp
    src/app/app.cpp
)

# 実行ファイル
add_executable(${PROJECT_NAME} ${SOURCES})

# インクルードディレクトリ
target_include_directories(${PROJECT_NAME} PRIVATE
    ${CMAKE_SOURCE_DIR}/include
    ${CMAKE_SOURCE_DIR}/src
)

# 外部ライブラリ（例: nlohmann/json）
include(FetchContent)
FetchContent_Declare(
    json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG v3.11.2
)
FetchContent_MakeAvailable(json)
target_link_libraries(${PROJECT_NAME} PRIVATE nlohmann_json::nlohmann_json)
```

### ビルドコマンド
```bash
# ビルドディレクトリ作成
mkdir build && cd build

# CMake構成
cmake ..

# ビルド
cmake --build .

# リリースビルド
cmake --build . --config Release
```

## コーディングスタイル

### 命名規則
| 対象 | 規則 | 例 |
|------|------|-----|
| クラス | PascalCase | `UserProfile` |
| 関数・メソッド | camelCase または snake_case | `getUserById` / `get_user_by_id` |
| 変数 | camelCase または snake_case | `userName` / `user_name` |
| 定数 | SCREAMING_SNAKE_CASE | `MAX_CONNECTIONS` |
| メンバ変数 | m_プレフィックス または _サフィックス | `m_name` / `name_` |
| 名前空間 | snake_case | `my_app` |

### .clang-format
```yaml
BasedOnStyle: Google
IndentWidth: 4
ColumnLimit: 100
AllowShortFunctionsOnASingleLine: Inline
AllowShortIfStatementsOnASingleLine: false
BreakBeforeBraces: Attach
PointerAlignment: Left
```

## モダンC++機能（C++17以上）

### スマートポインタ（必須）
```cpp
#include <memory>

// 単一所有権
auto user = std::make_unique<User>("Alice");

// 共有所有権（必要な場合のみ）
auto shared_user = std::make_shared<User>("Bob");

// 生ポインタは禁止
// User* user = new User("Alice");  // NG
```

### std::optional
```cpp
#include <optional>

std::optional<User> find_user(uint32_t id) {
    if (auto it = users.find(id); it != users.end()) {
        return it->second;
    }
    return std::nullopt;
}

// 使用例
if (auto user = find_user(123); user.has_value()) {
    std::cout << user->name << std::endl;
}

// value_or でデフォルト値
auto name = find_user(123).value_or(User{}).name;
```

### std::variant
```cpp
#include <variant>

using Result = std::variant<User, std::string>;  // User or エラーメッセージ

Result get_user(uint32_t id) {
    if (id == 0) {
        return "IDは0以外を指定してください";
    }
    return User{id, "Alice"};
}

// 使用例
auto result = get_user(123);
if (std::holds_alternative<User>(result)) {
    auto& user = std::get<User>(result);
    std::cout << user.name << std::endl;
} else {
    std::cerr << std::get<std::string>(result) << std::endl;
}
```

### 構造化束縛
```cpp
// mapのイテレーション
std::map<int, std::string> users = {{1, "Alice"}, {2, "Bob"}};
for (const auto& [id, name] : users) {
    std::cout << id << ": " << name << std::endl;
}

// tuple/pairの分解
auto [success, message] = process_data();
if (!success) {
    std::cerr << message << std::endl;
}
```

### if文での初期化
```cpp
if (auto user = find_user(123); user.has_value()) {
    // userはこのスコープでのみ有効
    process(*user);
}
```

## クラス設計

### 基本的なクラス
```cpp
#pragma once

#include <string>
#include <optional>

namespace my_app {

/// ユーザー情報を表すクラス
class User {
public:
    // コンストラクタ
    User() = default;
    User(uint32_t id, std::string name, std::string email);

    // コピー/ムーブ（必要に応じて）
    User(const User&) = default;
    User& operator=(const User&) = default;
    User(User&&) noexcept = default;
    User& operator=(User&&) noexcept = default;

    // デストラクタ
    ~User() = default;

    // ゲッター
    [[nodiscard]] uint32_t id() const noexcept { return m_id; }
    [[nodiscard]] const std::string& name() const noexcept { return m_name; }
    [[nodiscard]] const std::string& email() const noexcept { return m_email; }

    // セッター
    void set_name(std::string name) { m_name = std::move(name); }
    void set_email(std::string email) { m_email = std::move(email); }

    // バリデーション
    [[nodiscard]] bool is_valid() const;

private:
    uint32_t m_id{0};
    std::string m_name;
    std::string m_email;
};

}  // namespace my_app
```

### 実装ファイル
```cpp
#include "user.hpp"

namespace my_app {

User::User(uint32_t id, std::string name, std::string email)
    : m_id(id), m_name(std::move(name)), m_email(std::move(email)) {}

bool User::is_valid() const {
    if (m_name.empty()) return false;
    if (m_email.find('@') == std::string::npos) return false;
    return true;
}

}  // namespace my_app
```

## エラーハンドリング

### 例外（推奨）
```cpp
#include <stdexcept>
#include <string>

// カスタム例外
class AppException : public std::runtime_error {
public:
    explicit AppException(const std::string& message)
        : std::runtime_error(message) {}
};

class UserNotFoundException : public AppException {
public:
    explicit UserNotFoundException(uint32_t user_id)
        : AppException("ユーザーID " + std::to_string(user_id) + " が見つかりません"),
          m_user_id(user_id) {}

    [[nodiscard]] uint32_t user_id() const noexcept { return m_user_id; }

private:
    uint32_t m_user_id;
};

// 使用例
User get_user(uint32_t id) {
    if (id == 0) {
        throw std::invalid_argument("IDは0以外を指定してください");
    }
    // ...
    throw UserNotFoundException(id);
}

int main() {
    try {
        auto user = get_user(123);
    } catch (const UserNotFoundException& e) {
        std::cerr << "ユーザーが見つかりません: " << e.user_id() << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "エラー: " << e.what() << std::endl;
    }
}
```

## GUI開発

### Qt（推奨）
```cpp
#include <QApplication>
#include <QMainWindow>
#include <QPushButton>
#include <QVBoxLayout>

class MainWindow : public QMainWindow {
    Q_OBJECT

public:
    MainWindow(QWidget* parent = nullptr) : QMainWindow(parent) {
        auto* central = new QWidget(this);
        auto* layout = new QVBoxLayout(central);

        auto* button = new QPushButton("クリック", this);
        connect(button, &QPushButton::clicked, this, &MainWindow::on_button_clicked);
        layout->addWidget(button);

        setCentralWidget(central);
        setWindowTitle("サンプルアプリ");
        resize(400, 300);
    }

private slots:
    void on_button_clicked() {
        qDebug() << "ボタンがクリックされました";
    }
};

int main(int argc, char* argv[]) {
    QApplication app(argc, argv);
    MainWindow window;
    window.show();
    return app.exec();
}
```

### Dear ImGui
```cpp
#include "imgui.h"
#include "imgui_impl_win32.h"
#include "imgui_impl_dx11.h"

void render_ui() {
    ImGui::Begin("サンプルウィンドウ");

    static char name[128] = "";
    ImGui::InputText("名前", name, sizeof(name));

    if (ImGui::Button("送信")) {
        // 処理
    }

    ImGui::End();
}
```

## テスト

### Google Test
```cpp
#include <gtest/gtest.h>
#include "user.hpp"

class UserTest : public ::testing::Test {
protected:
    void SetUp() override {
        user_ = std::make_unique<User>(1, "Alice", "alice@example.com");
    }

    std::unique_ptr<User> user_;
};

TEST_F(UserTest, ConstructorSetsValues) {
    EXPECT_EQ(user_->id(), 1);
    EXPECT_EQ(user_->name(), "Alice");
    EXPECT_EQ(user_->email(), "alice@example.com");
}

TEST_F(UserTest, IsValidReturnsTrueForValidUser) {
    EXPECT_TRUE(user_->is_valid());
}

TEST_F(UserTest, IsValidReturnsFalseForEmptyName) {
    user_->set_name("");
    EXPECT_FALSE(user_->is_valid());
}

TEST(UserTestStandalone, DefaultConstructor) {
    User user;
    EXPECT_EQ(user.id(), 0);
    EXPECT_TRUE(user.name().empty());
}
```

## 禁止事項

- 生ポインタの `new` / `delete`（スマートポインタを使用）
- `using namespace std;` のグローバルスコープでの使用
- C言語スタイルのキャスト（`static_cast` 等を使用）
- マジックナンバー（定数を定義する）
- 巨大なヘッダファイル（前方宣言を活用）

```cpp
// Bad
User* user = new User();  // 生ポインタ
delete user;

// Good
auto user = std::make_unique<User>();

// Bad - Cスタイルキャスト
int x = (int)3.14;

// Good
int x = static_cast<int>(3.14);

// Bad
using namespace std;  // グローバルスコープ

// Good - 限定的に使用
void function() {
    using std::cout;
    using std::endl;
    cout << "Hello" << endl;
}
```
