import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, TextInput, InteractionManager } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { Appbar, Divider, List, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-easy-icon';
import { useDispatch, useSelector } from 'react-redux';

//App modules
import Components from 'app/components';
import styles from './styles';

//Redux
import * as appConfigActions from 'app/store/actions/appConfigActions';

//Modals
import { ISettingItem, ISettingSection } from 'app/models/viewModels/settingItem';
import IState from 'app/models/models/appState';

//Params
type RootStackParamList = {
  GeneralSetting: {};
};
type Props = NativeStackScreenProps<RootStackParamList, 'GeneralSetting'>;

const GeneralSetting = ({ navigation }: Props) => {
  //Refs
  let modalVisibleUrlPathRef = useRef<TextInput | null>(null);
  let modalVisibleUrlPortRef = useRef<TextInput | null>(null);
  let modalVisibleUrlRefreshIntervalRef = useRef<TextInput | null>(null);

  //Actions
  const path = useSelector((state: IState) => state.appConfigReducer.path);
  const port = useSelector((state: IState) => state.appConfigReducer.port);
  const refreshInterval = useSelector((state: IState) => state.appConfigReducer.refreshInterval);
  const username = useSelector((state: IState) => state.appConfigReducer.username);
  const password = useSelector((state: IState) => state.appConfigReducer.password);

  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();

  //States
  const [apps, setApps] = useState<ISettingSection[]>([
    {
      id: 0,
      title: t('SETTINGS_GENERAL_HEADER'),
      items: [
        {
          id: 0,
          iconName: 'web',
          iconType: 'material-community',
          title: t('SETTINGS_GENERAL_URL_PATH_TITLE'),
          description: `${path}`,
          route: 'SelectAppearance',
        },
        {
          id: 1,
          iconName: 'network',
          iconType: 'material-community',
          title: t('SETTINGS_GENERAL_PORT_TITLE'),
          description: `${port}`,
          route: 'SelectAppearance',
        },
        {
          id: 2,
          iconName: 'timer-sand-full',
          iconType: 'material-community',
          title: t('SETTINGS_GENERAL_REFRESH_INTERVAL_TITLE'),
          description: `${refreshInterval} ms`,
          route: '',
        },
      ],
    },
    {
      id: 1,
      title: t('SETTINGS_GENERAL_AUTH_HEADER'),
      items: [
        {
          id: 0,
          iconName: 'shield-lock',
          iconType: 'material-community',
          title: t('SETTINGS_GENERAL_AUTH_RESTORE_TITLE'),
          description: t('SETTINGS_GENERAL_AUTH_RESTORE_SUB_TITLE'),
          route: 'SelectAppearance',
        },
      ],
    },
    {
      id: 2,
      title: t('SETTINGS_GENERAL_OTHER_HEADER'),
      items: [
        {
          id: 0,
          iconName: 'backup-restore',
          iconType: 'material-community',
          title: t('SETTINGS_GENERAL_OTHER_RESTORE_TITLE'),
          description: t('SETTINGS_GENERAL_OTHER_RESTORE_SUB_TITLE'),
          route: 'SelectAppearance',
        },
      ],
    },
  ]);

  const [modalVisibleUrlPath, setModalVisiblePath] = useState(false);
  const [modalVisibleUrlPort, setModalVisiblePort] = useState(false);
  const [modalVisibleUrlRefreshInterval, setModalVisiblePathRefreshInterval] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);

  const [modalPath, setModalPath] = useState(path);
  const [modalPort, setModalPort] = useState(`${port}`);
  const [modalRefreshInterval, setModalRefreshInterval] = useState(`${refreshInterval}`);

  useEffect(() => {
    if (apps && apps.length > 0) {
      return;
    }
    let newApps = [...apps];
    newApps[0].items[0].description = path;
    setApps(newApps);
  }, [apps, path]);

  useEffect(() => {
    if (apps && apps.length > 0) {
      return;
    }
    let newApps = [...apps];
    newApps[0].items[1].description = `${port}`;
    setApps(newApps);
  }, [apps, port]);

  useEffect(() => {
    if (apps && apps.length > 0) {
      return;
    }
    let newApps = [...apps];
    newApps[0].items[2].description = `${refreshInterval}`;
    setApps(newApps);
  }, [apps, refreshInterval]);

  const onGoBack = () => {
    navigation.pop();
  };

  //
  const onPressAppearanceOption = (item: ISettingSection, index: number, subItem: ISettingItem, subIndex: number) => {
    switch (true) {
      case index === 0 && subIndex === 0:
        setModalVisiblePath(true);
        break;
      case index === 0 && subIndex === 1:
        setModalVisiblePort(true);
        break;
      case index === 0 && subIndex === 2:
        setModalVisiblePathRefreshInterval(true);
        break;
      case index === 1 && subIndex === 0:
        setAuthModalVisible(true);
        break;
      case index === 2 && subIndex === 0:
        resetSettings();
        break;
      default:
    }
  };

  const resetSettings = () => {
    dispatch(appConfigActions.setAppConfigRestoreDefault());
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.background }}>
        <Appbar.BackAction onPress={onGoBack} />
        <Appbar.Content title={t('SETTINGS_GENERAL_TITLE')} subtitle="" />
      </Appbar.Header>
      <View style={styles.safeArea}>
        <ScrollView>
          {apps.map((item, index) => {
            return (
              <View key={item.id.toString()}>
                <List.Subheader style={[styles.listSubHeader, { color: colors.primary }]}>{item.title}</List.Subheader>
                {item.items.map((subItem, subIndex) => {
                  return (
                    <List.Item
                      key={subItem.id.toString()}
                      titleStyle={{ color: colors.onSurface }}
                      descriptionStyle={{ color: `${colors.onSurface}88` }}
                      onPress={() => onPressAppearanceOption(item, index, subItem, subIndex)}
                      title={subItem.title}
                      description={subItem.description}
                      left={() => (
                        <Icon
                          style={styles.listItemIcon}
                          type={subItem.iconType}
                          name={subItem.iconName}
                          color={`${colors.onSurface}88`}
                          size={24}
                        />
                      )}
                    />
                  );
                })}
                <Divider />
              </View>
            );
          })}
        </ScrollView>
      </View>

      {modalVisibleUrlPath && (
        <Components.InputModal
          ref={modalVisibleUrlPathRef}
          modalVisible={modalVisibleUrlPath}
          header={t('SETTINGS_GENERAL_ENTER_URL_PATH_TITLE')}
          onPressClose={async () => {
            setModalVisiblePath(false);
          }}
          onPressSave={async () => {
            setModalVisiblePath(false);
            dispatch(appConfigActions.setAppConfigPath(modalPath));
          }}
          placeholder={t('SETTINGS_GENERAL_ENTER_URL_PATH_TITLE')}
          value={modalPath}
          onChangeText={text => setModalPath(text)}
        />
      )}

      {modalVisibleUrlPort && (
        <Components.InputModal
          ref={modalVisibleUrlPortRef}
          modalVisible={modalVisibleUrlPort}
          header={t('SETTINGS_GENERAL_ENTER_PORT_TITLE')}
          onPressClose={async () => {
            setModalVisiblePort(false);
          }}
          onPressSave={async () => {
            setModalVisiblePort(false);
            // eslint-disable-next-line radix
            dispatch(appConfigActions.setAppConfigPort(parseInt(modalPort)));
          }}
          placeholder={t('SETTINGS_GENERAL_ENTER_PORT_TITLE')}
          value={modalPort}
          onChangeText={text => setModalPort(text)}
          keyboardType={'numeric'}
          onSubmitEditing={() => modalVisibleUrlRefreshIntervalRef.current?.focus()}
        />
      )}

      {modalVisibleUrlRefreshInterval && (
        <Components.InputModal
          ref={modalVisibleUrlRefreshIntervalRef}
          modalVisible={modalVisibleUrlRefreshInterval}
          header={t('SETTINGS_GENERAL_ENTER_REFRESH_INTERVAL_TITLE')}
          onPressClose={async () => {
            setModalVisiblePathRefreshInterval(false);
          }}
          onPressSave={async () => {
            setModalVisiblePathRefreshInterval(false);
            // eslint-disable-next-line radix
            dispatch(appConfigActions.setAppConfigRefreshInterval(parseInt(modalRefreshInterval)));
          }}
          placeholder={t('SETTINGS_GENERAL_ENTER_REFRESH_INTERVAL_TITLE')}
          value={modalRefreshInterval}
          onChangeText={text => setModalRefreshInterval(text)}
          keyboardType={'numeric'}
        />
      )}

      {authModalVisible && (
        <Components.AuthInputModal
          modalVisible={authModalVisible}
          header={t('INPUT_DIALOG_AUTH_REQUIRED')}
          username={username ? username : ''}
          password={password ? password : ''}
          showConnectionLoader={false}
          onPressClose={() => {
            setAuthModalVisible(false);
          }}
          onPressSave={(username_, password_) => {
            dispatch(appConfigActions.setAppConfigAuth({ username: username_, password: password_ }));
            setAuthModalVisible(false);
          }}
        />
      )}
    </View>
  );
};

export default GeneralSetting;
