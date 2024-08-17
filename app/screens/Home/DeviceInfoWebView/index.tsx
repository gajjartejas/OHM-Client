import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Animated } from 'react-native';

//ThirdParty
import { Button, Dialog, IconButton, Menu, Portal, ProgressBar, Snackbar, Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import Clipboard from '@react-native-clipboard/clipboard';

//App modules
import Components from 'app/components';
import styles from './styles';

//Redux
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import useAppConfigStore from 'app/store/appConfig';
import AppHeader from 'app/components/AppHeader';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';
import WebView from 'react-native-webview';
import useAppWebViewConfigStore from 'app/store/webViewConfig';
import Utils from 'app/utils';
import inspectService from 'app/services/inspectService';

const THRESHOLD_DIFF_Y = 100;

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'DeviceInfoWebView'>;

const DeviceInfoWebView = ({ navigation }: Props) => {
  //Refs
  const refCurrentURL = useRef<string | null>(null);
  const webViewRef = useRef<WebView | null>(null);

  //Actions

  //Constants
  const { colors } = useTheme();
  const { t } = useTranslation();
  const largeScreenMode = useLargeScreenMode();
  const insets = useSafeAreaInsets();

  const selectedDevice = useAppConfigStore(store => store.selectedDevice);
  const switchDeviceIp = useAppConfigStore(store => store.switchDeviceIp);

  const scrollY = useRef(new Animated.Value(0)).current;
  const diffClamp = Animated.diffClamp(scrollY, 0, THRESHOLD_DIFF_Y);
  const translateY = diffClamp.interpolate({
    inputRange: [0, THRESHOLD_DIFF_Y],
    outputRange: [0, THRESHOLD_DIFF_Y],
    extrapolate: 'clamp',
  });
  const [
    mediaPlaybackRequiresUserAction,
    scalesPageToFit,
    domStorageEnabled,
    javaScriptEnabled,
    thirdPartyCookiesEnabled,
    userAgent,
    allowsFullScreenVideo,
    allowsInlineMediaPlayback,
    allowsAirPlayForMediaPlayback,
    bounces,
    contentMode,
    geolocationEnabled,
    allowFileAccessFromFileUrls,
    allowsBackForwardNavigationGestures,
    pullToRefreshEnabled,
    forceDarkOn,
    allowsProtectedMedia,
  ] = useAppWebViewConfigStore(store => [
    store.mediaPlaybackRequiresUserAction,
    store.scalesPageToFit,
    store.domStorageEnabled,
    store.javaScriptEnabled,
    store.thirdPartyCookiesEnabled,
    store.userAgent,
    store.allowsFullScreenVideo,
    store.allowsInlineMediaPlayback,
    store.allowsAirPlayForMediaPlayback,
    store.bounces,
    store.contentMode,
    store.geolocationEnabled,
    store.allowFileAccessFromFileUrls,
    store.allowsBackForwardNavigationGestures,
    store.pullToRefreshEnabled,
    store.forceDarkOn,
    store.allowsProtectedMedia,
  ]);

  //States
  const [webViewKey, setWebViewKey] = useState<number>(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [errorMessageTitle, setErrorMessageTitle] = useState<string | null>(null);
  const [errorMessageDesc, setErrorMessageDesc] = useState<string | null>(null);
  const [buttonTitle, setButtonTitle] = useState<string | null>(null);
  const [infoDialogVisible, setInfoDialogVisible] = useState<boolean>(false);
  const [appServerURL, setAppServerURL] = useState<string | null>(null);
  const [subTitleDialogVisible, setSubTitleDialogVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [error, setError] = useState<any | null>(null);
  const [progress, setProgress] = useState(0);
  const [infoLoaded, setInfoLoaded] = useState(false);

  const urls: string[] = useMemo(() => {
    return selectedDevice
      ? [selectedDevice.ip1, selectedDevice.ip2, selectedDevice.ip3].filter(m => !!m).map(m => m!)
      : [];
  }, [selectedDevice]);

  const subTitle = useMemo(() => {
    return selectedDevice ? `${selectedDevice.selectedIp}:${selectedDevice.port}` : undefined;
  }, [selectedDevice]);

  const loadRequest = useCallback(async () => {
    if (!selectedDevice) {
      return;
    }
    try {
      await inspectService({
        ipAddress: selectedDevice.selectedIp,
        port: selectedDevice.port,
        path: selectedDevice.path,
        username: selectedDevice.identity ? selectedDevice.identity.username : null,
        password: selectedDevice.identity ? selectedDevice.identity.password : null,
        abortController: null,
      });

      const { secureConnection, selectedIp, port, identity } = selectedDevice;
      const auth = identity ? `${identity.username}:${identity.password}@` : '';
      const serverURL = (secureConnection ? 'https://' : 'http://') + auth + selectedIp + ':' + port;

      setInfoLoaded(true);
      setAppServerURL(serverURL);
      setError(null);
    } catch (e: any) {
      setError(e);
    }
  }, [selectedDevice]);

  useEffect(() => {
    if (!selectedDevice) {
      return;
    }
    (async () => {
      await loadRequest();
    })();

    if (selectedDevice.name) {
      setTitle(selectedDevice.name);
      return;
    }
    setTitle(selectedDevice?.selectedIp! + ':' + selectedDevice?.port);
  }, [loadRequest, selectedDevice]);

  const onGoBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const onPressSetting = useCallback(() => {
    if (!selectedDevice) {
      return;
    }
    navigation.navigate('AddDevice', { device: selectedDevice, mode: 'edit' });
  }, [navigation, selectedDevice]);

  useEffect(() => {
    if (!infoLoaded && !error) {
      setErrorMessageTitle(t('deviceInfo.emptyData.item1.title'));
      setErrorMessageDesc(t('deviceInfo.emptyData.item1.message'));
      setButtonTitle(t('deviceInfo.emptyData.item1.button'));
      return;
    }

    if (!error) {
      setErrorMessageDesc(null);
      setErrorMessageTitle(null);
      setButtonTitle(null);
      return;
    }

    if (error.message === 'Aborted') {
      setErrorMessageTitle(t('deviceInfo.emptyData.item2.title'));
      setErrorMessageDesc(t('deviceInfo.emptyData.item2.message'));
      setButtonTitle(t('deviceInfo.emptyData.item2.button'));
      return;
    }

    if (error.code === 401) {
      setErrorMessageTitle(t('deviceInfo.emptyData.item3.title'));
      setErrorMessageDesc(t('deviceInfo.emptyData.item3.message'));
      setButtonTitle(t('deviceInfo.emptyData.item3.button'));
      return;
    }

    setErrorMessageTitle(t('deviceInfo.emptyData.item4.title'));
    setErrorMessageDesc(error.message);
    setButtonTitle(t('deviceInfo.emptyData.item4.button'));
  }, [error, infoLoaded, t]);

  const renderNoDataButtons = useCallback(() => {
    return (
      <View style={styles.noDataButtonsContainer}>
        <Button onPress={onPressSetting}>{buttonTitle}</Button>
      </View>
    );
  }, [buttonTitle, onPressSetting]);

  const onDismissModal = useCallback(() => {
    setMenuVisible(false);
  }, []);

  const onSwitchURL = useCallback(() => {
    setSubTitleDialogVisible(true);
  }, []);

  const onOpenWith = useCallback(() => {
    if (refCurrentURL.current !== null) {
      Utils.openBrowser(refCurrentURL.current);
    } else if (appServerURL) {
      Utils.openBrowser(appServerURL);
    }
  }, [appServerURL]);

  const onInfo = useCallback(() => {
    setMenuVisible(false);
    setInfoDialogVisible(true);
  }, []);

  const onPressMore = useCallback(() => {
    setMenuVisible(true);
  }, []);

  const onWRefresh = useCallback(async () => {
    setWebViewKey(v => v + 1);
  }, []);

  const onCopyJSON = useCallback(() => {
    setInfoDialogVisible(false);
    if (refCurrentURL.current !== null) {
      Clipboard.setString(refCurrentURL.current);
    } else if (appServerURL) {
      Clipboard.setString(appServerURL);
    }
  }, [appServerURL]);

  const handleScroll = useCallback(
    (event: any) => {
      const { y } = event.nativeEvent.contentOffset;

      if (y < 0) {
        scrollY.setValue(0);
        return;
      }

      if (y < 0 || y > event.nativeEvent.contentSize.height) {
        scrollY.setValue(event.nativeEvent.contentSize.height);
        return;
      }

      scrollY.setValue(event.nativeEvent.contentOffset.y);
    },
    [scrollY],
  );

  const onScroll = Animated.event([{ nativeEvent: { contentOffset: {} } }], {
    useNativeDriver: false,
    listener: event => handleScroll(event),
  });

  const contentContainerStyle = useMemo(
    () => ({
      bottom: insets.bottom + 12,
      backgroundColor: colors.background,
      borderColor: `${colors.primary}50`,
      transform: [{ translateY }],
    }),
    [colors.background, colors.primary, insets.bottom, translateY],
  );

  const onPressConfirmIpAddress = useCallback(
    (item: string) => {
      switchDeviceIp(item);
      setSubTitleDialogVisible(false);
    },
    [switchDeviceIp],
  );

  const onCloseSubTitleDialog = useCallback(() => {
    setSubTitleDialogVisible(false);
  }, []);

  const onCopyDialog = useCallback(() => {
    setInfoDialogVisible(false);
    if (refCurrentURL.current !== null) {
      Clipboard.setString(refCurrentURL.current);
    } else if (appServerURL) {
      Clipboard.setString(appServerURL);
    }
  }, [appServerURL]);

  const onDoneDialog = useCallback(() => {
    setInfoDialogVisible(false);
  }, []);

  const onDismissSnackbar = useCallback(() => {
    setSnackbarVisible(false);
  }, []);

  const onLoadProgress = useCallback(({ nativeEvent }: any) => {
    setProgress(nativeEvent.progress);
  }, []);

  const onNavigationStateChange = useCallback((state: any) => {
    refCurrentURL.current = state.url;
  }, []);

  const onHttpError = useCallback((e: any) => {
    console.log('onHttpError', e.nativeEvent.description);
    // setError(e);
  }, []);

  const onError = useCallback((e: any) => {
    console.log('onHttpError', e.nativeEvent.description);
    // setError(e);
  }, []);

  const onLoadEnd = useCallback(() => {
    console.log('onLoadEnd');
    setTimeout(() => {
      setProgress(0);
    }, 300);
  }, []);

  return (
    <Components.AppBaseView
      edges={['bottom', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        showBackButton={true}
        onPressBackButton={onGoBack}
        title={title}
        subTitle={subTitle}
        style={{ backgroundColor: colors.background }}
        RightViewComponent={
          <IconButton icon="tune-vertical" iconColor={colors.onBackground} size={20} onPress={onPressSetting} />
        }
      />

      {errorMessageDesc && infoLoaded && (
        <Components.AppMiniBanner
          onPress={onPressSetting}
          RightViewComponent={
            <IconButton icon="arrow-right" iconColor={colors.onBackground} size={20} onPress={onPressSetting} />
          }
          message={errorMessageDesc}
        />
      )}

      {!!appServerURL && (
        <View style={styles.subView}>
          <WebView
            key={webViewKey}
            ref={webViewRef}
            onScroll={onScroll}
            source={{ uri: appServerURL }}
            style={{ ...styles.webview, backgroundColor: colors.background }}
            originWhitelist={['*']}
            onLoadProgress={onLoadProgress}
            onNavigationStateChange={onNavigationStateChange}
            onHttpError={onHttpError}
            onError={onError}
            onLoadEnd={onLoadEnd}
            mediaPlaybackRequiresUserAction={mediaPlaybackRequiresUserAction}
            scalesPageToFit={scalesPageToFit}
            domStorageEnabled={domStorageEnabled}
            javaScriptEnabled={javaScriptEnabled}
            thirdPartyCookiesEnabled={thirdPartyCookiesEnabled}
            userAgent={userAgent}
            allowsFullscreenVideo={allowsFullScreenVideo}
            allowsInlineMediaPlayback={allowsInlineMediaPlayback}
            allowsAirPlayForMediaPlayback={allowsAirPlayForMediaPlayback}
            bounces={bounces}
            contentMode={contentMode ? 'desktop' : 'mobile'}
            geolocationEnabled={geolocationEnabled}
            allowFileAccessFromFileURLs={allowFileAccessFromFileUrls}
            allowsBackForwardNavigationGestures={allowsBackForwardNavigationGestures}
            pullToRefreshEnabled={pullToRefreshEnabled}
            forceDarkOn={forceDarkOn}
            allowsProtectedMedia={allowsProtectedMedia}
          />
        </View>
      )}

      {error && !infoLoaded && (
        <Components.AppEmptyDataView
          iconType={'font-awesome5'}
          iconName="box-open"
          style={styles.emptyView}
          header={errorMessageTitle}
          subHeader={errorMessageDesc}
          renderContent={renderNoDataButtons}
        />
      )}

      <Animated.View style={[styles.docker, contentContainerStyle]}>
        <IconButton icon={'chevron-left'} size={26} style={{}} onPress={onGoBack} />
        <View style={styles.homeBackFwdButtonContainer}>
          <IconButton icon={'swap-horizontal'} disabled={false} size={26} style={{}} onPress={onSwitchURL} />
          <IconButton icon={'refresh'} size={26} style={{}} disabled={false} onPress={onWRefresh} />
          <IconButton icon={'open-in-app'} size={26} disabled={false} style={{}} onPress={onOpenWith} />
        </View>

        <Menu
          visible={menuVisible}
          onDismiss={onDismissModal}
          anchor={<IconButton icon={'dots-vertical'} size={26} onPress={onPressMore} />}>
          <Menu.Item leadingIcon={'content-copy'} onPress={onCopyJSON} title={t('deviceInfo.copyURL')} />
          <Menu.Item leadingIcon={'information-outline'} onPress={onInfo} title={t('deviceInfo.info')} />
        </Menu>
        <View pointerEvents={'none'} style={styles.dockerLoadingProgress}>
          <ProgressBar color={`${colors.primary}50`} style={styles.progressBar} progress={progress} />
        </View>
      </Animated.View>

      <Portal>
        <Dialog
          style={largeScreenMode && styles.cardTablet}
          visible={infoDialogVisible}
          onDismiss={() => setInfoDialogVisible(false)}>
          <Dialog.Title>{t('deviceInfo.infoDialog.title')}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{t('deviceInfo.infoDialog.description', { id3001: appServerURL })}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onCopyDialog}>{t('deviceInfo.infoDialog.copy')}</Button>
            <Button onPress={onDoneDialog}>{t('deviceInfo.infoDialog.done')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar visible={snackbarVisible} onDismiss={onDismissSnackbar}>
        {t('deviceInfo.switchedURL', { URL: appServerURL })}
      </Snackbar>

      <Components.AppRadioSelectDialog
        visible={subTitleDialogVisible}
        title={t('deviceInfo.selectIpAddress.title')}
        items={urls}
        onPressConfirm={onPressConfirmIpAddress}
        onPressCancel={onCloseSubTitleDialog}
        selectedItem={selectedDevice ? selectedDevice.selectedIp : '-'}
      />
    </Components.AppBaseView>
  );
};

export default DeviceInfoWebView;
