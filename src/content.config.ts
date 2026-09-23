import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 로컬 점검용: USE_FIXTURES=1 일 때만 tests/fixtures 의 검증용 데이터를 읽습니다.
// 배포(GitHub Actions) 빌드에서는 절대 켜지지 않습니다.
const useFixtures = process.env.USE_FIXTURES === '1';
const dataPath = (name: string) => (useFixtures ? `tests/fixtures/${name}` : `src/data/${name}`);

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?/, 'YYYY-MM-DD 또는 YYYY-MM-DDTHH:mm 형식');

/** 득템 후기: 실제 입장자가 작성하고 게시에 동의한 후기만 등록.
 *  후기 문장(comment)만 필수이고, 상품명·가격·절약 금액·작성 시점은 알고 있을 때만 적습니다(추측해서 채우지 않기). */
const reviews = defineCollection({
  loader: file(dataPath('reviews.json')),
  schema: z.object({
    id: z.string(),
    comment: z.string().min(1).max(160),
    product: z.string().min(1).optional(),
    paidPrice: z.number().int().positive().optional(),
    savedAmount: z.number().int().nonnegative().optional(),
    writtenAt: isoDate.optional(),
    nickname: z.string().optional(),
    /** 표시 순서 (작은 숫자가 먼저). 없으면 작성 시점 최신순 → 파일 순서 */
    order: z.number().optional(),
    /** 작성자가 사이트 게시에 동의했는지. true 가 아니면 빌드가 실패합니다. */
    consent: z.literal(true),
  }),
});

/** 최근 출정: 오픈채팅방에서 실제로 소개한 딜만 등록 */
const deals = defineCollection({
  loader: file(dataPath('deals.json')),
  schema: z.object({
    id: z.string(),
    title: z.string().min(1),
    tier: z.enum(['bonghwa', 'chuljeong']),
    store: z.string().min(1),
    price: z.number().int().positive(),
    shippingFee: z.number().int().nonnegative(),
    listPrice: z.number().int().positive().optional(),
    checkedAt: isoDate,
    url: z.url().optional(),
    /** 제휴(수수료) 링크 여부 */
    affiliate: z.boolean().default(false),
    /** 광고·협찬 여부 */
    sponsored: z.boolean().default(false),
    note: z.string().max(140).optional(),
  }),
});

/** 핫딜 가이드 글 (Markdown) */
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    order: z.number().default(100),
    ogImage: z.string().optional(),
  }),
});

export const collections = { reviews, deals, guides };
