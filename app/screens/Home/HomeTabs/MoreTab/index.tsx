import React from 'react';
import { Image, ImageBackground, Linking, Platform, ScrollView, View } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { Divider, List, Text, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-easy-icon';
import { IconType } from 'react-native-easy-icon/src/Icon';

//App modules
import Utils from 'app/utils';

//App modules
import Config from 'app/config';
import Components from 'app/components';
import styles from './styles';

//Interfaces
interface IMoreItem {
  id: number;
  iconName: string;
  iconType: IconType;
  title: string;
}

//Params
type RootStackParamList = {
  DeviceLists: {};
  MoreApps: {};
  Settings: {};
  About: {};
};
type Props = NativeStackScreenProps<RootStackParamList, 'DeviceLists'>;

const MoreTab = ({ navigation }: Props) => {
  //Refs

  //Actions

  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();

  //State
  const [visible, setVisible] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [aboutItems, setAboutItems] = React.useState<IMoreItem[]>([
    {
      id: 0,
      iconName: 'feedback',
      iconType: 'material',
      title: t('ABOUT_SEND_FEEDBACK'),
    },
    {
      id: 1,
      iconName: 'star',
      iconType: 'font-awesome',
      title: t('ABOUT_RATE_APP'),
    },
    {
      id: 2,
      iconName: 'apps',
      iconType: 'material-community',
      title: t('ABOUT_MORE_APPS'),
    },
    {
      id: 3,
      iconName: 'github',
      iconType: 'entypo',
      title: t('ABOUT_GITHUB'),
    },
    {
      id: 4,
      iconName: 'gear',
      iconType: 'font-awesome',
      title: t('ABOUT_SETTING'),
    },
    {
      id: 5,
      iconName: 'info-circle',
      iconType: 'font-awesome',
      title: t('ABOUT_APP'),
    },
  ]);

  const onPress = (item: IMoreItem, _index: number) => {
    switch (item.id) {
      case 0:
        onPressShowDialog();
        break;
      case 1:
        onPressRateApp();
        break;
      case 2:
        onPressMoreApps();
        break;
      case 3:
        onPressContribute();
        break;
      case 4:
        onPressSettings();
        break;
      case 5:
        onPressAbout();
        break;
    }
  };

  const onPressShowDialog = () => setVisible(true);
  const onPressHideDialog = () => setVisible(false);

  const onPressRateApp = () => {
    Utils.openInAppBrowser(
      Platform.OS === 'android' ? Config.Constants.PLAY_STORE_URL : Config.Constants.APP_STORE_URL,
    );
  };

  const onPressMoreApps = () => {
    navigation.push('MoreApps', {});
  };

  const onPressContribute = () => {
    Utils.openInAppBrowser(Config.Constants.REPO_URL);
  };

  const onPressSettings = () => {
    navigation.push('Settings', {});
  };
  const onPressAbout = () => {
    navigation.push('About', {});
  };
  const onPressTelegram = () => {
    Utils.openInAppBrowser(Config.Constants.ABOUT_TELEGRAM_LINK);
  };
  const onPressEmail = async () => {
    const email = Config.Constants.ABOUT_SUPPORT_EMAIL;
    const subject = `${t('APPNAME')} feedback`;
    const osType = Platform.OS;
    const systemVersion = DeviceInfo.getSystemVersion();
    const brand = DeviceInfo.getBrand();
    const model = await DeviceInfo.getModel();
    const readableVersion = DeviceInfo.getReadableVersion();
    const body = `OS: ${osType} (${systemVersion})\nBrand: ${brand} (${model})\nApp Version: ${readableVersion}`;
    Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <ImageBackground source={Config.Images.icons.about_bg} style={styles.imageBackground}>
            <Image source={Config.Images.icons.app_icon} resizeMode="contain" style={styles.appIcon} />
            <Text style={[styles.appNameText, { color: colors.text }]}>{t('APPNAME')}</Text>
            <Text style={[styles.appVersion, { color: colors.text }]}>v{DeviceInfo.getVersion()}</Text>
          </ImageBackground>

          <View style={styles.cardContainer}>
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
        onPressTelegram={onPressTelegram}
        onPressEmail={onPressEmail}
        onPressHideDialog={onPressHideDialog}
      />
    </SafeAreaView>
  );
};

export default MoreTab;
