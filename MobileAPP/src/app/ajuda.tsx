import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BottomBar, BottomBarItem } from '@/components/app-bar/bottom-bar';
import { TopBar } from '@/components/app-bar/top-bar';
import { FaqSection } from '@/components/help/faq-section';
import { SupportSection } from '@/components/help/support-section';
import { MainContainer } from '@/components/main-container';
import { ThemedView } from '@/components/themed-view';
import { navigationTabs } from '@/constants/navigation';
import { Spacing } from '@/constants/theme';
import { watchHelpMock } from '@/mocks/help.mock';
import { focusAccessibleElement } from '@/utils/accessibility-focus';

const goBack = () => router.canGoBack() ? router.back() : router.replace('/configuracoes');

export default function HelpScreen() {
  const { section } = useLocalSearchParams<{ section?: string }>();
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const headingRef = useRef<ComponentRef<typeof Text>>(null);
  const positioned = useRef(false);
  const [contactY, setContactY] = useState<number | null>(null);
  const [contentHeight, setContentHeight] = useState(0);
  useEffect(() => {
    if (section !== 'contact' || contactY === null || contentHeight === 0 || positioned.current) return;
    const frame = requestAnimationFrame(() => {
      positioned.current = true;
      scrollRef.current?.scrollTo({ y: contactY, animated: false });
      void focusAccessibleElement(headingRef.current);
    });
    return () => cancelAnimationFrame(frame);
  }, [section, contactY, contentHeight]);
  useEffect(() => {
    const back = BackHandler.addEventListener('hardwareBackPress', () => { goBack(); return true; });
    return () => back.remove();
  }, []);
  return (
    <ThemedView style={styles.screen}>
      <TopBar semAjuda titulo="Ajuda" onVoltar={goBack} />
      <MainContainer>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.content}
          onContentSizeChange={(_width, height) => setContentHeight(height)}>
          <FaqSection />
          <FaqSection items={watchHelpMock} title="Usar o relógio" initiallyExpanded={false} />
          <View onLayout={(event) => setContactY(event.nativeEvent.layout.y)}>
            <SupportSection headingRef={headingRef} />
          </View>
        </ScrollView>
      </MainContainer>
      <BottomBar>{navigationTabs.map((tab) => <BottomBarItem key={tab.name} Icone={tab.Icone} rotulo={tab.rotulo}
        isFocused={false} onPress={() => router.dismissTo(tab.href)} />)}</BottomBar>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { gap: Spacing.four, paddingBottom: Spacing.four },
});
