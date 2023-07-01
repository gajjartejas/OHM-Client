import React, { useState } from 'react';
import { Linking, View } from 'react-native';

//ThirdParty
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Appbar, useTheme } from 'react-native-paper';

//App modules
import Config from 'app/config';
import Utils from 'app/utils';

//Modals
import Components from 'app/components';
import styles from './styles';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';

//Interfaces
interface IMoreAppItem {
  id: number;
  icon: string;
  title: string;
  description: string;
  showLinks: boolean;
  github?: string;
  playStore?: string;
}

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'MoreApps'>;

const MoreApps = ({ navigation }: Props) => {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();

  //States
  const [apps] = useState<IMoreAppItem[]>([
    {
      id: 0,
      icon: Config.Images.icons.app_icon,
      title: t('moreApps.apps1Title'),
      description: t('moreApps.apps1Desc'),
      showLinks: false,
    },
    {
      id: 1,
      icon: Config.Images.icons.ic_more_app_miuiadshelper,
      title: t('moreApps.apps2Title'),
      description: t('moreApps.apps2Desc'),
      showLinks: true,
      github: Config.Constants.MORE_APPS_MIUI_ADS_HELPER_GITHUB,
      playStore: Config.Constants.MORE_APPS_MIUI_ADS_HELPER_PLAY_STORE,
    },
  ]);

  const onGoBack = () => {
    navigation.pop();
  };

  const onPressGithub = (item: IMoreAppItem, _index: number) => {
    switch (item.id) {
      case 0:
        break;
      case 1:
        if (item.github != null) {
          Utils.openInAppBrowser(item.github);
        }
        break;
    }
  };

  const onPressPlayStore = (item: IMoreAppItem, _index: number) => {
    switch (item.id) {
      case 0:
        break;
      case 1:
        if (item.github != null) {
          if (item.playStore != null) {
            Linking.openURL(item.playStore);
          }
        }
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.background }}>
        <Appbar.BackAction onPress={onGoBack} />
        <Appbar.Content title={t('moreApps.appsTitle')} />
      </Appbar.Header>
      <Components.AppBaseView scroll edges={['bottom', 'left', 'right']} style={styles.safeArea}>
        <View style={styles.listContainer}>
          {apps.map((item, index) => {
            return (
              <Components.MoreAppCard
                key={item.id.toString()}
                style={styles.moreCard}
                icon={item.icon}
                showLinks={item.showLinks}
                title={item.title}
                description={item.description}
                onPressGithub={() => onPressGithub(item, index)}
                onPressPlayStore={() => onPressPlayStore(item, index)}
              />
            );
          })}
        </View>
      </Components.AppBaseView>
    </View>
  );
};

export default MoreApps;
