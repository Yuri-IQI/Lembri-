# Camadas — Arquitetura Front-end no Aplicativo Lembri

Material de consulta do princípio 1 da skill `principios`. Leia quando a dúvida for *em que camada* uma regra, estado, componente ou mock deve morar no **Lembri** (React Native com Expo SDK 58, Zustand e dados majoritariamente mockados).

---

## A camada é decisão do projeto, não sua

1. **O projeto tem convenção documentada?** Ela decide. Consulte este mapa e o código existente antes de criar ou mover arquivos.
2. **Não tem convenção explícita para o caso?** Siga o componente ou store irmão mais próximo.
3. **Duas camadas defensáveis e nenhum precedente?** É pergunta ao usuário, nunca sorteio.
4. **Regra de corte:** Arquivo novo só quando nenhum existente for o lugar óbvio. Evite fragmentar o projeto em camadas artificiais ou over-engineering.

---

## Os quatro invariantes da arquitetura front-end

1. **Regra de negócio e manipulação de estado não mora na visualização.**
   - Componentes visuais (`src/components/`) e rotas do Expo Router (`src/app/`) cuidam de renderização, layout e captura de gestos do usuário.
   - A adição de itens, regras de validação, filtragem complexa, contagem de tarefas pendentes e alternância de status moram nas **stores do Zustand** (`src/stores/`) ou em **serviços dedicados** (`src/services/`).
2. **A dependência aponta para dentro (UI → Hooks/Stores → Services/Mocks).**
   - As telas e componentes chamam hooks ou consomem stores Zustand.
   - As stores e serviços mockados **não conhecem componentes React, JSX ou layouts**.
   - Se para testar uma regra de lembrete ou exercício você precisar montar a tela inteira, a regra está na camada errada.
3. **Mocks desacoplados com contratos explícitos.**
   - Os dados mockados residem em `src/mocks/` e respeitam rigorosamente os tipos definidos em `src/types/`.
   - Essa separação garante que, quando o app integrar com uma API REST no futuro ou persistir em SQLite/AsyncStorage, nenhuma tela precise ser reescrita.
4. **Fronteira com hardware e módulos nativos isolada.**
   - A comunicação com o relógio Wear OS via `wear-connector` fica restrita a `src/services/wear/` e ao hook `src/hooks/use-sincronizar-relogio.ts`.
   - Nenhuma tela chama diretamente APIs do módulo nativo sem passar pelo serviço/contrato.

---

## O Mapa Real de Camadas do Lembri (`MobileAPP/src/`)

| Camada | Diretório | Responsabilidade | O que NÃO faz |
|---|---|---|---|
| **Rotas / Telas** | `src/app/` | Declara rotas do Expo Router (`(tabs)/index.tsx`, `lembretes.tsx`, `exercicios.tsx`, `_layout.tsx`), compõe a tela com componentes base e conecta com hooks/stores | Não contém regras de manipulação de coleções, lógica pesada ou manipulação direta de mocks |
| **Componentes UI** | `src/components/` | Componentes visuais reutilizáveis (`ThemedText`, `Card`, `MainContainer`, `TopBar`, `BottomBar`, `SplashScreen`) | Não gerencia estado de domínio global nem faz chamadas de rede/nativas |
| **Gerenciamento de Estado** | `src/stores/` | Stores do **Zustand** para itens (lembretes, exercícios, tarefas), filtros ativos e seletores reativos | Não renderiza elementos JSX nem lida com estilização de tela |
| **Custom Hooks** | `src/hooks/` | Encapsula integração entre React e stores/serviços (`useTheme`, `useSincronizarRelogio`, `useLembretes`) | Não substitui componentes nem acumula lógica não reutilizável |
| **Serviços & Contratos** | `src/services/` | Comunicação com o relógio (`wear-service.ts`, `contrato.ts`) e adaptadores de dados mockados | Não renderiza UI nem manipula estado local de componentes |
| **Mocks & Fixtures** | `src/mocks/` | Dados fictícios iniciais, geradores e cenários de teste para itens e configurações | Não executa código de produção que altere comportamento sem tipagem |
| **Design Tokens** | `src/constants/` | Tokens do design system centralizados (`theme.ts` com cores, espaçamentos, raios e `TouchTarget`) | Não define regras de negócio |
| **Tipos & Contratos** | `src/types/` | Definições de interfaces TypeScript (`svg.d.ts`, tipos de lembretes, exercícios e contratos Wear) | Não contém código executável em runtime |
| **Módulos Nativos** | `modules/` | Implementação Kotlin/Android do Wearable Data Layer (`wear-connector`) | Não deve ser alterado para tarefas que sejam puramente de front-end |

---

## Fluxo de Dados Recomendado

```
[ Usuário interage com a Tela (src/app/) ]
               │
               ▼
   [ Componente Visual (src/components/) ]
               │
               ▼
    [ Hook / Store Zustand (src/stores/) ] ──► [ Atualiza Estado Reativo ]
               │                                      │
               ├─────────────────────────┐            ▼
               ▼                         ▼      [ Notifica Telas Reativas ]
   [ Mocks / Fixtures ]        [ Wear Service ]
   (src/mocks/ & services/)    (src/services/wear/)
                                         │
                                         ▼
                               [ Módulo Nativo Wear ]
```
