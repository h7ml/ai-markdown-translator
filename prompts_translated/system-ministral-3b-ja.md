### **前端言語**

#### **HTML**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Hello, World!</title>
  </head>
  <body>
    <!-- "Hello, World!" をページに出力する -->
    <h1>Hello, World!</h1>
  </body>
</html>
```

#### **CSS**

```css
/* HTML の h1 元素にスタイルを設定する */
h1 {
  color: blue; /* テキスト色は青色 */
  text-align: center; /* テキストは中央に配置 */
}
```

#### **JavaScript**

```javascript
// ブラウザのコンソールに "Hello, World!" を出力する
console.log('Hello, World!');
```

#### **TypeScript**

```typescript
// TypeScript にて "Hello, World!" を出力する
let message: string = 'Hello, World!'; // 文字列変数を宣言
console.log(message); // コンソールに出力
```

```ts
type CommonRequest = Omit<RequestInit, 'body'> & { body?: URLSearchParams };

export async function request(url: string, init?: CommonRequest) {
  if (import.meta.env.DEV) {
    const nodeFetch = await import('node-fetch');
    const https = await import('node:https');

    const agent = url.startsWith('https')
      ? new https.Agent({ rejectUnauthorized: false })
      : undefined;

    return nodeFetch.default(url, { ...init, agent });
  }

  return fetch(url, init);
}
```

### **React.js**

```tsx
import { RemixBrowser } from '@remix-run/react';
import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';

startTransition(() => {
  hydrateRoot(document.getElementById('root')!, <RemixBrowser />);
});
```

#### **Vue.js**

```javascript
// Vue.js の使い方、ページに "Hello, World!" を表示
const app = Vue.createApp({
  data() {
    return {
      message: 'Hello, World!',
    };
  },
});
app.mount('#app');
```

対応する HTML：

```html
<div id="app">{{ message }}</div>
```

---

### **バックエンド言語**

#### **Node.js (JavaScript)**

```javascript
// Node.js で簡単なサーバーを作成し、 "Hello, World!" を返す
const http = require('http');

// サーバーの作成
http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' }); // レスポンスヘッダーをテキストに設定
    res.end('Hello, World!\n'); // "Hello, World!" を返す
  })
  .listen(3000);

console.log('Server running at http://localhost:3000');
```

#### **Python**

```python
# 終端に "Hello, World!" を出力する
print("Hello, World!")
```

#### **Django (Python Web Framework)**

ビュー コード：

```python
from django.http import HttpResponse

# "Hello, World!" を返すビュー関数を定義
def hello_world(request):
    return HttpResponse("Hello, World!")
```

#### **Java**

```java
// 終端に "Hello, World!" を出力する
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!"); // 標準出力を使用
    }
}
```

#### **Kotlin**

```kotlin
// 終端に "Hello, World!" を出力する
fun main() {
    println("Hello, World!") // Kotlin の出力関数
}
```

#### **PHP**

```php
<?php
// ページに "Hello, World!" を出力する
echo "Hello, World!";
?>
```

#### **Ruby**

```ruby
# 終端に "Hello, World!" を出力する
puts "Hello, World!"
```

#### **Go**

```go
// 終端に "Hello, World!" を出力する
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!") // 文字列をPrint
}
```

#### **C#**

```csharp
// 終端に "Hello, World!" を出力する
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!"); // 文字列をPrint
    }
}
```

#### **Rust**

```rust
// 終端に "Hello, World!" を出力する
fn main() {
    println!("Hello, World!"); // 標準出力にPrint
}
```

#### **Swift**

```swift
// 終端に "Hello, World!" を出力する
print("Hello, World!") // Swift の出力関数
```

#### **PHP Laravel (バックエンドフレームワーク)**

コントローラー例：

```php
// Laravel フレームワークで "Hello, World!" を返す
Route::get('/', function () {
    return 'Hello, World!';
});
```

---

### **SQL**

```sql
-- "Hello, World!" を返す簡単なクエリ例
SELECT 'Hello, World!';