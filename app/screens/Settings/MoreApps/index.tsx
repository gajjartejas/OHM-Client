import React, { useCallback, useState } from 'react';
import { View } from 'react-native';

//ThirdParty
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';

//App modules
import Config from 'app/config';
import Utils from 'app/utils';

//Modals
import Components from 'app/components';
import styles from './styles';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';
import AppHeader from 'app/components/AppHeader';

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
  const largeScreenMode = useLargeScreenMode();

  //States
  const [apps] = useState<IMoreAppItem[]>([
    {
      id: 0,
      icon: Config.Images.icons.app_icon,
      title: t('moreApps.apps1Title'),
      description: t('moreApps.apps1Desc'),
      showLinks: true,
      github: Config.Constants.REPO_URL,
      playStore: Config.Constants.PLAY_STORE_URL,
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
    {
      id: 2,
      icon: Config.Images.icons.ic_more_app_kano,
      title: t('moreApps.apps3Title'),
      description: t('moreApps.apps3Desc'),
      showLinks: true,
      github: Config.Constants.MORE_APPS_KANO_GITHUB,
      playStore: Config.Constants.MORE_APPS_KANO_PLAY_STORE,
    },
  ]);

  const onGoBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const onPressGithub = useCallback(async (item: IMoreAppItem, _index: number) => {
    if (item.github != null) {
      await Utils.openInAppBrowser(item.github);
    }
  }, []);

  const onPressPlayStore = useCallback(async (item: IMoreAppItem, _index: number) => {
    if (item.playStore != null) {
      await Utils.openBrowser(item.playStore);
    }
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        showBackButton={true}
        onPressBackButton={onGoBack}
        title={t('moreApps.appsTitle')}
        style={{ backgroundColor: colors.background }}
      />

      <Components.AppBaseView scroll edges={['bottom', 'left', 'right']} style={styles.safeArea}>
        <View style={[styles.listContainer, largeScreenMode && styles.cardTablet]}>
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
