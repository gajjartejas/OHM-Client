import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Keyboard } from 'react-native';

//ThirdParty
import Modal from 'react-native-modal';
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
  errorMessage: string;
  showConnectionLoader: boolean;
  onPressClose: () => void;
  onPressSave: (username: string, password: string) => void;
  onBackButtonPress: () => void;
}

const AuthInputModal = React.forwardRef((props: IAuthInputModalProps, _ref: any) => {
  //Refs
  let usernameRef = useRef<TextInput | null>(null);
  let portRef = useRef<TextInput | null>(null);

  //Const
  const deviceInfoLoading = useSelector((state: IState) => state.deviceReducer.deviceInfoLoading);
  const invalidAuthCount = useSelector((state: IState) => state.deviceReducer.invalidAuthCount);
  const showConnectionLoader = props.showConnectionLoader;
  const theme = useTheme();
  const { t } = useTranslation();
  const errorMessage = props.errorMessage;

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
    if (!props.modalVisible) {
      return;
    }
    const timeOut = setTimeout(() => {
      usernameRef.current && usernameRef.current.focus();
    }, 100);

    return () => {
      clearInterval(timeOut);
    };
  }, [props.modalVisible, usernameRef]);

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
      <View style={[styles.centeredView]}>
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
            placeholder={t('generalSetting.section2.row1.dialogInputPlaceholder1')!}
            placeholderTextColor={theme.colors.onSurface}
            onSubmitEditing={() => portRef.current?.focus()}
            keyboardType={'default'}
            returnKeyType={'next'}
          />
          {!isValidUsername && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {t('generalSetting.section2.row1.dialogInputValidation1')}
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
            placeholder={t('generalSetting.section2.row1.dialogInputPlaceholder2')!}
            placeholderTextColor={theme.colors.onSurface}
            onSubmitEditing={onPressSave}
            keyboardType={'default'}
            secureTextEntry={true}
            returnKeyType={'done'}
          />
          {!isValidPassword && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {t('generalSetting.section2.row1.dialogInputValidation2')}
            </Text>
          )}
          <Text style={[styles.hintText, { color: theme.colors.onSurface }]}>
            {t('generalSetting.section2.row1.dialogSubTitle')}
          </Text>
          {invalidAuthCount > 1 && (
            <Text style={[styles.loadingText, { color: theme.colors.error }]}>
              {t('generalSetting.section2.row1.dialogInputError1')}
            </Text>
          )}

          {!!errorMessage && <Text style={[styles.loadingText, { color: theme.colors.error }]}>{errorMessage}</Text>}
          {(!showConnectionLoader || !deviceInfoLoading) && (
            <View style={styles.buttonContainer}>
              <Button mode={'contained'} style={styles.button} onPress={props.onPressClose}>
                {t('general.close')}
              </Button>
              <View style={styles.spacing} />
              <Button mode={'contained'} style={styles.button} onPress={onPressSave}>
                {t('general.set')}
              </Button>
            </View>
          )}

          {showConnectionLoader && deviceInfoLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator />
              <Text style={[styles.loadingText, { color: theme.colors.primary }]}>{t('general.connecting')}</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
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
    borderBottomWidth: 1,
    width: '100%',
    height: 50,
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
  hintText: {
    fontSize: 12,
    marginVertical: 8,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    marginLeft: 4,
    marginBottom: 16,
  },
  spacing: { width: 8 },
});

export default AuthInputModal;
