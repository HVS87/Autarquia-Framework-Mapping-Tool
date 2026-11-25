## Ferramenta de Mapeamento para Autarquias — aplicação de secretária

**Windows**
- **Mapeamento-Autarquias-‹versão›-x64.exe** — instalador: escolhe a pasta e cria o atalho "Mapeamento para Autarquias" no menu Iniciar.
- **Mapeamento-Autarquias-‹versão›-portatil.exe** — portátil: corre onde estiver (pen, pasta partilhada), sem instalação; a pasta `autosaves` nasce ao lado.

**Mac** (macOS 11 ou mais recente)
- **Mapeamento-Autarquias-‹versão›-mac-arm64.dmg** — Mac com chip Apple (M1 e seguintes).
- **Mapeamento-Autarquias-‹versão›-mac-x64.dmg** — Mac com processador Intel.

**Linux**
- **Mapeamento-Autarquias-‹versão›-linux-x86_64.AppImage** — corre em qualquer distribuição: `chmod +x` e abrir.
- **Mapeamento-Autarquias-‹versão›-linux-amd64.deb** — Debian, Ubuntu e derivadas.

**Telemóvel e tablet (Android, iPhone, iPad)**: abra a versão web e use *Partilhar › Adicionar ao ecrã principal* (iPhone, iPad) ou *Instalar aplicação* (Android) — fica como uma app, funciona sem rede, e liga-se ao computador em Definições › Sincronizar dispositivos.

As aplicações não estão assinadas por um certificado de programador. No Windows, o SmartScreen mostra "Editor desconhecido" — *Mais informações › Executar mesmo assim*. No Mac, na primeira vez: botão direito na aplicação › *Abrir* › *Abrir*.

### Novidades desta versão (1.4.0)
- **Sincronizar dispositivos** (Definições): o mesmo projeto no telemóvel, no tablet e no computador, sem conta nem palavra-passe. O código de ligação passa por QR ou à mão; o projeto viaja cifrado (AES-GCM de 256 bits) por uma caixa de passagem que não o consegue ler. Alterações a coisas diferentes nos dois aparelhos ficam as duas; na mesma coisa ganha a mais recente, e o que chega anula-se com Ctrl+Z.
- **Acessibilidade** (Definições): visão das cores para daltonismo — vermelho-verde (Okabe–Ito), azul-amarelo e monocromático —, por cima de qualquer tema e sem mexer nas cores guardadas; atalho para o tema Alto Contraste; movimento reduzido à escolha; foco do teclado reforçado; tamanho do texto.
- **Privacidade**: o aviso de que tudo fica no aparelho, sem contas, publicidade nem estatísticas, nas boas-vindas e no fim das Definições.
- **Mac e Linux**: a aplicação de secretária passa a existir também para Mac (Apple e Intel) e Linux (AppImage e .deb); no Mac e no Linux os autosaves vivem na pasta do utilizador.
- **Correções**: o portátil do Windows guarda os autosaves ao lado do .exe (e não na pasta temporária onde se descompacta); depois de fechar um fluxograma, o segundo ecrã volta a seguir o que está selecionado; alvos de toque maiores nas caixas de seleção.

### Novidades da 1.3.0
- **Governação**: Pelouros (nódulos raiz e tudo o que está abaixo, com responsável do Executivo, visíveis no organograma), credenciais de segurança por pessoa (Consulta a Executivo, alteráveis pelo Admin, pelo Presidente, pelos responsáveis de Pelouro e por chefias com permissão), e o perfil ativo nas Definições.
- **Objetos**: número, categoria e atributos com texto preditivo, alertas, localização (geográfica, morada ou dentro de outro objeto), associações, valores com histórico, observações, inventário, arquivar e eliminar; lista em árvore com arrastar e largar, e mapa 3D em caixas baixas cujas tampas abrem em flor; objeto novo constrói-se em cubinhos no segundo ecrã.
- **Repositórios**: documentos, multimédia, atas e minutas ligados a procedimentos, tarefas, nódulos e pessoas, com credencial mínima de acesso.
- **Tarefas**: só fecham validadas pelo responsável; prazo por tarefa, aviso amarelo, alerta vermelho ao responsável e à chefia direta, e escalonamento semanal até ao responsável do Pelouro e ao Presidente.
- **Visita guiada**: termina-se no cartão (✕) e retoma-se nas Definições.
- **Desempenho**: o mapa de objetos com um terço das chamadas de desenho; o automático sobe de nível a partir de 48 fps; ecrã duplo verificado de ponta a ponta (a seleção de um nódulo acabado de criar já chega ao palco).

### Novidades da 1.2.0
- **Em espera no palco**: enquanto no ecrã principal se edita um nódulo, uma pessoa, uma tarefa ou um procedimento, o segundo ecrã põe esse elemento em cena e mantém-no vivo — câmara em órbita lenta, o elemento a respirar, uma faísca a percorrer a tarefa ou o procedimento passo a passo.
- **Holograma de edição**: sobre o elemento em edição paira uma ficha translúcida, nas tintas do tema, ligada a ele por um feixe com glifos a subir e um anel a pulsar; os dados reais escrevem-se letra a letra e cada campo alterado reescreve-se a partir da letra que mudou.
- **Obra e radar**: uma unidade, pessoa ou procedimento acabados de criar constroem-se em estaleiro à medida que o nome se escreve (esqueleto, andaime, grua, partículas da peça-mãe); a escolher o destino de uma tarefa nova ou a unidade de uma pessoa nova, um radar varre até ao candidato.
- **Dois ecrãs sem soluços**: cada tecla numa renomeação chega ao palco em ~1 ms (sem reconstruir a cena); o ecrã principal cede a placa gráfica ao palco; **Motor gráfico** em Definições › Desempenho (Vulkan para demonstrações a dois ecrãs em portáteis que prendem as janelas a 30 fps).
- **Toque**: interruptores, amostras de cor, nomes e botões de escolha com alvos maiores em ecrãs tácteis.
- **Desempenho**: o Automático já não desce de nível por causa do vsync dividido entre duas janelas; e as rondas de QA (web, telemóvel, tablet, .exe) não deixaram erros por fechar.

### Novidades da 1.1.0
- **Desempenho**: metade das chamadas de desenho e sem cópia do buffer por frame; três níveis em Definições › Desempenho (Completo · Equilibrado · Leve) e um Automático que sobe de nível se a animação perder frames.
- **Nova tarefa a partir de um nódulo**: o procedimento escolhe-se por procura (pelo nome do procedimento ou de uma tarefa dele) ou numa lista que rola, com "Criar novo procedimento" em cima.
- **Nascimentos no palco**: cada nódulo, tarefa, pessoa ou procedimento novo entra em cena no segundo ecrã com a sua animação; ao abrir o palco, a organização inteira nasce (génese).
- **Menu do Esc** (Voltar · Guardar · Guardar como… · Definições · Sair), saída com pergunta quando há alterações por guardar, e pasta dos autosaves à escolha.
- **Legibilidade**: contorno nos nomes dos procedimentos nos Fluxogramas, tema Calçada com contraste corrigido, "Tarefas ligadas" legíveis nos temas escuros.

### O que a aplicação de secretária traz
- Arranca em ecrã inteiro (desliga-se em Definições › Segundo ecrã).
- Deteta um segundo monitor e, mediante confirmação, abre lá o palco 3D já em ecrã inteiro — a organização nasce em cena quando o palco abre, e cada unidade, tarefa, pessoa ou procedimento novo entra com a sua animação.
- Autosave em pasta local (último estado a cada alteração e cópias datadas de meia em meia hora); a pasta muda-se nas Definições.
- Esc abre o menu: Voltar, Guardar, Guardar como…, Definições, Sair. Sair com alterações por guardar pergunta primeiro.
- Atalhos de teclado remapeáveis em Definições.
- Funciona sem internet (as exportações PDF/PPTX e a sincronização entre aparelhos precisam de rede).

A versão web continua em https://hvs87.github.io/Autarquia-Framework-Mapping-Tool/ — os dados de uma e de outra trocam-se pelos ficheiros JSON (Guardar / Abrir dataset).
