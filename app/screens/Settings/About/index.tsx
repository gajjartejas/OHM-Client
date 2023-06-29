import React, { useState } from 'react';
import { Image, Linking, View } from 'react-native';

//ThirdParty
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import { Appbar, Divider, List, Text, useTheme } from 'react-native-paper';

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

type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'About'>;

const About = ({ navigation }: Props) => {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme<AppTheme>();

  //States
  const [apps] = useState<ISettingSection[]>([
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
        },
        {
          id: 1,
          iconName: 'face-man',
          iconType: 'material-community',
          title: t('aboutScreen.infoAuthorNameTitle'),
          description: '',
          route: '',
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
        },
        {
          id: 1,
          iconName: 'instagram',
          iconType: 'material-community',
          title: t('aboutScreen.instagramTitle'),
          description: t('aboutScreen.instagramSubTitle')!,
          route: '',
        },
        {
          id: 3,
          iconName: 'telegram-plane',
          iconType: 'font-awesome5',
          title: t('aboutScreen.telegramTitle'),
          description: t('aboutScreen.telegramSubTitle')!,
          route: '',
        },
        {
          id: 4,
          iconName: 'github',
          iconType: 'material-community',
          title: t('aboutScreen.githubTitle'),
          description: t('aboutScreen.githubSubTitle')!,
          route: '',
        },
        {
          id: 5,
          iconName: 'twitter',
          iconType: 'material-community',
          title: t('aboutScreen.twitterTitle'),
          description: t('aboutScreen.twitterSubTitle')!,
          route: '',
        },
      ],
    },
  ]);

  const onGoBack = () => {
    navigation.pop();
  };

  //
  const onPressAboutOption = (item: ISettingSection, index: number, subItem: ISettingItem, subIndex: number) => {
    switch (true) {
      case index === 1 && subIndex === 0:
        Utils.openInAppBrowser(Config.Constants.ABOUT_PORTFOLIO);
        break;
      case index === 1 && subIndex === 1:
        Linking.openURL(Config.Constants.ABOUT_INSTAGRAM);
        break;
      case index === 1 && subIndex === 2:
        Linking.openURL(Config.Constants.ABOUT_TELEGRAM_LINK);
        break;
      case index === 1 && subIndex === 3:
        Utils.openInAppBrowser(Config.Constants.ABOUT_GITHUB);
        break;
      case index === 1 && subIndex === 4:
        Linking.openURL(Config.Constants.ABOUT_TWITTER);
        break;
      default:
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.background }}>
        <Appbar.BackAction onPress={onGoBack} />
        <Appbar.Content title={t('aboutScreen.title')} />
      </Appbar.Header>

      <Components.AppBaseView scroll edges={['bottom', 'left', 'right']} style={styles.safeArea}>
        <Image source={Config.Images.icons.app_icon} resizeMode="contain" style={styles.appicon} />
        <Text style={[styles.appNameText, { color: colors.onBackground }]}>{DeviceInfo.getApplicationName()}</Text>
        <Text style={[styles.appVersionText, { color: `${colors.onBackground}88` }]}>
          {`v${DeviceInfo.getVersion()}`}
        </Text>

        <View style={styles.listContainer}>
          {apps.map((item, index) => {
            return (
              <View
                style={[styles.listItem, { backgroundColor: `${colors.card}`, shadowColor: `${colors.shadow}` }]}
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
    </View>
  );
};

export default About;
