import React from 'react';
import { StyleSheet, View } from 'react-native';

//ThirdParty
import { ActivityIndicator, useTheme } from 'react-native-paper';

const LoadingPlaceHolder = () => {
  //Consts
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingPlaceHolder;
