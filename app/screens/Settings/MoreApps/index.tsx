import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { Appbar, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

//App modules
import Config from 'app/config';
import Utils from 'app/utils';

//Modals
import styles from './styles';
import Components from 'app/components';

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
type RootStackParamList = {
  DeviceLists: {};
};
type Props = NativeStackScreenProps<RootStackParamList, 'DeviceLists'>;

const MoreApps = ({ navigation }: Props) => {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();

  //States
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [apps, setApps] = useState<IMoreAppItem[]>([
    {
      id: 0,
      icon: Config.Images.icons.app_icon,
      title: t('MORE_APPS_1_TITLE'),
      description: t('MORE_APPS_1_DESC'),
      showLinks: false,
    },
    {
      id: 1,
      icon: Config.Images.icons.ic_more_app_miuiadshelper,
      title: t('MORE_APPS_2_TITLE'),
      description: t('MORE_APPS_2_DESC'),
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
            Utils.openInAppBrowser(item.playStore);
          }
        }
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.background }}>
        <Appbar.BackAction onPress={onGoBack} />
        <Appbar.Content title={t('MORE_APPS_TITLE')} subtitle="" />
      </Appbar.Header>
      <View style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          {apps.map((item, index) => {
            return (
              <Components.MoreAppCard
                style={styles.moreCard}
                icon={item.icon}
                key={item.id.toString()}
                showLinks={item.showLinks}
                title={item.title}
                description={item.description}
                onPressGithub={() => onPressGithub(item, index)}
                onPressPlayStore={() => onPressPlayStore(item, index)}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default MoreApps;
