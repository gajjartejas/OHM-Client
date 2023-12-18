import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { Dialog, TouchableRipple, useTheme, Button, RadioButton, Text } from 'react-native-paper';

//App modules
import { ISettingThemeOptions } from 'app/models/viewModels/settingItem';
import { AppTheme } from 'app/models/theme';
import { IAppearanceType } from 'app/store/themeConfig';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';

//Interface
interface ISelectThemeDialogProps {
  visible: boolean;
  appearance: IAppearanceType;
  themeOptions: ISettingThemeOptions[];
  onSelect: (item: ISettingThemeOptions, index: number) => void;
  onPressHideDialog: () => void;
}

function SelectThemeDialog(props: ISelectThemeDialogProps) {
  //Constants
  const { t } = useTranslation();
  const theme = useTheme<AppTheme>();
  const largeScreenMode = useLargeScreenMode();

  return (
    <Dialog
      style={[{ backgroundColor: theme.colors.surface }, largeScreenMode && styles.cardTablet]}
      visible={props.visible}
      onDismiss={props.onPressHideDialog}>
      <Dialog.Title style={{ color: theme.colors.onSurface }}>{t('appearanceSettings.themeOption')}</Dialog.Title>
      <View>
        <RadioButton.Group
          onValueChange={v => {
            const [item] = props.themeOptions.filter(c => c.value === v);
            props.onSelect(item, props.themeOptions.indexOf(item));
          }}
          value={props.appearance}>
          {props.themeOptions.map((item, index) => {
            return (
              <TouchableRipple
                key={item.id.toString()}
                theme={theme}
                borderless={true}
                onPress={() => props.onSelect(item, index)}
                rippleColor="rgba(0, 0, 0, .32)"
                style={styles.itemButton}>
                <View style={styles.itemButtonContainer}>
                  <Text style={[styles.itemText, { color: theme.colors.onSurface }]}>{item.title}</Text>
                  <RadioButton color={theme.colors.primary} value={item.value} />
                </View>
              </TouchableRipple>
            );
          })}
        </RadioButton.Group>
      </View>
      <Dialog.Actions>
        <Button onPress={props.onPressHideDialog}>{t('general.close')}</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  itemText: {
    flex: 1,
  },
  itemButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 6,
  },
  button: {
    alignSelf: 'center',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  descriptionText: {
    fontSize: 16,
  },
  cardTablet: {
    width: '70%',
    alignSelf: 'center',
  },
});

export default memo(SelectThemeDialog);
