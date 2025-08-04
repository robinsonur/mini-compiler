import path from 'path';
import { FileReader } from './file-reader.js';
import { Lexer } from './lexer.js';
import { Parser } from './parser.js';
import { JavaScriptGenerator } from './javascript-generator.js';
import { SemanticAnalyzer } from './semantic-analyzer.js';
import { IntermediateCodeGenerator } from './intermediate-code-generator.js';

const examplePath = process.argv[2] || path.resolve('examples/sample.mjava');
const sourceCode = FileReader.read(examplePath);

try {
  // Lexer
  const lexer = new Lexer(sourceCode);
  const tokens = lexer.tokenize();

  // Parser
  const parser = new Parser(tokens);
  const ast = parser.parse();

  // Semantic Analyzer + Symbol Table
  const sem = new SemanticAnalyzer(ast);
  const { symbolTable, errors } = sem.analyze();

  // Intermediate Code
  const icg = new IntermediateCodeGenerator();
  const intermediateCode = icg.generate(ast);

  // JS Code Generation
  const jsGenerator = new JavaScriptGenerator();
  const jsCode = jsGenerator.generate(ast);

  console.log('--- Input (Mini-Java) ---\n' + sourceCode);
  console.log('\n--- Tokens ---\n', tokens);
  console.log('\n--- AST ---\n', JSON.stringify(ast, null, 2));
  console.log('\n--- Symbol Table ---\n', symbolTable.getAll());
  if (errors.length) {
    console.log('\n--- Semantic Errors ---\n', errors);
  }
  console.log('\n--- Intermediate Code ---\n' + intermediateCode.join('\n'));
  console.log('\n--- Translated to JavaScript ---\n' + jsCode);

} catch (error) {
  console.error('Compilation Error:', error.message);
}
