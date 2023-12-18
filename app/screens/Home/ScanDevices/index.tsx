import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { Button, IconButton, List, Text, useTheme } from 'react-native-paper';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import LanPortScanner, { CancelScan, LSScanConfig } from 'react-native-lan-port-scanner';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

//App modules
import Components from 'app/components';
import styles from './styles';
import Config from 'app/config';
import Utils from 'app/utils';

//Modals
import IDevice from 'app/models/models/device';
import useAppScanConfigStore from 'app/store/appScanConfig';
import uuid from 'react-native-uuid';
import useAppConfigStore from 'app/store/appConfig';
import AppHeader from 'app/components/AppHeader';
import useEventEmitter from 'app/hooks/useDeviceEventEmitter';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'ScanDevices'>;

const ScanDevices = ({ navigation }: Props) => {
  //Refs
  const cancelScanRef = useRef<CancelScan | null>(null);
  //Actions

  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();
  const port = useAppScanConfigStore(store => store.port);
  const path = useAppScanConfigStore(store => store.path);
  const scanThreads = useAppScanConfigStore(store => store.scanThreads);
  const scanTimeoutInMs = useAppScanConfigStore(store => store.scanTimeoutInMs);
  const refreshRateInMs = useAppConfigStore(store => store.refreshRateInMs);
  const onSelectScannedDeviceEmitter = useEventEmitter<IDevice>('on_select_scanned_device');
  const largeScreenMode = useLargeScreenMode();

  //States
  const [scanningFinished, setScanningFinished] = useState(false);
  const [scannedDevices, setScannedDevices] = useState<IDevice[]>([]);

  const startScan = useCallback(async () => {
    setScannedDevices([]);
    setScanningFinished(false);
    if (cancelScanRef.current !== null) {
      cancelScanRef.current();
    }

    const networkInfo = await LanPortScanner.getNetworkInfo();
    const config: LSScanConfig = {
      networkInfo: networkInfo,
      ports: [port],
      timeout: scanTimeoutInMs,
      threads: scanThreads,
      logging: false,
    };
    cancelScanRef.current = LanPortScanner.startScan(
      config,
      (_totalHosts: number, _hostScanned: number) => {},
      result => {
        if (result) {
          setScannedDevices(d => {
            return [...d, { id: uuid.v4().toString(), refreshRateInMs: refreshRateInMs, path: path, ...result }];
          });
        }
      },
      () => {
        setScanningFinished(true);
      },
    );
  }, [path, port, refreshRateInMs, scanThreads, scanTimeoutInMs]);

  useEffect(() => {
    (async () => {
      await startScan();
    })();
  }, [startScan]);

  const onPressDevice = useCallback(
    async (device: IDevice, _index: number) => {
      onSelectScannedDeviceEmitter(device);
      navigation.goBack();
    },
    [navigation, onSelectScannedDeviceEmitter],
  );

  const onHelp = useCallback(async () => {
    await Utils.openInAppBrowser(Config.Constants.ABOUT_HELP);
  }, []);

  const renderNoNearbyDeviceButtons = useCallback(() => {
    return (
      <View style={styles.noDataButtonsContainer}>
        <Button onPress={onHelp}>{t('scanDevices.emptyData.help')}</Button>
        <Text style={{ color: colors.onBackground }}>{t('scanDevices.emptyData.or')}</Text>
        <Button onPress={startScan}>{t('scanDevices.emptyData.rescan')}</Button>
      </View>
    );
  }, [colors.onBackground, onHelp, startScan, t]);

  const onPressRefresh = useCallback(async () => {
    await startScan();
  }, [startScan]);

  const onGoBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        showBackButton={true}
        onPressBackButton={onGoBack}
        title={t('scanDevices.title')}
        RightViewComponent={
          <IconButton icon="refresh" iconColor={colors.onBackground} size={20} onPress={onPressRefresh} />
        }
        style={{ backgroundColor: colors.background }}
      />
      <View style={[styles.safeArea, largeScreenMode && styles.cardTablet, { backgroundColor: colors.background }]}>
        {scanningFinished && scannedDevices.length > 0 && (
          <ScrollView style={styles.scrollView}>
            <List.Section>
              <List.Subheader>{t(t('scanDevices.subTitle'))}</List.Subheader>
              {scannedDevices.map((device, idx) => {
                return (
                  <List.Item
                    key={device.id}
                    onPress={() => onPressDevice(device, idx)}
                    title={device.ip}
                    description={device.port}
                    left={props => <List.Icon {...props} icon="microsoft-windows" />}
                    right={props => <List.Icon {...props} icon={'antenna'} color={'green'} />}
                  />
                );
              })}
            </List.Section>
          </ScrollView>
        )}

        {scanningFinished && scannedDevices.length < 1 && (
          <Components.AppEmptyDataView
            style={{}}
            subHeader={t('scanDevices.emptyData.title')}
            renderContent={renderNoNearbyDeviceButtons}
          />
        )}
        {!scanningFinished && <Components.AppLoadingPlaceHolder />}
      </View>
    </View>
  );
};

export default ScanDevices;
