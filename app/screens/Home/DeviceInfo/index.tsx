import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, ScrollView } from 'react-native';

//ThirdParty
import { Button, IconButton } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';

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

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'DeviceInfo'>;

const DeviceInfo = ({ navigation }: Props) => {
  //Refs
  const refDeviceInfoRequestInProgress = useRef(false);

  //Actions

  //Constants
  const { colors } = useTheme();
  const selectedDevice = useAppConfigStore(store => store.selectedDevice);
  const disconnect = useAppConfigStore(store => store.disconnect);
  const connected = useAppConfigStore(store => store.connected);
  const { t } = useTranslation();
  const error = useAppConfigStore(store => store.error);
  const connect = useAppConfigStore(store => store.connect);

  //States
  const [title, setTitle] = useState('');
  const [deviceInfos, setDeviceInfos] = useState<ICardViewModel[]>([]);
  const [errorMessageTitle, setErrorMessageTitle] = useState<string | null>(null);
  const [errorMessageDesc, setErrorMessageDesc] = useState<string | null>(null);
  const [buttonTitle, setButtonTitle] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(true);

  useEffect(() => {
    if (!selectedDevice) {
      return;
    }
    if (selectedDevice.name) {
      setTitle(selectedDevice.name);
    }
    setTitle(selectedDevice?.ip! + ':' + selectedDevice?.port);
  }, [selectedDevice, selectedDevice?.ip, selectedDevice?.port]);

  useEffect(() => {
    if (!selectedDevice || !selectedDevice.deviceInfo) {
      return;
    }
    setDeviceInfos(convertToViewModel(selectedDevice.deviceInfo));
  }, [selectedDevice]);

  const onGoBack = useCallback(() => {
    disconnect();
    navigation.pop();
  }, [disconnect, navigation]);

  const onPressSetting = useCallback(() => {
    if (!selectedDevice) {
      return;
    }
    navigation.navigate('AddDevice', { device: selectedDevice, mode: 'edit' });
  }, [navigation, selectedDevice]);

  useEffect(() => {
    if (!connected && !error) {
      setErrorMessageTitle(t('dashboard.emptyData.item1.title'));
      setErrorMessageDesc(t('dashboard.emptyData.item1.message'));
      setButtonTitle(t('dashboard.emptyData.item1.button'));
      return;
    }

    if (!error) {
      setErrorMessageDesc(null);
      setErrorMessageTitle(null);
      setButtonTitle(null);
      return;
    }

    if (error.message === 'Aborted') {
      setErrorMessageTitle(t('dashboard.emptyData.item2.title'));
      setErrorMessageDesc(t('dashboard.emptyData.item2.message'));
      setButtonTitle(t('dashboard.emptyData.item2.button'));
      return;
    }

    if (error.code === 401) {
      setErrorMessageTitle(t('dashboard.emptyData.item3.title'));
      setErrorMessageDesc(t('dashboard.emptyData.item3.message'));
      setButtonTitle(t('dashboard.emptyData.item3.button'));
      return;
    }

    setErrorMessageTitle(t('dashboard.emptyData.item4.title'));
    setErrorMessageDesc(error.message);
    setButtonTitle(t('dashboard.emptyData.item4.button'));
  }, [connected, error, t]);

  useEffect(() => {
    if (!selectedDevice) {
      return;
    }

    const to = setInterval(async () => {
      if (refDeviceInfoRequestInProgress.current) {
        return;
      }
      refDeviceInfoRequestInProgress.current = true;
      await connect(selectedDevice, false, null);
      setConnecting(false);
      refDeviceInfoRequestInProgress.current = false;
    }, selectedDevice.refreshRateInMs);

    return () => {
      clearInterval(to);
    };
  }, [connect, selectedDevice]);

  const renderNoDataButtons = useCallback(() => {
    return (
      <View style={styles.noDataButtonsContainer}>
        <Button onPress={onPressSetting}>{buttonTitle}</Button>
      </View>
    );
  }, [buttonTitle, onPressSetting]);

  return (
    <Components.AppBaseView
      edges={['bottom', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        showBackButton={true}
        onPressBackButton={onGoBack}
        title={title}
        style={{ backgroundColor: colors.background }}
        RightViewComponent={
          <IconButton icon="tune-vertical" iconColor={colors.onBackground} size={20} onPress={onPressSetting} />
        }
      />

      {errorMessageDesc && selectedDevice && selectedDevice.deviceInfo && (
        <Components.AppMiniBanner
          onPress={onPressSetting}
          RightViewComponent={
            <IconButton icon="arrow-right" iconColor={colors.onBackground} size={20} onPress={onPressSetting} />
          }
          message={errorMessageDesc}
        />
      )}

      {selectedDevice && selectedDevice.deviceInfo && (
        <View style={styles.subView}>
          <ScrollView style={styles.scrollView}>
            {deviceInfos.map(item => {
              return <Components.CardSection key={item.id} value={item} root={true} />;
            })}
          </ScrollView>
        </View>
      )}

      {(!selectedDevice || !selectedDevice.deviceInfo) && error && !connecting && (
        <Components.AppEmptyDataView
          iconType={'font-awesome5'}
          iconName="box-open"
          style={styles.emptyView}
          header={errorMessageTitle}
          subHeader={errorMessageDesc}
          renderContent={renderNoDataButtons}
        />
      )}

      {connecting && (!selectedDevice || !selectedDevice.deviceInfo) && <Components.AppLoader message={'Loading...'} />}
    </Components.AppBaseView>
  );
};

export default DeviceInfo;
