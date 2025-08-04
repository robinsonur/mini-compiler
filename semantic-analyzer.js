import { SymbolTable } from './symbol-table.js';

class SemanticAnalyzer {
  constructor(ast) {
    this.ast = ast;
    this.symbolTable = new SymbolTable();
    this.errors = [];
  }

  analyze() {
    this.visitProgram(this.ast);
    return { symbolTable: this.symbolTable, errors: this.errors };
  }

  visitProgram(node) {
    for (const decl of node.declarations) {
      if (decl.type === 'VariableDeclaration') this.visitVariableDeclaration(decl, 'global');
      else if (decl.type === 'FunctionDeclaration') this.visitFunctionDeclaration(decl);
    }
  }

  visitVariableDeclaration(node, scope) {
    if (this.symbolTable.find(node.name, scope)) {
      this.errors.push(`Variable "${node.name}" already declared in scope "${scope}".`);
    } else {
      this.symbolTable.add({ name: node.name, type: node.varType, scope, address: this.symbolTable.symbols.length });
    }
    if (node.value) this.visitExpression(node.value, scope);
  }

  visitFunctionDeclaration(node) {
    if (this.symbolTable.find(node.name, "global")) {
      this.errors.push(`Function "${node.name}" already declared.`);
      return;
    }
    this.symbolTable.add({ name: node.name, type: 'function', params: node.params.map(p => p.type), scope: "global", address: this.symbolTable.symbols.length });
    // Parámetros en scope de función
    const functionScope = node.name;
    for (const param of node.params) {
      if (this.symbolTable.find(param.name, functionScope)) {
        this.errors.push(`Parameter "${param.name}" already declared in function "${functionScope}".`);
      } else {
        this.symbolTable.add({ name: param.name, type: param.type, scope: functionScope, address: this.symbolTable.symbols.length });
      }
    }
    for (const stmt of node.body) {
      if (stmt.type === 'VariableDeclaration') this.visitVariableDeclaration(stmt, functionScope);
      else if (stmt.type === 'Assignment') this.visitAssignment(stmt, functionScope);
      else if (stmt.type === 'ReturnStatement') this.visitExpression(stmt.value, functionScope);
      else if (stmt.type === 'ExpressionStatement') this.visitExpression(stmt.expression, functionScope);
    }
  }

  visitAssignment(node, scope) {
    if (!this.symbolTable.find(node.name, scope)) {
      this.errors.push(`Assignment to undeclared variable "${node.name}" in scope "${scope}".`);
    }
    this.visitExpression(node.value, scope);
  }

  visitExpression(node, scope) {
    if (!node) return;
    if (node.type === 'Identifier') {
      if (!this.symbolTable.find(node.name, scope) && !this.symbolTable.find(node.name, "global")) {
        this.errors.push(`Use of undeclared variable "${node.name}" in scope "${scope}".`);
      }
    } else if (node.type === 'BinaryExpression') {
      this.visitExpression(node.left, scope);
      this.visitExpression(node.right, scope);
    } else if (node.type === 'CallExpression') {
      if (!this.symbolTable.find(node.callee.name, "global")) {
        this.errors.push(`Call to undeclared function "${node.callee.name}".`);
      }
      for (const arg of node.arguments) {
        this.visitExpression(arg, scope);
      }
    }
    // NumberLiteral: nothing to check
  }
}

export { SemanticAnalyzer };
