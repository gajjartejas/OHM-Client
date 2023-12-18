import React, { memo } from 'react';

//ThirdParty
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//App modules
import { AppTheme } from 'app/models/theme';
import Icon from 'react-native-easy-icon';

interface AppHeaderProps {
  showBackButton?: boolean;
  onPressBackButton?: () => void;
  title?: string | null;
  leftTitle?: string;
  style?: object;
  textStyle?: object | null;
  tintColor?: string | null;
  showNotificationBell?: boolean | null;
  RightViewComponent?: React.ReactElement | null;
  statusBarHeight?: number | null;
  backArrowImage?: string;
  largeHeader?: boolean;
}

const AppHeader = (props: AppHeaderProps) => {
  //Ref
  const { colors } = useTheme<AppTheme>();

  let tintColor = props.tintColor === undefined ? colors.onBackground : props.tintColor;
  let textStyle = props.textStyle === undefined ? {} : props.textStyle;
  let RightViewComponent = props.RightViewComponent === undefined ? <></> : props.RightViewComponent;
  let backArrowImage = props.backArrowImage === undefined ? 'chevron-left' : props.backArrowImage;

  //Const
  const insets = useSafeAreaInsets();
  const isHasNotch = DeviceInfo.hasNotch();
  let statusBarHeight = props.statusBarHeight === undefined ? insets.top + (isHasNotch ? 0 : 5) : props.statusBarHeight;

  const backButtonPaddingForTitle = !props.showBackButton ? { marginLeft: 0 } : { marginLeft: 60, marginRight: 60 };
  return (
    <View
      style={{
        ...styles.headerContainer,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: colors.background,
        ...props.style,
      }}>
      <View style={[styles.statusBar, { height: statusBarHeight }]} />
      <View style={[styles.navigationContainer, props.largeHeader && styles.largeStatusBarHeight]}>
        <View style={[StyleSheet.absoluteFill, styles.titleViewStyle]}>
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={{ ...styles.titleTextStyle, color: colors.text, ...backButtonPaddingForTitle, ...textStyle }}>
            {props.title}
          </Text>
        </View>

        {props.showBackButton && (
          <TouchableOpacity activeOpacity={0.8} style={styles.menuButton} onPress={props.onPressBackButton!}>
            <Icon type="entypo" name={backArrowImage} color={tintColor!} size={26} />
          </TouchableOpacity>
        )}

        <View style={styles.leftTitleViewStyle}>
          <Text numberOfLines={2} ellipsizeMode={'tail'} style={{ ...styles.titleTextStyle, ...textStyle }}>
            {props.leftTitle}
          </Text>
        </View>

        {RightViewComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
  },
  statusBar: {
    width: '100%',
  },
  navigationContainer: {
    width: '100%',
    flexDirection: 'row',
    height: 44, //no need to normalize
    justifyContent: 'space-between',
    overflow: 'visible',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginLeft: 4,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  drawerImage: {
    width: 18,
    height: 18,
  },
  titleTextStyle: {
    fontSize: 16,
    fontWeight: '500',
  },
  titleViewStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  leftTitleViewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'flex-start',
    marginLeft: 13,
  },
  largeStatusBarHeight: {
    height: 52,
  },
});

export default memo(AppHeader);
