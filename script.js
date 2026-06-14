// ═══════════════════════════════════════════════════════
//  SNIPPETS
// ═══════════════════════════════════════════════════════
const SNIPPETS = {
  hello: `// প্রথম বাংলাকোড প্রোগ্রাম
দেখাও "নমস্কার, পৃথিবী!"
দেখাও "বাংলাকোড-এ স্বাগতম।"`,

  variable: `// চলক ব্যবহার
ধরো নাম = "রাহেলা"
ধরো বয়স = ২০
ধরো শহর = "রাজশাহী"

দেখাও "নাম: " + নাম
দেখাও "বয়স: " + বয়স
দেখাও "শহর: " + শহর`,

  ifelse: `// শর্ত পরীক্ষা
ধরো নম্বর = ৭৫

যদি নম্বর >= ৮০ {
  দেখাও "ফলাফল: এ+"
} নাহলে যদি নম্বর >= ৭০ {
  দেখাও "ফলাফল: এ"
} নাহলে যদি নম্বর >= ৬০ {
  দেখাও "ফলাফল: বি"
} নাহলে {
  দেখাও "ফলাফল: অকৃতকার্য"
}`,

  loop: `// যতক্ষণ লুপ
ধরো গণনা = ১

যতক্ষণ গণনা <= ৫ {
  দেখাও গণনা + " নম্বর রাউন্ড"
  গণনা = গণনা + ১
}

দেখাও "শেষ!"`,

  function: `// ফাংশন তৈরি
কাজ যোগ(ক, খ) {
  ফেরত ক + খ
}

কাজ অভিনন্দন(নাম) {
  দেখাও "অভিনন্দন, " + নাম + "!"
}

ধরো ফলাফল = যোগ(১৫, ২৭)
দেখাও "১৫ + ২৭ = " + ফলাফল

অভিনন্দন("করিম")`,

  fizzbuzz: `// ফিজবাজ
ধরো সংখ্যা = ১

যতক্ষণ সংখ্যা <= ২০ {
  যদি সংখ্যা % ১৫ == ০ {
    দেখাও "ফিজবাজ"
  } নাহলে যদি সংখ্যা % ৩ == ০ {
    দেখাও "ফিজ"
  } নাহলে যদি সংখ্যা % ৫ == ০ {
    দেখাও "বাজ"
  } নাহলে {
    দেখাও সংখ্যা
  }
  সংখ্যা = সংখ্যা + ১
}`,

  factorial: `// ফ্যাক্টোরিয়াল
কাজ ফ্যাক্টোরিয়াল(ন) {
  যদি ন <= ১ {
    ফেরত ১
  }
  ফেরত ন * ফ্যাক্টোরিয়াল(ন - ১)
}

ধরো ই = ১
যতক্ষণ ই <= ৮ {
  দেখাও ই + "! = " + ফ্যাক্টোরিয়াল(ই)
  ই = ই + ১
}`
};

// ═══════════════════════════════════════════════════════
//  SYNTAX HIGHLIGHTER
// ═══════════════════════════════════════════════════════
const KEYWORDS = ['ধরো','দেখাও','যদি','নাহলে','যতক্ষণ','কাজ','ফেরত','সত্য','মিথ্যা'];

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function highlight(code) {
  return code.split('\n').map(line => {
    // Full-line comments
    if (/^\s*\/\//.test(line)) {
      return `<span class="hl-comment">${escapeHtml(line)}</span>`;
    }

    let out = '';
    let i = 0;
    while (i < line.length) {
      // Inline comment
      if (line[i] === '/' && line[i+1] === '/') {
        out += `<span class="hl-comment">${escapeHtml(line.slice(i))}</span>`;
        break;
      }
      // String
      if (line[i] === '"') {
        let j = i+1;
        while (j < line.length && line[j] !== '"') j++;
        out += `<span class="hl-str">${escapeHtml(line.slice(i, j+1))}</span>`;
        i = j+1;
        continue;
      }
      // Number (ASCII or Bengali digits)
      if (/[0-9০-৯]/.test(line[i])) {
        let j = i;
        while (j < line.length && /[0-9০-৯.]/.test(line[j])) j++;
        out += `<span class="hl-num">${escapeHtml(line.slice(i,j))}</span>`;
        i = j;
        continue;
      }
      // Operators
      if (/[+\-*/%=<>!&|]/.test(line[i])) {
        out += `<span class="hl-op">${escapeHtml(line[i])}</span>`;
        i++; continue;
      }
      // Keyword / identifier
      if (/[\u0980-\u09FF\w]/.test(line[i])) {
        let j = i;
        while (j < line.length && /[\u0980-\u09FF\w]/.test(line[j])) j++;
        const word = line.slice(i, j);
        if (KEYWORDS.includes(word)) {
          out += `<span class="hl-kw">${escapeHtml(word)}</span>`;
        } else {
          const rest = line.slice(j).trimStart();
          if (rest.startsWith('(')) {
            out += `<span class="hl-fn">${escapeHtml(word)}</span>`;
          } else {
            out += escapeHtml(word);
          }
        }
        i = j; continue;
      }
      out += escapeHtml(line[i]);
      i++;
    }
    return out;
  }).join('\n');
}

// ═══════════════════════════════════════════════════════
//  LEXER
// ═══════════════════════════════════════════════════════

// Normalize Bengali digits → ASCII for arithmetic
function normDigits(s) {
  return s.replace(/[০১২৩৪৫৬৭৮৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d));
}

const TT = {
  NUM:'NUM', STR:'STR', IDENT:'IDENT', KW:'KW',
  PLUS:'+', MINUS:'-', STAR:'*', SLASH:'/', MOD:'%',
  EQ:'==', NEQ:'!=', LT:'<', LTE:'<=', GT:'>', GTE:'>=',
  ASSIGN:'=', LPAREN:'(', RPAREN:')', LBRACE:'{', RBRACE:'}',
  COMMA:',', EOF:'EOF', AND:'&&', OR:'||', NOT:'!'
};

function tokenize(src) {
  const tokens = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/[ \t\r\n]/.test(c)) { i++; continue; }
    if (c === '/' && src[i+1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }

    // String
    if (c === '"') {
      let j = i+1, s = '';
      while (j < src.length && src[j] !== '"') s += src[j++];
      tokens.push({ type: TT.STR, val: s }); i = j+1; continue;
    }

    // Number (Bengali or ASCII)
    if (/[0-9০-৯]/.test(c)) {
      let j = i, s = '';
      while (j < src.length && /[0-9০-৯.]/.test(src[j])) s += src[j++];
      tokens.push({ type: TT.NUM, val: parseFloat(normDigits(s)) }); i = j; continue;
    }

    // Identifier / keyword
    if (/[\u0980-\u09FF\u00C0-\u024Fa-zA-Z_]/.test(c)) {
      let j = i, s = '';
      while (j < src.length && /[\u0980-\u09FF\u00C0-\u024Fa-zA-Z_0-9০-৯]/.test(src[j])) s += src[j++];
      const kws = ['ধরো','দেখাও','যদি','নাহলে','যতক্ষণ','কাজ','ফেরত','সত্য','মিথ্যা'];
      tokens.push({ type: kws.includes(s) ? TT.KW : TT.IDENT, val: s });
      i = j; continue;
    }

    // Two-char operators
    if (c === '=' && src[i+1] === '=') { tokens.push({type:TT.EQ}); i+=2; continue; }
    if (c === '!' && src[i+1] === '=') { tokens.push({type:TT.NEQ}); i+=2; continue; }
    if (c === '<' && src[i+1] === '=') { tokens.push({type:TT.LTE}); i+=2; continue; }
    if (c === '>' && src[i+1] === '=') { tokens.push({type:TT.GTE}); i+=2; continue; }
    if (c === '&' && src[i+1] === '&') { tokens.push({type:TT.AND}); i+=2; continue; }
    if (c === '|' && src[i+1] === '|') { tokens.push({type:TT.OR}); i+=2; continue; }

    // Single-char operators
    const map = {'+':TT.PLUS,'-':TT.MINUS,'*':TT.STAR,'/':TT.SLASH,'%':TT.MOD,
                 '=':TT.ASSIGN,'<':TT.LT,'>':TT.GT,'(':TT.LPAREN,')':TT.RPAREN,
                 '{':TT.LBRACE,'}':TT.RBRACE,',':TT.COMMA,'!':TT.NOT};
    if (map[c]) { tokens.push({type:map[c]}); i++; continue; }
    throw new Error(`অজানা চিহ্ন: '${c}'`);
  }
  tokens.push({type:TT.EOF});
  return tokens;
}

// ═══════════════════════════════════════════════════════
//  PARSER → AST
// ═══════════════════════════════════════════════════════
class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }
  peek() { return this.tokens[this.pos]; }
  consume(type) {
    const t = this.tokens[this.pos];
    if (type && t.type !== type) throw new Error(`প্রত্যাশিত ${type}, পাওয়া গেছে '${t.val||t.type}'`);
    this.pos++;
    return t;
  }
  match(...types) {
    if (types.includes(this.peek().type)) { this.pos++; return true; }
    return false;
  }

  parseProgram() {
    const stmts = [];
    while (this.peek().type !== TT.EOF) stmts.push(this.parseStatement());
    return { type:'Program', body: stmts };
  }

  parseStatement() {
    const t = this.peek();

    // ধরো — variable declaration
    if (t.type === TT.KW && t.val === 'ধরো') {
      this.consume();
      const name = this.consume(TT.IDENT).val;
      this.consume(TT.ASSIGN);
      const val = this.parseExpr();
      return { type:'VarDecl', name, val };
    }
    // দেখাও — print
    if (t.type === TT.KW && t.val === 'দেখাও') {
      this.consume();
      const val = this.parseExpr();
      return { type:'Print', val };
    }
    // ফেরত — return
    if (t.type === TT.KW && t.val === 'ফেরত') {
      this.consume();
      const val = this.peek().type !== TT.RBRACE ? this.parseExpr() : null;
      return { type:'Return', val };
    }
    // যদি — if
    if (t.type === TT.KW && t.val === 'যদি') {
      return this.parseIf();
    }
    // যতক্ষণ — while
    if (t.type === TT.KW && t.val === 'যতক্ষণ') {
      this.consume();
      const cond = this.parseExpr();
      const body = this.parseBlock();
      return { type:'While', cond, body };
    }
    // কাজ — function definition
    if (t.type === TT.KW && t.val === 'কাজ') {
      this.consume();
      const name = this.consume(TT.IDENT).val;
      this.consume(TT.LPAREN);
      const params = [];
      while (this.peek().type !== TT.RPAREN) {
        params.push(this.consume(TT.IDENT).val);
        if (this.peek().type === TT.COMMA) this.consume();
      }
      this.consume(TT.RPAREN);
      const body = this.parseBlock();
      return { type:'FuncDef', name, params, body };
    }
    // Assignment: ident = expr
    if (t.type === TT.IDENT && this.tokens[this.pos+1]?.type === TT.ASSIGN) {
      const name = this.consume(TT.IDENT).val;
      this.consume(TT.ASSIGN);
      const val = this.parseExpr();
      return { type:'Assign', name, val };
    }
    // Expression statement (e.g. function call)
    const expr = this.parseExpr();
    return { type:'ExprStmt', expr };
  }

  parseIf() {
    this.consume(); // যদি
    const cond = this.parseExpr();
    const then = this.parseBlock();
    let otherwise = null;
    if (this.peek().type === TT.KW && this.peek().val === 'নাহলে') {
      this.consume();
      if (this.peek().type === TT.KW && this.peek().val === 'যদি') {
        otherwise = [this.parseIf()];
      } else {
        otherwise = this.parseBlock();
      }
    }
    return { type:'If', cond, then, otherwise };
  }

  parseBlock() {
    this.consume(TT.LBRACE);
    const stmts = [];
    while (this.peek().type !== TT.RBRACE && this.peek().type !== TT.EOF)
      stmts.push(this.parseStatement());
    this.consume(TT.RBRACE);
    return stmts;
  }

  // Expressions — precedence climbing
  parseExpr()     { return this.parseOr(); }

  parseOr() {
    let l = this.parseAnd();
    while (this.peek().type === TT.OR) { this.consume(); l = {type:'BinOp',op:'||',l,r:this.parseAnd()}; }
    return l;
  }
  parseAnd() {
    let l = this.parseEquality();
    while (this.peek().type === TT.AND) { this.consume(); l = {type:'BinOp',op:'&&',l,r:this.parseEquality()}; }
    return l;
  }
  parseEquality() {
    let l = this.parseCompar();
    while ([TT.EQ,TT.NEQ].includes(this.peek().type)) {
      const op = this.consume().type; l = {type:'BinOp',op,l,r:this.parseCompar()};
    }
    return l;
  }
  parseCompar() {
    let l = this.parseAdd();
    while ([TT.LT,TT.LTE,TT.GT,TT.GTE].includes(this.peek().type)) {
      const op = this.consume().type; l = {type:'BinOp',op,l,r:this.parseAdd()};
    }
    return l;
  }
  parseAdd() {
    let l = this.parseMul();
    while ([TT.PLUS,TT.MINUS].includes(this.peek().type)) {
      const op = this.consume().type; l = {type:'BinOp',op,l,r:this.parseMul()};
    }
    return l;
  }
  parseMul() {
    let l = this.parseUnary();
    while ([TT.STAR,TT.SLASH,TT.MOD].includes(this.peek().type)) {
      const op = this.consume().type; l = {type:'BinOp',op,l,r:this.parseUnary()};
    }
    return l;
  }
  parseUnary() {
    if (this.peek().type === TT.MINUS) { this.consume(); return {type:'Unary',op:'-',r:this.parseUnary()}; }
    if (this.peek().type === TT.NOT)   { this.consume(); return {type:'Unary',op:'!',r:this.parseUnary()}; }
    return this.parseCall();
  }
  parseCall() {
    let expr = this.parsePrimary();
    while (this.peek().type === TT.LPAREN) {
      this.consume(TT.LPAREN);
      const args = [];
      while (this.peek().type !== TT.RPAREN) {
        args.push(this.parseExpr());
        if (this.peek().type === TT.COMMA) this.consume();
      }
      this.consume(TT.RPAREN);
      expr = {type:'Call', callee: expr, args};
    }
    return expr;
  }
  parsePrimary() {
    const t = this.peek();
    if (t.type === TT.NUM)  { this.consume(); return {type:'Num', val:t.val}; }
    if (t.type === TT.STR)  { this.consume(); return {type:'Str', val:t.val}; }
    if (t.type === TT.KW && t.val === 'সত্য')  { this.consume(); return {type:'Bool',val:true}; }
    if (t.type === TT.KW && t.val === 'মিথ্যা') { this.consume(); return {type:'Bool',val:false}; }
    if (t.type === TT.IDENT){ this.consume(); return {type:'Var', name:t.val}; }
    if (t.type === TT.LPAREN) {
      this.consume(); const e = this.parseExpr(); this.consume(TT.RPAREN); return e;
    }
    throw new Error(`অপ্রত্যাশিত টোকেন: '${t.val||t.type}'`);
  }
}

// ═══════════════════════════════════════════════════════
//  INTERPRETER
// ═══════════════════════════════════════════════════════
class ReturnSignal { constructor(v){ this.val = v; } }

class Interpreter {
  constructor(output) {
    this.globals   = {};
    this.output    = output; // callback(text)
    this.callDepth = 0;
  }

  run(node) {
    return this.execNode(node, this.globals);
  }

  execNode(node, env) {
    switch(node.type) {
      case 'Program': {
        let last;
        for (const s of node.body) last = this.execNode(s, env);
        return last;
      }
      case 'VarDecl':
        env[node.name] = this.eval(node.val, env);
        break;
      case 'Assign': {
        // Walk scope chain to find the variable
        let e = env;
        while (e && !(node.name in e)) e = e.__parent__;
        if (e) e[node.name] = this.eval(node.val, env);
        else   env[node.name] = this.eval(node.val, env);
        break;
      }
      case 'Print': {
        const v = this.eval(node.val, env);
        this.output(this.stringify(v));
        break;
      }
      case 'If': {
        if (this.truthy(this.eval(node.cond, env))) {
          return this.execBlock(node.then, env);
        } else if (node.otherwise) {
          return this.execBlock(node.otherwise, env);
        }
        break;
      }
      case 'While': {
        let iters = 0;
        while (this.truthy(this.eval(node.cond, env))) {
          if (++iters > 100000) throw new Error('অসীম লুপ শনাক্ত! (১০০,০০০ বার অতিক্রম)');
          const r = this.execBlock(node.body, env);
          if (r instanceof ReturnSignal) return r;
        }
        break;
      }
      case 'FuncDef':
        env[node.name] = { __fn__: true, params: node.params, body: node.body, closure: env };
        break;
      case 'Return':
        return new ReturnSignal(node.val ? this.eval(node.val, env) : null);
      case 'ExprStmt':
        return this.eval(node.expr, env);
    }
  }

  execBlock(stmts, parentEnv) {
    const env = { __parent__: parentEnv };
    for (const s of stmts) {
      const r = this.execNode(s, env);
      if (r instanceof ReturnSignal) return r;
    }
  }

  eval(node, env) {
    switch(node.type) {
      case 'Num':  return node.val;
      case 'Str':  return node.val;
      case 'Bool': return node.val;
      case 'Var': {
        let e = env;
        while (e) { if (node.name in e) return e[node.name]; e = e.__parent__; }
        throw new Error(`অপরিচিত চলক: '${node.name}'`);
      }
      case 'Unary': {
        const r = this.eval(node.r, env);
        if (node.op === '-') return -r;
        if (node.op === '!') return !this.truthy(r);
        break;
      }
      case 'BinOp': {
        const l = this.eval(node.l, env), r = this.eval(node.r, env);
        switch(node.op) {
          case '+':   return (typeof l === 'number' && typeof r === 'number')
                               ? l + r
                               : String(this.stringify(l)) + this.stringify(r);
          case '-':   return l - r;
          case '*':   return l * r;
          case '/':   if (r === 0) throw new Error('শূন্য দিয়ে ভাগ করা যায় না!'); return l / r;
          case '%':   return l % r;
          case '==':  return l === r;
          case '!=':  return l !== r;
          case '<':   return l < r;
          case '<=':  return l <= r;
          case '>':   return l > r;
          case '>=':  return l >= r;
          case '&&':  return this.truthy(l) && this.truthy(r);
          case '||':  return this.truthy(l) || this.truthy(r);
        }
        break;
      }
      case 'Call': {
        const fn = this.eval(node.callee, env);
        if (!fn || !fn.__fn__) throw new Error(`'${node.callee.name}' একটি ফাংশন নয়`);
        if (++this.callDepth > 500) throw new Error('স্ট্যাক ওভারফ্লো! অতিরিক্ত পুনরাবৃত্তি।');
        const fnEnv = { __parent__: fn.closure };
        fn.params.forEach((p, i) => fnEnv[p] = this.eval(node.args[i] || {type:'Num',val:0}, env));
        const r = this.execBlock(fn.body, fnEnv);
        this.callDepth--;
        return r instanceof ReturnSignal ? r.val : null;
      }
    }
    return null;
  }

  stringify(v) {
    if (v === null || v === undefined) return 'শূন্য';
    if (typeof v === 'boolean') return v ? 'সত্য' : 'মিথ্যা';
    if (typeof v === 'number')  return Number.isInteger(v) ? String(v) : v.toFixed(6).replace(/\.?0+$/, '');
    return String(v);
  }

  truthy(v) { return v !== false && v !== null && v !== undefined && v !== 0 && v !== ''; }
}

// ═══════════════════════════════════════════════════════
//  UI
// ═══════════════════════════════════════════════════════
const editor     = document.getElementById('editor');
const hlLayer    = document.getElementById('highlight');
const lineNums   = document.getElementById('lineNums');
const output     = document.getElementById('output');
const statusLine = document.getElementById('statusLine');
const statusMsg  = document.getElementById('statusMsg');

function doHighlight() {
  hlLayer.innerHTML = highlight(editor.value);
  // Build line numbers as newline-separated string (white-space:pre keeps each on its own row)
  const count = editor.value.split('\n').length;
  lineNums.textContent = Array.from({length: count}, (_, i) => i + 1).join('\n');
  hlLayer.scrollTop  = editor.scrollTop;
  hlLayer.scrollLeft = editor.scrollLeft;
}

editor.addEventListener('input', doHighlight);
editor.addEventListener('scroll', () => {
  hlLayer.scrollTop  = editor.scrollTop;
  hlLayer.scrollLeft = editor.scrollLeft;
});

editor.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const s = editor.selectionStart, en = editor.selectionEnd;
    editor.value = editor.value.substring(0, s) + '  ' + editor.value.substring(en);
    editor.selectionStart = editor.selectionEnd = s + 2;
    doHighlight();
  }
});

editor.addEventListener('keyup', () => {
  const txt = editor.value.substring(0, editor.selectionStart);
  const row  = txt.split('\n').length;
  const col  = txt.split('\n').pop().length + 1;
  statusLine.textContent = `লাইন ${row}, কলাম ${col}`;
});

// Output helper
function addLine(text, cls = 'out-line') {
  const span = document.createElement('span');
  span.className = cls;
  span.textContent = text;
  output.appendChild(span);
  output.scrollTop = output.scrollHeight;
}

// ── RUN ──
function runCode() {
  output.innerHTML = '';
  const code = editor.value.trim();
  if (!code) { addLine('কোড লিখুন এবং চালান।', 'out-line info'); return; }

  addLine('── চালু হচ্ছে ──────────────────', 'out-line sep');

  const t0 = performance.now();
  try {
    const tokens = tokenize(code);
    const ast    = new Parser(tokens).parseProgram();
    const interp = new Interpreter(text => addLine(text, 'out-line bn'));
    interp.run(ast);
    const ms = (performance.now() - t0).toFixed(1);
    addLine('── সম্পন্ন (' + ms + 'ms) ───────────', 'out-line sep');
    addLine('✓ সফলভাবে চলেছে', 'out-line ok');
    statusMsg.textContent = 'সফল ✓';
    statusMsg.style.color = 'var(--green)';
  } catch(err) {
    addLine('ত্রুটি: ' + err.message, 'out-line error');
    statusMsg.textContent = 'ত্রুটি ✗';
    statusMsg.style.color = 'var(--red)';
  }
  setTimeout(() => {
    statusMsg.textContent = 'প্রস্তুত';
    statusMsg.style.color = 'var(--accent)';
  }, 3000);
}

document.getElementById('runBtn').addEventListener('click', runCode);
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runCode(); }
});

document.getElementById('clearBtn').addEventListener('click', () => { output.innerHTML = ''; });

// Snippet buttons
document.querySelectorAll('[data-snippet]').forEach(btn => {
  btn.addEventListener('click', () => {
    editor.value = SNIPPETS[btn.dataset.snippet] || '';
    doHighlight();
    editor.focus();
  });
});

// Keyword-insert buttons
document.querySelectorAll('[data-insert]').forEach(btn => {
  btn.addEventListener('click', () => {
    const s   = editor.selectionStart, en = editor.selectionEnd;
    const ins = btn.dataset.insert;
    editor.value = editor.value.substring(0, s) + ins + editor.value.substring(en);
    editor.selectionStart = editor.selectionEnd = s + ins.length;
    doHighlight();
    editor.focus();
  });
});

// Init with hello-world snippet
editor.value = SNIPPETS.hello;
doHighlight();