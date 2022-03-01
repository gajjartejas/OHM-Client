import React from 'react';
import { View, StyleSheet } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { useTheme, Text } from 'react-native-paper';

const AppNoInternetConnection = () => {
  //Consts
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.error }]}>
      <Text style={[styles.titleTextStyle, { color: colors.onPrimary }]}>{t('NO_INTERNET')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleTextStyle: {
    fontSize: 14,
  },
});

export default AppNoInternetConnection;
