import { router } from 'expo-router';

import { useVozStore } from '@/stores/useVozStore';
import type { ComandoVoz, ContextoVoz } from '@/types/comando-voz';

const ABAS = [
  { aba: 'index', rotulo: 'Início', frases: ['início', 'home', 'tela inicial', 'principal'] },
  { aba: 'exercicios', rotulo: 'Exercícios', frases: ['exercícios'] },
  { aba: 'lembretes', rotulo: 'Lembretes', frases: ['lembretes'] },
  { aba: 'configuracoes', rotulo: 'Ajustes', frases: ['ajustes', 'configurações'] },
];

// router.navigate dessincroniza a aba ativa: quem troca é a barra das abas, com switchTab.
const irParaAba = (aba: string) => {
  if (router.canDismiss()) router.dismissAll();
  useVozStore.getState().pedirAba(aba);
};

export const comandosGerais = ({ voltar, saidaProtegida }: ContextoVoz): ComandoVoz[] => {
  const sair = (destino: () => void) => (saidaProtegida ? voltar?.() : destino());

  const comandos: ComandoVoz[] = [
    ...ABAS.map(({ aba, rotulo, frases }) => ({
      id: `aba-${aba}`,
      rotulo,
      frases,
      executar: () => sair(() => irParaAba(aba)),
    })),
    {
      id: 'novo-lembrete',
      rotulo: 'Novo lembrete',
      frases: ['novo lembrete', 'criar lembrete'],
      executar: () => sair(() => router.navigate('/lembrete/novo')),
    },
    {
      id: 'ajuda',
      rotulo: 'Ajuda',
      frases: ['ajuda'],
      executar: () => router.navigate('/ajuda'),
    },
  ];

  if (!voltar) return comandos;
  return [
    ...comandos,
    { id: 'voltar', rotulo: 'Voltar', frases: ['voltar', 'volta', 'volte'], executar: voltar },
  ];
};
