import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, Modal, StyleSheet, TextInputProps, Keyboard, KeyboardAvoidingView } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Button, useTheme, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

//App modules
import IState from 'app/models/models/appState';
import validateIPaddress from 'app/utils/validateIPaddress';
import validatePort from 'app/utils/validatePort';

interface IScanInputModalProps extends TextInputProps {
  modalVisible: boolean;
  header: string;
  onPressClose: () => void;
  onPressSave: (ipAddresss: string, port: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ScanInputModal = React.forwardRef((props: IScanInputModalProps, ref: any) => {
  const deviceInfoLoading = useSelector((state: IState) => state.deviceReducer.deviceInfoLoading);

  let ipAddressRef = useRef<TextInput | null>(null);
  let portRef = useRef<TextInput | null>(null);

  const theme = useTheme();
  const { t } = useTranslation();

  const [ipAddress, setIPAddress] = useState('');
  const [port, setPort] = useState('');

  const [isValidIPAddress, setIsValidIPAddress] = useState(true);
  const [isValidPort, setIsValidPort] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      ipAddressRef.current?.focus();
    }, 200);
  }, []);

  useEffect(() => {
    setIsValidIPAddress(true);
  }, [ipAddress]);

  useEffect(() => {
    setIsValidPort(true);
  }, [port]);

  const onPressSave = () => {
    Keyboard.dismiss();
    if (!validateIPaddress(ipAddress)) {
      setIsValidIPAddress(false);
      return;
    }

    if (!validatePort(port)) {
      setIsValidPort(false);
      return;
    }

    props.onPressSave(ipAddress, port);
  };

  return (
    <Modal animationType="fade" transparent={true} visible={props.modalVisible}>
      <KeyboardAvoidingView
        behavior={'padding'}
        style={[styles.centeredView, { backgroundColor: `${theme.colors.onBackground}33` }]}>
        <View style={[styles.modalView, { backgroundColor: `${theme.colors.background}` }]}>
          <Text style={[styles.textSize, { color: theme.colors.primary }]}>{props.header}</Text>
          <TextInput
            ref={ipAddressRef}
            autoCapitalize="none"
            style={[
              styles.inputStyle,
              styles.textInputShadow,
              { borderBottomColor: theme.colors.primary, color: theme.colors.onBackground },
            ]}
            value={ipAddress}
            onChangeText={setIPAddress}
            placeholder={t('INPUT_DIALOG_ENTER_IP_ADDRESS')}
            placeholderTextColor={theme.colors.onSurface}
            onEndEditing={() => portRef.current?.focus()}
            keyboardType={'numeric'}
            returnKeyType={'next'}
          />
          {!isValidIPAddress && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {t('INPUT_DIALOG_PLEASE_ENTER_VALID_IP_ADDRESS')}
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
            value={port}
            onChangeText={setPort}
            placeholder={t('SETTINGS_GENERAL_ENTER_PORT_TITLE')}
            placeholderTextColor={theme.colors.onSurface}
            onEndEditing={onPressSave}
            keyboardType={'numeric'}
            returnKeyType={'done'}
          />
          {!isValidPort && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {t('INPUT_DIALOG_PLEASE_ENTER_VALID_PORT')}
            </Text>
          )}
          {!deviceInfoLoading && (
            <View style={styles.buttonContainer}>
              <Button style={styles.button} onPress={props.onPressClose}>
                {t('CLOSE')}
              </Button>
              <Button style={styles.button} onPress={onPressSave}>
                {t('INPUT_DIALOG_CONNECT')}
              </Button>
            </View>
          )}

          {deviceInfoLoading && (
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

export default ScanInputModal;
