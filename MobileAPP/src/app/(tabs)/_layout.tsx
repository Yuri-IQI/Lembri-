import { useNavigation, type Href } from 'expo-router';
import { TabList, TabSlot, Tabs, TabTrigger, useTabTrigger } from 'expo-router/ui';
import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';

import IconeHome from '@/assets/bottom-bar/home.svg';
import IconeAjustes from '@/assets/bottom-bar/settings.svg';
import IconeExercicios from '@/assets/bottom-bar/task.svg';
import IconeLembretes from '@/assets/bottom-bar/bell.svg';
import { BottomBar, BottomBarItem, type BottomBarIcone } from '@/components/app-bar/bottom-bar';
import { TopBar } from '@/components/app-bar/top-bar';
import { useVozStore } from '@/stores/useVozStore';

const ABAS: { name: string; href: Href; Icone: BottomBarIcone; rotulo: string }[] = [
  { name: 'index', href: '/', Icone: IconeHome, rotulo: 'Home' },
  { name: 'exercicios', href: '/exercicios', Icone: IconeExercicios, rotulo: 'Exercícios' },
  { name: 'lembretes', href: '/lembretes', Icone: IconeLembretes, rotulo: 'Lembretes' },
  { name: 'configuracoes', href: '/configuracoes', Icone: IconeAjustes, rotulo: 'Ajustes' },
];

const BarraSuperior = () => {
  const navigation = useNavigation();
  const { switchTab, getTrigger } = useTabTrigger({ name: ABAS[0].name });
  const abaAtual = ABAS.find((aba) => getTrigger(aba.name)?.isFocused)?.name ?? ABAS[0].name;

  const [historico, setHistorico] = useState<string[]>([abaAtual]);
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
