// 공유 이미지(1200x630 PNG)와 아이콘을 만듭니다. 한글 글꼴이 있는 PC(Windows: 맑은 고딕)에서 실행하세요.
//   npm run og
// 가이드 글을 추가했다면 다시 실행하면 글별 공유 이미지(public/og/guide-<파일명>.png)가 생깁니다.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const OUT = 'public/og';
mkdirSync(OUT, { recursive: true });

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// 한글 제목을 대략 글자 수 기준으로 줄바꿈 (공백 단위)
function wrap(text, max) {
  const lines = [];
  let line = '';
  for (const word of text.split(' ')) {
    if ((line + ' ' + word).trim().length > max && line) {
      lines.push(line);
      line = word;
    } else line = (line + ' ' + word).trim();
  }
  if (line) lines.push(line);
  return lines;
}

const LOGO = `
  <rect width="48" height="48" rx="12" fill="#0a2149"/>
  <rect x="1" y="1" width="46" height="46" rx="11" fill="none" stroke="#d9b46c" stroke-opacity=".6" stroke-width="1.5"/>
  <path d="M24 8.5c3.8 4.3 6.5 7.8 6.5 11.8A6.5 6.5 0 0 1 24 26.8a6.5 6.5 0 0 1-6.5-6.5c0-2.5 1.2-4.5 2.8-6.3.3 2 1.4 3.3 2.7 3.8-.4-2.9.2-5.9 1-9.3Z" fill="#e0533a"/>
  <path d="M24 16.8c1.8 2 2.9 3.6 2.9 5.2a2.9 2.9 0 0 1-5.8 0c0-1.4.8-2.5 1.7-3.4.1.8.5 1.4 1 1.6-.1-1.2 0-2.2.2-3.4Z" fill="#f4c25b"/>
  <path d="M14.5 28.4h19l-2.2 4.2H16.7l-2.2-4.2Z" fill="#c9a55a"/>
  <path d="M17.6 33.8h12.8l1.6 5.4H16l1.6-5.4Z" fill="#c9a55a" fill-opacity=".75"/>`;

const FONT = "'Malgun Gothic','Apple SD Gothic Neo','Noto Sans KR',sans-serif";

function card({ kicker, title, sub, art }) {
  const lines = wrap(title, art ? 10 : 16).slice(0, 3);
  const size = art ? 54 : lines.length > 2 ? 64 : 76;
  const startY = 330 - ((lines.length - 1) * size * 1.2) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="bg" cx="0.5" cy="0" r="1.1"><stop offset="0" stop-color="#0b2551"/><stop offset="0.6" stop-color="#081a3a"/><stop offset="1" stop-color="#050c1c"/></radialGradient>
    <radialGradient id="glow" cx="${art ? 0.78 : 1}" cy="${art ? 0.5 : 0}" r="0.55"><stop offset="0" stop-color="#2856a0" stop-opacity=".5"/><stop offset="1" stop-color="#2856a0" stop-opacity="0"/></radialGradient>
    <linearGradient id="rule" x1="0" x2="1"><stop offset="0" stop-color="#d9b46c" stop-opacity="0"/><stop offset=".5" stop-color="#d9b46c"/><stop offset="1" stop-color="#d9b46c" stop-opacity="0"/></linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="628" width="1200" height="2" fill="url(#rule)"/>
  <g transform="translate(80 70) scale(1.5)">${LOGO}</g>
  <text x="170" y="122" font-family="${FONT}" font-size="36" font-weight="700" fill="#ffffff">이순신의 할인대첩</text>
  <text x="80" y="${startY - size - 22}" font-family="${FONT}" font-size="28" font-weight="700" letter-spacing="3" fill="#d9b46c">${esc(kicker)}</text>
  ${lines.map((l, i) => `<text x="80" y="${startY + i * size * 1.2}" font-family="${FONT}" font-size="${size}" font-weight="700" fill="#ffffff">${esc(l)}</text>`).join('\n  ')}
  <text x="80" y="540" font-family="${FONT}" font-size="30" fill="#b9c3d8">${esc(sub)}</text>
</svg>`;
}

const pages = [
  { file: 'home.png', kicker: '카카오톡 핫딜 오픈채팅방', title: '이곳은 아무 할인이나 핫딜이라고 부르지 않습니다.', sub: '살 만한 가격이 왔을 때만 출정합니다', art: true },
  { file: 'deals.png', kicker: '최근 출정', title: '채팅방에서 실제로 소개한 딜', sub: '가격은 확인 시점 기준이며 바뀔 수 있습니다' },
  { file: 'guide.png', kicker: '핫딜 가이드', title: '싸 보이는 가격 말고, 실제로 싼 가격', sub: '배송비 포함 비교 · 할인율 확인법' },
  { file: 'principles.png', kicker: '운영 원칙', title: '믿고 볼 수 있도록 지키는 원칙', sub: '딜 선정 · 제휴 표시 · 가격 변동 · 문의' },
];

const GUIDE_DIR = 'src/content/guides';
for (const f of readdirSync(GUIDE_DIR).filter((f) => f.endsWith('.md'))) {
  const src = readFileSync(`${GUIDE_DIR}/${f}`, 'utf8');
  const title = src.match(/^title:\s*(.+)$/m)?.[1].trim().replace(/^["']|["']$/g, '');
  if (title) pages.push({ file: `guide-${f.replace(/\.md$/, '')}.png`, kicker: '핫딜 가이드', title, sub: '이순신의 할인대첩 가이드' });
}

// 히어로 엠블럼(원형만 남기고 모서리는 투명하게)
const EMBLEM = 520;
const emblem = await sharp('src/assets/hero-emblem.webp')
  .resize(EMBLEM, EMBLEM)
  .composite([{ input: Buffer.from(`<svg width="${EMBLEM}" height="${EMBLEM}"><circle cx="${EMBLEM / 2}" cy="${EMBLEM / 2}" r="${EMBLEM / 2 - 2}" fill="#fff"/></svg>`), blend: 'dest-in' }])
  .png()
  .toBuffer();

for (const p of pages) {
  const base = sharp(Buffer.from(card(p)));
  if (p.art) base.composite([{ input: emblem, left: 1200 - EMBLEM - 40, top: (630 - EMBLEM) / 2 }]);
  await base.png({ compressionLevel: 9 }).toFile(`${OUT}/${p.file}`);
  console.log(`og/${p.file}`);
}

// 아이콘
const icon = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48">${LOGO}</svg>`;
writeFileSync('public/favicon.svg', icon(48));
await sharp(Buffer.from(icon(180))).png().toFile('public/apple-touch-icon.png');
console.log('favicon.svg, apple-touch-icon.png');
