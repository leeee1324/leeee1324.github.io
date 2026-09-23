import config from '../../site.config.mjs';

export const SITE_NAME = '이순신의 할인대첩';
export const TAGLINE = '이곳은 아무 할인이나 핫딜이라고 부르지 않습니다.';
export const TAGLINE_SUB = '가격을 비교하고, 살 만한 가격이 왔을 때만 출정합니다.';

const OPEN_CHAT_PATTERN = /^https:\/\/open\.kakao\.com\/o\/[A-Za-z0-9]+$/;

/** 형식이 맞는 오픈채팅 URL만 반환. 비었거나 잘못된 값이면 null (가짜 링크로 연결하지 않음) */
// 로컬 점검(USE_FIXTURES=1)에서만 버튼 동작 확인용 주소를 씁니다. 배포 빌드에는 들어가지 않습니다.
const rawOpenChatUrl =
  !config.openChatUrl && process.env.USE_FIXTURES === '1' ? 'https://open.kakao.com/o/FixtureOnly' : config.openChatUrl;
export const openChatUrl: string | null = OPEN_CHAT_PATTERN.test(rawOpenChatUrl) ? rawOpenChatUrl : null;
export const naverSiteVerification: string = config.naverSiteVerification;
export const ga4Id: string = /^G-[A-Z0-9]+$/.test(config.ga4MeasurementId) ? config.ga4MeasurementId : '';
export const contactEmail: string = config.contactEmail;

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** 사이트 내부 경로에 base 를 붙입니다. href('/deals/') → '/yisunsin-deal/deals/' */
export const href = (path: string) => `${base}${path.startsWith('/') ? path : `/${path}`}`;

/** 절대 URL (canonical, og:image 용) */
export const absoluteUrl = (path: string) => new URL(href(path), import.meta.env.SITE).toString();

const won = new Intl.NumberFormat('ko-KR');
export const formatWon = (n: number) => `${won.format(n)}원`;

/** '2026-09-20' → '2026.09.20', '2026-09-20T21:30' → '2026.09.20 21:30' */
export function formatDate(value: string | Date) {
  const s = typeof value === 'string' ? value : value.toISOString().slice(0, 10);
  const [date, time] = s.split('T');
  const d = date.replaceAll('-', '.');
  return time ? `${d} ${time.slice(0, 5)}` : d;
}
