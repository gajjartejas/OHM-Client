import React, { useCallback, useMemo } from 'react';
import { Image, View } from 'react-native';

//ThirdParty
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import { Divider, List, Text, useTheme } from 'react-native-paper';

//App modules
import Config from 'app/config';
import Utils from 'app/utils';

//Modals
import { ISettingItem, ISettingSection } from 'app/models/viewModels/settingItem';
import Icon from 'react-native-easy-icon';
import styles from './styles';
import Components from 'app/components';
import { AppTheme } from 'app/models/theme';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';
import AppHeader from 'app/components/AppHeader';

type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'About'>;

const About = ({ navigation }: Props) => {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme<AppTheme>();
  const largeScreenMode = useLargeScreenMode();

  //States
  const apps: ISettingSection[] = useMemo(() => {
    return [
      {
        id: 0,
        title: t('aboutScreen.infoHeader'),
        items: [
          {
            id: 0,
            iconName: 'information',
            iconType: 'material-community',
            title: t('aboutScreen.infoDescTitle'),
            description: '',
            route: '',
            touchable: false,
          },
          {
            id: 1,
            iconName: 'face-man',
            iconType: 'material-community',
            title: t('aboutScreen.infoAuthorNameTitle'),
            description: '',
            route: '',
            touchable: false,
          },
        ],
      },
      {
        id: 1,
        title: t('aboutScreen.developerTitle'),
        items: [
          {
            id: 0,
            iconName: 'briefcase',
            iconType: 'material-community',
            title: t('aboutScreen.portfolioTitle'),
            description: t('aboutScreen.portfolioSubTitle')!,
            route: '',
            touchable: true,
          },
          {
            id: 1,
            iconName: 'instagram',
            iconType: 'material-community',
            title: t('aboutScreen.instagramTitle'),
            description: t('aboutScreen.instagramSubTitle')!,
            route: '',
            touchable: true,
          },
          {
            id: 3,
            iconName: 'telegram-plane',
            iconType: 'font-awesome5',
            title: t('aboutScreen.telegramTitle'),
            description: t('aboutScreen.telegramSubTitle')!,
            route: '',
            touchable: true,
          },
          {
            id: 4,
            iconName: 'github',
            iconType: 'material-community',
            title: t('aboutScreen.githubTitle'),
            description: t('aboutScreen.githubSubTitle')!,
            route: '',
            touchable: true,
          },
          {
            id: 5,
            iconName: 'twitter',
            iconType: 'material-community',
            title: t('aboutScreen.twitterTitle'),
            description: t('aboutScreen.twitterSubTitle')!,
            route: '',
            touchable: true,
          },
        ],
      },
    ];
  }, [t]);

  const onGoBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const onPressAboutOption = useCallback(
    async (_item: ISettingSection, index: number, _subItem: ISettingItem, subIndex: number) => {
      switch (true) {
        case index === 1 && subIndex === 0:
          await Utils.openInAppBrowser(Config.Constants.ABOUT_PORTFOLIO);
          break;
        case index === 1 && subIndex === 1:
          await Utils.openBrowser(Config.Constants.ABOUT_INSTAGRAM);
          break;
        case index === 1 && subIndex === 2:
          await Utils.openBrowser(Config.Constants.ABOUT_TELEGRAM_LINK);
          break;
        case index === 1 && subIndex === 3:
          await Utils.openInAppBrowser(Config.Constants.ABOUT_GITHUB);
          break;
        case index === 1 && subIndex === 4:
          await Utils.openBrowser(Config.Constants.ABOUT_TWITTER);
          break;
        default:
      }
    },
    [],
  );

  return (
    <Components.AppBaseView
      edges={['bottom', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        showBackButton={true}
        onPressBackButton={onGoBack}
        title={t('aboutScreen.title')}
        style={{ backgroundColor: colors.background }}
      />
      <Components.AppBaseView scroll edges={[]} style={styles.safeArea}>
        <Image source={Config.Images.icons.app_icon} resizeMode="contain" style={styles.appicon} />
        <Text style={[styles.appNameText, { color: colors.onBackground }]}>{DeviceInfo.getApplicationName()}</Text>
        <Text style={[styles.appVersionText, { color: `${colors.onBackground}88` }]}>
          {`v${DeviceInfo.getVersion()}`}
        </Text>

        <View style={styles.listContainer}>
          {apps.map((item, index) => {
            return (
              <View
                style={[
                  styles.listItem,
                  largeScreenMode && styles.cardTablet,
                  { backgroundColor: `${colors.card}`, shadowColor: `${colors.shadow}` },
                ]}
                key={item.id.toString()}>
                <List.Subheader style={[styles.listSubHeader, { color: colors.primary }]}>{item.title}</List.Subheader>
                {item.items.map((subItem, subIndex) => {
                  return (
                    <View key={subItem.id.toString()}>
                      <List.Item
                        titleStyle={{ color: colors.onSurface }}
                        descriptionStyle={{ color: `${colors.onSurface}88` }}
                        titleNumberOfLines={0}
                        onPress={() => onPressAboutOption(item, index, subItem, subIndex)}
                        title={subItem.title}
                        description={subItem.description}
                        disabled={!subItem.touchable}
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
                      {subIndex <= item.items.length - 2 && <Divider />}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      </Components.AppBaseView>
    </Components.AppBaseView>
  );
};

export default About;
