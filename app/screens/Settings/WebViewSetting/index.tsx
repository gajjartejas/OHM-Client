import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, ScrollView, TextInput, View } from 'react-native';

//ThirdParty
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-easy-icon';
import { Divider, List, Switch, useTheme } from 'react-native-paper';

//App modules
import Components from 'app/components';
import styles from './styles';

//Modals
import { ISettingItem, ISettingSection } from 'app/models/viewModels/settingItem';

//Redux
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';
import AppHeader from 'app/components/AppHeader';
import useAppWebViewConfigStore from 'app/store/webViewConfig';
import CookieManager from '@react-native-cookies/cookies';

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'WebViewSetting'>;

const WebViewSetting = ({ navigation }: Props) => {
  //Ref
  let modalVisibleUserAgentRef = useRef<TextInput | null>(null);

  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();

  const largeScreenMode = useLargeScreenMode();
  const [mediaPlaybackRequiresUserAction, setMediaPlaybackRequiresUserAction] = useAppWebViewConfigStore(store => [
    store.mediaPlaybackRequiresUserAction,
    store.setMediaPlaybackRequiresUserAction,
  ]);
  const [scalesPageToFit, setScalesPageToFit] = useAppWebViewConfigStore(store => [
    store.scalesPageToFit,
    store.setScalesPageToFit,
  ]);
  const [domStorageEnabled, setDomStorageEnabled] = useAppWebViewConfigStore(store => [
    store.domStorageEnabled,
    store.setDomStorageEnabled,
  ]);
  const [javaScriptEnabled, setJavaScriptEnabled] = useAppWebViewConfigStore(store => [
    store.javaScriptEnabled,
    store.setJavaScriptEnabled,
  ]);
  const [thirdPartyCookiesEnabled, setThirdPartyCookiesEnabled] = useAppWebViewConfigStore(store => [
    store.thirdPartyCookiesEnabled,
    store.setThirdPartyCookiesEnabled,
  ]);
  const [userAgent, setUserAgent] = useAppWebViewConfigStore(store => [store.userAgent, store.setUserAgent]);
  const [allowsFullScreenVideo, setAllowsFullScreenVideo] = useAppWebViewConfigStore(store => [
    store.allowsFullScreenVideo,
    store.setAllowsFullScreenVideo,
  ]);
  const [allowsInlineMediaPlayback, setAllowsInlineMediaPlayback] = useAppWebViewConfigStore(store => [
    store.allowsInlineMediaPlayback,
    store.setAllowsInlineMediaPlayback,
  ]);
  const [allowsAirPlayForMediaPlayback, setAllowsAirPlayForMediaPlayback] = useAppWebViewConfigStore(store => [
    store.allowsAirPlayForMediaPlayback,
    store.setAllowsAirPlayForMediaPlayback,
  ]);
  const [bounces, setBounces] = useAppWebViewConfigStore(store => [store.bounces, store.setBounces]);
  const [contentMode, setContentMode] = useAppWebViewConfigStore(store => [store.contentMode, store.setContentMode]);
  const [geolocationEnabled, setGeolocationEnabled] = useAppWebViewConfigStore(store => [
    store.geolocationEnabled,
    store.setGeolocationEnabled,
  ]);
  const [allowFileAccessFromFileUrls, setAllowFileAccessFromFileUrls] = useAppWebViewConfigStore(store => [
    store.allowFileAccessFromFileUrls,
    store.setAllowFileAccessFromFileUrls,
  ]);
  const [allowsBackForwardNavigationGestures, setAllowsBackForwardNavigationGestures] = useAppWebViewConfigStore(
    store => [store.allowsBackForwardNavigationGestures, store.setAllowsBackForwardNavigationGestures],
  );
  const [pullToRefreshEnabled, setPullToRefreshEnabled] = useAppWebViewConfigStore(store => [
    store.pullToRefreshEnabled,
    store.setPullToRefreshEnabled,
  ]);
  const [forceDarkOn, setForceDarkOn] = useAppWebViewConfigStore(store => [store.forceDarkOn, store.setForceDarkOn]);
  const [allowsProtectedMedia, setAllowsProtectedMedia] = useAppWebViewConfigStore(store => [
    store.allowsProtectedMedia,
    store.setAllowsProtectedMedia,
  ]);

  const reset = useAppWebViewConfigStore(store => store.reset);

  //States
  const [modalVisibleUserAgent, setModalVisibleUserAgent] = useState(false);
  const [modalUserAgent, setModalUserAgent] = useState(userAgent);
  const [clearDataAlertVisible, setClearDataAlertVisible] = useState(false);

  const apps: ISettingSection[] = useMemo(() => {
    const excludeIds =
      Platform.select({
        ios: [1, 2, 4, 6, 8, 11, 15, 16],
        android: [7, 8, 9, 10, 11, 13, 14],
      }) || [];
    return [
      {
        id: 0,
        title: t('webViewSetting.section1.header'),
        items: [
          {
            id: 0,
            iconName: 'movie-open-play',
            iconType: 'material-community',
            title: t('webViewSetting.section1.row1.title'),
            description: t('webViewSetting.section1.row1.subTitle'),
            route: '',
            value: mediaPlaybackRequiresUserAction,
            inputType: 'switch',
          },
          {
            id: 1,
            iconName: 'resize',
            iconType: 'material-community',
            title: t('webViewSetting.section1.row2.title'),
            description: t('webViewSetting.section1.row2.subTitle'),
            route: '',
            value: scalesPageToFit,
            inputType: 'switch',
          },
          {
            id: 2,
            iconName: 'harddisk',
            iconType: 'material-community',
            title: t('webViewSetting.section1.row3.title'),
            description: t('webViewSetting.section1.row3.subTitle'),
            route: '',
            value: domStorageEnabled,
            inputType: 'switch',
          },
          {
            id: 3,
            iconName: 'language-javascript',
            iconType: 'material-community',
            title: t('webViewSetting.section1.row4.title'),
            description: t('webViewSetting.section1.row4.subTitle'),
            route: '',
            value: javaScriptEnabled,
            inputType: 'switch',
          },
          {
            id: 4,
            iconName: 'cookie',
            iconType: 'material-community',
            title: t('webViewSetting.section1.row5.title'),
            description: t('webViewSetting.section1.row5.subTitle'),
            route: '',
            value: thirdPartyCookiesEnabled,
            inputType: 'switch',
          },
          {
            id: 5,
            iconName: 'face-agent',
            iconType: 'material-community',
            title: t('webViewSetting.section1.row6.title'),
            description: t('webViewSetting.section1.row6.subTitle'),
            route: '',
            value: userAgent,
            inputType: 'input',
          },
          {
            id: 6,
            iconName: 'fullscreen',
            iconType: 'material-community',
            title: t('webViewSetting.section1.row7.title'),
            description: t('webViewSetting.section1.row7.subTitle'),
            route: '',
            value: allowsFullScreenVideo,
            inputType: 'switch',
          },
          {
            id: 7,
            iconName: 'movie-play',
            iconType: 'material-community',
            title: t('webViewSetting.section1.row8.title'),
            description: t('webViewSetting.section1.row8.subTitle'),
            route: '',
            value: allowsInlineMediaPlayback,
            inputType: 'switch',
          },
          {
            id: 8,
            iconName: 'airplay',
            iconType: 'feather',
            title: t('webViewSetting.section1.row9.title'),
            description: t('webViewSetting.section1.row9.subTitle'),
            route: '',
            value: allowsAirPlayForMediaPlayback,
            inputType: 'switch',
          },
          {
            id: 9,
            iconName: 'gesture-swipe-vertical',
            iconType: 'material-community',
            title: t('webViewSetting.section1.row10.title'),
            description: t('webViewSetting.section1.row10.subTitle'),
            route: '',
            value: bounces,
            inputType: 'switch',
          },
          {
            id: 10,
            iconName: 'database-arrow-down',
            iconType: 'material-community',
            title: t('webViewSetting.section1.row11.title'),
            description: t('webViewSetting.section1.row11.subTitle'),
            route: '',
            value: contentMode,
            inputType: 'switch',
          },
          {
            id: 11,
            iconName: 'map-marker',
            iconType: 'material-community',
            title: t('webViewSetting.section1.row12.title'),
            description: t('webViewSetting.section1.row12.subTitle'),
            route: '',
            value: geolocationEnabled,
            inputType: 'switch',
          },
          {
            id: 12,
            iconName: 'file-link',
            iconType: 'material-community',
            title: t('webViewSetting.section1.row13.title'),
            description: t('webViewSetting.section1.row13.subTitle'),
            route: '',
            value: allowFileAccessFromFileUrls,
            inputType: 'switch',
          },
          {
            id: 13,
            iconName: 'gesture-swipe-horizontal',
            iconType: 'material-community',
            title: t('webViewSetting.section1.row14.title'),
            description: t('webViewSetting.section1.row14.subTitle'),
            route: '',
            value: allowsBackForwardNavigationGestures,
            inputType: 'switch',
          },
          {
            id: 14,
            iconName: 'gesture-swipe-down',
            iconType: 'material-community',
            title: t('webViewSetting.section1.row15.title'),
            description: t('webViewSetting.section1.row15.subTitle'),
            route: '',
            value: pullToRefreshEnabled,
            inputType: 'switch',
          },
          {
            id: 15,
            iconName: 'theme-light-dark',
            iconType: 'material-community',
            title: t('webViewSetting.section1.row16.title'),
            description: t('webViewSetting.section1.row16.subTitle'),
            route: '',
            value: forceDarkOn,
            inputType: 'switch',
          },
          {
            id: 16,
            iconName: 'movie-play',
            iconType: 'material-community',
            title: t('webViewSetting.section1.row17.title'),
            description: t('webViewSetting.section1.row17.subTitle'),
            route: '',
            value: allowsProtectedMedia,
            inputType: 'switch',
          },
        ].filter(v => !excludeIds.includes(v.id))! as ISettingItem[],
      },
      {
        id: 1,
        title: t('webViewSetting.section2.header'),
        items: [
          {
            id: 0,
            iconName: 'broom',
            iconType: 'material-community',
            title: t('webViewSetting.section2.row1.title'),
            description: t('webViewSetting.section2.row1.subTitle')!,
            route: 'WebViewSetting',
          },
          {
            id: 1,
            iconName: 'backup-restore',
            iconType: 'material-community',
            title: t('webViewSetting.section2.row2.title'),
            description: t('webViewSetting.section2.row2.subTitle')!,
            route: 'WebViewSetting',
          },
        ],
      },
    ];
  }, [
    allowFileAccessFromFileUrls,
    allowsAirPlayForMediaPlayback,
    allowsBackForwardNavigationGestures,
    allowsFullScreenVideo,
    allowsInlineMediaPlayback,
    allowsProtectedMedia,
    bounces,
    contentMode,
    domStorageEnabled,
    forceDarkOn,
    geolocationEnabled,
    javaScriptEnabled,
    mediaPlaybackRequiresUserAction,
    pullToRefreshEnabled,
    scalesPageToFit,
    t,
    thirdPartyCookiesEnabled,
    userAgent,
  ]);

  const onGoBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const onPressOption = useCallback(
    (item: ISettingSection, index: number, subItem: ISettingItem, _subIndex: number) => {
      switch (true) {
        case index === 0 && subItem.id === 0:
          setMediaPlaybackRequiresUserAction(!subItem.value);
          break;
        case index === 0 && subItem.id === 1:
          setScalesPageToFit(!subItem.value);
          break;
        case index === 0 && subItem.id === 2:
          setDomStorageEnabled(!subItem.value);
          break;
        case index === 0 && subItem.id === 3:
          setJavaScriptEnabled(!subItem.value);
          break;
        case index === 0 && subItem.id === 4:
          setThirdPartyCookiesEnabled(!subItem.value);
          break;
        case index === 0 && subItem.id === 5:
          setModalUserAgent(userAgent);
          setModalVisibleUserAgent(true);
          break;
        case index === 0 && subItem.id === 6:
          setAllowsFullScreenVideo(!subItem.value);
          break;
        case index === 0 && subItem.id === 7:
          setAllowsInlineMediaPlayback(!subItem.value);
          break;
        case index === 0 && subItem.id === 8:
          setAllowsAirPlayForMediaPlayback(!subItem.value);
          break;
        case index === 0 && subItem.id === 9:
          setBounces(!subItem.value);
          break;
        case index === 0 && subItem.id === 10:
          setContentMode(subItem.value);
          break;
        case index === 0 && subItem.id === 11:
          setGeolocationEnabled(!subItem.value);
          break;
        case index === 0 && subItem.id === 12:
          setAllowFileAccessFromFileUrls(!subItem.value);
          break;
        case index === 0 && subItem.id === 13:
          setAllowsBackForwardNavigationGestures(!subItem.value);
          break;
        case index === 0 && subItem.id === 14:
          setPullToRefreshEnabled(!subItem.value);
          break;
        case index === 0 && subItem.id === 15:
          setForceDarkOn(!subItem.value);
          break;
        case index === 0 && subItem.id === 16:
          setAllowsProtectedMedia(!subItem.value);
          break;
        case index === 1 && subItem.id === 0:
          setClearDataAlertVisible(true);
          break;
        case index === 1 && subItem.id === 1:
          reset();
          break;
        default:
      }
    },
    [
      reset,
      setAllowFileAccessFromFileUrls,
      setAllowsAirPlayForMediaPlayback,
      setAllowsBackForwardNavigationGestures,
      setAllowsFullScreenVideo,
      setAllowsInlineMediaPlayback,
      setAllowsProtectedMedia,
      setBounces,
      setContentMode,
      setDomStorageEnabled,
      setForceDarkOn,
      setGeolocationEnabled,
      setJavaScriptEnabled,
      setMediaPlaybackRequiresUserAction,
      setPullToRefreshEnabled,
      setScalesPageToFit,
      setThirdPartyCookiesEnabled,
      userAgent,
    ],
  );

  const onClearAllData = useCallback(() => {
    CookieManager.clearAll();
    Platform.select({ android: CookieManager.removeSessionCookies() });
  }, []);

  return (
    <Components.AppBaseView
      edges={['bottom', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        showBackButton={true}
        onPressBackButton={onGoBack}
        title={t('webViewSetting.title')}
        style={{ backgroundColor: colors.background }}
      />

      <ScrollView style={styles.safeArea}>
        <View style={[styles.listContainer, largeScreenMode && styles.cardTablet]}>
          {apps.map((item, index) => {
            return (
              <View key={item.id.toString()}>
                <List.Subheader style={[styles.listSubHeader, { color: colors.primary }]}>{item.title}</List.Subheader>
                {item.items.map((subItem, subIndex) => {
                  return (
                    <List.Item
                      key={subItem.id.toString()}
                      titleStyle={[{ color: colors.onSurface }, styles.rowOffset]}
                      descriptionStyle={[{ color: `${colors.onSurface}88` }, styles.rowOffset]}
                      onPress={() => onPressOption(item, index, subItem, subIndex)}
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
                      right={
                        subItem.inputType === 'switch'
                          ? () => (
                              <Switch
                                onValueChange={() => onPressOption(item, index, subItem, subIndex)}
                                value={subItem.value}
                              />
                            )
                          : undefined
                      }
                    />
                  );
                })}
                <Divider />
              </View>
            );
          })}
        </View>
      </ScrollView>

      <Components.AppInputDialog
        ref={modalVisibleUserAgentRef}
        modalVisible={modalVisibleUserAgent}
        header={t('webViewSetting.section1.row6.dialogTitle')}
        hint={t('webViewSetting.section1.row6.dialogSubTitle')}
        onPressClose={() => {
          setModalVisibleUserAgent(false);
        }}
        onPressSave={() => {
          setModalVisibleUserAgent(false);
          setUserAgent(modalUserAgent);
        }}
        placeholder={t('webViewSetting.section1.row6.dialogTitle')!}
        value={modalUserAgent}
        onChangeText={text => {
          setModalUserAgent(text);
        }}
        onBackButtonPress={() => {
          setModalVisibleUserAgent(false);
        }}
        multiline={true}
        autoCapitalize="none"
        keyboardType={'default'}
        returnKeyType={'default'}
        style={[styles.inputMultilineStyle, { color: colors.onBackground }]}
      />
      <Components.AppActionDialog
        title={t('webViewSetting.section2.row1.dialogTitle')}
        description={t('webViewSetting.section2.row1.dialogSubTitle')}
        visible={clearDataAlertVisible}
        cancelText={t('general.cancel')}
        confirmText={t('general.ok')}
        onPressConfirm={onClearAllData}
        onPressCancel={() => setClearDataAlertVisible(false)}
      />
    </Components.AppBaseView>
  );
};

export default WebViewSetting;
