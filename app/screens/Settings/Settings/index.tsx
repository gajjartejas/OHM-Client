import React, { useState } from 'react';
import { View } from 'react-native';

//ThirdParty
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Appbar, Divider, List, useTheme } from 'react-native-paper';

//App modules
import Config from 'app/config';
import Utils from 'app/utils';
import styles from './styles';

//Modals
import { ISettingItem, ISettingSection } from 'app/models/viewModels/settingItem';
import Icon from 'react-native-easy-icon';
import Components from 'app/components';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'Settings'>;

const Settings = ({ navigation }: Props) => {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();

  //States
  const [apps] = useState<ISettingSection[]>([
    {
      id: 0,
      title: t('settings.commonHeader'),
      items: [
        {
          id: 0,
          iconName: 'wb-sunny',
          iconType: 'material',
          title: t('settings.appearanceTitle'),
          description: t('settings.appearanceSubTitle')!,
          route: 'SelectAppearance',
        },
        {
          id: 1,
          iconName: 'app-settings-alt',
          iconType: 'material',
          title: t('settings.generalTitle'),
          description: t('settings.generalSubTitle'),
          route: 'GeneralSetting',
        },
      ],
    },
    {
      id: 1,
      title: t('settings.infoHeader'),
      items: [
        {
          id: 0,
          iconName: 'notes',
          iconType: 'material',
          title: t('settings.changelogTitle'),
          description: t('settings.changelogSubTitle')!,
          route: 'Changelog',
        },
        {
          id: 1,
          iconName: 'library-shelves',
          iconType: 'material-community',
          title: t('settings.librariesTitle'),
          description: t('settings.librariesSubTitle')!,
          route: 'License',
        },
        {
          id: 2,
          iconName: 'frequently-asked-questions',
          iconType: 'material-community',
          title: t('settings.faqTitle'),
          description: t('settings.faqSubTitle')!,
          route: 'FAQ',
        },
        {
          id: 3,
          iconName: 'language',
          iconType: 'ionicon',
          title: t('settings.translateTitle'),
          description: t('settings.translateSubTitle')!,
          route: 'Translate',
        },
        {
          id: 4,
          iconName: 'people',
          iconType: 'ionicon',
          title: t('settings.translatorsTitle'),
          description: t('settings.translatorsSubTitle')!,
          route: 'Translators',
        },
        {
          id: 5,
          iconName: 'privacy-tip',
          iconType: 'material',
          title: t('settings.privacyTitle'),
          description: t('settings.privacySubTitle')!,
          route: 'PrivacyPolicy',
        },
      ],
    },
  ]);

  const onGoBack = () => {
    navigation.pop();
  };

  const onPress = (item: ISettingItem, _index: number) => {
    switch (item.route) {
      case 'Changelog':
        Utils.openInAppBrowser(Config.Constants.CHANGE_LOG);
        break;

      case 'Translate':
        Utils.openInAppBrowser(Config.Constants.TRANSLATE_APP);
        break;

      case 'FAQ':
        Utils.openInAppBrowser(Config.Constants.FAQ);
        break;

      case 'PrivacyPolicy':
        Utils.openInAppBrowser(Config.Constants.PRIVACY_POLICY);
        break;

      default:
        // @ts-ignore
        navigation.push(item.route, {});
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.background }}>
        <Appbar.BackAction onPress={onGoBack} />
        <Appbar.Content title={t('settings.title')} />
      </Appbar.Header>
      <Components.AppBaseView scroll edges={['bottom', 'left', 'right']} style={styles.safeArea}>
        {apps.map(item => {
          return (
            <View key={item.id.toString()}>
              <List.Subheader style={[styles.listSubHeader, { color: colors.primary }]}>{item.title}</List.Subheader>
              {item.items.map((subItem, subIndex) => {
                return (
                  <List.Item
                    titleStyle={{ color: colors.onSurface }}
                    descriptionStyle={{ color: `${colors.onSurface}88` }}
                    key={subItem.id.toString()}
                    onPress={() => onPress(subItem, subIndex)}
                    title={subItem.title}
                    description={subItem.description}
                    left={() => (
                      <Icon
                        style={styles.listItemIcon}
                        type={subItem.iconType}
                        name={subItem.iconName}
                        color={`${colors.onSurface}88`}
                        size={24}
                      />
                    )}
                  />
                );
              })}
              <Divider />
            </View>
          );
        })}
      </Components.AppBaseView>
    </View>
  );
};

export default Settings;
