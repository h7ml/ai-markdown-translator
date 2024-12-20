### **前端言語**

#### **HTML**

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>こんにちは、世界！</title>
  </head>
  <body>
    <!-- 画面に「こんにちは、世界！」を表示 -->
    <h1>こんにちは、世界！</h1>
  </body>
</html>
```

#### **CSS**

```css
/* HTML の h1 要素にスタイルを設定 */
h1 {
  color: blue; /* 文字色は青色 */
  text-align: center; /* 文字は中央に配置 */
}
```

#### **JavaScript**

```javascript
// 画面のコンソールで「こんにちは、世界！」を表示
console.log('こんにちは、世界!');
```

#### **TypeScript**

```typescript
// TypeScript の中で「こんにちは、世界！」を表示
let message: string = 'こんにちは、世界!'; // 文字列変数を宣言
console.log(message); // コンソールに表示
```

#### **Vue.js**

```javascript
// Vue.js の使用例、画面に「こんにちは、世界！」を表示
const app = Vue.createApp({
  data() {
    return {
      message: 'こんにちは、世界!',
    };
  },
});
app.mount('#app');
```

対応する HTML:

```html
<div id="app">{{ message }}</div>
```

---

### **バックエンド言語**

#### **Node.js (JavaScript)**

```javascript
// Node.js を使用して簡単なサーバーを作成し、「こんにちは、世界！」を返す
const http = require('http');

// サーバーを作成
http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' }); // レスポンスヘッダーをテキストに設定
    res.end('こんにちは、世界!\n'); // 「こんにちは、世界！」を返す
  })
  .listen(3000);

console.log('サーバーは http://localhost:3000 で動作しています');
```

#### **Python**

```python
# 終端に「こんにちは、世界！」を表示
print("こんにちは、世界!")
```

#### **Django (Python Web Framework)**

ビュー コード:

```python
from django.http import HttpResponse

# 「こんにちは、世界！」を返すビュー関数を定義
def hello_world(request):
    return HttpResponse("こんにちは、世界!")
```

#### **Java**

```java
// 終端に「こんにちは、世界！」を表示
public class Main {
    public static void main(String[] args) {
        System.out.println("こんにちは、世界!"); // 標準出力を使用
    }
}
```

#### **Kotlin**

```kotlin
// 終端に「こんにちは、世界！」を表示
fun main() {
    println("こんにちは、世界!") // Kotlin の表示関数
}
```

#### **PHP**

```php
<?php
// 画面に「こんにちは、世界！」を表示
echo "こんにちは、世界!";
?>
```

#### **Ruby**

```ruby
# 終端に「こんにちは、世界！」を表示
puts "こんにちは、世界!"
```

#### **Go**

```go
// 終端に「こんにちは、世界！」を表示
package main

import "fmt"

func main() {
    fmt.Println("こんにちは、世界!") // 文字列を表示
}
```

#### **C#**

```csharp
// 終端に「こんにちは、世界！」を表示
using System;

class Program {
    static void Main() {
        Console.WriteLine("こんにちは、世界!"); // 文字列を表示
    }
}
```

#### **Rust**

```rust
// 終端に「こんにちは、世界！」を表示
fn main() {
    println!("こんにちは、世界!"); // 標準出力に表示
}
```

#### **Swift**

```swift
// 終端に「こんにちは、世界！」を表示
print("こんにちは、世界!") // Swift の表示関数
```

#### **PHP Laravel (バックエンドフレームワーク)**

コントローラー例:

```php
// Laravel フレームワークで「こんにちは、世界！」を返す
Route::get('/', function () {
    return 'こんにちは、世界!';
});
```

---

### **SQL**

```sql
-- 簡単なクエリ例、'こんにちは、世界!' を返す
SELECT 'こんにちは、世界!';
