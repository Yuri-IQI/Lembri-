import type { Href } from 'expo-router';

import ReminderIcon from '@/assets/bottom-bar/bell.svg';
import HomeIcon from '@/assets/bottom-bar/home.svg';
import SettingsIcon from '@/assets/bottom-bar/settings.svg';
import ExerciseIcon from '@/assets/bottom-bar/task.svg';
import type { BottomBarIcone } from '@/components/app-bar/bottom-bar';

export const navigationTabs: { name: string; href: Href; Icone: BottomBarIcone; rotulo: string }[] = [
  { name: 'index', href: '/', Icone: HomeIcon, rotulo: 'Home' },
  { name: 'exercicios', href: '/exercicios', Icone: ExerciseIcon, rotulo: 'Exercícios' },
  { name: 'lembretes', href: '/lembretes', Icone: ReminderIcon, rotulo: 'Lembretes' },
  { name: 'configuracoes', href: '/configuracoes', Icone: SettingsIcon, rotulo: 'Ajustes' },
];
