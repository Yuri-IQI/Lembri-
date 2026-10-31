import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { TopBar } from '@/components/app-bar/top-bar';
import { AvisoSucesso } from '@/components/aviso-sucesso';
import {
  CardsTemplateSelecao,
  type TemplateOpcao,
} from '@/components/formulario/cards-template-selecao';
import { FormularioLembrete } from '@/components/formulario/formulario-lembrete';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useLembretesStore } from '@/stores/useLembretesStore';
import type { CriarLembreteInput } from '@/types/lembrete';

const semAcao = () => {};

/**
 * Tela de Criação de Lembrete com Seleção de Templates em 2 Passos (CARD-33 - Figma 152:1551).
 */
const NovoLembreteScreen = () => {
  const [etapa, setEtapa] = useState<'templates' | 'formulario'>('templates');
  const [dadosIniciais, setDadosIniciais] = useState<Partial<CriarLembreteInput>>({});
  const [sucesso, setSucesso] = useState<string | null>(null);

  const adicionarLembrete = useLembretesStore((state) => state.adicionarLembrete);

  const handleVoltar = () => {
    if (etapa === 'formulario') {
      setEtapa('templates');
    } else {
      router.back();
    }
  };

  const handleEscolherTemplate = (template: TemplateOpcao) => {
    if (template === 'remedio') {
      setDadosIniciais({
        titulo: 'Tomar remédio',
        tipoId: 'tipo-saude',
        horarios: ['08:00', '14:00', '20:00'],
        dias: [0, 1, 2, 3, 4, 5, 6],
        exigeConfirmacao: true,
        templateOrigem: 'remedio',
      });
    } else if (template === 'compromisso') {
      setDadosIniciais({
        titulo: 'Consulta médica',
        horarios: ['10:00'],
        dias: [1, 2, 3, 4, 5],
        exigeConfirmacao: false,
        templateOrigem: 'compromisso',
      });
    } else {
      setDadosIniciais({
        titulo: '',
        horarios: ['08:00'],
        dias: [0, 1, 2, 3, 4, 5, 6],
        exigeConfirmacao: false,
        templateOrigem: 'livre',
      });
    }
    setEtapa('formulario');
  };

  const handleSalvar = (input: CriarLembreteInput) => {
    adicionarLembrete(input);
    setSucesso(`Lembrete "${input.titulo}" criado com sucesso!`);
    setTimeout(() => {
      router.back();
    }, 1200);
  };

  return (
    <View style={styles.tela}>
      <TopBar onVoltar={handleVoltar} onAjuda={semAcao} onAudio={semAcao} />

      <ScrollView contentContainerStyle={styles.conteudo}>
        <ThemedText type="title" accessibilityRole="header">
          {etapa === 'templates' ? 'Criar Lembrete' : 'Configurar Lembrete'}
        </ThemedText>

        {sucesso && (
          <AvisoSucesso mensagem={sucesso} onFechar={() => router.back()} />
        )}

        {etapa === 'templates' ? (
          <CardsTemplateSelecao onSelecionar={handleEscolherTemplate} />
        ) : (
          <FormularioLembrete
            dadosIniciais={dadosIniciais}
            onSalvar={handleSalvar}
            rotuloBotao="SALVAR"
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },
  conteudo: {
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four * 2,
  },
});

export default NovoLembreteScreen;
