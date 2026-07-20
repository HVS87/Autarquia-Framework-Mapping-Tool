# 🤝 Contribuir

Obrigado por querer melhorar o Orchestration Framework!

## Como Começar

1. **Fork** o repositório no GitHub
2. **Clone** para a sua máquina:
   ```bash
   git clone https://github.com/seu-utilizador/orchestration-framework.git
   cd orchestration-framework
   ```
3. **Edite** os ficheiros:
   - **App logic**: `app.js` (em `/home/claude/` se for o dev local)
   - **Estilos**: `<style>` tag dentro de `network-framework.html`
   - **Documentação**: `README.md`, `DEPLOY.md`
4. **Teste** localmente:
   ```bash
   python3 -m http.server 8000
   # Abra http://localhost:8000/network-framework.html
   ```
5. **Commit & Push**:
   ```bash
   git add .
   git commit -m "Melhor: descrição clara das mudanças"
   git push origin feature-branch
   ```
6. **Abra um Pull Request** no GitHub

## Directrizes

### Código
- Use JavaScript vanilla (sem frameworks)
- Respeite `prefers-reduced-motion` e acessibilidade
- Teste em Chrome, Firefox, Safari (mobile e desktop)
- Mantenha o ficheiro em **uma única página** (`network-framework.html`)

### Comentários
- Escreva comentários em **inglês** para a lógica principal
- PT-PT para labels de UI que aparecem na interface

### Pull Requests
- **Uma feature por PR** (mais fácil de rever)
- Descreva o problema e a solução
- Inclua screenshots se for mudança visual
- Mencione issues relacionadas (`#123`)

### Issues
- Procure issues existentes antes de abrir uma nova
- Descreva os passos para reproduzir
- Inclua versão do navegador e SO

## Área de Foco

Bem-vindo para:

- 🐛 **Bug fixes** — corrigir crashes, layouts quebrados, etc.
- ✨ **Features** — novos temas, modos de visualização, export formats
- 🎨 **UX melhorias** — animações, tooltips, gestos
- 🌐 **Internacionalização** — traduzir para outras línguas
- 📖 **Documentação** — exemplos, tutoriais, README

Evite:

- ⚠️ Dependências externas (não bibliotecas, use CDN se necessário)
- ⚠️ Grandes refactors sem discussão prévia
- ⚠️ Mudanças arquitectónicas radicais

## Arquitetura do Projecto

```
network-framework.html
├── <meta> + PWA setup
├── <style> 
│   ├── CSS variables (temas)
│   ├── Layout (glass, panels, stepper)
│   └── Animations (micro-interactions)
├── <body>
│   ├── #stage (canvas 3D)
│   ├── #header (org name + buttons)
│   ├── #panel (left sidebar: Nodes, Agents, Procedimentos, Groups)
│   ├── #detail (right sidebar: node/task/agent details)
│   ├── #stepper (tour controls + progress)
│   ├── #modal (fluxograma/organograma 2D)
│   ├── #confirm (delete confirmations)
│   └── #tip (hover tooltips)
└── <script>
    ├── Three.js initialization + scene setup
    ├── Data model (nodes, agents, processes, groups, TIER)
    ├── Rendering (3D visuals, labels, task flows)
    ├── UI panels (left/right sidebars, modals)
    ├── Interactions (click, drag, keyboard, tour)
    ├── Business logic (mutations, validation)
    ├── Themes (applyTheme, CSS variable swapping)
    └── Exports (PDF, PPTX, JSON)
```

## Testing

Os testes são em `/home/claude/test/`:
- `harness.js` — 1,121 assertions (core features)
- `harness2.js` — 147 assertions (advanced features)
- `three-stub.js` — Mock da biblioteca Three.js

Para rodar:
```bash
cd test && node harness.js && node harness2.js
```

## Perguntas?

- Abra uma **Discussion** para ideias
- Crie uma **Issue** para bugs
- Contacte o maintainer via issue

---

**Obrigado por contribuir!** 💚

Versão: 2.0 | Maintainer: [seu-nome] | Licença: MIT
