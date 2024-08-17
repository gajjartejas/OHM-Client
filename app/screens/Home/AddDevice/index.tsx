import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Keyboard,
  Platform,
  ToastAndroid,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';

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
import Components from 'app/components';
import useAppConfigStore from 'app/store/appConfig';
import uuid from 'react-native-uuid';
import IDevice from 'app/models/models/device';
import useAppScanConfigStore from 'app/store/appScanConfig';
import validateNum from 'app/utils/validateNum';
import useEventEmitter from 'app/hooks/useDeviceEventEmitter';
import IConnectionIdentity from 'app/models/models/identity';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';
import inspectService from 'app/services/inspectService';

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'AddDevice'>;

const AddDevice = ({ navigation, route }: Props) => {
  //Refs
  const connectionNameRef = useRef<TextInput | null>(null);
  const ipAddressRef = useRef<TextInput | null>(null);
  const portRef = useRef<TextInput | null>(null);
  const identityRef = useRef<TextInput | null>(null);
  const refreshRateInMsRef = useRef<TextInput | null>(null);
  const ipAddress1Ref = useRef<TextInput | null>(null);
  const ipAddress2Ref = useRef<TextInput | null>(null);
  const ipAddress3Ref = useRef<TextInput | null>(null);

  //Constants
  const { colors } = useTheme();
  const theme = useTheme();
  const { t } = useTranslation();
  const mode = route.params.mode;
  const upsertDevice = useAppConfigStore(store => store.upsertDevice);
  const defaultConfigPath = useAppScanConfigStore(store => store.path);
  const defaultConfigPort = useAppScanConfigStore(store => store.port);
  const defaultRefreshRateInMs = useAppConfigStore(store => store.refreshRateInMs);
  const largeScreenMode = useLargeScreenMode();

  //States
  const [identity, setIdentity] = useState<IConnectionIdentity | null>(null);
  const [device, setDevice] = useState<IDevice | null>(null);

  const [connectionName, setConnectionName] = useState('');
  const [ipAddress1, setIPAddress1] = useState('');
  const [ipAddress2, setIPAddress2] = useState('');
  const [ipAddress3, setIPAddress3] = useState('');
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
    setIPAddress1(device.ip1);
    setIPAddress2(device.ip2 || '');
    setIPAddress3(device.ip3 || '');
    setPath(device.path);
    setPort(device.port.toString());
    setRefreshRateInMs(device.refreshRateInMs.toString());
    if (device.identity !== null && device.identity !== undefined) {
      setIdentityTitle(device.identity.name ? device.identity.name : device.identity.username);
    }
  }, [device]);

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

  const isInvalidInputs = useMemo(() => {
    return (
      validPort(port) !== null || validIPAddress(ipAddress1) !== null || validRefreshRate(refreshRateInMs) !== null
    );
  }, [ipAddress1, port, refreshRateInMs, validIPAddress, validPort, validRefreshRate]);

  const onPressSave = useCallback(async () => {
    if (isInvalidInputs) {
      return;
    }
    Keyboard.dismiss();

    const deviceAddOrUpdate: IDevice = {
      id: device ? device.id : uuid.v4().toString(),
      name: connectionName.trim(),
      selectedIp: ipAddress1.trim(),
      path: path.trim(),
      ip1: ipAddress1.trim(),
      ip2: ipAddress2.trim(),
      ip3: ipAddress3.trim(),
      port: parseInt(port, 10),
      secureConnection: false,
      refreshRateInMs: parseInt(refreshRateInMs, 10),
      identity: identity !== null ? identity : device?.identity,
    };
    upsertDevice(deviceAddOrUpdate);
    navigation.pop();
  }, [
    connectionName,
    device,
    identity,
    ipAddress1,
    ipAddress2,
    ipAddress3,
    navigation,
    path,
    port,
    refreshRateInMs,
    upsertDevice,
    isInvalidInputs,
  ]);

  const onGoBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const onPressSelectIdentity = useCallback(() => {
    navigation.navigate('Identities', { mode: 'select' });
  }, [navigation]);

  const onPressTestConnection = useCallback(async () => {
    setConnecting(true);
    let abortController = new AbortController();
    setTimeout(() => {
      abortController.abort();
      setConnecting(false);
    }, 5000);

    const deviceAddOrUpdate: IDevice = {
      id: device ? device.id : uuid.v4().toString(),
      name: connectionName.trim(),
      selectedIp: ipAddress1.trim(),
      path: path.trim(),
      ip1: ipAddress1.trim(),
      ip2: ipAddress2.trim(),
      ip3: ipAddress3.trim(),
      port: parseInt(port, 10),
      secureConnection: false,
      refreshRateInMs: parseInt(refreshRateInMs, 10),
      identity: identity !== null ? identity : device?.identity,
    };

    try {
      await inspectService({
        ipAddress: deviceAddOrUpdate.selectedIp,
        port: deviceAddOrUpdate.port,
        path: deviceAddOrUpdate.path,
        username: deviceAddOrUpdate.identity ? deviceAddOrUpdate.identity.username : null,
        password: deviceAddOrUpdate.identity ? deviceAddOrUpdate.identity.password : null,
        abortController: null,
      });
      if (Platform.OS === 'android') {
        ToastAndroid.show(t('addDevice.connectionOk'), ToastAndroid.SHORT);
      } else if (Platform.OS === 'ios') {
        Alert.alert(t('addDevice.connectionOk'));
      }
    } catch (e: any) {
      if (Platform.OS === 'android') {
        ToastAndroid.show(e.code === 401 ? t('addDevice.authRequired') : e.message, ToastAndroid.SHORT);
      } else if (Platform.OS === 'ios') {
        Alert.alert(e.code === 401 ? t('addDevice.authRequired') : e.message);
      }
    }

    setConnecting(false);
  }, [connectionName, device, identity, ipAddress1, ipAddress2, ipAddress3, path, port, refreshRateInMs, t]);

  const onScanDevices = useCallback(() => {
    navigation.navigate('ScanDevices', {});
  }, [navigation]);

  return (
    <Components.AppBaseView
      edges={['bottom', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        showBackButton={true}
        onPressBackButton={onGoBack}
        title={headerTitle}
        style={{ backgroundColor: colors.background }}
      />
      <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={0} style={styles.subView}>
        <ScrollView style={styles.scrollView} keyboardDismissMode={'interactive'}>
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
                onSubmitEditing={() => ipAddressRef.current?.focus()}
                keyboardType={'default'}
                returnKeyType={'next'}
              />

              <Components.AppTextInput
                ref={ipAddress1Ref}
                autoCapitalize="none"
                spellCheck={false}
                autoCorrect={false}
                value={ipAddress1}
                onChangeText={setIPAddress1}
                placeholder={t('addDevice.inputPlaceholder2')!}
                errorText={validIPAddress(ipAddress1)}
                containerStyle={styles.inputStyle}
                onSubmitEditing={() => connectionNameRef.current?.focus()}
                keyboardType={'url'}
                returnKeyType={'next'}
                RightAccessoryView={
                  <IconButton icon="magnify" iconColor={theme.colors.primary} size={20} onPress={onScanDevices} />
                }
              />
              <Components.AppTextInput
                ref={ipAddress2Ref}
                autoCapitalize="none"
                spellCheck={false}
                autoCorrect={false}
                value={ipAddress2}
                onChangeText={setIPAddress2}
                placeholder={t('addDevice.inputPlaceholder3')!}
                containerStyle={styles.inputStyle}
                onSubmitEditing={() => ipAddress1Ref.current?.focus()}
                keyboardType={'url'}
                returnKeyType={'next'}
              />

              <Components.AppTextInput
                ref={ipAddress3Ref}
                autoCapitalize="none"
                spellCheck={false}
                autoCorrect={false}
                value={ipAddress3}
                onChangeText={setIPAddress3}
                placeholder={t('addDevice.inputPlaceholder4')!}
                containerStyle={styles.inputStyle}
                onSubmitEditing={() => ipAddress2Ref.current?.focus()}
                keyboardType={'url'}
                returnKeyType={'done'}
              />

              <Components.AppTextInput
                ref={identityRef}
                autoCapitalize="none"
                value={path}
                onChangeText={setPath}
                placeholder={t('addDevice.inputPlaceholder5')!}
                containerStyle={styles.inputStyle}
                onSubmitEditing={() => ipAddress3Ref.current?.focus()}
                keyboardType={'default'}
                returnKeyType={'next'}
              />

              <Components.AppTextInput
                ref={portRef}
                autoCapitalize="none"
                value={port}
                onChangeText={setPort}
                placeholder={t('addDevice.inputPlaceholder6')!}
                errorText={validPort(port)}
                containerStyle={styles.inputStyle}
                onSubmitEditing={() => identityRef.current?.focus()}
                keyboardType={'numeric'}
                returnKeyType={'done'}
              />

              <Components.AppTextInput
                ref={refreshRateInMsRef}
                autoCapitalize="none"
                value={refreshRateInMs}
                onChangeText={setRefreshRateInMs}
                placeholder={t('addDevice.inputPlaceholder7')!}
                errorText={validRefreshRate(refreshRateInMs)}
                containerStyle={styles.inputStyle}
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
      </KeyboardAvoidingView>
      <Button
        disabled={isInvalidInputs}
        mode={'text'}
        style={[styles.button, largeScreenMode && styles.cardTablet]}
        onPress={onPressTestConnection}>
        {t('addDevice.testConnection')}
      </Button>

      <Button
        disabled={isInvalidInputs}
        mode={'contained'}
        style={[styles.button, largeScreenMode && styles.cardTablet, styles.bottomMargin]}
        onPress={onPressSave}>
        {buttonTitle}
      </Button>
      {connecting && <Components.AppLoader message={t('general.connecting')} />}
    </Components.AppBaseView>
  );
};

export default AddDevice;
