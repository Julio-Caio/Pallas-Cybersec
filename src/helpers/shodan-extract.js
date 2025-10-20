#!/usr/bin/env node
// sanitize-extract.js
// Extrai apenas chaves permitidas de um arquivo JS/JSON-like sem avaliar o código.
// Uso: node sanitize-extract.js <arquivo>

const fs = require('fs');
if (process.argv.length !== 3) {
  console.error('Uso: node sanitize-extract.js <arquivo>');
  process.exit(2);
}
const infile = process.argv[2];
if (!fs.existsSync(infile)) { console.error('Arquivo não encontrado:', infile); process.exit(3); }

const txt = fs.readFileSync(infile, 'utf8');

// === CONFIG: altere as chaves que quer extrair ===
const KEYS = ['org', 'city', 'isp','asn','host','hostnames','domains','ip_str','product','port'];
// ===================================================

function isSpace(ch) { return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r'; }

function skipSpaces(s, i) {
  while (i < s.length && isSpace(s[i])) i++;
  return i;
}

// lê string iniciando em i (com ' ou ")
function readQuoted(s, i) {
  const quote = s[i];
  let out = '';
  i++; // pula a aspa inicial
  while (i < s.length) {
    const ch = s[i];
    if (ch === '\\') {
      // escapado: pega próximo char literalmente
      if (i + 1 < s.length) {
        out += s[i] + s[i+1];
        i += 2;
        continue;
      } else { break; }
    }
    if (ch === quote) { i++; break; }
    out += ch;
    i++;
  }
  return { str: out, idx: i };
}

// parse de um valor (string, number, null/true/false, array)
function parseValue(s, i) {
  i = skipSpaces(s, i);
  if (i >= s.length) return { val: null, idx: i };

  const ch = s[i];

  // string (com possível concatenação 'a' + 'b' ou adjacente 'a' 'b')
  if (ch === '\'' || ch === '"') {
    // captura e junta sequências de strings concatenadas por + ou apenas adjacentes
    let parts = [];
    while (true) {
      const q = readQuoted(s, i);
      parts.push(q.str);
      i = skipSpaces(s, q.idx);
      // aceita: + 'next'  ou apenas 'next' (adjacente)
      if (s[i] === '+') {
        i++;
        i = skipSpaces(s, i);
        if (s[i] === '"' || s[i] === '\'') continue;
        else break;
      }
      // adjacent quoted strings without + (ex: 'a' 'b')
      if (s[i] === '\'' || s[i] === '"') continue;
      break;
    }
    return { val: parts.join(''), idx: i };
  }

  // array
  if (ch === '[') {
    const arr = [];
    i++; // after '['
    i = skipSpaces(s, i);
    while (i < s.length && s[i] !== ']') {
      const res = parseValue(s, i);
      arr.push(res.val);
      i = skipSpaces(s, res.idx);
      if (s[i] === ',') { i = skipSpaces(s, i+1); continue; }
      // permissivo: aceita sem vírgula também
      i = skipSpaces(s, i);
      if (s[i] === ']') break;
      // se há um } ou { ou algo inesperado, tenta avançar
      if (s[i] === undefined) break;
      // se estiver preso, avança um char para evitar laço
      if (s[i] !== ',') { i++; i = skipSpaces(s, i); }
    }
    if (s[i] === ']') i++;
    return { val: arr, idx: i };
  }

  // number (inteiro/float)
  if (ch === '-' || (ch >= '0' && ch <= '9')) {
    let j = i;
    while (j < s.length && /[0-9eE+-.]/.test(s[j])) j++;
    const token = s.slice(i, j);
    const num = Number(token);
    if (!Number.isNaN(num)) return { val: num, idx: j };
    return { val: token, idx: j };
  }

  // null/true/false
  if (s.startsWith('null', i)) return { val: null, idx: i + 4 };
  if (s.startsWith('true', i)) return { val: true, idx: i + 4 };
  if (s.startsWith('false', i)) return { val: false, idx: i + 5 };

  // objeto — nós não parseamos objetos inteiros aqui; pegamos '{...}' como RAW ou tentamos extrair campos simples
  if (ch === '{') {
    // pega bloco balanceado e tenta extrair strings/números dentro dele com uma chamada recursiva simples
    let depth = 0, j = i;
    while (j < s.length) {
      if (s[j] === '{') depth++;
      else if (s[j] === '}') { depth--; if (depth === 0) { j++; break; } }
      else if (s[j] === '"' || s[j] === '\'') {
        // pular string
        const q = readQuoted(s, j);
        j = q.idx;
        continue;
      }
      j++;
    }
    const raw = s.slice(i, j);
    // tentativa: não vamos avaliar; retornamos raw para possível pós-processamento
    return { val: raw, idx: j };
  }

  // token desconhecido: lê até próxima vírgula/}]/\n
  let j = i;
  while (j < s.length && !/[,\]\}\n]/.test(s[j])) j++;
  const tok = s.slice(i, j).trim();
  return { val: tok, idx: j };
}

// Procura todas ocorrências de 'key' : value e extrai valores
function extractForKey(s, key) {
  const results = [];
  // regex que encontra a chave como word boundary seguido de :
  const re = new RegExp('\\b' + key + '\\b\\s*:', 'g');
  let m;
  while ((m = re.exec(s)) !== null) {
    let idx = m.index + m[0].length;
    // parse do valor a partir de idx
    const res = parseValue(s, idx);
    if (res.idx > idx) {
      results.push(res.val);
      re.lastIndex = res.idx;
    } else {
      // evitar laço infinito: avança 1 char
      re.lastIndex = m.index + 1;
    }
  }
  return results;
}

// Executa extração para cada chave e coloca em Set => array único
const output = {};
for (const k of KEYS) {
  const vals = extractForKey(txt, k);
  // achou arrays ou strings; normaliza: se elemento for array -> concat; se for raw object (string starting with '{') -> skip
  const set = new Set();
  for (const v of vals) {
    if (v === null || v === undefined) continue;
    if (Array.isArray(v)) {
      for (const e of v) {
        if (e !== null && e !== undefined) set.add(String(e));
      }
    } else {
      // se for raw object (abre com '{'), ignoramos — pois o usuário pediu campos simples
      const s = String(v);
      if (s.trim().startsWith('{')) continue;
      set.add(s);
    }
  }
  output[k] = Array.from(set);
}

// filtra chaves vazias (opcional)
for (const k of Object.keys(output)) if (output[k].length === 0) delete output[k];

console.log(JSON.stringify({ sanitized: output }, null, 2));