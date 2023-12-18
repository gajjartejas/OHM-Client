import React, { memo } from 'react';
import { StyleSheet } from 'react-native';

//ThirdParty
import { useTheme, Text, TouchableRipple } from 'react-native-paper';

interface IAppMiniBanner {
  onPress?: () => void;
  message: string;
  RightViewComponent?: React.JSX.Element | null;
}

const AppMiniBanner = (props: IAppMiniBanner) => {
  //Const
  const { colors } = useTheme();
  const { message, RightViewComponent, onPress } = props;

  return (
    <TouchableRipple onPress={onPress} style={[styles.container, { backgroundColor: colors.error }]}>
      <>
        <Text style={[styles.titleTextStyle, { color: colors.onSurface }]}>{message}</Text>
        {RightViewComponent}
      </>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
    minHeight: 40,
  },
  titleTextStyle: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default memo(AppMiniBanner);
