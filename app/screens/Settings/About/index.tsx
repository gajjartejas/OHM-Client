import React, { useState } from 'react';
import { Image, ScrollView, View } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { Appbar, Divider, List, Text, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DeviceInfo from 'react-native-device-info';
import Utils from 'app/utils';

//App modules
import Config from 'app/config';

//Modals
import Icon from 'react-native-easy-icon';
import { ISettingItem, ISettingSection } from 'app/models/viewModels/settingItem';
import styles from './styles';

//Params
type RootStackParamList = {
  DeviceLists: {};
};
type Props = NativeStackScreenProps<RootStackParamList, 'DeviceLists'>;

const Settings = ({ navigation }: Props) => {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();

  //States
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [apps, setApps] = useState<ISettingSection[]>([
    {
      id: 0,
      title: t('ABOUT_INFO_HEADER'),
      items: [
        {
          id: 0,
          iconName: 'wb-sunny',
          iconType: 'material',
          title: t('ABOUT_INFO_DESC_TITLE'),
        },
        {
          id: 1,
          iconName: 'app-settings-alt',
          iconType: 'material',
          title: t('ABOUT_INFO_AUTHOR_NAME_TITLE'),
        },
      ],
    },
    {
      id: 1,
      title: t('ABOUT_DEVELOPER_TITLE'),
      items: [
        {
          id: 0,
          iconName: 'notes',
          iconType: 'material',
          title: t('ABOUT_PORTFOLIO_TITLE'),
          description: t('ABOUT_PORTFOLIO_SUB_TITLE'),
        },
        {
          id: 1,
          iconName: 'library-shelves',
          iconType: 'material-community',
          title: t('ABOUT_INSTAGRAM_TITLE'),
          description: t('ABOUT_INSTAGRAM_SUB_TITLE'),
        },
        {
          id: 3,
          iconName: 'frequently-asked-questions',
          iconType: 'material-community',
          title: t('ABOUT_TELEGRAM_TITLE'),
          description: t('ABOUT_TELEGRAM_SUB_TITLE'),
        },
        {
          id: 4,
          iconName: 'language',
          iconType: 'ionicon',
          title: t('ABOUT_GITHUB_TITLE'),
          description: t('ABOUT_GITHUB_SUB_TITLE'),
        },
        {
          id: 5,
          iconName: 'people',
          iconType: 'ionicon',
          title: t('ABOUT_TWITTER_TITLE'),
          description: t('ABOUT_TWITTER_SUB_TITLE'),
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
        Utils.openInAppBrowser(Config.Constants.ABOUT_INSTAGRAM);
        break;
      case index === 1 && subIndex === 2:
        Utils.openInAppBrowser(Config.Constants.ABOUT_TELEGRAM_LINK);
        break;
      case index === 1 && subIndex === 3:
        Utils.openInAppBrowser(Config.Constants.ABOUT_GITHUB);
        break;
      case index === 1 && subIndex === 4:
        Utils.openInAppBrowser(Config.Constants.ABOUT_TWITTER);
        break;
      default:
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.background }}>
        <Appbar.BackAction onPress={onGoBack} />
        <Appbar.Content title={t('ABOUT_INFO_TITLE')} subtitle="" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <Image source={Config.Images.icons.app_icon} resizeMode="contain" style={styles.appicon} />
        <Text style={[styles.appNameText, { color: colors.onBackground }]}>{DeviceInfo.getApplicationName()}</Text>
        <Text style={[styles.appVersionText, { color: `${colors.onBackground}88` }]}>v{DeviceInfo.getVersion()}</Text>

        {apps.map((item, index) => {
          return (
            <View style={[styles.listContainer, { backgroundColor: colors.surface }]} key={item.id.toString()}>
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
                    <Divider />
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Settings;
