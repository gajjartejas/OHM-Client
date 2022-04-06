import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, ToastAndroid, TouchableOpacity, View } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { Appbar, Button, List, Menu, Text, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

//App modules
import Components from 'app/components';
import styles from './styles';
import Confg from 'app/config';
import Utils from 'app/utils';

//Redux
import * as devicesActions from 'app/store/actions/devicesActions';
import * as appConfigActions from 'app/store/actions/appConfigActions';

import { useDispatch, useSelector } from 'react-redux';
import IState from 'app/models/models/appState';

//Modals
import IDevice from 'app/models/models/device';

//Params
type RootStackParamList = {
  DeviceLists: {};
};
type Props = NativeStackScreenProps<RootStackParamList, 'DeviceLists'>;

const DeviceLists = ({}: Props) => {
  //Refs

  //Actions

  //Constants
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

  const selectedDevice = useSelector((state: IState) => state.deviceReducer.selectedDevice);
  const devices = useSelector((state: IState) => state.deviceReducer.devices);
  const isScanning = useSelector((state: IState) => state.deviceReducer.isScanning);
  const scanningFinished = useSelector((state: IState) => state.deviceReducer.scanningFinished);
  const error = useSelector((state: IState) => state.deviceReducer.error);
  const requestAuth = useSelector((state: IState) => state.deviceReducer.requestAuth);

  //States
  const [modalVisibleInput, setModalVisibleInput] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);

  const [menuVisible, setMenuVisible] = useState(false);

  const scanStart = useCallback(() => {
    dispatch(devicesActions.removeAllDevices());
    dispatch(devicesActions.requestScan());
  }, [dispatch]);

  useEffect(() => {
    scanStart();
    /*
    let deviceInfo = convertNodeToModel(require('app/assets/resources/b85m-g.json'));
    let device: IDevice = {
      hostname: 'Fake device',
      deviceInfo: deviceInfo,
      ip: '127.0.0.1',
      portsInfo: [],
      openPorts: [],
      iReachable: true,
    };
    dispatch(devicesActions.selectDevice(device));
*/
  }, [dispatch, scanStart]);

  useEffect(() => {
    if (!error) {
      return;
    }

    if (Platform.OS === 'android') {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    } else if (Platform.OS === 'ios') {
      Alert.alert(error.message);
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (!requestAuth) {
      return;
    }
    setAuthModalVisible(true);
  }, [requestAuth]);

  useEffect(() => {
    if (selectedDevice && selectedDevice.deviceInfo) {
      setModalVisibleInput(false);
    }
  }, [selectedDevice]);

  const onPressDevice = (device: IDevice, _index: number) => {
    dispatch(devicesActions.selectDevice(device));
  };

  const onPressMore = () => setMenuVisible(true);

  const onDismissModal = () => {
    setMenuVisible(false);
  };

  const onPressReScan = () => {
    setMenuVisible(false);
    scanStart();
  };

  const onPressConnectManually = () => {
    setModalVisibleInput(true);
    setMenuVisible(false);
  };

  const onHelp = async () => {
    Utils.openInAppBrowser(Confg.Constants.ABOUT_HELP);
  };

  const renderNoDataButtons = () => {
    return (
      <View style={styles.noDataButtonsContainer}>
        <Button onPress={onHelp}>{t('INPUT_DIALOG_CONNECT_HELP')}</Button>
        <Text style={{ color: colors.onBackground }}>{t('INPUT_DIALOG_OR')}</Text>
        <Button onPress={onPressConnectManually}>{t('INPUT_DIALOG_CONNECT_HOST_MANUALLY')}</Button>
        <Text style={{ color: colors.onBackground }}>{t('INPUT_DIALOG_OR')}</Text>
        <Button onPress={scanStart}>{t('INPUT_DIALOG_RESCAN')}</Button>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.onBackground }]}>
      <Appbar.Header style={{ backgroundColor: colors.background }}>
        <Appbar.Content title={t('APPNAME')} subtitle="" />
        <Appbar.Action icon={MORE_ICON} onPress={onPressMore} />
        <Menu
          visible={menuVisible}
          onDismiss={onDismissModal}
          anchor={
            <TouchableOpacity onPress={() => {}}>
              <Text> </Text>
            </TouchableOpacity>
          }>
          <Menu.Item onPress={onPressReScan} title={t('INPUT_DIALOG_RESCAN')} />
          <Menu.Item onPress={onPressConnectManually} title={t('INPUT_DIALOG_CONNECT_HOST_MANUALLY')} />
        </Menu>
      </Appbar.Header>
      <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
        {isScanning && <Components.AppLoadingPlaceHolder />}

        {!isScanning && devices.length > 0 && (
          <ScrollView style={styles.scrollView}>
            <List.Section>
              <List.Subheader>{t('DEVICE_LIST_SERVERS')}</List.Subheader>
              {devices.map((device, idx) => {
                return (
                  <List.Item
                    key={idx.toString()}
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

        {scanningFinished && devices.length < 1 && (
          <Components.AppEmptyDataView
            iconType={'font-awesome5'}
            iconName="box-open"
            style={{}}
            header={t('DEVICE_LIST_NO_DEVICE_FOUND')}
            subHeader={t('DEVICE_LIST_NO_DEVICE_FOUND_NPLEASE_TRY_ADDING_IT_MANUALLY')}
            renderContent={renderNoDataButtons}
          />
        )}
      </View>

      {modalVisibleInput && (
        <Components.ScanInputModal
          modalVisible={modalVisibleInput}
          header={t('DEVICE_LIST_ADD_MANUALLY')}
          onPressClose={() => {
            setModalVisibleInput(false);
          }}
          onPressSave={(ipAddress, port) => {
            // eslint-disable-next-line radix
            onPressDevice({ ip: ipAddress, port: parseInt(port) }, 0);
          }}
          placeholder={t('SETTINGS_GENERAL_ENTER_URL_PATH_TITLE')}
        />
      )}

      {authModalVisible && (
        <Components.AuthInputModal
          modalVisible={authModalVisible}
          header={t('INPUT_DIALOG_AUTH_REQUIRED')}
          username={''}
          password={''}
          showConnectionLoader={true}
          onPressClose={() => {
            dispatch(devicesActions.removeSelectedDevice());
            dispatch(devicesActions.resetDeviceInvalidAuthCount());
            setAuthModalVisible(false);
          }}
          onPressSave={(username, password) => {
            dispatch(devicesActions.setDeviceInfoLoading(true));
            dispatch(appConfigActions.setAppConfigAuth({ username, password }));
          }}
        />
      )}
    </View>
  );
};

export default DeviceLists;
