import React from 'react';
import { StyleSheet, View } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { Dialog, TouchableRipple, useTheme, Button } from 'react-native-paper';

//App modules
import { IAppearanceType } from 'app/models/reducers/theme';

//Interface
interface ISelectAccentDialogProps {
  visible: boolean;
  appearance: IAppearanceType;
  accentColorOptions: string[];
  onSelect: (item: string, index: number) => void;
  onPressHideDialog: () => void;
}

function SelectAccentDialog(props: ISelectAccentDialogProps) {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Dialog visible={props.visible} onDismiss={props.onPressHideDialog}>
      <Dialog.Title style={{ color: colors.onSurface }}>{t('SETTINGS_THEME_OPTION')}</Dialog.Title>
      <Dialog.Content>
        <View style={styles.dialogContainer}>
          {props.accentColorOptions.map((item, index) => {
            return (
              <TouchableRipple
                key={item.toString()}
                style={[styles.itemButton, { backgroundColor: item }]}
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
        <Button onPress={props.onPressHideDialog}>{t('CLOSE')}</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

export default SelectAccentDialog;

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
