# 이순신의 할인대첩 — 공식 웹사이트

카카오톡 핫딜 오픈채팅방 소개 사이트입니다. Astro + TypeScript 정적 사이트이고, GitHub Pages에 배포합니다.

## 배포 주소

- **https://leeee1324.github.io/**
- 저장소: https://github.com/leeee1324/leeee1324.github.io (빌드 결과는 `gh-pages` 브랜치에서 서비스)

### 다시 배포하기 (지금 방식)

내용을 수정한 뒤 아래 명령 하나로 확인 → 빌드 → `gh-pages` 브랜치 반영까지 진행됩니다. **`openChatUrl`이 비어 있으면 배포가 멈춥니다.** 가짜 링크가 공개되지 않게 막아 둔 것입니다.

```bash
npm run deploy
```

### (선택) push만 하면 자동 배포되게 바꾸기

GitHub Actions 파일을 올리려면 로그인 토큰에 `workflow` 권한이 필요합니다.

1. `gh auth refresh -h github.com -s workflow` 실행 후 브라우저에서 **leeee1324** 계정으로 승인
2. `deploy/github-pages-workflow.yml`을 `.github/workflows/deploy.yml`로 옮기고 push
3. 저장소 Settings → Pages → Source를 **GitHub Actions**로 변경

## 설정 바꾸기: `site.config.mjs` 한 곳

| 항목 | 내용 |
| --- | --- |
| `openChatUrl` | 오픈채팅방 입장 URL (`https://open.kakao.com/o/...`). **필수** |
| `siteUrl` | 사이트 주소. 개인 도메인을 쓰면 `https://도메인`으로 바꾸세요 (CNAME은 자동 생성). |
| `naverSiteVerification` | 네이버 서치어드바이저 소유 확인 값 |
| `ga4MeasurementId` | (선택) GA4 측정 ID. 입장 버튼 클릭 수를 집계합니다. |
| `contactEmail` | (선택) 문의 이메일 |

`npm run check:config`를 실행하면 빠진 값을 알려 줍니다.

## 후기 추가: `src/data/reviews.json`

**실제 입장자가 쓰고 사이트 게시에 동의한 후기만** 넣으세요. 후기가 하나도 없으면 홈에 "실제 후기가 쌓이면 이곳에 소개됩니다"가 표시됩니다. 1개 이상이면 4초 간격으로 자동으로 넘어가는 슬라이더가 됩니다(일시 정지 버튼 포함).

```json
{
  "id": "review-08",
  "comment": "후기 문장 (160자 이내, 필수)",
  "order": 8,
  "consent": true
}
```

- 선택 항목(알고 있을 때만 적고, 추측해서 채우지 마세요): `product`(상품명), `paidPrice`(실제 구매가), `savedAmount`(절약한 금액), `writtenAt`(작성일, `2026-10-01`), `nickname`(닉네임). 적은 항목만 카드에 표시됩니다.
- `order`가 작을수록 먼저 나옵니다.
- `consent`가 `true`가 아니면 빌드가 실패합니다.
- 최근 출정 딜은 `src/data/deals.json`에 넣습니다. 필드: `id, title, tier("bonghwa"|"chuljeong"), store, price, shippingFee, checkedAt`와 선택 필드 `listPrice, url, affiliate, sponsored, note`. 제휴 링크나 광고는 `affiliate: true` 또는 `sponsored: true`로 표시하세요.
- 가이드 글은 `src/content/guides/*.md`에 추가합니다. 머리말(frontmatter)에는 `title, description, publishedAt`를 씁니다. 글을 추가한 뒤 `npm run og`를 실행하면 그 글의 공유 이미지가 만들어집니다 (Windows PC에서 실행).
- 히어로 이미지는 `src/assets/hero-emblem.webp`입니다. 같은 이름으로 바꿔 넣으면 빌드할 때 자동으로 AVIF/WebP 여러 크기로 최적화됩니다.
- 딜 등급 문구는 `src/lib/criteria.ts`에서 고칩니다.

수정한 뒤 `npm run deploy`로 배포하세요. (자동 배포를 켰다면 GitHub 웹에서 파일을 고치고 커밋해도 다시 배포됩니다.)

## 네이버 서치어드바이저 등록 순서

1. [searchadvisor.naver.com](https://searchadvisor.naver.com) → 웹마스터 도구 → 사이트 등록에 `siteUrl`을 입력합니다.
2. 소유확인 방법으로 **HTML 태그**를 고르고, `content="..."` 안의 값만 `naverSiteVerification`에 넣은 뒤 push합니다.
3. 배포가 끝나면 서치어드바이저에서 **소유확인**을 누릅니다.
4. 요청 → **사이트맵 제출**에 `sitemap.xml`을 입력합니다 (예: `https://도메인/sitemap.xml`).
5. 검증 → **robots.txt** 확인, 요청 → **웹 페이지 수집**에 홈 주소를 입력합니다.


## 클릭 측정

모든 입장 버튼은 클릭하면 GA4 이벤트 `open_chat_click`을 보냅니다. `cta_location` 값은 `hero`, `sticky`, `footer`, `guide-article`, `principles` 중 하나입니다. 이 숫자는 **버튼 클릭 수**입니다. 실제로 채팅방에 입장했는지는 알 수 없습니다.

## 로컬 명령

```bash
npm install
npm run dev            # 개발 서버
npm run dev:fixtures   # 점검용 가짜 데이터로 슬라이더·딜 목록 확인 (배포에는 쓰이지 않음)
npm run build          # 타입 검사 + 빌드 (dist/)
npm run preview        # 빌드 결과 미리보기
```
