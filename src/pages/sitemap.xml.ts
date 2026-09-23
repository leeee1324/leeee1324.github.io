import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const today = new Date().toISOString().slice(0, 10);
const day = (d: string | Date) => (typeof d === 'string' ? d : d.toISOString()).slice(0, 10);

export const GET: APIRoute = async ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const url = (path: string) => new URL(`${base}${path}`, site).toString();

  const [guides, deals, reviews] = await Promise.all([
    getCollection('guides'),
    getCollection('deals'),
    getCollection('reviews'),
  ]);
  const latest = (dates: string[]) => [...dates].sort().at(-1);
  const guideDates = guides.map((g) => day(g.data.updatedAt ?? g.data.publishedAt));

  const entries: { path: string; lastmod?: string }[] = [
    { path: '/', lastmod: latest(reviews.flatMap((r) => (r.data.writtenAt ? [day(r.data.writtenAt)] : []))) ?? today },
    { path: '/deals/', lastmod: latest(deals.map((d) => day(d.data.checkedAt))) ?? today },
    { path: '/guide/', lastmod: latest(guideDates) ?? today },
    ...guides.map((g, i) => ({ path: `/guide/${g.id}/`, lastmod: guideDates[i] })),
    { path: '/principles/', lastmod: today },
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((e) => `  <url><loc>${url(e.path)}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
