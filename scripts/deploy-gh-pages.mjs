// 수동 배포: 설정 확인 → 빌드 → dist 를 gh-pages 브랜치로 push
//   npm run deploy
// (GitHub Actions 자동 배포를 켜면 이 스크립트는 필요 없습니다. README 참고)
import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';

const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts });
const remote = execSync('git remote get-url origin').toString().trim();

run('npm run check:config');
run('npm run build');
rmSync('dist/.git', { recursive: true, force: true });
const git = (args) => run(`git ${args}`, { cwd: 'dist' });
git('init -q -b gh-pages');
git('add -A');
git('-c user.name=deploy -c user.email=deploy@users.noreply.github.com commit -q -m "Deploy"');
git(`push -f ${remote} gh-pages`);
rmSync('dist/.git', { recursive: true, force: true });
console.log('✔ gh-pages 브랜치로 배포했습니다. 1~2분 뒤 사이트에 반영됩니다.');
