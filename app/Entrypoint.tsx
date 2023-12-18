/**
 * React Native App
 * Everything starts from the entrypoint
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { enableScreens } from 'react-native-screens';
import './locales';
import AppManager from 'app/components/AppManager';
import Navigator from 'app/navigation';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';

/**
 * Optimize memory usage and performance: https://reactnavigation.org/docs/react-native-screens/
 */
enableScreens();

const Entrypoint: React.FC = () => {
  return (
    <View style={styles.container}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <AppManager>
          <Navigator />
        </AppManager>
      </SafeAreaProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default Entrypoint;
