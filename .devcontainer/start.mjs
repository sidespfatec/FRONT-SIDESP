import { spawn } from 'node:child_process';
import { mkdirSync, openSync, readFileSync, writeFileSync, rmSync, closeSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const logs = resolve(root, '.local/codespaces');
const pidFile = resolve(logs, 'supervisor.pid');
mkdirSync(logs, { recursive: true });
let running = false;
try {
  const pid = Number(readFileSync(pidFile, 'utf8').trim());
  if (Number.isSafeInteger(pid) && pid > 0) { process.kill(pid, 0); running = true; }
} catch {}
if (running) {
  console.log('SIDESP já está iniciado. Logs: .local/codespaces/');
} else {
  const fd = openSync(resolve(logs, 'supervisor.log'), 'a');
  // detached cria outra sessão Linux; o encerramento do lifecycle não mata o serviço.
  const child = spawn(process.execPath, [resolve(root, '.devcontainer/run.mjs')], {
    cwd: root, detached: true, stdio: ['ignore', fd, fd], env: process.env
  });
  closeSync(fd);
  child.on('error', error => {
    rmSync(pidFile, { force: true });
    console.error(error.message);
    process.exitCode = 1;
  });
  if (child.pid) writeFileSync(pidFile, `${child.pid}\n`);
  child.unref();
  console.log('SIDESP iniciando. Abra a porta 4200 quando a compilação terminar. Logs: .local/codespaces/');
}
