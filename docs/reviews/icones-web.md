# Correção de ícones no navegador

Data: 02/11/2026. Branch: `feat/ajustes-dispositivos-e-ajuda`, incluindo alterações locais. Escopo: ícones da interface React Native em `MobileAPP/src` e seus assets. O aplicativo Kotlin Wear OS não é executado no navegador.

## Resultado

Foram migrados **35 usos em 28 componentes** para `MaterialSymbol`, que fornece o mesmo nome Material ao Android e à web. O único import direto de `SymbolView` ficou no adaptador. As cores, tamanhos, propriedades e ações dos consumidores continuam sendo encaminhados ao Expo Symbols.

A causa recorrente era o uso de `name.android` sem `name.web`. A correção segue o contrato do [Expo Symbols SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/symbols/).

Também foi corrigido o fundo de navegação: `app.json` declara `userInterfaceStyle: light`, e `useTheme` fornece a paleta clara do projeto, mas o stack seguia o esquema escuro do navegador. Isso produzia fundos pretos com textos e símbolos escuros em formulários e outras rotas. O tema de navegação agora usa `DefaultTheme` com `Colors.background`.

## Prevenção de recorrência

A regra `no-restricted-imports` bloqueia importar `SymbolView` diretamente nos consumidores e orienta usar `MaterialSymbol`. O adaptador é a exceção explícita. Tipos como `AndroidSymbol` continuam permitidos.

Foi feita uma prova negativa por stdin: uma importação direta em um arquivo virtual de componente foi rejeitada pelo lint com `no-restricted-imports`. Nenhum arquivo de teste temporário foi adicionado ao código do aplicativo.

## Validação

- `npx expo lint`: passou.
- `npx tsc --noEmit`: passou.
- `git diff --check`: passou.
- Varredura AST após a migração: 35 usos, 28 componentes, zero imports diretos fora do adaptador e zero nomes literais ausentes no catálogo de símbolos instalado.
- Verificação no navegador local: Home, filtros, quatro templates, formulário de remédio, seletor de repetição, tipos de lembrete, catálogo de exercícios, busca/limpeza, teclado numérico e Ajustes.
- Busca: o botão de limpar surgiu com texto e retornou a lista completa.
- Teclado: inserir um dígito e tocar no botão de apagar restaurou o visor vazio. A sessão foi encerrada sem registrar uma tentativa concluída.
- Ajustes: setas alternaram ao expandir/recolher; os botões de aumentar/diminuir limite exibiram seus símbolos.
- Os ícones SVG da barra inferior permaneceram visíveis nas telas verificadas.

Essa é uma verificação da renderização web. Não representa certificação WCAG AAA nem execução nativa Android/iOS. Estados condicionais não abertos individualmente foram cobertos pela migração dos consumidores, pela tipagem e pela auditoria de imports.

## Componentes migrados

| Grupo | Componentes | Usos |
| --- | --- | ---: |
| Agenda | filtros-agenda, fundo-excluir | 2 |
| Cabeçalho | top-bar | 2 |
| Feedback e ações | aviso-sucesso, botao-icone, botao | 3 |
| Cards | exercicio-card, grupo-agenda-card, lembrete-card | 4 |
| Ajustes e horários | cartao-ajuste, chip-horario, chip-ocorrencia | 3 |
| Exercícios | campo-busca, teclado-numerico | 3 |
| Templates e listas | card-template, icone-template, item-lista, lista-vazia-lembretes | 6 |
| Formulários | campo-selecao, campo-texto, chip-removivel, chips-selecao, circulo-cor, item-checklist, item-sugestao, mensagem-erro | 9 |
| Conclusão e tipos | marcador-feito, item-tipo | 3 |
| **Total** | **28 componentes** | **35** |

## Evidências

- [Home](assets/icones-web/home.jpg)
- [Templates](assets/icones-web/templates.jpg)
- [Formulário com contraste corrigido](assets/icones-web/formulario.jpg)
- [Seleção de repetição](assets/icones-web/selecao.jpg)
- [Tipos, checks e lixeiras](assets/icones-web/tipos.jpg)
- [Catálogo de exercícios](assets/icones-web/exercicios.jpg)
- [Teclado numérico](assets/icones-web/teclado.jpg)
- [Ajustes](assets/icones-web/ajustes.jpg)

`MaterialSymbol → DRY e compatibilidade de plataforma; tema de navegação → tokens e padrão claro existente; lint → prevenção de recorrência.`

## Ação explícita em Próximo lembrete

Após o usuário pedir mais clareza sobre a função do círculo à direita, o card passou a reutilizar `Botao` com texto visível: **Marcar como tomado** para remédios e **Marcar como feito** nos demais templates. O estado concluído do componente oferece **Desfazer conclusão**. O rótulo acessível inclui a ação, o título do lembrete e o horário.

A ação ocupa uma linha própria abaixo dos dados do card, evitando comprimir o título. O texto de `Botao` agora pode encolher horizontalmente e quebrar linha dentro da largura disponível. A regra de conclusão e a seleção do próximo lembrete continuam nas camadas existentes.

Validação em `localhost:8082`, com armazenamento independente de `localhost:8081`: clique em Marcar como tomado registrou a ocorrência e mudou o card para a próxima; o template Livre exibiu Marcar como feito. As marcações feitas no teste foram desfeitas na própria interface. Em viewport de 320×568, o botão mediu 238×70 px na escala normal e 238×82 px no texto ampliado; `scrollWidth` e `clientWidth` ficaram iguais a 234 px. Lint, TypeScript e `git diff --check` passaram.

- [Ação em tela pequena](assets/proximo-lembrete/acao-320.jpg)
- [Ação com texto ampliado](assets/proximo-lembrete/acao-ampliada-320.jpg)
- [Ação para lembrete comum](assets/proximo-lembrete/acao-feito-320.jpg)

`ação com texto → reconhecimento e clareza; Botao reutilizado → DRY; quebra de linha → acessibilidade em telas pequenas.`
