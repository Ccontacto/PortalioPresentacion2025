import { spawn } from 'node:child_process';

const PORTFOLIO_PATH = '/portafolio/JoseCarlos';

const env = {
  ...process.env,
  PORTFOLIO_BASE_PATH: `${PORTFOLIO_PATH}/`,
  VITE_PORTFOLIO_MOUNT: PORTFOLIO_PATH
};

const runner = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const child = spawn(runner, ['run', 'build'], {
  env,
  stdio: 'inherit',
  shell: false
});

child.on('exit', code => {
  process.exit(code ?? 0);
});
