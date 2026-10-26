import { spawn } from 'node:child_process';
import { mkdirSync, openSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const logs = resolve(root, '.local/codespaces');
mkdirSync(logs, { recursive: true });
const children = [];
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    try { process.kill(-child.pid, 'SIGTERM'); } catch {}
  }
  const finish = () => {
    rmSync(resolve(logs, 'supervisor.pid'), { force: true });
    process.exit(code);
  };
  setInterval(() => {
    if (children.every(child => child.exitCode !== null || child.signalCode !== null)) finish();
  }, 100);
  setTimeout(() => {
    for (const child of children) {
      try { process.kill(-child.pid, 'SIGKILL'); } catch {}
    }
    finish();
  }, 15000);
}
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => stop());
function launch(name, command, args, cwd, extraEnv = {}) {
  const fd = openSync(resolve(logs, `${name}.log`), 'a');
  const child = spawn(command, args, {
    cwd: resolve(root, cwd), detached: true,
    env: { ...process.env, ...extraEnv }, stdio: ['ignore', fd, fd]
  });
  children.push(child);
  child.on('error', error => { console.error(`${name}: ${error.message}`); stop(1); });
  child.on('exit', code => { if (!stopping) { console.error(`${name} encerrou: ${code}. Consulte os logs.`); stop(code || 1); } });
}
const extraEnv = {};
if (process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN) {
  extraEnv.CORS_ORIGINS = `https://${process.env.CODESPACE_NAME}-4200.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`;
}
launch('backend', 'bash', ['./mvnw', '--batch-mode', 'spring-boot:run'], 'backend', extraEnv);
const frontendArgs = ['start', '--', '--host', '0.0.0.0'];
if (process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN) {
  frontendArgs.push('--allowed-hosts', `${process.env.CODESPACE_NAME}-4200.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`);
}
launch('frontend', 'npm', frontendArgs, '.');
