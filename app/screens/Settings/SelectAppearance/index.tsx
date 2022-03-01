import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { Appbar, Divider, List, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-easy-icon';

//App modules
import styles from './styles';
import Components from 'app/components';

//Modals
import { ISettingItem, ISettingSection, ISettingThemeOptions } from 'app/models/viewModels/settingItem';
import { IAppearanceType } from 'app/models/reducers/theme';
import IState from 'app/models/models/appState';

//Redux
import * as themeActions from 'app/store/actions/themeActions';

//Params
type RootStackParamList = {
  SelectAppearance: {};
};
type Props = NativeStackScreenProps<RootStackParamList, 'SelectAppearance'>;

const SelectAppearance = ({ navigation }: Props) => {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const appearance = useSelector((state: IState) => state.themeReducer.appearance);

  //States
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [apps, setApps] = useState<ISettingSection[]>([
    {
      id: 0,
      title: t('SETTINGS_INTERFACE_HEADER'),
      items: [
        {
          id: 0,
          iconName: 'wb-sunny',
          iconType: 'material',
          title: t('SETTINGS_THEME_TITLE'),
          description: t('SETTINGS_THEME_SUB_TITLE'),
          route: 'SelectAppearance',
        },
        {
          id: 1,
          iconName: 'app-settings-alt',
          iconType: 'material',
          title: t('SETTINGS_ACCENT_COLOR_TITLE'),
          description: t('SETTINGS_ACCENT_COLOR_SUB_TITLE'),
          route: '',
        },
      ],
    },
    {
      id: 1,
      title: t('SETTINGS_OTHER_HEADER'),
      items: [
        {
          id: 0,
          iconName: 'backup-restore',
          iconType: 'material-community',
          title: t('SETTINGS_OTHER_TITLE'),
          description: t('SETTINGS_OTHER_SUB_TITLE'),
          route: 'SelectAppearance',
        },
      ],
    },
  ]);

  //
  const [themeDialogVisible, setThemeDialogVisible] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [themeOptions, setThemeOptions] = React.useState<ISettingThemeOptions[]>([
    {
      id: 0,
      title: t('SETTINGS_THEME_OPTION_1'),
      value: IAppearanceType.Light,
    },
    {
      id: 1,
      title: t('SETTINGS_THEME_OPTION_2'),
      value: IAppearanceType.Dark,
    },
    {
      id: 2,
      title: t('SETTINGS_THEME_OPTION_3'),
      value: IAppearanceType.Auto,
    },
  ]);

  //
  const [accentColorDialogVisible, setAccentColorDialogVisible] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [accentColorOptions, setAccentColorOptions] = React.useState<string[]>([
    '#008b00',
    '#61d800',
    '#90ee02',
    '#c6f68d',
    '#defabb',

    '#880061',
    '#dd0074',
    '#ee0290',
    '#f186c0',
    '#f5b6da',

    '#e44304',
    '#ee6002',
    '#ff9e22',
    '#ffc77d',
    '#ffddb0',

    '#0000d6',
    '#5300e8',
    '#7e3ff2',
    '#9965f4',
    '#b794f6',

    '#5c00d2',
    '#8b00dc',
    '#a100e0',
    '#ba00e5',
    '#cc00e9',
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

  const onPressPrimaryColor = (item: string, _index: number) => {
    onPressHideAccentColorDialog();
    setTimeout(() => {
      dispatch(themeActions.setPrimaryColor(item));
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
        <Appbar.Content title={t('SETTINGS_APPEARANCE_TITLE')} subtitle="" />
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
