import React from 'react';
import { View, StyleSheet } from 'react-native';

//ThirdParty
import { useTheme, Text } from 'react-native-paper';

const AppMiniBanner = (props: { message: string }) => {
  //Const
  const { colors } = useTheme();
  const { message } = props;

  return (
    <View style={[styles.container, { backgroundColor: colors.error }]}>
      <Text style={[styles.titleTextStyle, { color: colors.onSurface }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  titleTextStyle: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default AppMiniBanner;
