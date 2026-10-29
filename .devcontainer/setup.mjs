import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

// O workspace preserva estas chaves entre reinícios e rebuilds do mesmo Codespace.
const root = fileURLToPath(new URL('../', import.meta.url));
const config = resolve(root, 'backend/config/local.properties');
mkdirSync(resolve(root, 'backend/config'), { recursive: true });
if (!existsSync(config)) {
  const names = ['CPF_HMAC_KEY', 'EMAIL_HMAC_KEY', 'EMAIL_ENCRYPTION_KEY', 'JWT_KEY'];
  writeFileSync(config, names.map(name => `${name}=${randomBytes(32).toString('base64')}`).join('\n') + '\n', { mode: 0o600, flag: 'wx' });
  console.log('Chaves de desenvolvimento criadas; não serão substituídas.');
} else {
  console.log('Configuração existente preservada.');
}
