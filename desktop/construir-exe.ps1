# Constrói o .exe (portátil + instalador) a partir da pasta desktop.
# Requer Node.js 18+ (https://nodejs.org) — instala-se uma vez com:
#   winget install OpenJS.NodeJS.LTS
# Depois, nesta pasta:  .\construir-exe.ps1
$ErrorActionPreference="Stop"
Set-Location $PSScriptRoot
if(-not (Get-Command node -ErrorAction SilentlyContinue)){
  Write-Host "Node.js não encontrado. Instale com:  winget install OpenJS.NodeJS.LTS" -ForegroundColor Yellow
  exit 1
}
if(-not (Test-Path "node_modules")){ npm install }
npm run build
if($LASTEXITCODE -ne 0){ Write-Host "O electron-builder falhou (código $LASTEXITCODE) — veja as mensagens acima." -ForegroundColor Red; exit $LASTEXITCODE }
Write-Host ""
Write-Host "Pronto. Os executáveis estão em desktop\dist:" -ForegroundColor Green
Get-ChildItem dist -Filter *.exe | ForEach-Object { Write-Host ("  " + $_.Name) }
Write-Host "O portátil corre onde estiver; a pasta 'autosaves' nasce ao lado dele."
