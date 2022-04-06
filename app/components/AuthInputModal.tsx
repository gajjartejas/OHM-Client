import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, Modal, StyleSheet, TextInputProps, Keyboard, KeyboardAvoidingView } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Button, useTheme, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

//App modules
import IState from 'app/models/models/appState';

interface IAuthInputModalProps extends TextInputProps {
  modalVisible: boolean;
  username: string;
  password: string;
  header: string;
  showConnectionLoader: boolean;
  onPressClose: () => void;
  onPressSave: (username: string, password: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AuthInputModal = React.forwardRef((props: IAuthInputModalProps, ref: any) => {
  //Refs
  let usernameRef = useRef<TextInput | null>(null);
  let portRef = useRef<TextInput | null>(null);

  //Const
  const deviceInfoLoading = useSelector((state: IState) => state.deviceReducer.deviceInfoLoading);
  const invalidAuthCount = useSelector((state: IState) => state.deviceReducer.invalidAuthCount);
  const showConnectionLoader = props.showConnectionLoader;
  const theme = useTheme();
  const { t } = useTranslation();

  //State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isValidUsername, setIsValidUsername] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);

  useEffect(() => {
    setUsername(props.username);
  }, [props.username]);

  useEffect(() => {
    setPassword(props.password);
  }, [props.password]);

  useEffect(() => {
    setTimeout(() => {
      usernameRef.current?.focus();
    }, 200);
  }, []);

  useEffect(() => {
    setIsValidUsername(true);
  }, [username]);

  useEffect(() => {
    setIsValidPassword(true);
  }, [password]);

  const onPressSave = () => {
    Keyboard.dismiss();
    props.onPressSave(username, password);
  };

  return (
    <Modal animationType="fade" transparent={true} visible={props.modalVisible}>
      <KeyboardAvoidingView
        behavior={'padding'}
        style={[styles.centeredView, { backgroundColor: `${theme.colors.onBackground}33` }]}>
        <View style={[styles.modalView, { backgroundColor: `${theme.colors.background}` }]}>
          <Text style={[styles.textSize, { color: theme.colors.primary }]}>{props.header}</Text>
          <TextInput
            ref={usernameRef}
            autoCapitalize="none"
            style={[
              styles.inputStyle,
              styles.textInputShadow,
              { borderBottomColor: theme.colors.primary, color: theme.colors.onBackground },
            ]}
            value={username}
            onChangeText={setUsername}
            placeholder={t('INPUT_DIALOG_ENTER_USERNAME')}
            placeholderTextColor={theme.colors.onSurface}
            onSubmitEditing={() => portRef.current?.focus()}
            keyboardType={'default'}
            returnKeyType={'next'}
          />
          {!isValidUsername && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {t('INPUT_DIALOG_PLEASE_ENTER_VALID_USERNAME')}
            </Text>
          )}

          <TextInput
            ref={portRef}
            autoCapitalize="none"
            style={[
              styles.inputStyle,
              styles.textInputShadow,
              { borderBottomColor: theme.colors.primary, color: theme.colors.onBackground },
            ]}
            value={password}
            onChangeText={setPassword}
            placeholder={t('INPUT_DIALOG_ENTER_PASSWORD')}
            placeholderTextColor={theme.colors.onSurface}
            onSubmitEditing={onPressSave}
            keyboardType={'default'}
            secureTextEntry={true}
            returnKeyType={'done'}
          />
          {!isValidPassword && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {t('INPUT_DIALOG_PLEASE_ENTER_VALID_PASSWORD')}
            </Text>
          )}

          {invalidAuthCount > 1 && (
            <Text style={[styles.loadingText, { color: theme.colors.error }]}>{t('INPUT_DIALOG_INVALID_AUTH')}</Text>
          )}
          {(!showConnectionLoader || !deviceInfoLoading) && (
            <View style={styles.buttonContainer}>
              <Button style={styles.button} onPress={props.onPressClose}>
                {t('CLOSE')}
              </Button>
              <Button style={styles.button} onPress={onPressSave}>
                {t('INPUT_DIALOG_SET')}
              </Button>
            </View>
          )}

          {showConnectionLoader && deviceInfoLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator />
              <Text style={[styles.loadingText, { color: theme.colors.primary }]}>{t('INPUT_DIALOG_CONNECTING')}</Text>
            </View>
          )}
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: { flex: 1 },
  errorText: {
    fontSize: 12,
  },
  loadingText: {
    fontSize: 16,
    marginLeft: 4,
  },
});

export default AuthInputModal;
