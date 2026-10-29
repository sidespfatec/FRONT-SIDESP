import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const pidFile = fileURLToPath(new URL('../.local/codespaces/supervisor.pid', import.meta.url));
let pid;
function isSupervisor() {
  try {
    return readFileSync(`/proc/${pid}/cmdline`, 'utf8').split('\0')
      .some(arg => arg.endsWith('/.devcontainer/run.mjs') || arg === '.devcontainer/run.mjs');
  } catch { return false; }
}
try { pid = Number(readFileSync(pidFile, 'utf8').trim()); } catch {}
if (Number.isSafeInteger(pid) && pid > 0 && isSupervisor()) {
  process.kill(pid, 'SIGTERM');
  for (let attempt = 0; attempt < 200 && isSupervisor(); attempt++) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  if (isSupervisor()) throw new Error('O supervisor ainda não encerrou; confira os logs.');
}
console.log('Serviços SIDESP encerrados.');
