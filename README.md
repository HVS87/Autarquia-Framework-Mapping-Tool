# Ferramenta de Mapeamento para Autarquias

Um sistema interativo de 3D para visualização e gestão de estruturas organizacionais municipais portuguesas. Combina hierarquia vertical (organograma) com procedimentos horizontais (fluxos de trabalho), permitindo explorar responsabilidades, equipas e tarefas direcionais num espaço imersivo.

## 🎯 Características

### Visualização 3D
- **Rede organizacional em tempo real**: Quatro níveis de coordenação (Executivo, Geral, Setorial, Operacional) dispostos em anéis com cores por ramo
- **Agentes orbitais**: Cada nódulo exibe a sua equipa como esferas em órbita; a dourada é o responsável
- **Tarefas direcionais**: Correntes de energia percorrem cada procedimento (tarefa) da origem ao destino
- **Modo imersivo**: Zoom, rotação livre e tour guiado com 8 cenas ilustrativas em português

### Temas
- **Nocturno** (padrão): Azul-marinho com dourado — otimizado para ambientes escuros
- **Meia-noite em Lisboa**: Índigo com azulejo azul e amarelo de elétrico — tom lisboeta
- **Calçada** (standby): Pedra e areia — modo claro com contraste elevado, ideal para projeções
- **Verde Institucional**: Verde profundo com latão — identidade autárquica

Cada tema retinge toda a interface, aurora do céu, tesserae do chão, e as paletas de cores das divisões.

### Gestão de Dados
- **Organograma interativo**: Criar/renomear/reorganizar nódulos, mudar níveis, reparentar equipas
- **Equipas e agentes**: Adicionar agentes aos nódulos, designar responsáveis, reatribuir entre estruturas
- **Procedimentos**: Criar tarefas direcionais com descrições, durações, agentes responsáveis
- **Fluxogramas 2D**: Cada procedimento desdobra-se num fluxograma editável com visualização de cadeias
- **Grupos de procedimentos**: Agrupar tarefas relacionadas em "Grupos de Procedimentos" para melhor navegação

### Governação
- **Pelouros**: o Presidente (ou o Systems Admin) cria, edita e elimina Pelouros; cada um junta nódulos raiz e tudo o que está hierarquicamente abaixo, com um responsável do Executivo. Um nódulo pode ser destacado para outro Pelouro. Os procedimentos pertencem ao Pelouro onde têm origem. O organograma mostra o Pelouro de cada braço.
- **Credenciais de segurança** (Consulta · Operacional · Chefia · Direção · Executivo): o Systems Admin define-as; o Presidente altera todas; os membros do Executivo alteram as dos seus Pelouros; uma chefia altera as dos subordinados diretos ou dos nódulos abaixo se tiver essa permissão, e nunca acima da sua.
- **Objetos**: número, nome, categoria e atributos com texto preditivo, alertas (recorrentes, por procedimento ou por alteração noutro objeto), localização (geográfica, morada ou dentro de outro objeto), associações a objetos e procedimentos, valores com histórico (cobranças, despesas, valor patrimonial), observações, "conta para o inventário", arquivar e eliminar. O que se vê e edita depende da credencial.
- **Validação e prazos de tarefas**: uma tarefa só fica concluída quando o responsável a valida, e só então o procedimento prossegue. Cada tarefa tem um prazo em dias (editável pela chefia com credencial): aviso amarelo "Prazo a vencer" ao aproximar-se, alerta vermelho "Em atraso" ao responsável e à chefia direta quando passa, e de semana em semana o alerta sobe um nível na hierarquia até ao responsável do Pelouro e ao Presidente. Os prazos dos alertas afinam-se em Definições.
- **Objetos em lista ou em mapa 3D**: a lista é uma árvore colapsável e editável (novo objeto, novo objeto dentro do atual, arrastar um objeto para outro para o pôr lá dentro, zona para o tirar de dentro); o mapa 3D mostra a hierarquia em cubos (a organização é de esferas), com as raízes num anel e o que está dentro em volta de quem o contém. Ao arrastar um objeto para outro, o de destino abre-se como uma caixa (tampa a levantar, brilho) e o transportado deposita-se lá dentro; as faces dos cubos vestem-se com o tema (azulejo em Lisboa, cartão na Calçada, madeira no Verde, traço grosso no Contraste, grelha de néon no Noturno).
- **Repositórios**: documentos, multimédia, atas e minutas, com formato, ligação (endereço web ou caminho de rede), data e observações, associados a procedimentos, tarefas, nódulos e pessoas, e com credencial mínima de acesso (abaixo dela vê-se que existe, mas não se abre).
- **Perfil ativo** (Definições): escolhe-se quem está a usar a aplicação — o Systems Admin ou um dos agentes — e tudo o resto respeita a credencial dessa pessoa.

### Experiência do Utilizador
- **Tour guiado**: Reprodução automática (com ritmo adaptativo) ou navegação manual (←/→ ou clique)
- **Pesquisa em tempo real**: Filtro rápido em todos os separadores (Procedimentos, Nódulos, Agentes, Grupos)
- **Suporte móvel**: Interface responsiva com gaveta lateral e painéis inferiores; controlos otimizados para toque
- **Lembretes de mudanças**: Aviso `beforeunload` se houver alterações não gravadas
- **Exportação/Importação**: Guardar datasets em JSON, partilhar configurações; PDF e apresentações PPTX

### Segurança e Acessibilidade
- `prefers-reduced-motion`: Animações pausam automaticamente para utilizadores com preferências
- `prefers-color-scheme`: Deteta modo claro/escuro do sistema
- Rótulos ARIA e navegação por teclado: ←/→ mudam cenas, Espaço reproduz/pausa a tour
- Tipografia clara (Avenir Next/Segoe UI) com alto contraste em todos os temas

## 🚀 Como Começar

### Uso Online
Abra [o link do GitHub Pages](#) e comece imediatamente — não é necessário instalar nada.

### Instalação Local
```bash
git clone https://github.com/HVS87/Autarquia-Framework-Mapping-Tool.git
cd Autarquia-Framework-Mapping-Tool
# Abra network-framework.html num browser moderno (Chrome, Firefox, Safari, Edge)
```

### Instalação como App (PWA)
1. Visite a página no Chrome/Edge (ou similar com suporte PWA)
2. Clique no ícone "Instalar" na barra de endereços
3. A app abre em modo standalone — funciona offline após o primeiro carregamento

### Aplicação de secretária (.exe)
A pasta `desktop/` gera um executável Windows independente do browser: arranca em ecrã inteiro, estende sozinho o palco 3D para um segundo monitor (mediante confirmação, reversível nas Definições) e guarda os autosaves numa pasta `autosaves/` ao lado do executável. Instruções em [DEPLOY.md](DEPLOY.md#aplicação-de-secretária-exe). Os atalhos de teclado remapeiam-se em Definições › Atalhos de teclado.

## 📖 Guia de Utilização

### Exploração 3D
- **Clique + arraste**: Roda a câmara
- **Scroll/Pinch**: Zoom in/out (raio da órbita)
- **Clique numa esfera**: Seleciona o nódulo ou a tarefa — abre o painel de edição à direita
- **Espaço**: Reproduz/pausa o tour (quando não está num campo de texto)

### Edição de Dados
1. **Nódulos**: Clique em qualquer esfera para renomear, mudar de nível, adicionar/remover agentes
2. **Tarefas**: Clique num arco para editar as pontas (origem/destino), descrição, responsável, duração
3. **Agentes**: Atribua a um nódulo ou mude de responsável de uma tarefa
4. **Grupos**: Agrupe procedimentos relacionados e controle a visibilidade em conjunto

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

O código está organizado em secções:
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
