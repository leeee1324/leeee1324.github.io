// 배포 전에 site.config.mjs 의 필수 값을 검사합니다. 누락 시 exit 1.
import config from '../site.config.mjs';

const problems = [];
const warnings = [];

if (!config.openChatUrl) {
  problems.push('openChatUrl 이 비어 있습니다. 카카오톡 오픈채팅방 입장 URL을 넣어 주세요.');
} else if (!/^https:\/\/open\.kakao\.com\/o\/[A-Za-z0-9]+$/.test(config.openChatUrl)) {
  problems.push(`openChatUrl 형식이 올바르지 않습니다: ${config.openChatUrl} (예: https://open.kakao.com/o/abcd1234)`);
}

try {
  const u = new URL(config.siteUrl);
  if (u.protocol !== 'https:') problems.push('siteUrl 은 https:// 로 시작해야 합니다.');
} catch {
  problems.push('siteUrl 이 비어 있거나 올바른 주소가 아닙니다.');
}

if (!config.naverSiteVerification) warnings.push('naverSiteVerification 이 비어 있습니다. 네이버 서치어드바이저 소유 확인 전에 넣어 주세요.');
if (!config.ga4MeasurementId) warnings.push('ga4MeasurementId 가 비어 있습니다. 입장 버튼 클릭 수가 집계되지 않습니다.');

for (const w of warnings) console.warn(`⚠  ${w}`);
if (problems.length) {
  for (const p of problems) console.error(`✖  ${p}`);
  process.exit(1);
}
console.log('✔  배포에 필요한 설정이 모두 채워져 있습니다.');
