// =====================================================================
//  이순신의 할인대첩 — 사이트 설정 (이 파일 한 곳만 고치면 됩니다)
// =====================================================================
//  값이 비어 있으면 해당 기능은 꺼집니다. 가짜 링크나 임시 값을 넣지 마세요.
//  `npm run check:config` 로 배포 전에 빠진 값을 확인할 수 있습니다.
// =====================================================================

export default {
  /** 카카오톡 오픈채팅방 입장 URL (예: https://open.kakao.com/o/xxxxxxx) */
  openChatUrl: 'https://open.kakao.com/o/pIFobVNi',

  /**
   * 사이트 전체 주소. canonical, sitemap, 공유 이미지 주소가 모두 이 값을 기준으로 만들어집니다.
   * - 개인 도메인: 'https://example.co.kr'
   * - GitHub Pages 기본 주소: 'https://<계정>.github.io'
   */
  siteUrl: 'https://leeee1324.github.io',

  /** 네이버 서치어드바이저 > 사이트 소유확인 > HTML 태그의 content 값 */
  naverSiteVerification: '',

  /** (선택) Google Analytics 4 측정 ID. 입장 버튼 클릭 수를 이벤트로 집계합니다. 예: 'G-XXXXXXXXXX' */
  ga4MeasurementId: '',

  /** (선택) 문의용 이메일. 비워 두면 운영 원칙 페이지에 오픈채팅방 문의만 안내합니다. */
  contactEmail: '',
};
