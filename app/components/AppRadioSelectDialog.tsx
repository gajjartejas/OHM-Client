import React, { memo } from 'react';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';

//ThirdParty
import { Dialog, Text, useTheme, TouchableRipple, RadioButton, Portal } from 'react-native-paper';

//App Modules
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';
import { useTranslation } from 'react-i18next';

//Interface
interface IAppRadioSelectDialogProps<T> {
  visible: boolean;
  title: string;
  onPressConfirm: (item: T) => void;
  onPressCancel: () => void;

  items: T[];
  selectedItem: T;
}

function AppRadioSelectDialog(props: IAppRadioSelectDialogProps<string>) {
  //Constants
  const { title, onPressCancel, items, selectedItem, visible } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const largeScreenMode = useLargeScreenMode();

  return (
    <Portal>
      <Dialog
        dismissableBackButton={true}
        style={[largeScreenMode && styles.cardTablet]}
        visible={visible}
        onDismiss={onPressCancel}>
        <Dialog.Title style={[styles.titleText, { color: colors.onBackground }]}>{title}</Dialog.Title>
        <Dialog.Content>
          <ScrollView style={styles.scrollView}>
            {items.map(v => {
              return (
                <TouchableRipple
                  key={v}
                  onPress={() => {
                    props.onPressConfirm(v);
                  }}
                  style={styles.touchableRow}>
                  <>
                    <Text style={styles.expand}>{t(v)}</Text>
                    <RadioButton
                      onPress={() => {
                        props.onPressConfirm(v);
                      }}
                      status={v === selectedItem ? 'checked' : 'unchecked'}
                      value={t(v)}
                    />
                  </>
                </TouchableRipple>
              );
            })}
          </ScrollView>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
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
  scrollView: {
    paddingHorizontal: 12,
    maxHeight: Dimensions.get('screen').height * 0.7,
  },
  touchableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  expand: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
  },
});

export default memo(AppRadioSelectDialog);
