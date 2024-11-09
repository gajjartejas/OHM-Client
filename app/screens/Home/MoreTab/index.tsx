import React, { useCallback, useMemo } from 'react';
import { Image, Platform, ScrollView, View } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { Divider, List, Text, useTheme } from 'react-native-paper';
import { IconType } from 'react-native-easy-icon/src/Icon';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-easy-icon';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';

//App Modules
import Utils from 'app/utils';

//App modules
import Config from 'app/config';
import Components from 'app/components';
import styles from './styles';
import { HomeTabsNavigatorParams, LoggedInTabNavigatorParams } from 'app/navigation/types';
import { AppTheme } from 'app/models/theme';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';
import getSystemInfo from 'app/utils/getSystemInfo';

//Interfaces
interface IMoreItem {
  id: number;
  iconName: string;
  iconType: IconType;
  title: string;
}

//Params
type MoreTabNavigationProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<HomeTabsNavigatorParams, 'MoreTab'>,
  NativeStackNavigationProp<LoggedInTabNavigatorParams>
>;

const MoreTab = () => {
  //Refs

  //Actions

  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme<AppTheme>();
  const largeScreenMode = useLargeScreenMode();
  const navigation = useNavigation<MoreTabNavigationProp>();

  //State
  const [visible, setVisible] = React.useState(false);
  const aboutItems: IMoreItem[] = useMemo(() => {
    return [
      {
        id: 0,
        iconName: 'feedback',
        iconType: 'material',
        title: t('about.sendFeedback'),
      },
      {
        id: 1,
        iconName: 'star',
        iconType: 'font-awesome',
        title: t('about.rateApp'),
      },
      {
        id: 2,
        iconName: 'apps',
        iconType: 'material-community',
        title: t('about.moreApps'),
      },
      {
        id: 3,
        iconName: 'github',
        iconType: 'entypo',
        title: t('about.github'),
      },
      {
        id: 4,
        iconName: 'gear',
        iconType: 'font-awesome',
        title: t('about.setting'),
      },
      {
        id: 5,
        iconName: 'info-circle',
        iconType: 'font-awesome',
        title: t('about.app'),
      },
    ];
  }, [t]);

  const onPressShowDialog = useCallback(() => setVisible(true), []);
  const onPressHideDialog = useCallback(() => setVisible(false), []);

  const onPressRateApp = useCallback(async () => {
    await Utils.openBrowser(
      Platform.OS === 'android' ? Config.Constants.PLAY_STORE_URL : Config.Constants.APP_STORE_URL,
    );
  }, []);

  const onPressMoreApps = useCallback(() => {
    navigation.push('MoreApps', {});
  }, [navigation]);

  const onPressContribute = useCallback(async () => {
    await Utils.openInAppBrowser(Config.Constants.REPO_URL);
  }, []);

  const onPressSettings = useCallback(() => {
    navigation.push('Settings', {});
  }, [navigation]);

  const onPressAbout = useCallback(() => {
    navigation.push('About', {});
  }, [navigation]);

  const onPress = useCallback(
    async (item: IMoreItem, _index: number) => {
      switch (item.id) {
        case 0:
          onPressShowDialog();
          break;
        case 1:
          await onPressRateApp();
          break;
        case 2:
          onPressMoreApps();
          break;
        case 3:
          await onPressContribute();
          break;
        case 4:
          onPressSettings();
          break;
        case 5:
          onPressAbout();
          break;
      }
    },
    [onPressAbout, onPressContribute, onPressMoreApps, onPressRateApp, onPressSettings, onPressShowDialog],
  );

  const onPressGithub = useCallback(async () => {
    const { title, body } = getSystemInfo();
    await Utils.openInAppBrowser(`${Config.Constants.ABOUT_NEW_GITHUB_ISSUE}?title=${title}&body=${body}`);
    setTimeout(() => {
      setVisible(false);
    }, 200);
  }, []);

  const onPressGithubDiscussion = useCallback(async () => {
    const { title, body } = getSystemInfo();
    await Utils.openInAppBrowser(
      `${Config.Constants.ABOUT_GITHUB_DISCUSSION}?category=q-a&title=${title}&body=${body}`,
    );
    setTimeout(() => {
      setVisible(false);
    }, 200);
  }, []);

  return (
    <Components.AppBaseView
      edges={['left', 'right', 'top']}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.subView}>
          <View style={[styles.imageBackground, largeScreenMode && styles.cardTablet]}>
            <Image source={Config.Images.icons.app_icon} resizeMode="contain" style={styles.appIcon} />
            <Text style={[styles.appNameText, { color: colors.text }]}>{t('general.appname')}</Text>
            <Text style={[styles.appVersion, { color: colors.text }]}>
              {t('about.version', { id0001: DeviceInfo.getReadableVersion() })}
            </Text>
          </View>

          <View style={[styles.cardContainer, largeScreenMode && styles.cardTablet]}>
            {aboutItems.map((subItem, subIndex) => {
              return (
                <View key={subItem.id.toString()}>
                  <List.Item
                    style={styles.listItem}
                    titleStyle={{ color: colors.onSurface }}
                    key={subItem.id.toString()}
                    onPress={() => onPress(subItem, subIndex)}
                    title={subItem.title}
                    left={() => (
                      <Icon
                        style={styles.listIcon}
                        type={subItem.iconType}
                        name={subItem.iconName}
                        color={`${colors.onSurface}88`}
                        size={24}
                      />
                    )}
                  />
                  <Divider style={[styles.divider, { backgroundColor: colors.backdrop }]} />
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <Components.AboutFeedbackDialog
        visible={visible}
        onPressGithub={onPressGithub}
        onPressGithubDiscussion={onPressGithubDiscussion}
        onPressHideDialog={onPressHideDialog}
      />
    </Components.AppBaseView>
  );
};

export default MoreTab;
