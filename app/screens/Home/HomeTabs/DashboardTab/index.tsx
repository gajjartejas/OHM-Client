import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';

//ThirdParty
import { Appbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';

//App modules
import Components from 'app/components';
import styles from './styles';

//Redux
import { ICardViewModel } from 'app/models/viewModels/cardValueViewModel';
import { convertToViewModel } from 'app/models/mapper/cardValueViewModel';
import IState from 'app/models/models/appState';
import * as devicesActions from 'app/store/actions/devicesActions';
import { t } from 'i18next';

//Params
type RootStackParamList = {
  DashboardTab: { userId: string };
};
type Props = NativeStackScreenProps<RootStackParamList, 'DashboardTab'>;

const DashboardTab = ({}: Props) => {
  //Refs

  //Actions
  const selectedDevice = useSelector((state: IState) => state.deviceReducer.selectedDevice);
  const connected = useSelector((state: IState) => state.deviceReducer.connected);
  const requestAuth = useSelector((state: IState) => state.deviceReducer.requestAuth);

  //Constants
  const dispatch = useDispatch();
  const { colors } = useTheme();

  //States
  const [title, setTitle] = useState('');
  const [deviceInfos, setDeviceInfos] = useState<ICardViewModel[]>([]);

  useEffect(() => {
    setTitle(selectedDevice?.ip!);
  }, [selectedDevice?.ip]);

  useEffect(() => {
    setDeviceInfos(convertToViewModel(selectedDevice));
  }, [selectedDevice]);

  useEffect(() => {
    dispatch(devicesActions.refreshDeviceInfo());
  }, [dispatch]);

  const _logout = () => {
    dispatch(devicesActions.removeSelectedDevice());
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.background }}>
        <Appbar.BackAction onPress={_logout} />
        <Appbar.Content title={title} />
      </Appbar.Header>
      {!connected && requestAuth && <Components.AppMiniBanner message={t('deviceList.authRequestedMessage')} />}
      {!connected && !requestAuth && <Components.AppMiniBanner message={t('deviceList.disconnectedMessage')} />}

      <View style={styles.subView}>
        <ScrollView style={styles.scrollView}>
          {deviceInfos.map(item => {
            return <Components.CardSection key={item.id} value={item} root={true} />;
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default DashboardTab;
