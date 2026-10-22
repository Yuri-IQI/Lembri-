import { router, usePathname, type Href } from 'expo-router';
import { TabList, TabSlot, Tabs, TabTrigger } from 'expo-router/ui';

import IconeLembretes from '@/assets/bottom-bar/bell.svg';
import IconeHome from '@/assets/bottom-bar/home.svg';
import IconeAjustes from '@/assets/bottom-bar/settings.svg';
import IconeExercicios from '@/assets/bottom-bar/task.svg';
import { BottomBar, BottomBarItem, type BottomBarIcone } from '@/components/app-bar/bottom-bar';
import { TopBar } from '@/components/app-bar/top-bar';

const ABAS: { name: string; href: Href; Icone: BottomBarIcone; rotulo: string }[] = [
  { name: 'index', href: '/', Icone: IconeHome, rotulo: 'Home' },
  { name: 'exercicios', href: '/exercicios', Icone: IconeExercicios, rotulo: 'Exercícios' },
  { name: 'lembretes', href: '/lembretes', Icone: IconeLembretes, rotulo: 'Lembretes' },
  { name: 'configuracoes', href: '/configuracoes', Icone: IconeAjustes, rotulo: 'Ajustes' },
];

const semAcao = () => { };

const TabsLayout = () => {
  const pathname = usePathname();
  const abaAtual = ABAS.find((aba) => aba.href === pathname) ?? ABAS[0];

  return (
    <Tabs>
      <TopBar
        titulo={abaAtual.rotulo}
        onVoltar={abaAtual.name === 'index' ? undefined : () => router.navigate('/')}
        onAjuda={semAcao}
        onAudio={semAcao}
      />
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
}

export default TabsLayout;