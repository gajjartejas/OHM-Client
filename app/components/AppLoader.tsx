import React from 'react';
import { View, StyleSheet } from 'react-native';

//ThirdParty
import { useTheme, Text, Portal, ActivityIndicator } from 'react-native-paper';

const AppLoader = (props: { message: string }) => {
  //Const
  const { colors } = useTheme();
  const { message } = props;

  return (
    <Portal>
      <View style={styles.container}>
        <ActivityIndicator animating={true} color={colors.primary} />
        <Text style={[styles.titleTextStyle, { color: colors.onSurface }]}>{message}</Text>
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  titleTextStyle: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 12,
  },
});

export default AppLoader;
