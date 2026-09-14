# Prepara a pasta "app" que vai dentro do executável: copia a aplicação e os
# ícones, descarrega o three.js para o .exe funcionar sem internet, e aponta
# a página para essa cópia local. Corre antes do electron-builder (npm run build).
$ErrorActionPreference="Stop"
$raiz=Split-Path -Parent $PSScriptRoot
$app=Join-Path $PSScriptRoot "app"
New-Item -ItemType Directory -Force (Join-Path $app "vendor") | Out-Null
New-Item -ItemType Directory -Force (Join-Path $app "icons") | Out-Null

Copy-Item (Join-Path $raiz "icons\*") (Join-Path $app "icons") -Force
$html=Get-Content (Join-Path $raiz "network-framework.html") -Raw -Encoding UTF8

# O three.js vem de um CDN na versão web; no .exe fica dentro do pacote.
$cdn='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
$local=Join-Path $app "vendor\three.min.js"
if(-not (Test-Path $local)){
  Write-Host "A descarregar three.js r128…"
  Invoke-WebRequest -Uri $cdn -OutFile $local -UseBasicParsing
}
$html=$html.Replace('<script src="'+$cdn+'" crossorigin="anonymous"></script>','<script src="vendor/three.min.js"></script>')
if($html -notmatch 'vendor/three.min.js'){ throw "Não encontrei o <script> do three.js para apontar à cópia local." }

# O service worker é da versão web (instalação como PWA); no .exe não faz sentido.
$html=$html -replace 'navigator\.serviceWorker\.register\([^)]*\)','Promise.resolve()'

[IO.File]::WriteAllText((Join-Path $app "network-framework.html"),$html,(New-Object Text.UTF8Encoding $false))
Write-Host "Pasta app preparada em $app"
