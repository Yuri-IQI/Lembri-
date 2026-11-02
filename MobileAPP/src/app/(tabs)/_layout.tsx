import { useNavigation } from 'expo-router';
import { TabList, TabSlot, Tabs, TabTrigger, useTabTrigger } from 'expo-router/ui';
import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';

import { BottomBar, BottomBarItem } from '@/components/app-bar/bottom-bar';
import { TopBar } from '@/components/app-bar/top-bar';
import { useVozStore } from '@/stores/useVozStore';

import { navigationTabs as ABAS } from '@/constants/navigation';

/**
 * Top bar com histórico de abas próprio: o backBehavior das abas headless do expo-router
 * quebra a aba Home. Fica dentro de <Tabs> para trocar de aba pelo próprio navegador.
 */
const BarraSuperior = () => {
  const navigation = useNavigation();
  const { switchTab, getTrigger } = useTabTrigger({ name: ABAS[0].name });
  const abaAtual = ABAS.find((aba) => getTrigger(aba.name)?.isFocused)?.name ?? ABAS[0].name;

  const [historico, setHistorico] = useState<string[]>([abaAtual]);
  // Aba para onde o "voltar" está indo; até chegar nela, a aba atual não entra no histórico.
  const [destino, setDestino] = useState<string | null>(null);

  if (destino !== null) {
    if (abaAtual === destino) setDestino(null);
  } else if (historico[historico.length - 1] !== abaAtual) {
    setHistorico([...historico, abaAtual]);
  }

  const podeVoltar = historico.length > 1;

  const voltar = () => {
    if (!podeVoltar) return false;
    const anteriores = historico.slice(0, -1);
    const anterior = anteriores[anteriores.length - 1];
    setHistorico(anteriores);
    setDestino(anterior);
    switchTab(anterior, {});
    return true;
  };

  useEffect(() => {
    // Com outra tela por cima das abas, o botão voltar do Android é dela.
    const assinatura = BackHandler.addEventListener(
      'hardwareBackPress',
      () => navigation.isFocused() && voltar()
    );
    return () => assinatura.remove();
  });

  const abaPedida = useVozStore((state) => state.abaPedida);
  const limparAbaPedida = useVozStore((state) => state.limparAbaPedida);

  useEffect(() => {
    if (!abaPedida) return;
    switchTab(abaPedida, {});
    limparAbaPedida();
  }, [abaPedida, switchTab, limparAbaPedida]);

  return <TopBar onVoltar={podeVoltar ? voltar : undefined} />;
};

const TabsLayout = () => {
  return (
    <Tabs>
      <BarraSuperior />
      <TabSlot />
      <TabList asChild>
        <BottomBar>
          {ABAS.map((aba) => (
            <TabTrigger key={aba.name} name={aba.name} href={aba.href} asChild>
              <BottomBarItem Icone={aba.Icone} rotulo={aba.rotulo} />
            </TabTrigger>
          ))}
        </BottomBar>
      </TabList>
    </Tabs>
  );
};

export default TabsLayout;
