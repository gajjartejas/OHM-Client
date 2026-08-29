import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Animated, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

//ThirdParty
import { Button, Dialog, IconButton, Menu, Portal, Snackbar, Text, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Clipboard from '@react-native-clipboard/clipboard';

//App modules
import Components from 'app/components';
import styles from './styles';

//Redux
import { ICardViewModel } from 'app/models/viewModels/cardValueViewModel';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import useAppConfigStore from 'app/store/appConfig';
import { convertToViewModel } from 'app/models/mapper/cardValueViewModel';
import AppHeader from 'app/components/AppHeader';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';
import getLiveURL from 'app/utils/getLiveURL';
import inspectService from 'app/services/inspectService';

interface IAppError {
  message?: string;
  code?: number;
}

const THRESHOLD_DIFF_Y = 100;

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'DeviceInfo'>;

const DeviceInfo = ({ navigation }: Props) => {
  //Refs
  const refJSONData = useRef<string | null>(null);
  const refDeviceInfoRequestInProgress = useRef<boolean>(false);

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

  //States
  const [deviceInfos, setDeviceInfos] = useState<ICardViewModel[]>([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [errorMessageTitle, setErrorMessageTitle] = useState<string | null>(null);
  const [errorMessageDesc, setErrorMessageDesc] = useState<string | null>(null);
  const [buttonTitle, setButtonTitle] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(true);
  const [infoDialogVisible, setInfoDialogVisible] = useState<boolean>(false);
  const [appServerURL, setAppServerURL] = useState<string | null>(null);
  const [subTitleDialogVisible, setSubTitleDialogVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [appServerAltURL, setAppServerAltURL] = useState<string | null>(null);
  const [switchUrlError, setSwitchUrlError] = useState<IAppError | null>(null);
  const [error, setError] = useState<IAppError | null>(null);

  const urls: string[] = useMemo(() => {
    return selectedDevice
      ? [selectedDevice.ip1, selectedDevice.ip2, selectedDevice.ip3].filter(m => !!m).map(m => m!)
      : [];
  }, [selectedDevice]);

  const allUrls = useMemo(() => {
    return [selectedDevice?.ip1, selectedDevice?.ip2, selectedDevice?.ip3].filter(v => !!v);
  }, [selectedDevice?.ip1, selectedDevice?.ip2, selectedDevice?.ip3]);

  const subTitle = useMemo(() => {
    return selectedDevice ? `${selectedDevice.selectedIp}:${selectedDevice.port}` : undefined;
  }, [selectedDevice]);

  const getURL = useCallback((url: string, path: string, port: number, secure: boolean) => {
    return (secure ? 'https://' : 'http://') + url + ':' + port + '/' + path.replace(/^\//, '');
  }, []);

  const loadURL = useCallback(() => {
    if (!selectedDevice) {
      setAppServerURL(null);
      return;
    }
    const serverURL = getURL(
      selectedDevice?.selectedIp,
      selectedDevice.path,
      selectedDevice.port,
      selectedDevice.secureConnection,
    );
    console.log('serverURL>>>>', serverURL);
    setAppServerURL(serverURL);
  }, [getURL, selectedDevice]);

  const fetchAlternateAddress = useCallback(async (): Promise<string | null> => {
    const abortController = new AbortController();
    try {
      const serverURLs = allUrls
        .filter(v => v !== selectedDevice?.selectedIp)
        .map(v => {
          return getURL(v!, selectedDevice!.path, selectedDevice!.port, selectedDevice!.secureConnection);
        });
      const value = await getLiveURL(serverURLs, abortController);
      console.log('fetchAlternateAddress->value:', value);
      return value;
    } catch (e) {
      console.log('fetchAlternateAddress->error:', e);
      return null;
    }
  }, [allUrls, getURL, selectedDevice]);

  useEffect(() => {
    loadURL();
    fetchAlternateAddress().then(url => {
      if (url) {
        setAppServerAltURL(url);
      }
    });
  }, [fetchAlternateAddress, loadURL]);

  useEffect(() => {
    if (switchUrlError && appServerAltURL && appServerURL !== appServerAltURL) {
      setSwitchUrlError(null);
      setAppServerURL(appServerAltURL);
      setSnackbarVisible(true);
    }
  }, [appServerAltURL, appServerURL, switchUrlError]);

  useEffect(() => {
    if (!selectedDevice) {
      return;
    }
    if (selectedDevice.name) {
      setTitle(selectedDevice.name);
      return;
    }
    setTitle(selectedDevice?.selectedIp! + ':' + selectedDevice?.port);
  }, [selectedDevice, selectedDevice?.selectedIp, selectedDevice?.port]);

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
    if (!deviceInfos && !error) {
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
    setErrorMessageDesc(error.message ?? null);
    setButtonTitle(t('deviceInfo.emptyData.item4.button'));
  }, [deviceInfos, error, t]);

  const loadRequest = useCallback(async () => {
    if (!selectedDevice) {
      return;
    }
    if (refDeviceInfoRequestInProgress.current) {
      return;
    }

    refDeviceInfoRequestInProgress.current = true;

    try {
      let response = await inspectService({
        ipAddress: selectedDevice.selectedIp,
        port: selectedDevice.port,
        path: selectedDevice.path,
        username: selectedDevice.identity ? selectedDevice.identity.username : null,
        password: selectedDevice.identity ? selectedDevice.identity.password : null,
        abortController: null,
      });
      refJSONData.current = JSON.stringify(response);
      setError(null);
      setDeviceInfos(convertToViewModel(response));
    } catch (e: unknown) {
      setError(e as IAppError);
    }

    setConnecting(false);
    refDeviceInfoRequestInProgress.current = false;
  }, [selectedDevice]);

  useEffect(() => {
    if (!selectedDevice) {
      return;
    }

    (async () => {
      setConnecting(true);
      await loadRequest();
      setConnecting(false);
    })();

    const to = setInterval(async () => {
      await loadRequest();
    }, selectedDevice.refreshRateInMs);

    return () => {
      clearInterval(to);
    };
  }, [error, loadRequest, selectedDevice]);

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
    navigation.navigate('DeviceInfoWebView');
  }, [navigation]);

  const onInfo = useCallback(() => {
    setMenuVisible(false);
    setInfoDialogVisible(true);
  }, []);

  const onPressMore = useCallback(() => {
    setMenuVisible(true);
  }, []);

  const onWRefresh = useCallback(async () => {
    setConnecting(true);
    await loadRequest();
    setConnecting(false);
  }, [loadRequest]);

  const onCopyJSON = useCallback(() => {
    setMenuVisible(false);
    if (refJSONData.current !== null) {
      Clipboard.setString(refJSONData.current);
    }
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
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
    useNativeDriver: true,
    listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => handleScroll(event),
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
    if (appServerURL) {
      Clipboard.setString(appServerURL);
    }
  }, [appServerURL]);

  const onDoneDialog = useCallback(() => {
    setInfoDialogVisible(false);
  }, []);

  const onDismissSnackbar = useCallback(() => {
    setSnackbarVisible(false);
  }, []);

  return (
    <Components.AppBaseView edges={['bottom', 'left', 'right']} style={styles.container}>
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

      {errorMessageDesc && (
        <Components.AppMiniBanner
          onPress={onPressSetting}
          RightViewComponent={
            <IconButton icon="arrow-right" iconColor={colors.onBackground} size={20} onPress={onPressSetting} />
          }
          message={errorMessageDesc}
        />
      )}

      {deviceInfos && (
        <View style={styles.subView}>
          <Animated.ScrollView
            style={styles.scrollView}
            onScroll={onScroll}
            scrollEventThrottle={16}>
            {deviceInfos.map(m => {
              return <Components.CardSection key={m.id.toString()} root={true} value={m} />;
            })}
          </Animated.ScrollView>
        </View>
      )}

      {deviceInfos.length < 1 && !!error && !connecting && (
        <Components.AppEmptyDataView
          iconType={'fontawesome6'}
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
          <Menu.Item leadingIcon={'content-copy'} onPress={onCopyJSON} title={t('deviceInfo.copyJSON')} />
          <Menu.Item leadingIcon={'information-outline'} onPress={onInfo} title={t('deviceInfo.info')} />
        </Menu>
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
        {t('deviceInfo.switchedURL', { id3002: appServerAltURL })}
      </Snackbar>

      <Components.AppRadioSelectDialog
        visible={subTitleDialogVisible}
        title={t('deviceInfo.selectIpAddress.title')}
        items={urls}
        onPressConfirm={onPressConfirmIpAddress}
        onPressCancel={onCloseSubTitleDialog}
        selectedItem={selectedDevice ? selectedDevice.selectedIp : '-'}
      />

      {connecting && <Components.AppLoader message={t('deviceInfo.loading')} />}
    </Components.AppBaseView>
  );
};

export default DeviceInfo;
