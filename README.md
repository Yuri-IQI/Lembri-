# Lembri: celular + relógio

Versão pública: https://github.com/Yuri-IQI/Lembri-

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
Encerre um daemon do Gradle que tenha ficado aberto com outro JDK. Ele ignora o `JAVA_HOME` novo:
```powershell
.\gradlew.bat --stop
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
Ajuste o caminho para o seu JDK 17. O `ANDROID_HOME` evita o erro de SDK depois de um `prebuild --clean`:
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"; $env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
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
Esse comando trava o Metro que estiver aberto: reinicie-o depois.

### 4. Sincronizar os emuladores

Os AVDs conversam pela porta 5601 do PC, e esse redirecionamento pode sumir. Recrie-o a cada sessão.
Troque `emulator-5554` pelo serial do **celular**:
```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" -s emulator-5554 forward tcp:5601 tcp:5601
```

A reconexão pode levar cerca de 2 minutos. Para conferir, troque `emulator-5556` pelo serial do **relógio**.
A saída deve mostrar `1 connected out of 1`:
```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" -s emulator-5556 shell dumpsys activity service com.google.android.gms/.wearable.service.WearableService | Select-String "connected out of"
```

Confira também a data do relógio. Ele só mostra os lembretes da data dele, então ela precisa ser a de hoje:
```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" -s emulator-5556 shell date
```

Abra o Lembri no celular para publicar a agenda. O relógio recebe mesmo com o app dele fechado.

### 5. Testar

1. Crie no celular um lembrete para hoje, em um horário que ainda não passou. Ele aparece no relógio como próximo lembrete ou em **Mais tarde**.
2. Toque em **Feito** no próximo lembrete do relógio e espere os 10 segundos de **Desfazer**. O lembrete aparece como feito no celular.
3. Deixe um lembrete chegar ao horário. O relógio avisa por conta própria, e o aviso abre o app ao ser tocado. Na primeira abertura, permita as notificações.
4. Faça **Sequência** ou **Guardar no lugar** no relógio. A tentativa aparece no histórico do exercício no celular, marcada como **Relógio**.

**Logs:**
- **Celular (JS):** aparecem no Terminal 2 (Metro).
- **Celular (serviço que recebe eventos):**
```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" -s emulator-5554 logcat -s EventosRelogio
```
- **Relógio:**
```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" -s emulator-5556 logcat -s AgendaRepository
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
| `jlink.exe` falha no build do relógio | O Gradle está usando a GraalVM, mesmo com outro `JAVA_HOME`: o relógio exige Java 25, e um daemon antigo pode ser reaproveitado. Defina o JBR do Android Studio, rode `.\gradlew.bat --stop` e repita o build. O JDK 17 serve só para o celular |
| `configureCMakeDebug ... restricted method` no build do celular | JDK 24+. Use o JDK 17 |
| `SDK location not found` | O `prebuild --clean` apaga `android/local.properties`. Defina `$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"` e repita |
| `Could not find device with name` | O `--device` espera o nome do AVD (`Pixel_10_Pro`), não o serial |
| `adb.exe: more than one device/emulator` | Há dois emuladores ligados. Use `adb -s <serial>` ou defina `$env:ANDROID_SERIAL` |
| Build do celular instala no relógio, ou o contrário | `ANDROID_SERIAL` ou `JAVA_HOME` ficou de outro app no terminal. Use um terminal para cada app |
| `Wearable.API is not available on this device` | O celular não tem o app companion ou não está pareado. Veja [Parear o relógio com o celular](#4-parear-o-relógio-com-o-celular) |
| Celular na tela branca/preta | O Metro não está rodando. Rode `npx expo start --dev-client` |
| Metro parou de responder depois do `prebuild --clean` | Encerre e suba o Metro de novo |
| Tela de inicialização antiga no celular | A imagem é nativa. Rode `npx expo prebuild -p android --clean` e depois `npx expo run:android --device Pixel_10_Pro` |
| Relógio mostra **Sem conexão com o celular** ou `0 connected out of 1` | Falta o redirecionamento: refaça [Sincronizar os emuladores](#4-sincronizar-os-emuladores). Sem conexão depois de 2 minutos? Rode `adb -s <relógio> reverse tcp:5601 tcp:5601` e `adb -s <aparelho> shell am force-stop com.google.android.gms` nos dois |
| Relógio mostra **Nenhum lembrete para hoje**, mas o celular tem lembretes | Veja a data com `adb -s <relógio> shell date`. Se estiver errada, encerre com `adb -s <relógio> emu kill` e ligue sem snapshot: `emulator.exe -avd Wear_OS_Small_Round -no-snapshot-load`. Se continuar errada, ajuste a data nas configurações do relógio |
| Relógio mostra **Abra o Lembri no celular** | Ele ainda não recebeu nenhuma agenda. Confira a conexão e abra o app no celular |
| Relógio não avisa no horário do lembrete | Confira se as notificações do Lembri estão permitidas no relógio, se a data dele está certa e se a agenda chegou depois do último horário alterado |
| Conectado, mas os dados não passam entre os apps | Os dois precisam ter o mesmo `applicationId` e a mesma assinatura. Veja [Requisitos](#requisitos-para-a-comunicação-funcionar) |
| Pareamento inconsistente | Repita **Pair Wearable**. Se não resolver, siga **Recomeçar do zero** nas [Dicas](#dicas) |
| App não abre no Expo Go | Esperado: o módulo nativo exige development build (`run:android`) |

## Exemplo implementado

```
Celular                                         Relógio
───────                                         ───────
Stores de lembretes ── /lembri/agenda ────────▶ LembriWearListenerService
  (hoje + amanhã)        DataItem único               │
                                                      ▼
                                                AgendaRepository ─▶ tela atualiza
                                                      │
EventosRelogioService ◀── /lembri/eventos/<uuid> ── Feito ou exercício concluído
  └▶ processa e apaga    um DataItem por evento
```

Tudo trafega por DataItems: o que for gravado sem conexão é entregue quando os aparelhos se
reencontram. O serviço do celular acorda o app mesmo com o processo morto (tarefa headless).

## Arquitetura

### Contrato compartilhado
O "idioma" entre os apps (paths, capabilities, JSON) fica definido em **dois arquivos espelhados**:

- `WearableAPP/.../data/comunicacao/ContratoComunicacao.kt` (+ `data/model/AgendaRelogio.kt` e `EventoRelogio.kt`)
- `MobileAPP/src/services/wear/contrato.ts`

Mudou um? Mude o outro.

### MobileAPP (camadas)
```
src/hooks/use-sincronizar-relogio.ts   Publica a agenda e lê eventos com o app aberto
src/services/wear/
  ├─ contrato.ts                  Paths, capabilities e tipos
  ├─ wear-service.ts              Publica a agenda, lista e apaga eventos
  ├─ montar-agenda.ts             Ocorrências de hoje e amanhã para o relógio
  ├─ sincronizar-agenda.ts        Publica só quando a agenda muda
  ├─ ler-evento.ts                Valida o JSON recebido
  ├─ processar-eventos.ts         Aplica nas stores, cancela avisos, republica e apaga
  └─ tarefa-eventos.ts            Registra a tarefa headless (importado em index.ts)
modules/wear-connector/           Módulo nativo Expo (Kotlin), transporte genérico
  ├─ index.ts                     API JS tipada (null no iOS/web/Expo Go)
  └─ android/.../
      ├─ WearConnectorModule.kt   DataClient + CapabilityClient + NodeClient
      └─ EventosRelogioService.kt Acorda o app quando chega um evento
plugins/with-shared-debug-keystore.js     Alinha a assinatura de debug com o relógio
```

### WearableAPP (MVVM + repositório)
```
LembriWearApplication.kt          Cria o AppContainer (DI manual)
di/AppContainer.kt                Instâncias únicas compartilhadas
data/comunicacao/
  ├─ ContratoComunicacao.kt       Paths e capabilities
  ├─ CelularDataSource.kt         Lê a agenda, grava eventos, checa a conexão
  └─ LembriWearListenerService.kt Recebe a agenda (mesmo com o app fechado)
data/avisos/                      Alarmes e notificações dos lembretes no relógio
data/model/                       Agenda, lembrete e evento + JSON
data/repository/
  ├─ AgendaRepository.kt          Fonte única da verdade (StateFlow)
  └─ FeitosLocais.kt              Feitos e desfazer pendente (SharedPreferences)
presentation/
  ├─ MainActivity.kt              Ponto de entrada
  ├─ navigation/                  Rotas e navegação
  ├─ inicio/ sequencia/ guardar/ resumo/   Telas e ViewModels
  ├─ comum/                       Componentes reutilizados
  └─ theme/                       Cores, tipografia e dimensões
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

- **iOS**: Apple Watch não usa Wear OS; exigiria um app watchOS + WatchConnectivity.
