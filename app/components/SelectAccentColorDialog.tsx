import React, { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { Dialog, TouchableRipple, useTheme, Button } from 'react-native-paper';

//App Modules
import { AppTheme } from 'app/models/theme';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';

//Interface
interface ISelectAccentDialogProps {
  visible: boolean;
  onSelect: (item: SelectAccentDialogColor) => void;
  onDismiss: () => void;
}

export type SelectAccentDialogColor = {
  primary: string;
  onPrimary: string;
};

function SelectAccentDialog(props: ISelectAccentDialogProps) {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme<AppTheme>();
  const largeScreenMode = useLargeScreenMode();

  const [accentColorOptions] = useState<SelectAccentDialogColor[]>([
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

  const onSelect = (item: SelectAccentDialogColor) => {
    props.onSelect(item);
  };

  const onDismiss = () => {
    props.onDismiss();
  };

  return (
    <Dialog style={[largeScreenMode && styles.cardTablet]} visible={props.visible} onDismiss={onDismiss}>
      <Dialog.Title style={{ color: colors.onSurface }}>{t('appearanceSettings.themeOption')}</Dialog.Title>
      <Dialog.Content>
        <View style={styles.dialogContainer}>
          {accentColorOptions.map(item => {
            return (
              <TouchableRipple
                key={item.primary.toString()}
                style={[styles.itemButton, { backgroundColor: item.primary }]}
                borderless={true}
                onPress={() => onSelect(item)}
                centered={true}
                rippleColor="rgba(0, 0, 0, .32)">
                <View />
              </TouchableRipple>
            );
          })}
        </View>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onDismiss}>{t('general.close')}</Button>
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
  dialogContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  cardTablet: {
    width: '70%',
    alignSelf: 'center',
  },
});

export default memo(SelectAccentDialog);
