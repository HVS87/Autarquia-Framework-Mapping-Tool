# 🚀 Guia de Implementação — GitHub Pages

## Setup Rápido (5 minutos)

### 1. Crie um repositório no GitHub

```bash
# Clone ou crie um novo repo
git clone https://github.com/HVS87/Autarquia-Framework-Mapping-Tool.git
cd Autarquia-Framework-Mapping-Tool
```

### 2. Adicione os ficheiros

Os seguintes ficheiros devem estar na **raiz do repositório**:

```
.
├── index.html                (redireciona a raiz para a app — NÃO remover)
├── .nojekyll                 (desativa o Jekyll — NÃO remover)
├── network-framework.html    (a app)
├── manifest.json             (metadados da app instalável)
├── sw.js                     (service worker — instalação e uso sem rede)
├── icons/                    (ícones do ecrã principal — NÃO remover)
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon-maskable-192.png
│   ├── icon-maskable-512.png
│   └── apple-touch-icon.png
├── README.md                 (documentação)
├── DEPLOY.md                 (este ficheiro)
├── .gitignore               (exclusões Git)
└── LICENSE                  (opcional: MIT, GPL, etc.)
```

> **Importante:** sem `index.html`, o GitHub Pages mostra o `README.md` na raiz
> em vez da app. O `index.html` reencaminha a raiz para `network-framework.html`,
> e o `.nojekyll` impede o GitHub de processar o site com Jekyll.

> **Guardar como app:** `sw.js`, `manifest.json` e a pasta `icons/` têm de ficar
> na raiz, ao lado da app. Sem o service worker o Chrome nunca oferece instalar;
> sem ícones de 192px ou mais, também não. O service worker exige HTTPS — o
> GitHub Pages já serve em HTTPS, mas abrir o ficheiro directamente do disco
> (`file://`) não permite instalar. A app funciona na mesma, só não se instala.

### 3. Ative GitHub Pages

**GitHub Settings → Pages:**
- Source: Deploy from a branch
- Branch: `main` (ou o seu default)
- Folder: `/ (root)`
- Custom domain: (opcional; deixe em branco para usar `HVS87.github.io/Autarquia-Framework-Mapping-Tool`)

Clique **Save**.

### 4. Aguarde ~1–2 minutos

GitHub construirá o site. Visite:
```
https://HVS87.github.io/Autarquia-Framework-Mapping-Tool/
```

Pronto! 🎉

---

## Guardar como aplicação

Depois de publicada em HTTPS, a ferramenta instala-se no ecrã principal e passa
a abrir sem barra de endereço — e **sem internet**, o que numa junta com ligação
intermitente é o que faz a diferença.

Dentro da app, o botão está em **Painel → Setup → Guardar como app**. Só aparece
quando a instalação é mesmo possível.

| Onde | Como |
|---|---|
| **Android — Chrome, Edge, Samsung Internet** | O botão instala directamente. O browser também costuma oferecer sozinho. |
| **Android — Firefox** | Menu **⋮** → *Instalar* / *Adicionar ao ecrã principal*. O botão explica o caminho. |
| **iPhone e iPad — Safari** | Não há instalação automática em lado nenhum do iOS: **Partilhar** → *Adicionar ao ecrã principal*. O botão mostra os passos. |
| **iPhone e iPad — Chrome, Edge, Firefox** | O iOS só permite instalar a partir do Safari; a app diz isso e manda abrir lá. |
| **Windows, macOS, Linux — Chrome/Edge** | Ícone de instalação na barra de endereço, ou o botão dentro da app. |
| **macOS — Safari** | Ficheiro → *Adicionar à Dock* (Safari 17+). |

Uma vez instalada, o botão desaparece — não faz sentido continuar a oferecer.

### O que fica a funcionar sem rede

Toda a ferramenta: o 3D, os fluxogramas, as vistas, a edição e o histórico. Os
dados ficam no aparelho. Só precisam de internet, e apenas à primeira vez, as
exportações para **PDF** e **PowerPoint**, que buscam a biblioteca respectiva.

### Outras funcionalidades automáticas

- ✅ **Ícone próprio** no ecrã principal, incluindo formato *maskable* no Android
- ✅ **Theme color**: a barra do sistema toma a cor Calçada
- ✅ **Atalhos**: Nova rede e Organograma, no menu de contexto do ícone
- ✅ **Actualizações**: quando há versão nova, a app avisa e oferece recarregar
- ✅ **SEO**: JSON-LD structured data para motores de busca

## Personalizações Opcionais

### Domínio Personalizado

1. No GitHub Settings → Pages, adicione o seu domínio (ex: `mapeamento.cm-exemplo.pt`)
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
