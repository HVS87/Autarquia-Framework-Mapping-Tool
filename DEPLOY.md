# 🚀 Guia de Implementação — GitHub Pages

## Setup Rápido (5 minutos)

### 1. Crie um repositório no GitHub

```bash
# Clone ou crie um novo repo
git clone https://github.com/seu-utilizador/orchestration-framework.git
cd orchestration-framework
```

### 2. Adicione os ficheiros

Os seguintes ficheiros devem estar na **raiz do repositório**:

```
.
├── index.html                (redireciona a raiz para a app — NÃO remover)
├── .nojekyll                 (desativa o Jekyll — NÃO remover)
├── network-framework.html    (a app — 192KB)
├── manifest.json             (metadados PWA)
├── README.md                 (documentação)
├── DEPLOY.md                 (este ficheiro)
├── .gitignore               (exclusões Git)
└── LICENSE                  (opcional: MIT, GPL, etc.)
```

> **Importante:** sem `index.html`, o GitHub Pages mostra o `README.md` na raiz
> em vez da app. O `index.html` reencaminha a raiz para `network-framework.html`,
> e o `.nojekyll` impede o GitHub de processar o site com Jekyll.

### 3. Ative GitHub Pages

**GitHub Settings → Pages:**
- Source: Deploy from a branch
- Branch: `main` (ou o seu default)
- Folder: `/ (root)`
- Custom domain: (opcional; deixe em branco para usar `username.github.io/orchestration-framework`)

Clique **Save**.

### 4. Aguarde ~1–2 minutos

GitHub construirá o site. Visite:
```
https://seu-utilizador.github.io/orchestration-framework/
```

Pronto! 🎉

---

## Funcionalidades Habilitadas Automaticamente

- ✅ **PWA (Progressive Web App)**: Instale no ecrã inicial (Chrome, Edge, Firefox, Safari)
- ✅ **Offline**: Funciona offline após primeiro carregamento
- ✅ **Ícone**: Logótipo da app personalizado
- ✅ **Theme Color**: Barra de endereço toma a cor Calçada
- ✅ **Manifest Shortcuts**: Atalhos rápidos (Nova org, Organograma)
- ✅ **SEO**: JSON-LD structured data para motores de busca

## Personalizações Opcionais

### Domínio Personalizado

1. No GitHub Settings → Pages, adicione o seu domínio (ex: `orchestration.cm-exemplo.pt`)
2. Configure os DNS records da sua autarquia:
   - A: `185.199.108.153`
   - CNAME: `seu-utilizador.github.io`

### Personalizar Cores PWA

Edite `manifest.json`:
```json
{
  "theme_color": "#775212",        // Cor da barra de endereço
  "background_color": "#A89A78"    // Cor de arranque da app
}
```

### HTTPS (Habilitado por Padrão)

GitHub Pages serve HTTPS gratuitamente — nenhuma configuração necessária. A app é 100% segura.

### Offline-First

O Service Worker é construído automaticamente no navegador — não precisa de configuração.

---

## Troubleshooting

**"Página em branco"**
- Aguarde 2-3 minutos pelo build do GitHub Pages
- Limpe a cache do browser (Ctrl+Shift+Del)
- Verifique se `network-framework.html` está na raiz

**"Manifest.json not found"**
- Confirme que o ficheiro está na raiz (não numa pasta)
- GitHub Pages diferencia maiúsculas/minúsculas — use o nome exato

**"PWA não instala"**
- Apenas Chrome, Edge, Firefox e Safari suportam PWA
- Safari no macOS: Menu → Ficheiro → Abrir como Web App
- iOS/Safari: Toque Partilhar → Adicionar ao Ecrã Inicial

**"Tour ou dados não carregam"**
- Confirme que o `network-framework.html` foi inlined com o `app.js` (veja `<script>` na fonte da página)
- Se vir `<script src="app.js"></script>`, o build foi incompleto

---

## Build Local (para testes antes de push)

```bash
# Instale um servidor HTTP simples (Python 3)
python3 -m http.server 8000

# Aceda em: http://localhost:8000/network-framework.html
```

---

## Atualizar a App

1. Edite `network-framework.html` localmente
2. Commit & push para `main`
3. GitHub Pages rebuilda automaticamente (5-30 segundos)
4. Publicado! 🚀

---

## Licença & Créditos

- **Three.js**: WebGL rendering (MIT)
- **jsPDF / PptxGenJS**: Export (MIT)
- **Desenvolvido para**: Modernização da administração autárquica portuguesa

---

**Questões?** Abra uma issue no repositório ou contacte o administrador.

Versão: 2.0 • Platform: GitHub Pages • PWA: ✓ Enabled
