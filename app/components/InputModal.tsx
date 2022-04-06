import React, { useEffect } from 'react';
import { View, TextInput, Modal, StyleSheet, TextInputProps, KeyboardAvoidingView } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { Text, Button, useTheme } from 'react-native-paper';

//Interface
interface IInputModalProps extends TextInputProps {
  modalVisible: boolean;
  header: string;
  onPressClose: () => void;
  onPressSave: () => void;
}

const InputModal = React.forwardRef((props: IInputModalProps, ref: any) => {
  //Consts
  const theme = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      ref.current.focus();
    }, 200);
  }, [ref]);

  return (
    <Modal animationType="fade" transparent={true} visible={props.modalVisible}>
      <KeyboardAvoidingView
        behavior={'padding'}
        style={[styles.centeredView, { backgroundColor: `${theme.colors.onBackground}33` }]}>
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

          <View style={styles.buttonContainer}>
            <Button style={styles.button} onPress={props.onPressClose}>
              {t('CLOSE')}
            </Button>
            <Button style={styles.button} onPress={props.onPressSave}>
              {t('SAVE')}
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
});

const styles = StyleSheet.create({
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
    alignItems: 'center',
    width: '100%',
    height: 200,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 10,
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
  },
  inputStyle: {
    borderBottomWidth: 1,
    width: '100%',
  },
  textInputShadow: {},
  buttonContainer: {
    flexDirection: 'row',
  },
  button: { flex: 1 },
});
export default InputModal;
