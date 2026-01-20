---
paths: "**/*.py, **/tensorflow/**, **/keras/**, **/ml/**"
---

# TensorFlow 開発ルール

## 概要

[TensorFlow](https://github.com/tensorflow/tensorflow) は193k+スターのGoogle製機械学習フレームワーク。
エンドツーエンドのMLプラットフォームとして、研究から本番デプロイまで対応。

## バージョン

| バージョン | 状態 | 備考 |
|------------|------|------|
| **TensorFlow 2.x** | 推奨 | Keras統合、Eager Execution |
| TensorFlow 1.x | 非推奨 | レガシー |

## インストール

```bash
# uv推奨
uv pip install tensorflow

# GPU対応
uv pip install tensorflow[cuda]

# 軽量版（CPU）
uv pip install tensorflow-cpu
```

## TensorFlow vs PyTorch

| 項目 | TensorFlow | PyTorch |
|------|------------|---------|
| **本番デプロイ** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **モバイル/エッジ** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **研究・実験** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **学習曲線** | 中程度 | 緩やか |
| **デバッグ** | 中程度 | 容易 |

### 選択基準

| 用途 | 推奨 |
|------|------|
| 本番デプロイ・スケーリング | TensorFlow |
| モバイル・組み込み | TensorFlow Lite |
| 研究・プロトタイプ | PyTorch |
| Webブラウザ | TensorFlow.js |

## 基本構成

### Keras API（推奨）

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# Sequential API
model = keras.Sequential([
    layers.Dense(128, activation='relu', input_shape=(784,)),
    layers.Dropout(0.2),
    layers.Dense(64, activation='relu'),
    layers.Dense(10, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

model.fit(x_train, y_train, epochs=10, validation_split=0.2)
```

### Functional API（複雑なモデル）

```python
inputs = keras.Input(shape=(784,))
x = layers.Dense(128, activation='relu')(inputs)
x = layers.Dropout(0.2)(x)
x = layers.Dense(64, activation='relu')(x)
outputs = layers.Dense(10, activation='softmax')(x)

model = keras.Model(inputs=inputs, outputs=outputs)
```

### カスタムモデル

```python
class MyModel(keras.Model):
    def __init__(self):
        super().__init__()
        self.dense1 = layers.Dense(128, activation='relu')
        self.dense2 = layers.Dense(10)

    def call(self, inputs, training=False):
        x = self.dense1(inputs)
        if training:
            x = tf.nn.dropout(x, rate=0.2)
        return self.dense2(x)
```

## データパイプライン

### tf.data API

```python
# 効率的なデータパイプライン
dataset = tf.data.Dataset.from_tensor_slices((x_train, y_train))
dataset = (
    dataset
    .shuffle(buffer_size=1024)
    .batch(32)
    .prefetch(tf.data.AUTOTUNE)
)
```

## モデル保存・読み込み

```python
# SavedModel形式（推奨）
model.save('my_model')
loaded_model = keras.models.load_model('my_model')

# 重みのみ
model.save_weights('weights.h5')
model.load_weights('weights.h5')
```

## TensorFlow エコシステム

| ツール | 用途 |
|--------|------|
| **TensorFlow Lite** | モバイル・組み込み |
| **TensorFlow.js** | ブラウザ・Node.js |
| **TensorFlow Serving** | 本番デプロイ |
| **TensorFlow Hub** | 事前学習モデル |
| **TensorBoard** | 可視化・デバッグ |
| **TFX** | 本番MLパイプライン |

## GPU設定

```python
# GPU確認
print(tf.config.list_physical_devices('GPU'))

# メモリ成長を有効化（推奨）
gpus = tf.config.list_physical_devices('GPU')
for gpu in gpus:
    tf.config.experimental.set_memory_growth(gpu, True)

# 特定GPUのみ使用
tf.config.set_visible_devices(gpus[0], 'GPU')
```

## ベストプラクティス

| 項目 | 推奨 |
|------|------|
| **API** | Keras API（tf.keras） |
| **実行モード** | Eager Execution（デフォルト） |
| **データ** | tf.data API |
| **保存形式** | SavedModel |
| **可視化** | TensorBoard |
| **型** | tf.float32（デフォルト） |

## 禁止事項

| 禁止 | 代替 |
|------|------|
| TensorFlow 1.x スタイル | TensorFlow 2.x + Keras |
| tf.Session() | Eager Execution |
| tf.placeholder | tf.function + 引数 |
| feed_dict | tf.data API |
| 手動メモリ管理 | tf.config.experimental.set_memory_growth |

## 参照

- [TensorFlow 公式](https://www.tensorflow.org/)
- [TensorFlow GitHub](https://github.com/tensorflow/tensorflow)
- [Keras 公式](https://keras.io/)
- [TensorFlow Hub](https://tfhub.dev/)
- [TensorBoard](https://www.tensorflow.org/tensorboard)
