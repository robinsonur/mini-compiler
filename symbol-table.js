class SymbolTable {
  constructor() {
    this.symbols = [];
  }
  add(symbol) {
    this.symbols.push(symbol);
  }
  find(name, scope = "global") {
    return this.symbols.find(s => s.name === name && s.scope === scope);
  }
  getAll() {
    return this.symbols;
  }
}

export { SymbolTable };
