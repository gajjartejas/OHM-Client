import React, { useCallback, useRef, useState } from 'react';
import { View, TextInput } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { Divider, List, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-easy-icon';

//App modules
import Components from 'app/components';
import styles from './styles';
import useAppScanConfigStore from 'app/store/appScanConfig';

//Modals
import { ISettingItem, ISettingSection } from 'app/models/viewModels/settingItem';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import AppHeader from 'app/components/AppHeader';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'ScanSetting'>;

const ScanSetting = ({ navigation }: Props) => {
  //Refs
  let modalVisibleUrlPathRef = useRef<TextInput | null>(null);
  let modalVisibleUrlPortRef = useRef<TextInput | null>(null);

  let modalVisibleScanTimeoutRef = useRef<TextInput | null>(null);
  let modalVisibleScanThreadsRef = useRef<TextInput | null>(null);

  //Actions
  const [path, setPath] = useAppScanConfigStore(store => [store.path, store.setPath]);
  const [port, setPort] = useAppScanConfigStore(store => [store.port, store.setPort]);
  const [scanTimeoutInMs, setScanTimeoutInMs] = useAppScanConfigStore(store => [
    store.scanTimeoutInMs,
    store.setScanTimeoutInMs,
  ]);
  const [scanThreads, setScanThreads] = useAppScanConfigStore(store => [store.scanThreads, store.setScanThreads]);
  const reset = useAppScanConfigStore(store => store.reset);
  const largeScreenMode = useLargeScreenMode();

  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();

  //States
  const apps: ISettingSection[] = [
    {
      id: 0,
      title: t('scanSetting.section1.header'),
      items: [
        {
          id: 0,
          iconName: 'web',
          iconType: 'material-community',
          title: t('scanSetting.section1.row1.title'),
          description: t('scanSetting.section1.row1.subTitle', { id2001: path }),
          route: '',
        },
        {
          id: 1,
          iconName: 'network',
          iconType: 'material-community',
          title: t('scanSetting.section1.row2.title'),
          description: t('scanSetting.section1.row2.subTitle', { id2002: port }),
          route: '',
        },
      ],
    },
    {
      id: 1,
      title: t('scanSetting.section3.header'),
      items: [
        {
          id: 0,
          iconName: 'timer-sand-full',
          iconType: 'material-community',
          title: t('scanSetting.section3.row1.title'),
          description: t('scanSetting.section3.row1.subTitle', { id2003: scanTimeoutInMs }),
          route: '',
        },
        {
          id: 1,
          iconName: 'speedometer',
          iconType: 'material-community',
          title: t('scanSetting.section3.row2.title'),
          description: t('scanSetting.section3.row2.subTitle', { id2004: scanThreads }),
          route: '',
        },
      ],
    },
    {
      id: 3,
      title: t('scanSetting.section4.header'),
      items: [
        {
          id: 0,
          iconName: 'backup-restore',
          iconType: 'material-community',
          title: t('scanSetting.section4.row1.title'),
          description: t('scanSetting.section4.row1.subTitle'),
          route: 'SelectAppearance',
        },
      ],
    },
  ];

  const [modalVisibleUrlPath, setModalVisiblePath] = useState(false);
  const [modalVisibleUrlPort, setModalVisiblePort] = useState(false);

  const [modalVisibleScanTimeout, setModalVisibleScanTimeout] = useState(false);
  const [modalVisibleScanThreads, setModalVisibleScanThreads] = useState(false);

  const [modalPath, setModalPath] = useState(path);
  const [modalPort, setModalPort] = useState(`${port}`);

  const [modalScanTimeout, setModalScanTimeout] = useState(`${scanTimeoutInMs}`);
  const [modalScanThreads, setModalScanThreads] = useState(`${scanThreads}`);

  useCallback(() => {}, []);

  const onGoBack = () => {
    navigation.pop();
  };

  const resetSettings = useCallback(() => {
    reset();
  }, [reset]);

  const onPressAppearanceOption = useCallback(
    (item: ISettingSection, index: number, subItem: ISettingItem, subIndex: number) => {
      switch (true) {
        case index === 0 && subIndex === 0:
          setModalVisiblePath(true);
          break;
        case index === 0 && subIndex === 1:
          setModalVisiblePort(true);
          break;
        case index === 1 && subIndex === 0:
          setModalVisibleScanTimeout(true);
          break;
        case index === 1 && subIndex === 1:
          setModalVisibleScanThreads(true);
          break;
        case index === 2 && subIndex === 0:
          resetSettings();
          break;
        default:
      }
    },
    [resetSettings],
  );

  return (
    <Components.AppBaseView
      edges={['bottom', 'left', 'right']}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        showBackButton={true}
        onPressBackButton={onGoBack}
        title={t('scanSetting.title')}
        style={{ backgroundColor: colors.background }}
      />

      <Components.AppBaseView scroll edges={[]} style={styles.safeArea}>
        <View style={[styles.listContainer, largeScreenMode && styles.cardTablet]}>
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
        </View>
      </Components.AppBaseView>

      <Components.InputModal
        ref={modalVisibleUrlPathRef}
        modalVisible={modalVisibleUrlPath}
        header={t('scanSetting.section1.row1.dialogTitle')}
        hint={t('scanSetting.section1.row1.dialogSubTitle')}
        onPressClose={() => {
          setModalVisiblePath(false);
        }}
        onPressSave={() => {
          setModalVisiblePath(false);
          setPath(modalPath.trim());
        }}
        placeholder={t('scanSetting.section1.row1.dialogTitle')!}
        value={modalPath}
        onChangeText={text => setModalPath(text)}
        onBackButtonPress={() => {
          setModalVisiblePath(false);
        }}
      />

      <Components.InputModal
        ref={modalVisibleUrlPortRef}
        modalVisible={modalVisibleUrlPort}
        header={t('scanSetting.section1.row2.dialogTitle')}
        hint={t('scanSetting.section1.row2.dialogSubTitle')}
        onPressClose={async () => {
          setModalVisiblePort(false);
        }}
        onPressSave={async () => {
          setModalVisiblePort(false);
          if (!isNaN(Number(modalPort))) {
            setPort(parseInt(modalPort, 10));
          }
        }}
        placeholder={t('scanSetting.section1.row2.dialogTitle')!}
        value={modalPort}
        onChangeText={text => setModalPort(text)}
        keyboardType={'numeric'}
        onBackButtonPress={() => {
          setModalVisiblePath(false);
        }}
      />

      <Components.InputModal
        ref={modalVisibleScanTimeoutRef}
        modalVisible={modalVisibleScanTimeout}
        header={t('scanSetting.section3.row1.dialogTitle')}
        hint={t('scanSetting.section3.row1.dialogSubTitle')}
        onPressClose={async () => {
          setModalVisibleScanTimeout(false);
        }}
        onPressSave={async () => {
          setModalVisibleScanTimeout(false);
          if (!isNaN(Number(modalScanTimeout))) {
            setScanTimeoutInMs(parseInt(modalScanTimeout, 10));
          }
        }}
        placeholder={t('scanSetting.section3.row1.dialogTitle')!}
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
        header={t('scanSetting.section3.row2.dialogTitle')}
        hint={t('scanSetting.section3.row2.dialogSubTitle')}
        onPressClose={async () => {
          setModalVisibleScanThreads(false);
        }}
        onPressSave={async () => {
          setModalVisibleScanThreads(false);
          if (!isNaN(Number(modalScanThreads))) {
            setScanThreads(parseInt(modalScanThreads, 10));
          }
        }}
        placeholder={t('scanSetting.section3.row2.dialogTitle')!}
        value={modalScanThreads}
        onChangeText={text => setModalScanThreads(text)}
        keyboardType={'numeric'}
        onBackButtonPress={() => {
          setModalVisiblePath(false);
        }}
      />
    </Components.AppBaseView>
  );
};

export default ScanSetting;
