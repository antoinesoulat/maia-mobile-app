import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { API_URL } from './src/config/env';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Maia</Text>
      <Text style={styles.subtitle}>Expo environment ready</Text>
      <Text style={styles.meta}>API: {API_URL}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f8faf9',
    flex: 1,
    justifyContent: 'center',
    padding: 24
  },
  meta: {
    color: '#68736f',
    fontSize: 14
  },
  subtitle: {
    color: '#2f3d38',
    fontSize: 18,
    marginBottom: 12
  },
  title: {
    color: '#17352b',
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 8
  }
});
