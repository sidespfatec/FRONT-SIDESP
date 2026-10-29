import express from 'express';
import http from 'node:http';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const app = express();

/** Encaminha a API ao backend local, mantendo autenticação e respostas do servidor. */
app.use('/api', (req, res) => {
  const proxy = http.request({
    host: '127.0.0.1', port: 8080, path: req.originalUrl, method: req.method,
    headers: { ...req.headers, host: '127.0.0.1:8080' },
  }, upstream => {
    res.writeHead(upstream.statusCode, upstream.headers);
    upstream.pipe(res);
  });
  proxy.on('error', () => {
    if (!res.headersSent) res.status(502).end('Backend indisponível. Confira os logs.');
    else res.destroy();
  });
  req.on('aborted', () => proxy.destroy());
  req.pipe(proxy);
});

// Permite testar o último build quando o servidor de desenvolvimento estiver indisponível.
app.use(express.static(resolve(root, 'dist/SIDESP/browser')));
app.use((req, res) => res.sendFile(resolve(root, 'dist/SIDESP/browser/index.html')));
app.listen(4200, '0.0.0.0', () => console.log('Prévia SIDESP disponível na porta 4200.'));
