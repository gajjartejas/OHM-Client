import React, { useCallback, useState } from 'react';
import { Platform, ScrollView, TouchableOpacity, View } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { Appbar, Button, FAB, List, Menu, Text, useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeTabsNavigatorParams, LoggedInTabNavigatorParams } from 'app/navigation/types';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//App modules
import Components from 'app/components';
import styles from './styles';

//Modals
import IDevice from 'app/models/models/device';
import useAppConfigStore from 'app/store/appConfig';
import AppHeader from 'app/components/AppHeader';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';

//Params
type ConnectToDeviceListTabNavigationProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<HomeTabsNavigatorParams, 'ConnectToDeviceList'>,
  NativeStackNavigationProp<LoggedInTabNavigatorParams>
>;

const ConnectToDeviceList = ({}: ConnectToDeviceListTabNavigationProp) => {
  //Refs
  //Actions

  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();
  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
  const navigation = useNavigation<ConnectToDeviceListTabNavigationProp>();
  const recentDevices = useAppConfigStore(store => store.devices);
  const selectDevice = useAppConfigStore(store => store.selectDevice);
  const insets = useSafeAreaInsets();
  const largeScreenMode = useLargeScreenMode();

  //States
  const [menuVisible, setMenuVisible] = useState(false);

  const onPressDevice = useCallback(
    async (device: IDevice, _index: number) => {
      selectDevice(device);
    },
    [selectDevice],
  );

  const onPressMore = useCallback(() => {
    setMenuVisible(true);
  }, []);

  const onDismissModal = useCallback(() => {
    setMenuVisible(false);
  }, []);

  const onPressAddDevice = useCallback(() => {
    setMenuVisible(false);
    navigation.navigate('AddDevice', { mode: 'create' });
  }, [navigation]);

  const onPressAdvanceSetting = useCallback(() => {
    setMenuVisible(false);
    navigation.navigate('Devices', {});
  }, [navigation]);

  const renderNoRecentlyConnectedButtons = useCallback(() => {
    return (
      <View style={styles.noDataButtonsContainer}>
        <Button onPress={onPressAddDevice}>{t('connectToDeviceList.emptyData.button')}</Button>
      </View>
    );
  }, [onPressAddDevice, t]);

  return (
    <Components.AppBaseView
      edges={['left', 'right', 'top']}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        showBackButton={false}
        title={t('general.appname')}
        style={{ backgroundColor: colors.background }}
        RightViewComponent={
          <>
            <Appbar.Action icon={MORE_ICON} onPress={onPressMore} />
            <Menu
              visible={menuVisible}
              onDismiss={onDismissModal}
              anchor={
                <TouchableOpacity onPress={() => {}}>
                  <Text> </Text>
                </TouchableOpacity>
              }>
              <Menu.Item onPress={onPressAddDevice} title={t('connectToDeviceList.addManually')} />
              <Menu.Item onPress={onPressAdvanceSetting} title={t('connectToDeviceList.devicesSettings')} />
            </Menu>
          </>
        }
      />

      <View style={[styles.safeArea, largeScreenMode && styles.cardTablet, { backgroundColor: colors.background }]}>
        {recentDevices.length > 0 && (
          <ScrollView style={styles.scrollView}>
            <List.Section>
              <List.Subheader>{t(t('connectToDeviceList.savedConnections'))}</List.Subheader>
              {recentDevices.map((device, idx) => {
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

        {recentDevices.length < 1 && (
          <Components.AppEmptyDataView
            iconType={'font-awesome5'}
            iconName="box-open"
            style={{}}
            header={t('connectToDeviceList.emptyData.emptyDeviceTitle')}
            subHeader={t('connectToDeviceList.emptyData.emptyDeviceSubtitle')}
            renderContent={renderNoRecentlyConnectedButtons}
          />
        )}
      </View>
      <FAB icon="plus" style={[styles.fab, { bottom: insets.bottom }]} onPress={onPressAddDevice} />
    </Components.AppBaseView>
  );
};

export default ConnectToDeviceList;
