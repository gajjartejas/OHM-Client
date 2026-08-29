import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ScrollView, View } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Button,
  IconButton,
  List,
  ProgressBar,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import LanPortScanner, {
  CancelScan,
  LSScanConfig,
} from 'react-native-lan-port-scanner';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

//App modules
import Components from 'app/components';
import CommonIcon from 'app/components/CommonIcon';
import styles from './styles';
import Config from 'app/config';
import Utils from 'app/utils';

//Modals
import IDevice from 'app/models/models/device';
import useAppScanConfigStore from 'app/store/appScanConfig';
import uuid from 'react-native-uuid';
import AppHeader from 'app/components/AppHeader';
import useEventEmitter from 'app/hooks/useDeviceEventEmitter';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAppConfigStore from 'app/store/appConfig';

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'ScanDevices'>;

interface IScanProgress {
  progress: number;
  percent: number;
  totalHosts: number;
  hostScanned: number;
}

const ScanDevices = ({ navigation }: Props) => {
  //Refs
  const cancelScanRef = useRef<CancelScan | null>(null);
    const lastProgressUpdateRef = useRef<number>(0);

    //Actions

  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();
  const port = useAppScanConfigStore(store => store.port);
  const scanThreads = useAppScanConfigStore(store => store.scanThreads);
  const scanTimeoutInMs = useAppScanConfigStore(store => store.scanTimeoutInMs);
  const refreshRateInMs = useAppConfigStore(store => store.refreshRateInMs);
  const onSelectScannedDeviceEmitter = useEventEmitter<IDevice>('on_select_scanned_device');
  const largeScreenMode = useLargeScreenMode();
  const insets = useSafeAreaInsets();

  //States
  const [scanningFinished, setScanningFinished] = useState(false);
  const [scannedDevices, setScannedDevices] = useState<IDevice[]>([]);
    const [scanProgress, setScanProgress] = useState<IScanProgress>({
      progress: 0,
      percent: 0,
      totalHosts: 0,
      hostScanned: 0,
    });

  const startScan = useCallback(async () => {
    setScannedDevices([]);
    setScanningFinished(false);
      setScanProgress({
        progress: 0,
        percent: 0,
        totalHosts: 0,
        hostScanned: 0,
      });
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
      (totalHosts: number, hostScanned: number) => {
        const now = Date.now();
        const ratio = totalHosts > 0 ? hostScanned / totalHosts : 0;
        const pct = Math.round(ratio * 100);

        if (
          hostScanned === 1 ||
          hostScanned === totalHosts ||
          hostScanned % 50 === 0
        ) {
          console.log(
            `[ScanDevices] Scan Progress: ${hostScanned}/${totalHosts} (${pct}%)`,
          );
        }

        if (
          now - lastProgressUpdateRef.current > 80 ||
          hostScanned === totalHosts
        ) {
          lastProgressUpdateRef.current = now;
          setScanProgress({
            progress: Math.min(1, Math.max(0, ratio)),
            percent: Math.min(100, pct),
            totalHosts,
            hostScanned,
          });
        }
      },
      result => {
        if (result) {
          setScannedDevices(d => {
            const updatedDevices = d.map(device => {
              if (device.ip1 === result.ip) {
                return {
                  ...device,
                  ip1: result.ip,
                  ip2: null,
                  ip3: null,
                  selectedIp: result.ip,
                  refreshRateInMs: refreshRateInMs,
                  path: '/data.json',
                  secureConnection: false,
                };
              }
              return device;
            });
            return updatedDevices.some(device => device.ip1 === result.ip)
              ? updatedDevices
              : [
                  ...updatedDevices,
                  {
                    id: uuid.v4().toString(),
                    name: '',
                    ip1: result.ip,
                    ip2: null,
                    ip3: null,
                    selectedIp: result.ip,
                    refreshRateInMs: refreshRateInMs,
                    secureConnection: false,
                    path: '/data.json',
                    ...result,
                  },
                ];
          });
        }
      },
      () => {
        setScanningFinished(true);
      },
    );
  }, [port, refreshRateInMs, scanThreads, scanTimeoutInMs]);

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

  const onPressSettings = useCallback(async () => {
    navigation.navigate('ScanSetting', {});
  }, [navigation]);

  const onGoBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const bottomInsets = useMemo(() => {
    return insets.bottom > 0 ? insets.bottom : 16;
  }, [insets.bottom]);

  return (
    <Components.AppBaseView
      edges={['bottom', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <AppHeader
        showBackButton={true}
        onPressBackButton={onGoBack}
        title={t('scanDevices.title')}
        RightViewComponent={
          <IconButton
            style={styles.navigationButton}
            icon="cog"
            iconColor={colors.onBackground}
            size={20}
            onPress={onPressSettings}
          />
        }
        style={{ backgroundColor: colors.background }}
      />
      <View
        style={[
          styles.safeArea,
          largeScreenMode && styles.cardTablet,
          { backgroundColor: colors.background },
        ]}
      >
        {!scanningFinished && (
          <Surface
            elevation={1}
            style={[
              styles.progressCard,
              {
                backgroundColor: colors.surface,
                borderColor: `${colors.onSurface}18`,
              },
            ]}
          >
            <View style={styles.progressHeader}>
              <View style={styles.progressTitleContainer}>
                <ActivityIndicator
                  animating={true}
                  color={colors.primary}
                  size={16}
                />
                <Text
                  style={[
                    styles.progressStatusText,
                    { color: colors.onSurface },
                  ]}
                >
                  {t('scanDevices.scanning')}
                </Text>
              </View>
              <Text
                style={[
                  styles.progressPercentageText,
                  { color: colors.onSurface },
                ]}
              >
                {scanProgress.percent}%
              </Text>
            </View>

            <ProgressBar
              progress={scanProgress.progress}
              color={colors.primary}
              style={[
                styles.progressBar,
                { backgroundColor: `${colors.onSurface}15` },
              ]}
            />

            <View style={styles.progressFooter}>
              <Text
                style={[
                  styles.progressFooterText,
                  { color: `${colors.onSurface}88` },
                ]}
              >
                {scanProgress.totalHosts > 0
                  ? t('scanDevices.scannedRatio', {
                      scanned: scanProgress.hostScanned,
                      total: scanProgress.totalHosts,
                    })
                  : ''}
              </Text>
              <View
                style={[
                  styles.discoveredBadge,
                  {
                    backgroundColor:
                      scannedDevices.length > 0
                        ? '#00D10020'
                        : `${colors.onSurface}10`,
                    borderColor:
                      scannedDevices.length > 0
                        ? '#00D10060'
                        : `${colors.onSurface}20`,
                  },
                ]}
              >
                <CommonIcon
                  type="material"
                  name={scannedDevices.length > 0 ? 'antenna' : 'radar'}
                  size={14}
                  color={
                    scannedDevices.length > 0
                      ? '#00D100'
                      : `${colors.onSurface}88`
                  }
                />
                <Text
                  style={[
                    styles.discoveredBadgeText,
                    {
                      color:
                        scannedDevices.length > 0
                          ? '#00D100'
                          : `${colors.onSurface}88`,
                    },
                  ]}
                >
                  {t('scanDevices.discoveredCount', {
                    count: scannedDevices.length,
                  })}
                </Text>
              </View>
            </View>
          </Surface>
        )}
        {scanningFinished && scannedDevices.length > 0 && (
          <ScrollView style={styles.scrollView}>
            <List.Section>
              <List.Subheader>{t(t('scanDevices.subTitle'))}</List.Subheader>
              {scannedDevices.map((device, idx) => {
                return (
                  <List.Item
                    key={device.id}
                    onPress={() => onPressDevice(device, idx)}
                    title={device.ip1}
                    description={device.port}
                    left={props => <List.Icon {...props} icon="raspberry-pi" />}
                    right={props => (
                      <List.Icon {...props} icon={'antenna'} color={'green'} />
                    )}
                  />
                );
              })}
            </List.Section>
          </ScrollView>
        )}

        {scanningFinished && scannedDevices.length < 1 && (
          <Components.AppEmptyDataView
            iconType={'fontawesome6'}
            iconName="raspberry-pi"
            style={{}}
            header={t('scanDevices.emptyData.title')}
            subHeader={t('scanDevices.emptyData.subtitle')}
            renderContent={renderNoNearbyDeviceButtons}
          />
        )}
        {!scanningFinished && <Components.AppLoadingPlaceHolder />}

        {scanningFinished && scannedDevices.length > 0 && (
          <Button
            style={{ marginBottom: bottomInsets }}
            icon={'refresh'}
            mode={'text'}
            onPress={startScan}
          >
            {t('scanDevices.refresh')}
          </Button>
        )}
      </View>
    </Components.AppBaseView>
  );
};

export default ScanDevices;
