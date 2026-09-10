import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';

import { AuthNavigator } from './src/navigation/AuthNavigator';
import { colors } from './src/theme/colors';
import { useBrandFonts } from './src/hooks/useBrandFonts';

export default function App() {
  const fontsLoaded = useBrandFonts();

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.honey} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <AuthNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    backgroundColor: colors.black,
    flex: 1,
    justifyContent: 'center'
  }
});
