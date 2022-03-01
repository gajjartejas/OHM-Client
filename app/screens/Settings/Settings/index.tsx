import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { Appbar, Divider, List, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

//App modules
import Config from 'app/config';
import styles from './styles';
import Utils from 'app/utils';

//Modals
import Icon from 'react-native-easy-icon';
import { ISettingItem, ISettingSection } from 'app/models/viewModels/settingItem';

//Params
type RootStackParamList = {
  Settings: {};
};
type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const Settings = ({ navigation }: Props) => {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();

  //States
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [apps, setApps] = useState<ISettingSection[]>([
    {
      id: 0,
      title: t('SETTINGS_COMMON_HEADER'),
      items: [
        {
          id: 0,
          iconName: 'wb-sunny',
          iconType: 'material',
          title: t('SETTINGS_APPEARANCE_TITLE'),
          description: t('SETTINGS_APPEARANCE_SUB_TITLE'),
          route: 'SelectAppearance',
        },
        {
          id: 1,
          iconName: 'app-settings-alt',
          iconType: 'material',
          title: t('SETTINGS_GENERAL_TITLE'),
          description: t('SETTINGS_GENERAL_SUB_TITLE'),
          route: 'GeneralSetting',
        },
      ],
    },
    {
      id: 1,
      title: t('SETTINGS_INFO_HEADER'),
      items: [
        {
          id: 0,
          iconName: 'notes',
          iconType: 'material',
          title: t('SETTINGS_CHANGELOG_TITLE'),
          description: t('SETTINGS_CHANGELOG_SUB_TITLE'),
          route: 'Changelog',
        },
        {
          id: 1,
          iconName: 'library-shelves',
          iconType: 'material-community',
          title: t('SETTINGS_LIBRARIES_TITLE'),
          description: t('SETTINGS_LIBRARIES_SUB_TITLE'),
          route: 'License',
        },
        {
          id: 2,
          iconName: 'frequently-asked-questions',
          iconType: 'material-community',
          title: t('SETTINGS_FAQ_TITLE'),
          description: t('SETTINGS_FAQ_SUB_TITLE'),
          route: 'FAQ',
        },
        {
          id: 3,
          iconName: 'language',
          iconType: 'ionicon',
          title: t('SETTINGS_TRANSLATE_TITLE'),
          description: t('SETTINGS_TRANSLATE_SUB_TITLE'),
          route: 'Translate',
        },
        {
          id: 4,
          iconName: 'people',
          iconType: 'ionicon',
          title: t('SETTINGS_TRANSLATORS_TITLE'),
          description: t('SETTINGS_TRANSLATORS_SUB_TITLE'),
          route: 'Translators',
        },
        {
          id: 5,
          iconName: 'privacy-tip',
          iconType: 'material',
          title: t('SETTINGS_PRIVACY_TITLE'),
          description: t('SETTINGS_PRIVACY_SUB_TITLE'),
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
        navigation.push(item.route, {});
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.background }}>
        <Appbar.BackAction onPress={onGoBack} />
        <Appbar.Content title={t('SETTINGS_TITLE')} subtitle="" />
      </Appbar.Header>
      <View style={styles.safeArea}>
        <ScrollView>
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
        </ScrollView>
      </View>
    </View>
  );
};

export default Settings;
