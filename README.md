# Java to JavaScript Mini Compiler

A modular educational compiler from a simple Java-like language (“Mini-Java”) to JavaScript.
Implements all classic compilation phases: lexical, syntax, semantic analysis, symbol table, intermediate code, and code generation.

---

## Features

* Lexical analysis (token stream)
* Syntax analysis (AST generation)
* Semantic analysis (scope and undeclared/duplicated variables)
* Symbol table construction
* Intermediate code generation (three-address code)
* Final code generation (JavaScript)
* Modular, extensible and easy to understand

---

## Project Structure

```

java-to-js-mini-compiler/
├── examples/
│   └── sample.mjava
├── .gitignore
├── abstract-syntax-tree.js
├── file-reader.js
├── intermediate-code-generator.js
├── javascript-generator.js
├── lexer.js
├── main.js
├── package.json
├── parser.js
├── README.md
├── semantic-analyzer.js
├── symbol-table.js
└── token.js

````

---

## Getting Started

### **Prerequisites**
* [Node.js](https://nodejs.org/) (version 16+ recommended)

### **Installation**

Clone the repository or download the source code:

```bash
git clone https://github.com/robinsonur/java-to-js-mini-compiler.git
cd java-to-js-mini-compiler
````

### **Running the Compiler**

```bash
npm start
```

or directly:

```bash
node src/main.js
```

---

## Example Output

The compiler displays:

* The Mini-Java input
* The token stream
* The AST (abstract syntax tree)
* The symbol table
* Semantic errors (if any)
* The intermediate code
* The generated JavaScript code

---

## Example Input (`examples/sample.mjava`)

```java
int suma(int a, int b) {
  int resultado = a + b;
  return resultado;
}

int x = 5;
int y = 2;
int z = suma(x, y);
```

---

## Customization

* You can extend the language and phases (see code comments)
* AST nodes, semantic analysis, or code generation can be modified to support more features

---

## Author

**Robinson U. Rodríguez**
[GitHub](https://github.com/robinsonur)
