# 🤝 Contribuir

Obrigado por querer melhorar a Ferramenta de Mapeamento para Autarquias!

## Como Começar

1. **Fork** o repositório no GitHub
2. **Clone** para a sua máquina:
   ```bash
   git clone https://github.com/HVS87/Autarquia-Framework-Mapping-Tool.git
   cd Autarquia-Framework-Mapping-Tool
   ```
3. **Edite** os ficheiros:
   - **Lógica da app**: `app.js` (em `/home/claude/` se for o dev local)
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

## Diretrizes

### Código
- Use JavaScript vanilla (sem frameworks)
- Respeite `prefers-reduced-motion` e acessibilidade
- Teste em Chrome, Firefox, Safari (mobile e desktop)
- Mantenha o ficheiro em **uma única página** (`network-framework.html`)

### Comentários
- Escreva comentários em **português** para a lógica principal
- Português europeu (AO90) em tudo o que aparece na interface

### Pull Requests
- **Uma funcionalidade por PR** (mais fácil de rever)
- Descreva o problema e a solução
- Inclua capturas de ecrã se for mudança visual
- Mencione issues relacionadas (`#123`)

### Issues
- Procure questões já abertas antes de abrir uma nova
- Descreva os passos para reproduzir
- Inclua versão do navegador e SO

## Área de Foco

Bem-vindo para:

- 🐛 **Correção de defeitos** — falhas, layouts partidos, etc.
- ✨ **Funcionalidades** — novos temas, modos de visualização, formatos de exportação
- 🎨 **Melhorias de utilização** — animações, dicas, gestos
- 🌐 **Internacionalização** — traduzir para outras línguas
- 📖 **Documentação** — exemplos, tutoriais, README

Evite:

- ⚠️ Dependências externas (não bibliotecas, use CDN se necessário)
- ⚠️ Grandes reestruturações sem discussão prévia
- ⚠️ Mudanças arquitetónicas radicais

## Arquitetura do Projeto

```
network-framework.html
├── <meta> + preparação da PWA
├── <style> 
│   ├── CSS variables (temas)
│   ├── Layout (vidro, painéis, rodapé da visita)
│   └── Animações (microinterações)
├── <body>
│   ├── #stage (canvas 3D)
│   ├── #header (nome da organização + botões)
│   ├── #panel (painel esquerdo: Nódulos, Agentes, Procedimentos, Grupos)
│   ├── #detail (painel direito: detalhe de nódulo/tarefa/agente)
│   ├── #stepper (comandos da visita + progresso)
│   ├── #modal (fluxograma/organograma 2D)
│   ├── #confirm (confirmações de remoção)
│   └── #tip (dicas ao passar o rato)
└── <script>
    ├── Arranque do Three.js + montagem da cena
    ├── Modelo de dados (nodes, agents, processes, groups, TIER)
    ├── Desenho (visuais 3D, rótulos, fluxos de tarefas)
    ├── Painéis (laterais esquerda e direita, modais)
    ├── Interações (clique, arrasto, teclado, visita)
    ├── Lógica de negócio (mutações, validação)
    ├── Temas (applyTheme, troca de variáveis CSS)
    └── Exportações (PDF, PPTX, JSON)
```

## Testes

Os testes são em `/home/claude/test/`:
- `harness.js` — 1,121 asserções (funcionalidades base)
- `harness2.js` — 147 asserções (funcionalidades avançadas)
- `three-stub.js` — substituto da biblioteca Three.js para testes

Para executar:
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
