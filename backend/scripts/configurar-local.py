"""Executar da pasta backend: python scripts/configurar-local.py"""
from pathlib import Path
from getpass import getpass
import base64,secrets
p=Path('config/local.properties')
if p.exists():raise SystemExit('Configuração já existe. Preserve as chaves: CPF HMAC não permite recuperação.')
url=input('URL JDBC [jdbc:mysql://127.0.0.1:3306/sidesp]: ').strip() or 'jdbc:mysql://127.0.0.1:3306/sidesp'
user=input('Usuário LOCAL XAMPP [root]: ').strip() or 'root'
password=getpass('Senha do banco LOCAL (vazia se não houver): ')
def esc(s):
    """Escapa barras e quebras de linha conforme o formato Java .properties."""
    return s.replace('\\','\\\\').replace('\n','\\n').replace('\r','\\r')
lines=['DB_URL='+esc(url),'DB_USERNAME='+esc(user),'DB_PASSWORD='+esc(password)]
for name in ['CPF_HMAC_KEY','EMAIL_HMAC_KEY','EMAIL_ENCRYPTION_KEY','JWT_KEY']:lines.append(name+'='+base64.b64encode(secrets.token_bytes(32)).decode())
p.parent.mkdir(exist_ok=True);p.write_text('\n'.join(lines)+'\n',encoding='utf-8');p.chmod(0o600)
print('Configuração local criada. Não compartilhe esse arquivo e guarde as chaves com segurança.')
