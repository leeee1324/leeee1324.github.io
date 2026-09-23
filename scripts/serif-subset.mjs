// 빌드 후처리: 페이지마다 명조(Noto Serif KR)로 표시되는 글자만 모아
// Google Fonts `text=` 서브셋 URL로 바꿉니다. 전체 한글 폰트(약 1MB) 대신 수십 KB만 내려받습니다.
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SERIF_PLACEHOLDER = '__SERIF_TEXT__';

// 명조를 쓰는 요소: 제목(h1~h3), 로고 이름, 번호
const PATTERNS = [
  /<(h1|h2|h3)\b[^>]*>([\s\S]*?)<\/\1>/g,
  /<(span|div)\b[^>]*class="[^"]*\b(?:brand__name|site-footer__brand|num)\b[^"]*"[^>]*>([\s\S]*?)<\/\1>/g,
];

const decode = (s) =>
  s.replace(/<[^>]+>/g, '').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
  });
}

export function subsetSerif(distDir) {
  for (const file of walk(distDir)) {
    const html = readFileSync(file, 'utf8');
    if (!html.includes(SERIF_PLACEHOLDER)) continue;
    const chars = new Set('0123456789');
    for (const re of PATTERNS) for (const m of html.matchAll(re)) for (const ch of decode(m.at(-1))) if (ch.trim()) chars.add(ch);
    const text = encodeURIComponent([...chars].sort().join(''));
    writeFileSync(file, html.replaceAll(SERIF_PLACEHOLDER, text));
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) subsetSerif(process.argv[2] ?? 'dist');
