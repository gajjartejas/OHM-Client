import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

//ThirdParty
import { useTheme, Text, Portal, ActivityIndicator } from 'react-native-paper';

interface IAppLoaderProps {
  message: string;
  portal?: boolean;
}

const AppLoader = (props: IAppLoaderProps) => {
  //Const
  const { colors } = useTheme();
  const { message, portal } = props;

  const Child = (
    <View style={[styles.container, { backgroundColor: `${colors.background}cc` }]}>
      <ActivityIndicator animating={true} color={colors.primary} />
      <Text style={[styles.titleTextStyle, { color: colors.onSurface }]}>{message}</Text>
    </View>
  );

  return portal ? <Portal>{Child}</Portal> : Child;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleTextStyle: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 12,
  },
});

export default memo(AppLoader);
