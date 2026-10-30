import type { Href } from 'expo-router';
import { TabList, TabSlot, Tabs, TabTrigger, useTabTrigger } from 'expo-router/ui';
import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';

import IconeHome from '@/assets/bottom-bar/home.svg';
import IconeAjustes from '@/assets/bottom-bar/settings.svg';
import IconeExercicios from '@/assets/bottom-bar/task.svg';
import { BottomBar, BottomBarItem, type BottomBarIcone } from '@/components/app-bar/bottom-bar';
import { TopBar } from '@/components/app-bar/top-bar';

const ABAS: { name: string; href: Href; Icone: BottomBarIcone; rotulo: string }[] = [
  { name: 'index', href: '/', Icone: IconeHome, rotulo: 'Home' },
  { name: 'exercicios', href: '/exercicios', Icone: IconeExercicios, rotulo: 'Exercícios' },
  { name: 'configuracoes', href: '/configuracoes', Icone: IconeAjustes, rotulo: 'Ajustes' },
];

const semAcao = () => { };

/**
 * Top bar com histórico de abas próprio: o backBehavior das abas headless do expo-router
 * quebra a aba Home. Fica dentro de <Tabs> para trocar de aba pelo próprio navegador.
 */
const BarraSuperior = () => {
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
    const assinatura = BackHandler.addEventListener('hardwareBackPress', voltar);
    return () => assinatura.remove();
  });

  return <TopBar onVoltar={podeVoltar ? voltar : undefined} onAjuda={semAcao} onAudio={semAcao} />;
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
