import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
  type ExpoSpeechRecognitionErrorCode,
} from 'expo-speech-recognition';
import { useCallback, useEffect, useState } from 'react';

export type EstadoEscuta =
  | 'ouvindo'
  | 'concluido'
  | 'sem-fala'
  | 'sem-permissao'
  | 'indisponivel'
  | 'sem-internet'
  | 'erro';

const ESTADO_DO_ERRO: Partial<Record<ExpoSpeechRecognitionErrorCode, EstadoEscuta>> = {
  'no-speech': 'sem-fala',
  'speech-timeout': 'sem-fala',
  'not-allowed': 'sem-permissao',
  'service-not-allowed': 'indisponivel',
  'language-not-supported': 'indisponivel',
  network: 'sem-internet',
};

const INTERVALO_VOLUME = 100;
const VOLUME_MINIMO = -2;
const VOLUME_MAXIMO = 10;

const normalizarVolume = (valor: number) =>
  Math.min(1, Math.max(0, (valor - VOLUME_MINIMO) / (VOLUME_MAXIMO - VOLUME_MINIMO)));

const iniciar = async (frases: string[]): Promise<EstadoEscuta | null> => {
  if (!ExpoSpeechRecognitionModule.isRecognitionAvailable()) return 'indisponivel';
  const { granted } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
  if (!granted) return 'sem-permissao';
  ExpoSpeechRecognitionModule.start({
    lang: 'pt-BR',
    interimResults: true,
    maxAlternatives: 5,
    contextualStrings: frases,
    volumeChangeEventOptions: { enabled: true, intervalMillis: INTERVALO_VOLUME },
  });
  return null;
};

export const useEscutaVoz = (frases: string[], aoOuvir: (falas: string[]) => void) => {
  const [estado, setEstado] = useState<EstadoEscuta>('ouvindo');
  const [parcial, setParcial] = useState('');
  const [volume, setVolume] = useState(0);

  const comecar = useCallback(() => {
    iniciar(frases).then((erro) => {
      if (erro) setEstado(erro);
    });
  }, [frases]);

  useEffect(() => {
    comecar();
    return () => ExpoSpeechRecognitionModule.abort();
  }, [comecar]);

  useSpeechRecognitionEvent('result', ({ results, isFinal }) => {
    const falas = results.map((resultado) => resultado.transcript);
    setParcial(falas[0] ?? '');
    if (!isFinal) return;
    setEstado('concluido');
    aoOuvir(falas);
  });

  useSpeechRecognitionEvent('volumechange', ({ value }) => {
    setVolume(normalizarVolume(value));
  });

  useSpeechRecognitionEvent('error', ({ error }) => {
    if (error !== 'aborted') setEstado(ESTADO_DO_ERRO[error] ?? 'erro');
  });

  useSpeechRecognitionEvent('end', () => {
    setEstado((atual) => (atual === 'ouvindo' ? 'sem-fala' : atual));
  });

  const ouvirDeNovo = () => {
    setParcial('');
    setVolume(0);
    setEstado('ouvindo');
    comecar();
  };

  return { estado, parcial, volume, ouvirDeNovo };
};
