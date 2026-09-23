// 로컬 점검 전용: tests/fixtures 의 점검용 후기·딜 데이터로 개발 서버를 띄웁니다. (배포 빌드와 무관)
import { spawn } from 'node:child_process';
process.env.USE_FIXTURES = '1';
spawn('npx', ['astro', 'dev', '--port', '4322', ...process.argv.slice(2)], { stdio: 'inherit', shell: true, env: process.env });
