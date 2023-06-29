import React, { useState } from 'react';
import { View } from 'react-native';

//ThirdParty
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-easy-icon';
import { Appbar, Divider, List, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

//App modules
import Components from 'app/components';
import styles from './styles';

//Modals
import IState from 'app/models/models/appState';
import { IAppearanceType } from 'app/models/reducers/theme';
import { ISettingItem, ISettingSection, ISettingThemeOptions } from 'app/models/viewModels/settingItem';

//Redux
import * as themeActions from 'app/store/actions/themeActions';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'SelectAppearance'>;

export interface IAppearanceColor {
  primary: string;
  onPrimary: string;
}

const SelectAppearance = ({ navigation }: Props) => {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const appearance = useSelector((state: IState) => state.themeReducer.appearance);

  //States
  const [apps] = useState<ISettingSection[]>([
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
  ]);

  //
  const [themeDialogVisible, setThemeDialogVisible] = React.useState(false);
  const [themeOptions] = React.useState<ISettingThemeOptions[]>([
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
  ]);

  //
  const [accentColorDialogVisible, setAccentColorDialogVisible] = React.useState(false);
  const [accentColorOptions] = React.useState<IAppearanceColor[]>([
    { primary: '#008b00', onPrimary: '#ffffff' },
    { primary: '#61d800', onPrimary: '#ffffff' },
    { primary: '#90ee02', onPrimary: '#000000' },
    { primary: '#c6f68d', onPrimary: '#000000' },
    { primary: '#defabb', onPrimary: '#000000' },

    { primary: '#880061', onPrimary: '#ffffff' },
    { primary: '#dd0074', onPrimary: '#ffffff' },
    { primary: '#ee0290', onPrimary: '#000000' },
    { primary: '#f186c0', onPrimary: '#000000' },
    { primary: '#f5b6da', onPrimary: '#000000' },

    { primary: '#e44304', onPrimary: '#ffffff' },
    { primary: '#ee6002', onPrimary: '#ffffff' },
    { primary: '#ff9e22', onPrimary: '#000000' },
    { primary: '#ffc77d', onPrimary: '#000000' },
    { primary: '#ffddb0', onPrimary: '#000000' },

    { primary: '#0000d6', onPrimary: '#ffffff' },
    { primary: '#5300e8', onPrimary: '#ffffff' },
    { primary: '#7e3ff2', onPrimary: '#000000' },
    { primary: '#9965f4', onPrimary: '#000000' },
    { primary: '#b794f6', onPrimary: '#000000' },

    { primary: '#5c00d2', onPrimary: '#ffffff' },
    { primary: '#8b00dc', onPrimary: '#ffffff' },
    { primary: '#a100e0', onPrimary: '#000000' },
    { primary: '#ba00e5', onPrimary: '#000000' },
    { primary: '#cc00e9', onPrimary: '#000000' },
  ]);

  const onGoBack = () => {
    navigation.pop();
  };

  //
  const onPressAppearanceOption = (item: ISettingSection, index: number, subItem: ISettingItem, subIndex: number) => {
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
  };

  //
  const onPressShowThemeDialog = () => setThemeDialogVisible(true);
  const onPressHideThemeDialog = () => setThemeDialogVisible(false);

  const onSelectTheme = (item: ISettingThemeOptions, _index: number) => {
    onPressHideThemeDialog();

    setTimeout(() => {
      dispatch(themeActions.setAppearance(item.value));
    }, 100);
  };

  //
  const onPressShowAccentColorDialog = () => setAccentColorDialogVisible(true);
  const onPressHideAccentColorDialog = () => setAccentColorDialogVisible(false);

  const onPressPrimaryColor = (item: IAppearanceColor, _index: number) => {
    onPressHideAccentColorDialog();
    setTimeout(() => {
      dispatch(themeActions.setPrimaryColor(item.primary, item.onPrimary));
    }, 100);
  };

  //
  const onPressRestoreDefaultTheme = () => {
    dispatch(themeActions.resetTheme());
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.background }}>
        <Appbar.BackAction onPress={onGoBack} />
        <Appbar.Content title={t('appearanceSettings.title')} />
      </Appbar.Header>
      <Components.AppBaseView scroll edges={['bottom', 'left', 'right']} style={styles.safeArea}>
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
        appearance={appearance}
        accentColorOptions={accentColorOptions}
        onSelect={onPressPrimaryColor}
        onPressHideDialog={onPressHideAccentColorDialog}
      />
    </View>
  );
};

export default SelectAppearance;
