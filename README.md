# Orchestration Framework — Junta de Freguesia

Um sistema interativo de 3D para visualização e gestão de estruturas organizacionais municipais portuguesas. Combina hierarquia vertical (organograma) com procedimentos horizontais (fluxos de trabalho), permitindo explorar responsabilidades, equipas e tarefas direcionais num espaço imersivo.

## 🎯 Características

### Visualização 3D
- **Rede organizacional em tempo real**: Quatro tiers de coordenação (Executivo, Geral, Setorial, Operacional) dispostos em anéis com cores por ramo
- **Agentes orbitais**: Cada node exibe a sua equipa como esferas em órbita; a dourada é o responsável
- **Tarefas direcionais**: Correntes de energia percorrem cada procedimento (tarefa) da origem ao destino
- **Modo imersivo**: Zoom, rotação livre e tour guiado com 8 cenas ilustrativas em português

### Temas
- **Nocturno** (padrão): Azul-marinho com dourado — otimizado para ambientes escuros
- **Meia-noite em Lisboa**: Índigo com azulejo azul e amarelo de elétrico — tom lisboeta
- **Calçada** (standby): Pedra e areia — modo claro com contraste elevado, ideal para projeções
- **Verde Institucional**: Verde profundo com latão — identidade autárquica

Cada tema retinge toda a interface, aurora do céu, tesserae do chão, e as paletas de cores das divisões.

### Gestão de Dados
- **Organograma interativo**: Criar/renomear/reorganizar nodes, mudar tiers, reparentar equipas
- **Equipas e agentes**: Adicionar agentes aos nodes, designar responsáveis, reatribuir entre estruturas
- **Procedimentos**: Criar tarefas direcionais com descrições, durações, agentes responsáveis
- **Fluxogramas 2D**: Cada procedimento desdobra-se num flowchart editável com visualização de cadeias
- **Grupos de procedimentos**: Agrupar tarefas relacionadas em "Grupos de Procedimentos" para melhor navegação

### Experiência do Utilizador
- **Tour guiado**: Reprodução automática (com ritmo adaptativo) ou navegação manual (←/→ ou clique)
- **Pesquisa em tempo real**: Filtro rápido em todos os separadores (Procedimentos, Nodes, Agentes, Grupos)
- **Suporte móvel**: Interface responsiva com gaveta lateral e bottom-sheets; controles otimizados para toque
- **Lembretes de mudanças**: Aviso `beforeunload` se houver alterações não gravadas
- **Exportação/Importação**: Guardar datasets em JSON, partilhar configurações; PDF e apresentações PPTX

### Segurança e Acessibilidade
- `prefers-reduced-motion`: Animações pausam automaticamente para utilizadores com preferências
- `prefers-color-scheme`: Deteta modo claro/escuro do sistema
- ARIA labels e navegação por teclado: ←/→ mudam cenas, Espaço reproduz/pausa a tour
- Tipografia clara (Avenir Next/Segoe UI) com alto contraste em todos os temas

## 🚀 Como Começar

### Uso Online
Abra [o link do GitHub Pages](#) e comece imediatamente — não é necessário instalar nada.

### Instalação Local
```bash
git clone https://github.com/seu-utilizador/orchestration-framework.git
cd orchestration-framework
# Abra network-framework.html num browser moderno (Chrome, Firefox, Safari, Edge)
```

### Instalação como App (PWA)
1. Visite a página no Chrome/Edge (ou similar com suporte PWA)
2. Clique no ícone "Instalar" na barra de endereços
3. A app abre em modo standalone — funciona offline após o primeiro carregamento

## 📖 Guia de Utilização

### Exploração 3D
- **Clique + arraste**: Roda a câmara
- **Scroll/Pinch**: Zoom in/out (raio da órbita)
- **Clique numa esfera**: Seleciona o node ou tarefa — abre o painel de edição à direita
- **Espaço**: Reproduz/pausa o tour (quando não está num campo de texto)

### Edição de Dados
1. **Nodes**: Clique em qualquer esfera para renomear, mudar tier, adicionar/remover agentes
2. **Tarefas**: Clique num arco para editar endpoints (origem/destino), descrição, responsável, duração
3. **Agentes**: Atribua a um node ou mude de responsável de uma tarefa
4. **Grupos**: Agrupe procedimentos relacionados e controle visibilidade em conjunto

### Tour Guiado
- Clique **Play tour** para reprodução automática (ritmo adaptativo por cena)
- Use **←/→** para navegar manualmente entre cenas
- Clique nos pontos (dots) para ir a uma cena específica
- Cada cena realça diferentes aspetos da estrutura

### Exportar & Partilhar
- **Export Dataset**: Guarda toda a configuração como JSON (inclui tema)
- **Export PDF**: Relatório impresso com organograma + fluxogramas
- **Export Presentation**: Slide deck PPTX com overview, estrutura por divisão, e procedimentos

## 🏗️ Arquitetura Técnica

- **Frontend**: JavaScript vanilla + Three.js r128 (3D rendering)
- **Sem dependências externas**: Todos os componentes são auto-contidos (PDF/PPTX via CDN)
- **Single-file artifact**: `network-framework.html` contém toda a lógica, estilos e dados
- **Persistência**: JSON em memória durante a sessão; exportação manual para ficheiros
- **Acesso sem servidor**: Funciona totalmente offline após carregamento inicial

## 📱 Suporte de Navegadores

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Opera 76+
- Requires WebGL support

Mobile:
- iOS Safari 15+ (com limitações de vibração e fullscreen)
- Chrome Android 90+
- Firefox Android 88+

## 🎨 Desenvolvimento & Personalização

O código está organizado em seções:
- **Paletas de cores** (linhas ~110–180): Edite `THEMES` para adicionar novos temas
- **Estrutura de dados** (linhas ~200–300): Seed inicial; edite `nodes`, `agents`, `processes`
- **Renderização 3D** (linhas ~400–1200): Three.js cena, materiais, câmara, iluminação
- **UI panels** (linhas ~1300–3200): Renderização dos separadores e modais
- **Lógica de negócio** (linhas ~3200–3600): Mutações, validação, re-layout

## 📄 Licença

Este projeto é fornecido como-é para uso em administração autárquica portuguesa. Personalize livremente para as suas necessidades.

## 🛠️ Contribuições & Feedback

Têm ideias? Encontraram um bug? Abra uma issue ou enviem um pull request — queremos ouvir!

---

**Desenvolvido para modernizar a administração municipal através de visualização clara e interativa de estruturas e fluxos.**

Versão: 2.0 • Temas: 4 • Scenes: 8 • Assertions: 1269 ✓
