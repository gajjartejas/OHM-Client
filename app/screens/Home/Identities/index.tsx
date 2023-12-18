import React, { useCallback } from 'react';
import { View, ScrollView } from 'react-native';

//ThirdParty
import { Button, FAB, IconButton, List, Menu } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';

//App modules
import styles from './styles';

//Redux
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import AppHeader from 'app/components/AppHeader';
import IConnectionIdentity from 'app/models/models/identity';
import useAppConfigStore from 'app/store/appConfig';
import Components from 'app/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useEventEmitter from 'app/hooks/useDeviceEventEmitter';
import { useTranslation } from 'react-i18next';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'Identities'>;

const Identities = ({ navigation, route }: Props) => {
  //Refs

  //Constants
  const { colors } = useTheme();
  const identities = useAppConfigStore(store => store.identities);
  const deleteIdentity = useAppConfigStore(store => store.deleteIdentity);
  const insets = useSafeAreaInsets();
  const mode = route.params && route.params.mode ? route.params.mode : 'create';
  const onSelectIdentityEmitter = useEventEmitter('on_select_identity');
  const { t } = useTranslation();
  const largeScreenMode = useLargeScreenMode();

  //States
  const [visibleIndex, setVisibleIndex] = React.useState<number | null>(null);

  const openMenu = useCallback((index: number) => {
    setVisibleIndex(index);
  }, []);

  const closeMenu = useCallback(() => {
    setVisibleIndex(null);
  }, []);

  const onGoBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const onPressIdentity = useCallback(
    (item: IConnectionIdentity, _index: number) => {
      if (mode === 'select') {
        onSelectIdentityEmitter(item);
        navigation.goBack();
      } else {
        navigation.navigate('AddIdentity', { identity: item });
      }
    },
    [mode, navigation, onSelectIdentityEmitter],
  );

  const onPressAddNewIdentity = useCallback(() => {
    navigation.navigate('AddIdentity', {});
  }, [navigation]);

  const onRedirectToCreateIdentity = useCallback(() => {
    navigation.navigate('AddIdentity', {});
  }, [navigation]);

  const onPressEditMenu = useCallback(
    (item: IConnectionIdentity, _index: number) => {
      closeMenu();
      navigation.navigate('AddIdentity', { identity: item });
    },
    [closeMenu, navigation],
  );

  const onPressDeleteMenu = useCallback(
    (item: IConnectionIdentity, _index: number) => {
      deleteIdentity(item.id);
      closeMenu();
    },
    [closeMenu, deleteIdentity],
  );

  const renderNoDataButtons = useCallback(() => {
    return (
      <View style={styles.noDataButtonsContainer}>
        <Button onPress={onRedirectToCreateIdentity}>{t('identitiesList.createNewIdentity')}</Button>
      </View>
    );
  }, [onRedirectToCreateIdentity, t]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        showBackButton={true}
        onPressBackButton={onGoBack}
        title={mode === 'select' ? t('identitiesList.selectTitle') : t('identitiesList.listTitle')}
        style={{ backgroundColor: colors.background }}
      />
      <View style={[styles.subView, largeScreenMode && styles.cardTablet]}>
        {identities && identities.length > 0 && (
          <ScrollView style={styles.scrollView}>
            <List.Section>
              <List.Subheader>{t('identitiesList.subTitle')}</List.Subheader>
              {identities.map((identity, idx) => {
                return (
                  <List.Item
                    key={idx.toString()}
                    onPress={() => onPressIdentity(identity, idx)}
                    title={identity.name ? identity.name : identity.username}
                    description={identity.username}
                    left={props => <List.Icon {...props} icon="key" />}
                    right={props => (
                      <Menu
                        visible={visibleIndex === idx}
                        onDismiss={closeMenu}
                        anchor={<IconButton {...props} icon={'dots-vertical'} onPress={() => openMenu(idx)} />}>
                        <Menu.Item
                          leadingIcon="pencil"
                          onPress={() => {
                            onPressEditMenu(identity, idx);
                          }}
                          title={t('identitiesList.edit')}
                        />
                        <Menu.Item
                          leadingIcon="delete"
                          onPress={() => {
                            onPressDeleteMenu(identity, idx);
                          }}
                          title={t('identitiesList.delete')}
                        />
                      </Menu>
                    )}
                  />
                );
              })}
            </List.Section>
          </ScrollView>
        )}

        {identities.length < 1 && (
          <Components.AppEmptyDataView
            iconType={'font-awesome5'}
            iconName="box-open"
            style={{}}
            header={t('identitiesList.emptyData.title')}
            subHeader={t('identitiesList.emptyData.message')}
            renderContent={renderNoDataButtons}
          />
        )}
      </View>

      <FAB icon="plus" style={[styles.fab, { bottom: insets.bottom + 16 }]} onPress={onPressAddNewIdentity} />
    </View>
  );
};

export default Identities;
