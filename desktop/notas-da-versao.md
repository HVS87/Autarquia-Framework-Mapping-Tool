## Ferramenta de Mapeamento para Autarquias — aplicação de secretária

Duas formas de a ter no Windows:

- **Mapeamento-Autarquias-‹versão›-x64.exe** — instalador: escolhe a pasta e cria o atalho "Mapeamento para Autarquias" no menu Iniciar.
- **Mapeamento-Autarquias-‹versão›-portatil.exe** — portátil: corre onde estiver (pen, pasta partilhada), sem instalação; a pasta `autosaves\` nasce ao lado.

Os executáveis não estão assinados digitalmente. Na primeira execução o SmartScreen mostra "Editor desconhecido" — *Mais informações › Executar mesmo assim*.

### Novidades desta versão
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
- Funciona sem internet (as exportações PDF/PPTX precisam de rede na primeira utilização).

A versão web continua em https://hvs87.github.io/Autarquia-Framework-Mapping-Tool/ — os dados de uma e de outra trocam-se pelos ficheiros JSON (Guardar / Abrir dataset).
