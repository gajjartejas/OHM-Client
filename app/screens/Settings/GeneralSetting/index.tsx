import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, TextInput } from 'react-native';

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

  let modalVisibleScanTimeoutRef = useRef<TextInput | null>(null);
  let modalVisibleScanThreadsRef = useRef<TextInput | null>(null);

  //Actions
  const path = useSelector((state: IState) => state.appConfigReducer.path);
  const port = useSelector((state: IState) => state.appConfigReducer.port);
  const refreshInterval = useSelector((state: IState) => state.appConfigReducer.refreshInterval);
  const scanTimeoutInMs = useSelector((state: IState) => state.appConfigReducer.scanTimeoutInMs);
  const scanThreads = useSelector((state: IState) => state.appConfigReducer.scanThreads);
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
      title: t('generalSetting.section1.header'),
      items: [
        {
          id: 0,
          iconName: 'web',
          iconType: 'material-community',
          title: t('generalSetting.section1.row1.title'),
          description: t('generalSetting.section1.row1.subTitle', { path }),
          route: '',
        },
        {
          id: 1,
          iconName: 'network',
          iconType: 'material-community',
          title: t('generalSetting.section1.row2.title'),
          description: t('generalSetting.section1.row2.subTitle', { port }),
          route: '',
        },
        {
          id: 2,
          iconName: 'timer-sand-full',
          iconType: 'material-community',
          title: t('generalSetting.section1.row3.title'),
          description: t('generalSetting.section1.row3.subTitle', { refreshInterval }),
          route: '',
        },
      ],
    },
    {
      id: 1,
      title: t('generalSetting.section2.header'),
      items: [
        {
          id: 0,
          iconName: 'shield-lock',
          iconType: 'material-community',
          title: t('generalSetting.section2.row1.title'),
          description: t('generalSetting.section2.row1.subTitle'),
          route: '',
        },
      ],
    },
    {
      id: 2,
      title: t('generalSetting.section3.header'),
      items: [
        {
          id: 0,
          iconName: 'shield-lock',
          iconType: 'material-community',
          title: t('generalSetting.section3.row1.title'),
          description: t('generalSetting.section3.row1.subTitle', { scanTimeoutInMs }),
          route: '',
        },
        {
          id: 1,
          iconName: 'shield-lock',
          iconType: 'material-community',
          title: t('generalSetting.section3.row2.title'),
          description: t('generalSetting.section3.row2.subTitle', { scanThreads }),
          route: '',
        },
      ],
    },
    {
      id: 3,
      title: t('generalSetting.section4.header'),
      items: [
        {
          id: 0,
          iconName: 'backup-restore',
          iconType: 'material-community',
          title: t('generalSetting.section4.row1.title'),
          description: t('generalSetting.section4.row1.subTitle'),
          route: 'SelectAppearance',
        },
      ],
    },
  ]);

  const [modalVisibleUrlPath, setModalVisiblePath] = useState(false);
  const [modalVisibleUrlPort, setModalVisiblePort] = useState(false);
  const [modalVisibleUrlRefreshInterval, setModalVisiblePathRefreshInterval] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);

  const [modalVisibleScanTimeout, setModalVisibleScanTimeout] = useState(false);
  const [modalVisibleScanThreads, setModalVisibleScanThreads] = useState(false);

  const [modalPath, setModalPath] = useState(path);
  const [modalPort, setModalPort] = useState(`${port}`);
  const [modalRefreshInterval, setModalRefreshInterval] = useState(`${refreshInterval}`);

  const [modalScanTimeout, setModalScanTimeout] = useState(`${scanTimeoutInMs}`);
  const [modalScanThreads, setModalScanThreads] = useState(`${scanThreads}`);

  useEffect(() => {
    setApps(v => {
      let newApps = [...v];
      newApps[2].items[0].description = `${scanTimeoutInMs} ms`;
      return newApps;
    });
  }, [scanTimeoutInMs]);

  useEffect(() => {
    setApps(v => {
      let newApps = [...v];
      newApps[2].items[1].description = `${scanThreads}`;
      return newApps;
    });
  }, [scanThreads]);

  useEffect(() => {
    setApps(v => {
      let newApps = [...v];
      newApps[0].items[0].description = path;
      return newApps;
    });
  }, [path]);

  useEffect(() => {
    setApps(v => {
      let newApps = [...v];
      newApps[0].items[1].description = `${port}`;
      return newApps;
    });
  }, [port]);

  useEffect(() => {
    setApps(v => {
      let newApps = [...v];
      newApps[0].items[2].description = `${refreshInterval}`;
      return newApps;
    });
  }, [refreshInterval]);

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
        setModalVisibleScanTimeout(true);
        break;
      case index === 2 && subIndex === 1:
        setModalVisibleScanThreads(true);
        break;
      case index === 3 && subIndex === 0:
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
        <Appbar.Content title={t('generalSetting.title')} />
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

      <Components.InputModal
        ref={modalVisibleUrlPathRef}
        modalVisible={modalVisibleUrlPath}
        header={t('generalSetting.section1.row1.dialogTitle')}
        hint={t('generalSetting.section1.row1.dialogSubTitle')}
        onPressClose={() => {
          setModalVisiblePath(false);
        }}
        onPressSave={() => {
          setModalVisiblePath(false);
          dispatch(appConfigActions.setAppConfigPath(modalPath));
        }}
        placeholder={t('generalSetting.section1.row1.dialogTitle')!}
        value={modalPath}
        onChangeText={text => setModalPath(text)}
        onBackButtonPress={() => {
          setModalVisiblePath(false);
        }}
      />

      <Components.InputModal
        ref={modalVisibleUrlPortRef}
        modalVisible={modalVisibleUrlPort}
        header={t('generalSetting.section1.row2.dialogTitle')}
        hint={t('generalSetting.section1.row2.dialogSubTitle')}
        onPressClose={async () => {
          setModalVisiblePort(false);
        }}
        onPressSave={async () => {
          setModalVisiblePort(false);
          if (!isNaN(Number(modalPort))) {
            dispatch(appConfigActions.setAppConfigPort(parseInt(modalPort, 10)));
          }
        }}
        placeholder={t('generalSetting.section1.row2.dialogTitle')!}
        value={modalPort}
        onChangeText={text => setModalPort(text)}
        keyboardType={'numeric'}
        onBackButtonPress={() => {
          setModalVisiblePath(false);
        }}
      />

      <Components.InputModal
        ref={modalVisibleUrlRefreshIntervalRef}
        modalVisible={modalVisibleUrlRefreshInterval}
        header={t('generalSetting.section1.row3.dialogTitle')}
        hint={t('generalSetting.section1.row3.dialogSubTitle')}
        onPressClose={async () => {
          setModalVisiblePathRefreshInterval(false);
        }}
        onPressSave={async () => {
          setModalVisiblePathRefreshInterval(false);
          if (!isNaN(Number(modalRefreshInterval))) {
            dispatch(appConfigActions.setAppConfigRefreshInterval(parseInt(modalRefreshInterval, 10)));
          }
        }}
        placeholder={t('generalSetting.section1.row3.dialogTitle')!}
        value={modalRefreshInterval}
        onChangeText={text => setModalRefreshInterval(text)}
        keyboardType={'numeric'}
        onBackButtonPress={() => {
          setModalVisiblePath(false);
        }}
      />

      <Components.AuthInputModal
        modalVisible={authModalVisible}
        header={t('generalSetting.section2.row1.dialogTitle')}
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
        errorMessage={''}
        onBackButtonPress={() => {
          setAuthModalVisible(false);
        }}
      />

      <Components.InputModal
        ref={modalVisibleScanTimeoutRef}
        modalVisible={modalVisibleScanTimeout}
        header={t('generalSetting.section3.row1.dialogTitle')}
        hint={t('generalSetting.section3.row1.dialogSubTitle')}
        onPressClose={async () => {
          setModalVisibleScanTimeout(false);
        }}
        onPressSave={async () => {
          setModalVisibleScanTimeout(false);
          if (!isNaN(Number(modalScanTimeout))) {
            dispatch(appConfigActions.setAppConfigScanTimeout(parseInt(modalScanTimeout, 10)));
          }
        }}
        placeholder={t('generalSetting.section3.row1.dialogTitle')!}
        value={modalScanTimeout}
        onChangeText={text => setModalScanTimeout(text)}
        keyboardType={'numeric'}
        onBackButtonPress={() => {
          setModalVisiblePath(false);
        }}
      />

      <Components.InputModal
        ref={modalVisibleScanThreadsRef}
        modalVisible={modalVisibleScanThreads}
        header={t('generalSetting.section3.row2.dialogTitle')}
        hint={t('generalSetting.section3.row2.dialogSubTitle')}
        onPressClose={async () => {
          setModalVisibleScanThreads(false);
        }}
        onPressSave={async () => {
          setModalVisibleScanThreads(false);
          if (!isNaN(Number(modalScanThreads))) {
            dispatch(appConfigActions.setAppConfigScanThreads(parseInt(modalScanThreads, 10)));
          }
        }}
        placeholder={t('generalSetting.section3.row2.dialogTitle')!}
        value={modalScanThreads}
        onChangeText={text => setModalScanThreads(text)}
        keyboardType={'numeric'}
        onBackButtonPress={() => {
          setModalVisiblePath(false);
        }}
      />
    </View>
  );
};

export default GeneralSetting;
