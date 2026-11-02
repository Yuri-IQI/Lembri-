# Escopo de Impacto — Árvore de Decisão Front-end no Lembri

Material de consulta do princípio 2 da skill `principios`. Leia quando a tarefa alterar comportamento de tela, fluxo de navegação, persistência ou comunicação com o relógio — e a dúvida for *onde e por qual mecanismo essa alteração deve ser expressa*.

---

## As Quatro Perguntas Fundamentais no Front-end

1. **Quem consome essa informação?**
   - Apenas o componente atual? → Estado local (`useState`).
   - Múltiplas telas ou componentes irmãos (ex: tela inicial e aba de lembretes)? → **Store Zustand**.
   - O relógio Wear OS? → **Serviço Wear + Contrato de sincronização**.
2. **A alteração é visual, de estado ou de infraestrutura?**
   - *Visual / Espaçamento / Cores:* Centralize em `theme.ts` ou nos componentes base de `src/components/`.
   - *Estado / Lógica de Itens:* Centralize na respectiva store do Zustand em `src/stores/`.
   - *Módulo Nativo:* Somente se envolver o canal de comunicação do Wearable Data Layer (`modules/wear-connector`).
3. **Existe precedente no projeto?**
   - Sempre utilize os padrões existentes (Expo Router, componentes temáticos `ThemedText`/`ThemedView`, stores Zustand).
   - Não adicione bibliotecas externas pesadas ou mecanismos alternativos de estado (como Redux ou MobX) quando o Zustand já é a solução canônica adotada.
4. **Isso afeta dados mockados existentes?**
   - Se novos campos obrigatórios forem criados em interfaces (`src/types/`), atualize imediatamente os arquivos de mock em `src/mocks/` para evitar quebras em tempo de execução.

---

## Mecanismos de Impacto no Lembri

| Mecanismo | Onde Reside | Quando Utilizar |
|---|---|---|
| **Estado Local (`useState`)** | Dentro do componente de tela em `src/app/` ou componente visual | Dados temporários de formulário enquanto o usuário digita, estado de foco, abertura de modal local |
| **Store Global (Zustand)** | `src/stores/` (ex: `useLembretesStore`, `useExerciciosStore`) | Itens compartilhados entre telas, coleções de lembretes, filtros ativos, contadores e ações de CRUD |
| **Hook Customizado** | `src/hooks/` (ex: `useTheme`, `useSincronizarRelogio`) | Composição de lógica reativa reutilizável entre múltiplas telas |
| **Contrato e Serviço Wear** | `src/services/wear/` e `contrato.ts` | Dados que trafegam entre o celular e o relógio Wear OS pela Wearable Data Layer API |
| **Mocks e Fixtures** | `src/mocks/` | Dados estáticos para exibição inicial e testes no ambiente de desenvolvimento |
| **Design Tokens** | `src/constants/theme.ts` | Definição de cores, espaçamentos, tipografia e tamanho de alvo de toque (`TouchTarget`) |

---

## Árvore de Decisão Front-end

```
O dado/comportamento precisa ser compartilhado entre diferentes telas ou abas?
├─ NÃO → É um dado transitório de tela (ex: texto que está sendo digitado)?
│         └─ SIM → Use `useState` no próprio componente/tela.
│
└─ SIM → O dado representa itens de domínio (lembretes, exercícios, configurações)?
          ├─ SIM → Crie ou utilize uma store do Zustand em `src/stores/`.
          │         └─ O relógio Wear OS precisa receber ou atualizar esse item?
          │               ├─ SIM → Integre a ação da store com o `wear-service` / `useSincronizarRelogio`.
          │               └─ NÃO → Mantenha a alteração reativa apenas na store.
          │
          └─ NÃO → É um estilo, cor ou espaçamento compartilhado?
                    └─ SIM → Utilize os tokens declarados em `src/constants/theme.ts`.
```
