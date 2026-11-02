# Lembri — Instruções para o Claude Code

App mobile de lembretes e exercícios de memória para pessoas idosas (projeto acadêmico), com um app
de relógio Wear OS de escopo reduzido. Foco no front-end, dados mockados, acessibilidade **WCAG 2.2 AAA**.

- `MobileAPP/` — Expo SDK 58 · React Native 0.88 · React 19 · TypeScript · Expo Router · Zustand.
- `WearableAPP/` — Kotlin + Compose for Wear OS.
- `docs/` — planos SDD (`plans/`), revisões (`reviews/`), módulos (`modulos/`), manuais e scripts.

Esta é a versão do Claude da documentação de IA. `AGENTS.md` e `.agents/` são a versão para os demais
agentes e **não** são lidos aqui; ao mudar uma regra comum, avise que a outra versão precisa acompanhar.

## Regras que valem sempre

1. **Skill `principios` ativa em todo trabalho de código** (`.claude/skills/principios/SKILL.md` e `references/`).
   As demais skills são subordinadas a ela.
2. **Regra da Dúvida:** nada de premissas. Divergência entre pedido, código, Figma ou Trello vira pergunta
   objetiva com recomendação, antes de virar código. Ler o código e a doc primeiro; perguntar depois.
3. **Figma é a fonte visual; acessibilidade AAA vence o Figma.** Tela com frame no Figma segue
   `.claude/skills/principios/references/figma.md` (frames, `nodeId`, tokens, desvios intencionais).
4. **Tokens só em `MobileAPP/src/constants/theme.ts`.** Nada de hex ou número mágico em componente.
5. Código em **inglês**; textos de interface e TSDoc em **português**.

## Skills do fluxo (SDD)

Acionáveis por `/nome` ou carregadas automaticamente quando o pedido combina:

| Skill | Faz |
|---|---|
| `/buscar-tarefa` | Coleta o cartão do Trello (`docs/scripts/trello-fetch.mjs`) e prepara a branch a partir de `develop` |
| `/plano` | Gera o SDD em `docs/plans/<chave>-<slug>.html` a partir de `EXEMPLO_PLANO.html` |
| `/implementar` | Implementa o SDD em camadas: Types → Mocks → Stores → Hooks/Services → Componentes → Telas |
| `/testar` | Testes de componentes e stores, navegação no emulador e acessibilidade AAA |
| `/revisar` | Revisa o diff contra `develop` e gera `docs/reviews/<chave>-<slug>.html` |
| `/documentar-modulo` | Gera/atualiza `docs/modulos/<MODULO>.html` |
| `/principios` | Carrega os princípios; `/principios planejar` segue o guia de planejamento |

Backlog: quadro Trello **UI/UX - Lembri**. Protótipo: Figma `lembri_proto` (fileKey `Wmxfr3VnYjHLZtHgbyHhQZ`) —
use o conector do Figma com a skill `figma:figma-design-to-code`.

## MobileAPP — onde as coisas moram

- Rotas: `src/app/` (`_layout.tsx` raiz, `(tabs)/` com top bar e bottom bar no layout das abas).
- Estado: `src/stores/` (`useLembretesStore`, `useExerciciosStore`, `useTiposLembreteStore`) com `useShallow`.
- Dados: `src/mocks/` (fixtures do Figma), `src/types/` (contratos), `src/services/` (inclui `wear/`).
- UI base: `src/components/` (`ThemedText`, `ThemedView`/`Card`, `MainContainer`, `app-bar/`, `splash`, `loading/`).
- Assets: `assets/<area>/`; SVG importado como componente (`react-native-svg-transformer`, `.svgrrc`).
- Relógio: módulo nativo `modules/wear-connector` + `useSincronizarRelogio` + `services/wear/`.

## Comandos (rodar dentro de `MobileAPP/`)

```bash
npx expo start              # Metro (reinicie com --clear ao mudar metro.config.js ou .svgrrc)
npx expo run:android        # build nativo + instalação no emulador
npx tsc --noEmit            # tipos
npx expo lint               # lint
npx expo install <pacote>   # SEMPRE em vez de npm install (versões do SDK)
```

Rode `tsc` e `lint` antes de dar uma tarefa como pronta. Mudou dependência nativa, `app.json` ou plugin?
Precisa de build nativo novo (`expo run:android`); só JS → basta o Metro.

### Build Android no Windows

- `JAVA_HOME` = JDK 17 (`C:\Program Files\Java\jdk-17`). O JDK 25 padrão quebra o CMake do React Native.
- Defina `ANDROID_HOME` (`%LOCALAPPDATA%\Android\Sdk`): `prebuild --clean` apaga `android/local.properties`.
- CMake **3.31.6** instalado no SDK Manager (plugin `plugins/with-windows-cmake.js`): o ninja do 3.22.1
  falha com caminhos > 260 caracteres.
- `react-native.config.js` tira do build Android reanimated, worklets e gesture-handler (não usados).
- `android/` é gerado (CNG): nunca edite à mão; configure por `app.json` e `plugins/`.

## Armadilhas conhecidas

- **Abas headless do expo-router 58:** `backBehavior` (`history`/`fullHistory`) quebra a aba Home. Para
  "voltar", mantenha histórico próprio e troque de aba com `useTabTrigger().switchTab`; `router.navigate`
  a partir da top bar dessincroniza a aba ativa.
- `TabTrigger asChild` injeta `flexDirection: 'row'` no filho: o estilo do item deve vir por último e fixar a direção.
- SVG baixado do Figma com `style="display: block;"` na raiz quebra no React Native — remova o atributo.
- Splash: `SplashScreen.preventAutoHideAsync()` no layout raiz; sem `hideAsync()` o app fica preso e dá ANR.
- Emulador: `uiautomator dump` pode vir desatualizado e `screencap` preto quando o app está em ANR —
  confira o foco com `adb shell dumpsys window | grep mCurrentFocus`.

## Git

Gitflow com `develop` como base (`feat/`, `fix/`, `hotfix/`, `release/`), PR para `develop`,
Conventional Commits em português sem acento no assunto (ex.: `feat(lembretes): criar store de tipos`).
Não comite nem faça push sem pedido explícito.
