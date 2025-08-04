class IntermediateCodeGenerator {
  constructor() {
    this.code = [];
    this.tempCount = 0;
  }

  generate(ast) {
    this.visitProgram(ast);
    return this.code;
  }

  newTemp() {
    return `t${this.tempCount++}`;
  }

  visitProgram(node) {
    for (const decl of node.declarations) {
      if (decl.type === 'FunctionDeclaration') {
        this.code.push(`# Function ${decl.name}`);
        this.visitFunctionDeclaration(decl);
      } else if (decl.type === 'VariableDeclaration') {
        if (decl.value) {
          const temp = this.visitExpression(decl.value);
          this.code.push(`${decl.name} = ${temp}`);
        } else {
          this.code.push(`${decl.name} = 0`);
        }
      }
    }
  }

  visitFunctionDeclaration(node) {
    this.code.push(`function ${node.name}:`);
    for (const stmt of node.body) {
      if (stmt.type === 'VariableDeclaration') {
        if (stmt.value) {
          const temp = this.visitExpression(stmt.value);
          this.code.push(`  ${stmt.name} = ${temp}`);
        } else {
          this.code.push(`  ${stmt.name} = 0`);
        }
      } else if (stmt.type === 'Assignment') {
        const temp = this.visitExpression(stmt.value);
        this.code.push(`  ${stmt.name} = ${temp}`);
      } else if (stmt.type === 'ReturnStatement') {
        const temp = this.visitExpression(stmt.value);
        this.code.push(`  return ${temp}`);
      } else if (stmt.type === 'ExpressionStatement') {
        this.visitExpression(stmt.expression);
      }
    }
    this.code.push(`end function ${node.name}`);
  }

  visitExpression(node) {
    if (node.type === 'NumberLiteral') return node.value;
    if (node.type === 'Identifier') return node.name;
    if (node.type === 'BinaryExpression') {
      const left = this.visitExpression(node.left);
      const right = this.visitExpression(node.right);
      const temp = this.newTemp();
      this.code.push(`${temp} = ${left} ${node.operator} ${right}`);
      return temp;
    }
    if (node.type === 'CallExpression') {
      const args = node.arguments.map(a => this.visitExpression(a));
      const temp = this.newTemp();
      this.code.push(`${temp} = call ${node.callee.name}(${args.join(', ')})`);
      return temp;
    }
    return '';
  }
}

export { IntermediateCodeGenerator };
