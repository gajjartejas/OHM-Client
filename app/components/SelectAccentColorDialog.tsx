import React from 'react';
import { StyleSheet, View } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { Dialog, TouchableRipple, useTheme, Button } from 'react-native-paper';

//App Modules
import { IAppearanceType } from 'app/models/reducers/theme';
import { IAppearanceColor } from 'app/screens/Settings/SelectAppearance';

//Interface
interface ISelectAccentDialogProps {
  visible: boolean;
  appearance: IAppearanceType;
  accentColorOptions: IAppearanceColor[];
  onSelect: (item: IAppearanceColor, index: number) => void;
  onPressHideDialog: () => void;
}

function SelectAccentDialog(props: ISelectAccentDialogProps) {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Dialog visible={props.visible} onDismiss={props.onPressHideDialog}>
      <Dialog.Title style={{ color: colors.onSurface }}>{t('appearanceSettings.themeOption')}</Dialog.Title>
      <Dialog.Content>
        <View style={styles.dialogContainer}>
          {props.accentColorOptions.map((item, index) => {
            return (
              <TouchableRipple
                key={item.primary.toString()}
                style={[styles.itemButton, { backgroundColor: item.primary }]}
                borderless={true}
                onPress={() => props.onSelect(item, index)}
                centered={true}
                rippleColor="rgba(0, 0, 0, .32)">
                <View />
              </TouchableRipple>
            );
          })}
        </View>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={props.onPressHideDialog}>{t('general.close')}</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  itemButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 4,
    overflow: 'hidden',
  },
  dialogContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' },
});

export default SelectAccentDialog;
