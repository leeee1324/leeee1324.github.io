/** 딜 등급 기준. 문구를 바꾸면 홈·최근 출정·운영 원칙 페이지에 함께 반영됩니다. */
export const TIERS = {
  bonghwa: {
    key: 'bonghwa',
    name: '최저가 떴다, 봉화를 울려라',
    short: '봉화',
    summary: '살펴볼 만한 일반 핫딜',
    detail:
      '배송비까지 더한 실구매가가 평소 확인되던 가격보다 낮아, 필요한 분이라면 한 번 살펴볼 만한 딜입니다.',
  },
  chuljeong: {
    key: 'chuljeong',
    name: '전군 출정하라',
    short: '출정',
    summary: '가격 조건이 특히 좋은 강력딜',
    detail:
      '실구매가가 최근 확인된 가격대보다 뚜렷하게 낮고, 조건(쿠폰·카드·수량 제한)이 까다롭지 않은 강력딜에만 붙입니다.',
  },
} as const;

export type TierKey = keyof typeof TIERS;
