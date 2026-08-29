import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

//ThirdParty
import { useTheme, Text, Portal, ActivityIndicator } from 'react-native-paper';

interface IAppLoaderProps {
  message: string;
  portal?: boolean;
  overlay?: boolean;
}

const AppLoader = (props: IAppLoaderProps) => {
  //Const
  const { colors } = useTheme();
  const { message, portal = false, overlay = true } = props;

  const Child = useMemo(() => {
    return (
      <View
        style={[
          styles.container,
          overlay ? styles.overlay : styles.inline,
          { backgroundColor: overlay ? `${colors.background}cc` : 'transparent' },
        ]}
      >
        <ActivityIndicator animating={true} color={colors.primary} />
        <Text style={[styles.titleTextStyle, { color: colors.onSurface }]}>
          {message}
        </Text>
      </View>
    );
  }, [colors.background, colors.onSurface, colors.primary, message, overlay]);

  return portal ? <Portal>{Child}</Portal> : Child;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  inline: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  titleTextStyle: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 12,
  },
});

export default memo(AppLoader);
