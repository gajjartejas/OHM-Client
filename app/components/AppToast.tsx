import React, { memo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';

//Third Party
import { useTheme } from 'react-native-paper';
import { BaseToast } from 'react-native-toast-message';
import Icon from 'react-native-easy-icon';
import { ToastConfigParams } from 'react-native-toast-message/lib/src/types';

//App modules
import { AppTheme } from 'app/models/theme';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';

export interface IAppSuccessToastProps {
  type: 'success' | 'error' | 'info';
}

const AppToast = (props: ToastConfigParams<IAppSuccessToastProps>) => {
  const { colors } = useTheme<AppTheme>();
  const { text1, text2, type, ...rest } = props;
  const minHeight = text1 && text2 ? 50 : 40;
  const largeScreenMode = useLargeScreenMode();

  return (
    <BaseToast
      {...rest}
      style={[
        styles.container,
        {
          borderLeftColor: type === 'error' ? colors.error : colors.primary,
          backgroundColor: type === 'error' ? colors.error : colors.primary,
          minHeight: minHeight,
        },
        largeScreenMode && { width: Dimensions.get('window').width * 0.7 },
      ]}
      renderLeadingIcon={() => <Icon type={'font-awesome'} name={'info-circle'} color={colors.white} size={18} />}
      contentContainerStyle={styles.contentContainerStyle}
      text1Style={[styles.text1Style, { color: colors.white }]}
      text2Style={[styles.text2Style, { color: colors.white }]}
      text2={text2}
      text1={text1}
      text2NumberOfLines={0}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    height: 'auto',
    alignItems: 'center',
  },
  contentContainerStyle: {
    paddingHorizontal: 0,
  },
  text1Style: {
    fontSize: 13,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  text2Style: {
    fontSize: 13,
    fontWeight: '400',
    marginHorizontal: 8,
  },
});

export default memo(AppToast);
