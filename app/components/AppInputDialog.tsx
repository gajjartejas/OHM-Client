import React, { memo, useEffect } from 'react';
import { View, StyleSheet, TextInputProps, TextInput } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { Text, Button, useTheme, Portal } from 'react-native-paper';
import Modal from 'react-native-modal';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';

interface IAppInputDialogProps extends TextInputProps {
  modalVisible: boolean;
  header: string;
  hint: string;
  onPressClose: () => void;
  onPressSave: () => void;
  onBackButtonPress: () => void;
}

const AppInputDialog = React.forwardRef((props: IAppInputDialogProps, ref: any) => {
  //Const
  const theme = useTheme();
  const { t } = useTranslation();
  const largeScreenMode = useLargeScreenMode();

  useEffect(() => {
    if (!props.modalVisible) {
      return;
    }
    const timeOut = setTimeout(() => {
      ref.current && ref.current.focus();
    }, 100);

    return () => {
      clearInterval(timeOut);
    };
  }, [props.modalVisible, ref]);

  return (
    <Portal>
      <Modal
        style={styles.modal}
        backdropColor={`${theme.colors.onBackground}33`}
        coverScreen
        animationInTiming={300}
        animationIn={'slideInUp'}
        avoidKeyboard
        hideModalContentWhileAnimating
        onBackButtonPress={props.onBackButtonPress}
        isVisible={props.modalVisible}>
        <View style={[styles.centeredView, largeScreenMode && styles.cardTablet]}>
          <View style={[styles.modalView, { backgroundColor: `${theme.colors.background}` }]}>
            <Text style={[styles.textSize, { color: theme.colors.primary }]}>{props.header}</Text>
            <TextInput
              ref={ref}
              autoCapitalize="none"
              style={[
                styles.inputStyle,
                styles.textInputShadow,
                { borderBottomColor: theme.colors.primary, color: theme.colors.onBackground },
              ]}
              value={props.value}
              onChangeText={props.onChangeText}
              placeholder={props.placeholder}
              placeholderTextColor={theme.colors.onSurface}
              {...props}
            />

            {!!props.hint && <Text style={[styles.hintText, { color: theme.colors.onSurface }]}>{props.hint}</Text>}

            <View style={styles.buttonContainer}>
              <Button mode={'contained'} style={styles.button} onPress={props.onPressClose}>
                {t('general.close')}
              </Button>

              <View style={styles.spacing} />

              <Button mode={'contained'} style={styles.button} onPress={props.onPressSave}>
                {t('general.save')}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
});

const styles = StyleSheet.create({
  modal: { margin: 8, marginBottom: -4 },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    justifyContent: 'space-around',
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.55,
    shadowRadius: 8,
    elevation: 20,
  },
  textSize: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 16,
  },
  inputStyle: {
    width: '100%',
    height: 50,
  },
  textInputShadow: {},
  buttonContainer: {
    flexDirection: 'row',
  },
  button: { flex: 1 },
  spacing: { width: 8 },
  hintText: {
    fontSize: 12,
    marginVertical: 8,
    marginBottom: 16,
  },
  cardTablet: {
    width: '70%',
    alignSelf: 'center',
  },
});

AppInputDialog.displayName = 'AppInputDialog';
export default memo(AppInputDialog);
