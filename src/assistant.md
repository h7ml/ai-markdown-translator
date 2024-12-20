### **Frontend Languages**

#### **HTML**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Hello, World!</title>
  </head>
  <body>
    <!-- Output "Hello, World!" in the page -->
    <h1>Hello, World!</h1>
  </body>
</html>
```

#### **CSS**

```css
/* Set styles for the h1 element in HTML */
h1 {
  color: blue; /* Text color is blue */
  text-align: center; /* Text is centered */
}
```

#### **JavaScript**

```javascript
// Output "Hello, World!" to the browser's console
console.log('Hello, World!');
```

#### **TypeScript**

```typescript
// Output "Hello, World!" in TypeScript
let message: string = 'Hello, World!'; // Declare a string variable
console.log(message); // Print to the console
```

#### **Vue.js**

```javascript
// Vue.js usage, display "Hello, World!" on the page
const app = Vue.createApp({
  data() {
    return {
      message: 'Hello, World!',
    };
  },
});
app.mount('#app');
```

Corresponding HTML:

```html
<div id="app">{{ message }}</div>
```

---

### **Backend Languages**

#### **Node.js (JavaScript)**

```javascript
// Create a simple server with Node.js and return "Hello, World!"
const http = require('http');

// Create server
http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' }); // Set response header to text
    res.end('Hello, World!\n'); // Return "Hello, World!"
  })
  .listen(3000);

console.log('Server running at http://localhost:3000');
```

#### **Python**

```python
# Output "Hello, World!" to the terminal
print("Hello, World!")
```

#### **Django (Python Web Framework)**

View code:

```python
from django.http import HttpResponse

# Define a view function that returns "Hello, World!"
def hello_world(request):
    return HttpResponse("Hello, World!")
```

#### **Java**

```java
// Output "Hello, World!" to the terminal
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!"); // Use standard output
    }
}
```

#### **Kotlin**

```kotlin
// Output "Hello, World!" to the terminal
fun main() {
    println("Hello, World!") // Print function in Kotlin
}
```

#### **PHP**

```php
<?php
// Output "Hello, World!" on the page
echo "Hello, World!";
?>
```

#### **Ruby**

```ruby
# Output "Hello, World!" to the terminal
puts "Hello, World!"
```

#### **Go**

```go
// Output "Hello, World!" to the terminal
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!") // Print string
}
```

#### **C#**

```csharp
// Output "Hello, World!" to the terminal
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!"); // Print string
    }
}
```

#### **Rust**

```rust
// Output "Hello, World!" to the terminal
fn main() {
    println!("Hello, World!"); // Print to standard output
}
```

#### **Swift**

```swift
// Output "Hello, World!" to the terminal
print("Hello, World!") // Print function in Swift
```

#### **PHP Laravel (Backend Framework)**

Controller example:

```php
// Return "Hello, World!" in the Laravel framework
Route::get('/', function () {
    return 'Hello, World!';
});
```

---

### **SQL**

```sql
-- Simple query example, returns 'Hello, World!'
SELECT 'Hello, World!';