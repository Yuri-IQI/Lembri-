# Lembri: celular + relógio

Dois apps que conversam pela **Wearable Data Layer API** (Google Play Services):

| Pasta          | Tecnologia                          | Papel                                        |
|----------------|-------------------------------------|----------------------------------------------|
| `MobileAPP/`   | Expo (React Native) + módulo nativo | Cria lembretes e envia ao relógio            |
| `WearableAPP/` | Kotlin + Compose for Wear OS        | Exibe lembretes e confirma quando concluídos |

## Guia rápido

Comandos em **PowerShell**. Use **dois terminais**, um por app: cada um precisa de um JDK
diferente, e o `JAVA_HOME` definido num terminal vale só para ele.

### Pré-requisitos (uma vez)

| O quê | Detalhe |
|---|---|
| Android Studio + SDK | Com as plataformas e imagens de emulador instaladas |
| Node.js | Para o MobileAPP |
| **JDK 17** | Para o MobileAPP. O React Native quebra com JDK 24+ |
| **JBR do Android Studio** | Para o WearableAPP. Já vem com o Android Studio. A Oracle GraalVM falha no `jlink` |
| AVD de celular | Imagem **com Google Play** (ex.: `Pixel_10_Pro`) |
| AVD Wear OS | Ex.: `Wear_OS_Small_Round` |

Instale as dependências JS:
```powershell
cd MobileAPP; npm install
```

### 1. Ligar os emuladores

Primeira vez? Antes, crie e pareie os AVDs seguindo [Configurar os emuladores](#configurar-os-emuladores).

```powershell
Start-Process "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -ArgumentList "-avd","Pixel_10_Pro"
```
```powershell
Start-Process "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -ArgumentList "-avd","Wear_OS_Small_Round"
```

Anote os seriais (`emulator-55xx`). A numeração **muda entre sessões**:
```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" devices -l
```
O relógio aparece como `sdk_gwear...` e o celular como `sdk_gphone...`.

### 2. Terminal 1: WearableAPP (relógio)

```powershell
cd WearableAPP
```
Troque `emulator-5556` pelo serial do relógio:
```powershell
$env:JAVA_HOME = "$env:LOCALAPPDATA\Programs\Android Studio\jbr"; $env:ANDROID_SERIAL = "emulator-5556"
```
```powershell
.\gradlew.bat :app:installDebug
```
```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" shell am start -n com.borabill.lembriwearable/.presentation.MainActivity
```
Alternativa: abra `WearableAPP/` no Android Studio e clique em **Run**. A IDE já usa o JBR.

### 3. Terminal 2: MobileAPP (celular)

```powershell
cd MobileAPP
```
Ajuste o caminho para o seu JDK 17:
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
```
Este comando compila, instala, sobe o Metro e abre o app (use o **nome do AVD**, não o serial). Deixe o terminal aberto:
```powershell
npx expo run:android --device Pixel_10_Pro
```

Nas próximas vezes, se você **só mudou JS/TS**, basta subir o Metro e apertar `a`:
```powershell
npx expo start --dev-client
```
Rode o `run:android` de novo quando mudar código nativo (`modules/`), `app.json`, plugins ou dependências.
Se mudar `app.json` ou plugins, gere o nativo do zero com `npx expo prebuild -p android --clean`.

### 4. Testar

1. No relógio, o app deve mostrar **"Celular conectado"** (toque em **Atualizar** se preciso).
2. No celular, o card deve mostrar **"Conectado: <nome do relógio>"**.
3. Digite um lembrete no celular e toque em **Enviar ao relógio**.
4. Toque no lembrete no relógio. O celular mostra **"Concluído no relógio ✓"**.

**Logs:**
- **Celular:** os logs do JS aparecem no Terminal 2 (Metro).
- **Relógio:** use o logcat filtrado pelas tags do app:
```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" -s emulator-5556 logcat -s LembriWearListener CelularDataSource
```

## Configurar os emuladores

Faça isso só uma vez. Você vai precisar de **dois AVDs**: um celular com Google Play e um Wear OS.
Os nomes abaixo são os usados nos comandos deste README. Se usar outros, ajuste os comandos.

### 1. Baixar as imagens de sistema

No Android Studio, abra **Tools → SDK Manager → SDK Platforms**, marque **Show Package Details** e instale:

| Para | Imagem (API 37, x86_64) |
|---|---|
| Celular | **Google Play** Intel x86_64 Atom System Image (`google_apis_playstore`) |
| Relógio | **Wear OS** Intel x86_64 Atom System Image (`android-wear`) |

Em **SDK Tools**, confira se estão instalados o **Android Emulator** e o **Android SDK Platform-Tools**.

> A imagem do celular **precisa ser "Google Play"**, e não só "Google APIs". Sem a Play Store
> não dá para instalar o app companion, e sem ele não existe pareamento nem Data Layer.

### 2. Criar o AVD do celular

1. Abra **View → Tool Windows → Device Manager** e clique em **+ → Create Virtual Device**.
2. Na aba **Phone**, escolha **Pixel 10 Pro** (ou outro aparelho com o ícone da Play Store).
3. Selecione a imagem **Google Play, API 37**.
4. Nome do AVD: `Pixel_10_Pro`. Finalize.

Configuração usada aqui: 2 GB de RAM e 10 GB de armazenamento interno.

### 3. Criar o AVD do relógio

1. Clique em **+ → Create Virtual Device**.
2. Na aba **Wear OS**, escolha **Wear OS Small Round**.
3. Selecione a imagem **Wear OS, API 37**.
4. Nome do AVD: `Wear_OS_Small_Round`. Finalize.

### 4. Parear o relógio com o celular

1. Ligue os dois AVDs (Device Manager → ▶).
2. **No celular**, abra a Play Store e faça login com uma conta Google.
3. No Device Manager, clique em **⋮** no `Wear_OS_Small_Round` e escolha **Pair Wearable**.
4. Escolha o `Pixel_10_Pro` e clique em **Next**. O assistente pode reiniciar os emuladores.
5. O assistente abre a Play Store do celular no app companion (**Pixel Watch** ou **Wear OS by Google**). Instale e abra.
6. Siga o fluxo do app companion e confirme o código nos dois aparelhos.
7. Quando o assistente mostrar **Pairing successful**, terminou.

O pareamento fica salvo nos AVDs. Nas próximas vezes, basta ligar os dois.
Se o pareamento cair depois de reiniciar os emuladores, repita **Pair Wearable** (não é preciso reinstalar o companion).

### 5. Conferir se está tudo certo

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" devices -l
```
Os dois devem aparecer como `device`: o celular como `sdk_gphone...` e o relógio como `sdk_gwear...`.
No celular, o app companion deve mostrar o relógio como **Conectado**.

### Dicas

- **Desempenho:** ative a aceleração de hardware (no Windows, **Windows Hypervisor Platform**
  em *Recursos do Windows*). Emulador sem aceleração fica lento demais para os dois juntos.
- **Recomeçar do zero:** se o pareamento ficar inconsistente, use **⋮ → Unpair** no relógio,
  **⋮ → Wipe Data** nos dois AVDs e pareie de novo.
- **Aparelhos reais** também funcionam: pareie o relógio pelo app companion normalmente e
  ative a depuração (USB no celular; Wi-Fi/ADB no relógio).

## Problemas comuns

| Sintoma | Causa / solução |
|---|---|
| `jlink.exe` falha no build do relógio | `JAVA_HOME` aponta para a GraalVM. Use o JBR do Android Studio |
| `configureCMakeDebug ... restricted method` no build do celular | JDK 24+. Use o JDK 17 |
| `SDK location not found` | Crie `MobileAPP/android/local.properties` com `sdk.dir=C:\\Users\\<você>\\AppData\\Local\\Android\\Sdk` ou defina `ANDROID_HOME` |
| `Could not find device with name` | O `--device` espera o nome do AVD (`Pixel_10_Pro`), não o serial |
| `Wearable.API is not available on this device` | O celular não tem o app companion ou não está pareado. Veja o passo 1 |
| Celular na tela branca/preta | O Metro não está rodando. Rode `npx expo start --dev-client` |
| Os apps não se encontram | Confira se os dois estão instalados e se o pareamento está ativo. Se necessário, faça **Cold Boot** nos dois AVDs e reinstale os apps |
| App não abre no Expo Go | Esperado: o módulo nativo exige development build (`run:android`) |

## Exemplo implementado

```
Celular                                         Relógio
───────                                         ───────
[Enviar ao relógio] ── /lembri/lembrete ──────▶ LembriWearListenerService
                         {id, titulo, horario}        │
                                                      ▼
                                                LembreteRepository ─▶ tela atualiza
                                                      │
Lembrete "Concluído ✓" ◀── /lembri/confirmacao ── toque no lembrete
                         {lembreteId, concluidoEm}
```

## Arquitetura

### Contrato compartilhado
O "idioma" entre os apps (paths, capabilities, JSON) fica definido em **dois arquivos espelhados**:

- `WearableAPP/.../data/comunicacao/ContratoComunicacao.kt` (+ `data/model/Lembrete.kt`)
- `MobileAPP/src/services/wear/contrato.ts`

Mudou um? Mude o outro.

### MobileAPP (camadas)
```
src/app/index.tsx                 Tela: só usa o hook
src/hooks/use-wear.ts             Estado React (relógios, lembretes enviados)
src/services/wear/
  ├─ contrato.ts                  Paths, capabilities e tipos
  └─ wear-service.ts              Regras: monta JSON, envia, filtra respostas
modules/wear-connector/           Módulo nativo Expo (Kotlin), transporte genérico
  ├─ index.ts                     API JS tipada (null no iOS/web/Expo Go)
  └─ android/.../WearConnectorModule.kt   MessageClient + CapabilityClient + NodeClient
plugins/with-shared-debug-keystore.js     Alinha a assinatura de debug com o relógio
```

### WearableAPP (MVVM + repositório)
```
LembriWearApplication.kt          Cria o AppContainer (DI manual)
di/AppContainer.kt                Instâncias únicas compartilhadas
data/comunicacao/
  ├─ ContratoComunicacao.kt       Paths e capabilities
  ├─ CelularDataSource.kt         Envia mensagens ao celular
  └─ LembriWearListenerService.kt Recebe mensagens (mesmo com o app fechado)
data/model/Lembrete.kt            Modelos + JSON
data/repository/LembreteRepository.kt   Fonte única da verdade (StateFlow)
presentation/
  ├─ MainActivity.kt              Liga ViewModel → tela
  ├─ LembretesViewModel.kt        UiState + ações
  └─ LembretesScreen.kt           UI stateless (com preview)
```

## Requisitos para a comunicação funcionar

1. **Mesmo `applicationId`** nos dois apps: `com.borabill.lembriwearable`
   (`WearableAPP/app/build.gradle.kts` e `android.package` em `MobileAPP/app.json`).
2. **Mesma chave de assinatura.** Em debug, o plugin `with-shared-debug-keystore`
   faz o Expo usar `~/.android/debug.keystore`, a mesma do Android Studio.
   Em release, configure a mesma keystore nos dois projetos.
3. **Capabilities** declaradas em `res/values/wear.xml` de cada lado
   (`lembri_mobile` no celular, `lembri_wear` no relógio). Se a capability não propagar
   (acontece em emuladores), os dois apps usam os nós conectados (`NodeClient`) como fallback.
4. O app mobile precisa de um **development build**. O Expo Go não inclui módulos nativos customizados.

## Próximos passos sugeridos

- **Persistência**: trocar o `MutableStateFlow` do `LembreteRepository` por Room/DataStore
  e o `useState` do `use-wear.ts` por `expo-sqlite`.
- **Sincronizar estado** (não só eventos): usar `DataClient` (DataItems), que entrega mesmo
  se o outro lado estiver offline no momento do envio. `MessageClient` é "dispare e esqueça".
- **Receber no celular com o app fechado**: criar um `WearableListenerService` dentro do
  módulo `wear-connector` (hoje o celular só ouve enquanto a tela está aberta).
- **iOS**: Apple Watch não usa Wear OS; exigiria um app watchOS + WatchConnectivity.
