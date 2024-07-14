import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';

//ThirdParty
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-easy-icon';
import { Divider, List, useTheme } from 'react-native-paper';

//App modules
import Components from 'app/components';
import styles from './styles';

//Modals
import { ISettingItem, ISettingSection, ISettingThemeOptions } from 'app/models/viewModels/settingItem';

//Redux
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import useThemeConfigStore, { IAppearanceType } from 'app/store/themeConfig';
import { SelectAccentDialogColor } from 'app/components/SelectAccentColorDialog';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';
import AppHeader from 'app/components/AppHeader';

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'SelectAppearance'>;

const SelectAppearance = ({ navigation }: Props) => {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();
  const resetTheme = useThemeConfigStore(store => store.resetTheme);
  const setPrimaryColor = useThemeConfigStore(store => store.setPrimaryColor);
  const setAppearance = useThemeConfigStore(store => store.setAppearance);
  const appearance = useThemeConfigStore(store => store.appearance);
  const largeScreenMode = useLargeScreenMode();

  //States
  const apps: ISettingSection[] = useMemo(() => {
    return [
      {
        id: 0,
        title: t('appearanceSettings.interfaceHeader'),
        items: [
          {
            id: 0,
            iconName: 'wb-sunny',
            iconType: 'material',
            title: t('appearanceSettings.themeTitle'),
            description: t('appearanceSettings.themeSubTitle')!,
            route: 'SelectAppearance',
          },
          {
            id: 1,
            iconName: 'app-settings-alt',
            iconType: 'material',
            title: t('appearanceSettings.accentColorTitle'),
            description: t('appearanceSettings.accentColorSubTitle')!,
            route: '',
          },
        ],
      },
      {
        id: 1,
        title: t('appearanceSettings.otherHeader'),
        items: [
          {
            id: 0,
            iconName: 'backup-restore',
            iconType: 'material-community',
            title: t('appearanceSettings.otherTitle'),
            description: t('appearanceSettings.otherSubTitle')!,
            route: 'SelectAppearance',
          },
        ],
      },
    ];
  }, [t]);

  //
  const [themeDialogVisible, setThemeDialogVisible] = useState(false);
  const themeOptions: ISettingThemeOptions[] = useMemo(() => {
    return [
      {
        id: 0,
        title: t('appearanceSettings.themeOption1'),
        value: IAppearanceType.Light,
      },
      {
        id: 1,
        title: t('appearanceSettings.themeOption2'),
        value: IAppearanceType.Dark,
      },
      {
        id: 2,
        title: t('appearanceSettings.themeOption3'),
        value: IAppearanceType.Auto,
      },
    ];
  }, [t]);

  //
  const [accentColorDialogVisible, setAccentColorDialogVisible] = useState(false);

  const onGoBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const onPressRestoreDefaultTheme = useCallback(() => {
    resetTheme();
  }, [resetTheme]);

  const onPressShowThemeDialog = useCallback(() => setThemeDialogVisible(true), []);
  const onPressHideThemeDialog = useCallback(() => setThemeDialogVisible(false), []);

  const onPressShowAccentColorDialog = useCallback(() => setAccentColorDialogVisible(true), []);
  const onPressHideAccentColorDialog = useCallback(() => setAccentColorDialogVisible(false), []);

  const onPressPrimaryColor = useCallback(
    (item: SelectAccentDialogColor) => {
      onPressHideAccentColorDialog();
      setTimeout(() => {
        setPrimaryColor(item.primary, item.onPrimary);
      }, 100);
    },
    [onPressHideAccentColorDialog, setPrimaryColor],
  );

  const onPressAppearanceOption = useCallback(
    (item: ISettingSection, index: number, subItem: ISettingItem, subIndex: number) => {
      switch (true) {
        case index === 0 && subIndex === 0:
          onPressShowThemeDialog();
          break;
        case index === 0 && subIndex === 1:
          onPressShowAccentColorDialog();
          break;
        case index === 1 && subIndex === 0:
          onPressRestoreDefaultTheme();
          break;
        default:
      }
    },
    [onPressRestoreDefaultTheme, onPressShowAccentColorDialog, onPressShowThemeDialog],
  );

  const onSelectTheme = useCallback(
    (item: ISettingThemeOptions, _index: number) => {
      setThemeDialogVisible(false);

      setTimeout(() => {
        setAppearance(item.value);
      }, 100);
    },
    [setAppearance],
  );

  return (
    <Components.AppBaseView
      edges={['left', 'right', 'top']}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        showBackButton={true}
        onPressBackButton={onGoBack}
        title={t('appearanceSettings.title')}
        style={{ backgroundColor: colors.background }}
      />

      <Components.AppBaseView scroll edges={['bottom', 'left', 'right']} style={styles.safeArea}>
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

      <Components.SelectThemeDialog
        visible={themeDialogVisible}
        appearance={appearance}
        themeOptions={themeOptions}
        onSelect={onSelectTheme}
        onPressHideDialog={onPressHideThemeDialog}
      />

      <Components.SelectAccentDialog
        visible={accentColorDialogVisible}
        onSelect={onPressPrimaryColor}
        onDismiss={onPressHideAccentColorDialog}
      />
    </Components.AppBaseView>
  );
};

export default SelectAppearance;
