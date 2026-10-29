# Execute da pasta backend. Não recria chaves existentes.
$ErrorActionPreference = 'Stop'
$destino = Join-Path (Get-Location) 'config/local.properties'
if (Test-Path $destino) { throw 'Configuração já existe. Preserve as chaves; não é possível recuperar CPF pelo hash.' }
$url = Read-Host 'URL JDBC (Enter = jdbc:mysql://127.0.0.1:3306/sidesp)'
if (-not $url) { $url = 'jdbc:mysql://127.0.0.1:3306/sidesp' }
$usuario = Read-Host 'Usuário LOCAL XAMPP (Enter = root)'
if (-not $usuario) { $usuario = 'root' }
$segura = Read-Host 'Senha do banco LOCAL (Enter se vazia)' -AsSecureString
$senha = [System.Net.NetworkCredential]::new('', $segura).Password
# Escapa caracteres especiais do formato .properties para preservar a senha/URL digitada.
function Escapar([string]$valor) { return $valor.Replace('\','\\').Replace("`n",'\n').Replace("`r",'\r') }
$linhas = @()
$linhas += 'DB_URL=' + (Escapar $url)
$linhas += 'DB_USERNAME=' + (Escapar $usuario)
$linhas += 'DB_PASSWORD=' + (Escapar $senha)
$gerador = [System.Security.Cryptography.RandomNumberGenerator]::Create()
foreach ($nome in @('CPF_HMAC_KEY','EMAIL_HMAC_KEY','EMAIL_ENCRYPTION_KEY','JWT_KEY')) {
  $bytes = New-Object byte[] 32
  $gerador.GetBytes($bytes)
  $linhas += $nome + '=' + [Convert]::ToBase64String($bytes)
}
$gerador.Dispose()
New-Item -ItemType Directory -Force 'config' | Out-Null
[System.IO.File]::WriteAllLines($destino, $linhas, [System.Text.UTF8Encoding]::new($false))
Write-Host 'Configuração local criada. Proteja este arquivo e mantenha backup das chaves.'
