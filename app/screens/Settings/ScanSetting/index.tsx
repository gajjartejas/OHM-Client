import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, TextInput } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { Divider, List, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

//App modules
import Components from 'app/components';
import styles from './styles';
import useAppScanConfigStore from 'app/store/appScanConfig';

//Modals
import {
  ISettingItem,
  ISettingSection,
} from 'app/models/viewModels/settingItem';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import AppHeader from 'app/components/AppHeader';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';
import CommonIcon from 'app/components/CommonIcon';

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'ScanSetting'>;

const ScanSetting = ({ navigation }: Props) => {
  //Refs
  const modalVisibleUrlPortsRef = useRef<TextInput | null>(null);
  const modalVisibleScanTimeoutRef = useRef<TextInput | null>(null);
  const modalVisibleScanThreadsRef = useRef<TextInput | null>(null);

  //Actions
  const ports = useAppScanConfigStore(store => store.ports);
  const setPorts = useAppScanConfigStore(store => store.setPorts);

  const scanTimeoutInMs = useAppScanConfigStore(store => store.scanTimeoutInMs);
  const setScanTimeoutInMs = useAppScanConfigStore(
    store => store.setScanTimeoutInMs,
  );

  const scanThreads = useAppScanConfigStore(store => store.scanThreads);
  const setScanThreads = useAppScanConfigStore(store => store.setScanThreads);

  const reset = useAppScanConfigStore(store => store.reset);
  const largeScreenMode = useLargeScreenMode();

  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();

  //States
  const apps: ISettingSection[] = useMemo(() => {
    return [
      {
        id: 0,
        title: t('scanSetting.section1.header'),
        items: [
          {
            id: 0,
            iconName: 'network',
            iconType: 'material',
            title: t('scanSetting.section1.row1.title'),
            description: t('scanSetting.section1.row1.subTitle', {
              id2001: ports.join(', '),
            }),
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
            iconType: 'material',
            title: t('scanSetting.section3.row1.title'),
            description: t('scanSetting.section3.row1.subTitle', {
              id2003: scanTimeoutInMs,
            }),
            route: '',
          },
          {
            id: 1,
            iconName: 'speedometer',
            iconType: 'material',
            title: t('scanSetting.section3.row2.title'),
            description: t('scanSetting.section3.row2.subTitle', {
              id2004: scanThreads,
            }),
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
            iconType: 'material',
            title: t('scanSetting.section4.row1.title'),
            description: t('scanSetting.section4.row1.subTitle'),
            route: 'SelectAppearance',
          },
        ],
      },
    ];
  }, [ports, scanThreads, scanTimeoutInMs, t]);

  const [modalVisibleUrlPorts, setModalVisiblePorts] = useState(false);
  const [modalVisibleScanTimeout, setModalVisibleScanTimeout] = useState(false);
  const [modalVisibleScanThreads, setModalVisibleScanThreads] = useState(false);

  const [modalPorts, setModalPorts] = useState<string>(ports.join(', '));
  const [modalScanTimeout, setModalScanTimeout] = useState(
    `${scanTimeoutInMs}`,
  );
  const [modalScanThreads, setModalScanThreads] = useState(`${scanThreads}`);

  useEffect(() => {
    setModalPorts(ports.join(', '));
  }, [ports]);

  const onGoBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const resetSettings = useCallback(() => {
    reset();
  }, [reset]);

  const onPressAppearanceOption = useCallback(
    (
      item: ISettingSection,
      index: number,
      subItem: ISettingItem,
      subIndex: number,
    ) => {
      switch (true) {
        case index === 0 && subIndex === 0:
          setModalVisiblePorts(true);
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
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <AppHeader
        showBackButton={true}
        onPressBackButton={onGoBack}
        title={t('scanSetting.title')}
        style={{ backgroundColor: colors.background }}
      />

      <Components.AppBaseView scroll edges={[]} style={styles.safeArea}>
        <View
          style={[styles.listContainer, largeScreenMode && styles.cardTablet]}
        >
          {apps.map((item, index) => {
            return (
              <View key={item.id.toString()}>
                <List.Subheader
                  style={[styles.listSubHeader, { color: colors.primary }]}
                >
                  {item.title}
                </List.Subheader>
                {item.items.map((subItem, subIndex) => {
                  return (
                    <List.Item
                      key={subItem.id.toString()}
                      titleStyle={{ color: colors.onSurface }}
                      descriptionStyle={{ color: `${colors.onSurface}88` }}
                      onPress={() =>
                        onPressAppearanceOption(item, index, subItem, subIndex)
                      }
                      title={subItem.title}
                      description={subItem.description}
                      left={() => (
                        <CommonIcon
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

      <Components.AppInputDialog
        ref={modalVisibleUrlPortsRef}
        modalVisible={modalVisibleUrlPorts}
        header={t('scanSetting.section1.row1.dialogTitle')}
        hint={t('scanSetting.section1.row1.dialogSubTitle')}
        onPressClose={() => {
          setModalVisiblePorts(false);
        }}
        onPressSave={() => {
          setModalVisiblePorts(false);
          const p = modalPorts.split(',').reduce((ac: number[], v: string) => {
            if (!isNaN(Number(v))) {
              ac.push(Number(v));
            }
            return ac;
          }, []);
          setPorts(p);
        }}
        placeholder={t('scanSetting.section1.row1.dialogTitle')!}
        value={modalPorts}
        onChangeText={text => setModalPorts(text)}
        keyboardType={'numeric'}
        onBackButtonPress={() => {
          setModalVisiblePorts(false);
        }}
        multiline={false}
      />

      <Components.AppInputDialog
        ref={modalVisibleScanTimeoutRef}
        modalVisible={modalVisibleScanTimeout}
        header={t('scanSetting.section3.row1.dialogTitle')}
        hint={t('scanSetting.section3.row1.dialogSubTitle')}
        onPressClose={() => {
          setModalVisibleScanTimeout(false);
        }}
        onPressSave={() => {
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
          setModalVisibleScanTimeout(false);
        }}
      />

      <Components.AppInputDialog
        ref={modalVisibleScanThreadsRef}
        modalVisible={modalVisibleScanThreads}
        header={t('scanSetting.section3.row2.dialogTitle')}
        hint={t('scanSetting.section3.row2.dialogSubTitle')}
        onPressClose={() => {
          setModalVisibleScanThreads(false);
        }}
        onPressSave={() => {
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
          setModalVisibleScanThreads(false);
        }}
      />
    </Components.AppBaseView>
  );
};

export default ScanSetting;
