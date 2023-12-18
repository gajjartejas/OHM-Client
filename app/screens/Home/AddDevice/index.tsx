import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, ScrollView, TextInput, Keyboard, Platform, ToastAndroid, Alert } from 'react-native';

//ThirdParty
import { Button, IconButton, List } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';

//App modules
import styles from './styles';

//Redux
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import validateIPAddress from 'app/utils/validateIPAddress';
import validatePort from 'app/utils/validatePort';
import { useTranslation } from 'react-i18next';
import AppHeader from 'app/components/AppHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Components from 'app/components';
import useAppConfigStore from 'app/store/appConfig';
import uuid from 'react-native-uuid';
import IDevice from 'app/models/models/device';
import useAppScanConfigStore from 'app/store/appScanConfig';
import validateNum from 'app/utils/validateNum';
import useEventEmitter from 'app/hooks/useDeviceEventEmitter';
import IConnectionIdentity from 'app/models/models/identity';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'AddDevice'>;

const AddDevice = ({ navigation, route }: Props) => {
  //Refs
  let connectionNameRef = useRef<TextInput | null>(null);
  let ipAddressRef = useRef<TextInput | null>(null);
  let portRef = useRef<TextInput | null>(null);
  let identityRef = useRef<TextInput | null>(null);
  let refreshRateInMsRef = useRef<TextInput | null>(null);

  //Constants
  const { colors } = useTheme();
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const mode = route.params.mode;
  const upsertDevice = useAppConfigStore(store => store.upsertDevice);
  const defaultConfigPath = useAppScanConfigStore(store => store.path);
  const defaultConfigPort = useAppScanConfigStore(store => store.port);
  const defaultRefreshRateInMs = useAppConfigStore(store => store.refreshRateInMs);
  const connect = useAppConfigStore(store => store.connect);
  const largeScreenMode = useLargeScreenMode();

  //States
  const [identity, setIdentity] = useState<IConnectionIdentity | null>(null);
  const [device, setDevice] = useState<IDevice | null>(null);

  const [connectionName, setConnectionName] = useState('');
  const [ipAddress, setIPAddress] = useState('');
  const [port, setPort] = useState('');
  const [path, setPath] = useState('');
  const [refreshRateInMs, setRefreshRateInMs] = useState<string>('');
  const [identityTitle, setIdentityTitle] = useState('....');
  const [connecting, setConnecting] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('');
  const [buttonTitle, setButtonTitle] = useState('');

  useEventEmitter<IConnectionIdentity>('on_select_identity', data => {
    setIdentity(data);
  });

  useEventEmitter<IDevice>('on_select_scanned_device', data => {
    setDevice(data);
  });

  useEffect(() => {
    if (mode === 'create') {
      setHeaderTitle(t('addDevice.addDevice')!);
      setButtonTitle(t('addDevice.titleCreate')!);
    } else if (mode === 'edit') {
      setHeaderTitle(t('addDevice.updateDevice')!);
      setButtonTitle(t('addDevice.titleUpdate')!);
    } else if (mode === 'connect') {
      setHeaderTitle(t('addDevice.titleConnect')!);
      setButtonTitle(t('addDevice.connectDevice')!);
    }
  }, [mode, t]);

  useEffect(() => {
    setDevice(route.params.device ? route.params.device : null);
  }, [route.params.device]);

  useEffect(() => {
    if (device) {
      return;
    }
    setPath(defaultConfigPath);
    setPort(defaultConfigPort.toString());
    setRefreshRateInMs(defaultRefreshRateInMs.toString());
  }, [defaultConfigPath, defaultConfigPort, defaultRefreshRateInMs, device]);

  useEffect(() => {
    if (identity === null || identity === undefined) {
      return;
    }
    setIdentityTitle(identity.name ? identity.name : identity.username);
  }, [identity]);

  useEffect(() => {
    if (device === null) {
      return;
    }

    setConnectionName(device.name ? device.name : '');
    setIPAddress(device.ip);
    setPath(device.path);
    setPort(device.port.toString());
    setRefreshRateInMs(device.refreshRateInMs.toString());
    if (device.identity !== null && device.identity !== undefined) {
      setIdentityTitle(device.identity.name ? device.identity.name : device.identity.username);
    }
  }, [device]);

  const onPressSave = useCallback(async () => {
    Keyboard.dismiss();

    let deviceAddOrUpdate: IDevice = {
      id: device ? device.id : uuid.v4().toString(),
      name: connectionName,
      port: parseInt(port, 10),
      ip: ipAddress,
      path: path,
      refreshRateInMs: parseInt(refreshRateInMs, 10),
      identity: identity !== null ? identity : device?.identity,
    };

    upsertDevice(deviceAddOrUpdate);
    if (mode === 'connect') {
      setConnecting(true);
      let response = await connect(deviceAddOrUpdate, false, null);
      setConnecting(false);

      if (!response.deviceInfo || response.error) {
        return;
      }
    }

    navigation.pop();
  }, [
    connect,
    connectionName,
    device,
    identity,
    ipAddress,
    mode,
    navigation,
    path,
    port,
    refreshRateInMs,
    upsertDevice,
  ]);

  const onGoBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const onPressSelectIdentity = useCallback(() => {
    navigation.navigate('Identities', { mode: 'select' });
  }, [navigation]);

  const validPort = useCallback(
    (field: string): string | null => {
      return !validatePort(field) ? t('addDevice.invalidIpAddress') : null;
    },
    [t],
  );

  const validIPAddress = useCallback(
    (field: string): string | null => {
      return !validateIPAddress(field) ? t('addDevice.invalidIpAddress') : null;
    },
    [t],
  );

  const validRefreshRate = useCallback(
    (field: string): string | null => {
      return !validateNum(field, 100, 60 * 60 * 1000) ? t('addDevice.invalidRefreshRate') : null;
    },
    [t],
  );

  const onPressTestConnection = useCallback(async () => {
    setConnecting(true);
    let abortController = new AbortController();
    setTimeout(() => {
      abortController.abort();
      setConnecting(false);
    }, 5000);

    let deviceAddOrUpdate: IDevice = {
      id: device ? device.id : uuid.v4().toString(),
      name: connectionName,
      port: parseInt(port, 10),
      ip: ipAddress,
      path: path,
      refreshRateInMs: parseInt(refreshRateInMs, 10),
      identity: identity !== null ? identity : device?.identity,
    };

    let status = await connect(deviceAddOrUpdate, true, abortController);
    setConnecting(false);
    if (status.deviceInfo) {
      if (Platform.OS === 'android') {
        ToastAndroid.show(t('addDevice.connectionOk'), ToastAndroid.SHORT);
      } else if (Platform.OS === 'ios') {
        Alert.alert(t('addDevice.connectionOk'));
      }
    } else if (status.error) {
      if (Platform.OS === 'android') {
        ToastAndroid.show(
          status.error.code === 401 ? t('addDevice.authRequired') : status.error.message,
          ToastAndroid.SHORT,
        );
      } else if (Platform.OS === 'ios') {
        Alert.alert(status.error.code === 401 ? t('addDevice.authRequired') : status.error.message);
      }
    }
  }, [connect, connectionName, device, identity, ipAddress, path, port, refreshRateInMs, t]);

  const onScanDevices = useCallback(() => {
    navigation.navigate('ScanDevices', {});
  }, [navigation]);

  const validInputs = useMemo(() => {
    return validPort(port) !== null || validIPAddress(ipAddress) !== null || validRefreshRate(refreshRateInMs) !== null;
  }, [ipAddress, port, refreshRateInMs, validIPAddress, validPort, validRefreshRate]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        showBackButton={true}
        onPressBackButton={onGoBack}
        title={headerTitle}
        style={{ backgroundColor: colors.background }}
      />
      <View style={styles.subView}>
        <ScrollView style={styles.scrollView}>
          <View style={[styles.centeredView]}>
            <View
              style={[
                styles.modalView,
                largeScreenMode && styles.cardTablet,
                { backgroundColor: `${theme.colors.background}` },
              ]}>
              <Components.AppTextInput
                ref={connectionNameRef}
                autoCapitalize="none"
                value={connectionName}
                onChangeText={setConnectionName}
                placeholder={t('addDevice.inputPlaceholder1')!}
                containerStyle={styles.inputStyle}
                placeholderTextColor={theme.colors.onSurface}
                onSubmitEditing={() => ipAddressRef.current?.focus()}
                keyboardType={'default'}
                returnKeyType={'next'}
              />

              <Components.AppTextInput
                ref={ipAddressRef}
                autoCapitalize="none"
                value={ipAddress}
                onChangeText={setIPAddress}
                placeholder={t('addDevice.inputPlaceholder2')!}
                errorText={validIPAddress(ipAddress)}
                containerStyle={styles.inputStyle}
                placeholderTextColor={theme.colors.onSurface}
                onSubmitEditing={() => identityRef.current?.focus()}
                keyboardType={'numeric'}
                returnKeyType={'next'}
                RightAccessoryView={
                  <IconButton icon="magnify" iconColor={theme.colors.primary} size={20} onPress={onScanDevices} />
                }
              />

              <Components.AppTextInput
                ref={identityRef}
                autoCapitalize="none"
                value={path}
                onChangeText={setPath}
                placeholder={t('addDevice.inputPlaceholder3')!}
                containerStyle={styles.inputStyle}
                placeholderTextColor={theme.colors.onSurface}
                onSubmitEditing={() => portRef.current?.focus()}
                keyboardType={'default'}
                returnKeyType={'next'}
              />

              <Components.AppTextInput
                ref={portRef}
                autoCapitalize="none"
                value={port}
                onChangeText={setPort}
                placeholder={t('addDevice.inputPlaceholder4')!}
                errorText={validPort(port)}
                containerStyle={styles.inputStyle}
                placeholderTextColor={theme.colors.onSurface}
                onSubmitEditing={() => refreshRateInMsRef.current?.focus()}
                keyboardType={'numeric'}
                returnKeyType={'done'}
              />

              <Components.AppTextInput
                ref={refreshRateInMsRef}
                autoCapitalize="none"
                value={refreshRateInMs}
                onChangeText={setRefreshRateInMs}
                placeholder={t('addDevice.inputPlaceholder5')!}
                errorText={validRefreshRate(refreshRateInMs)}
                containerStyle={styles.inputStyle}
                placeholderTextColor={theme.colors.onSurface}
                onSubmitEditing={onPressSave}
                keyboardType={'numeric'}
                returnKeyType={'done'}
              />

              <List.Item
                style={styles.selectIdentity}
                title={t('addDevice.selectIdentity')!}
                description={identityTitle}
                onPress={onPressSelectIdentity}
                right={props => <List.Icon {...props} icon="key" />}
              />
            </View>
          </View>
        </ScrollView>

        <Button
          disabled={validInputs}
          mode={'text'}
          style={[styles.button, largeScreenMode && styles.cardTablet]}
          onPress={onPressTestConnection}>
          {t('addDevice.testConnection')}
        </Button>

        <Button
          disabled={validInputs}
          mode={'contained'}
          style={[styles.button, largeScreenMode && styles.cardTablet, { marginBottom: insets.bottom + 8 }]}
          onPress={onPressSave}>
          {buttonTitle}
        </Button>
      </View>

      {connecting && <Components.AppLoader message={t('general.connecting')} />}
    </View>
  );
};

export default AddDevice;
