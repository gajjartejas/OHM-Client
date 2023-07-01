import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Keyboard, TouchableOpacity } from 'react-native';

//ThirdParty
import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Button, useTheme, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

//App modules
import IState from 'app/models/models/appState';
import validateIPAddress from 'app/utils/validateIPAddress';
import validatePort from 'app/utils/validatePort';

interface IScanInputModalProps extends TextInputProps {
  modalVisible: boolean;
  header: string;
  onPressClose: () => void;
  onPressAdvanceSetting: () => void;
  onPressSave: (ipAddress: string, port: string) => void;
  errorMessage: string;
  onBackButtonPress: () => void;
}

const ScanInputModal = React.forwardRef((props: IScanInputModalProps, _ref: any) => {
  const deviceInfoLoading = useSelector((state: IState) => state.deviceReducer.deviceInfoLoading);

  let ipAddressRef = useRef<TextInput | null>(null);
  let portRef = useRef<TextInput | null>(null);

  const errorMessage = props.errorMessage;
  const theme = useTheme();
  const { t } = useTranslation();

  const [ipAddress, setIPAddress] = useState('');
  const [port, setPort] = useState('');

  const [isValidIPAddress, setIsValidIPAddress] = useState(true);
  const [isValidPort, setIsValidPort] = useState(true);

  useEffect(() => {
    if (!props.modalVisible) {
      return;
    }
    const timeOut = setTimeout(() => {
      ipAddressRef.current && ipAddressRef.current.focus();
    }, 100);

    return () => {
      clearInterval(timeOut);
    };
  }, [props.modalVisible, ipAddressRef]);

  useEffect(() => {
    setIsValidIPAddress(true);
  }, [ipAddress]);

  useEffect(() => {
    setIsValidPort(true);
  }, [port]);

  const onPressSave = () => {
    Keyboard.dismiss();
    if (!validateIPAddress(ipAddress)) {
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
            ref={ipAddressRef}
            autoCapitalize="none"
            style={[
              styles.inputStyle,
              styles.textInputShadow,
              { borderBottomColor: theme.colors.primary, color: theme.colors.onBackground },
            ]}
            value={ipAddress}
            onChangeText={setIPAddress}
            placeholder={t('inputIpAddressDialog.inputPlaceholder1')!}
            placeholderTextColor={theme.colors.onSurface}
            onSubmitEditing={() => portRef.current?.focus()}
            keyboardType={'numeric'}
            returnKeyType={'next'}
          />

          {!isValidIPAddress && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {t('inputIpAddressDialog.dialogInputError1')}
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
            placeholder={t('inputIpAddressDialog.inputPlaceholder2')!}
            placeholderTextColor={theme.colors.onSurface}
            onSubmitEditing={onPressSave}
            keyboardType={'numeric'}
            returnKeyType={'done'}
          />

          <TouchableOpacity style={styles.touchableAdvanceSetting} onPress={props.onPressAdvanceSetting}>
            <Text style={[styles.advanceSettingText, { color: theme.colors.primary }]}>
              {t('inputIpAddressDialog.button1')}
            </Text>
          </TouchableOpacity>

          {!isValidPort && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {t('inputIpAddressDialog.dialogInputError2')}
            </Text>
          )}
          {!!errorMessage && (
            <Text style={[styles.bottomErrorMessage, { color: theme.colors.error }]}>{errorMessage}</Text>
          )}

          {!deviceInfoLoading && (
            <View style={styles.buttonContainer}>
              <Button mode={'contained'} style={styles.button} onPress={props.onPressClose}>
                {t('general.close')}
              </Button>
              <View style={styles.spacing} />
              <Button mode={'contained'} style={styles.button} onPress={onPressSave}>
                {t('general.connect')}
              </Button>
            </View>
          )}

          {deviceInfoLoading && (
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
  loadingText: {
    fontSize: 16,
    marginLeft: 4,
  },
  advanceSettingText: {
    fontSize: 12,
    alignSelf: 'flex-end',
    minHeight: 20,
  },
  bottomErrorMessage: {
    fontSize: 12,
    marginBottom: 16,
  },
  touchableAdvanceSetting: {
    marginVertical: 8,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  spacing: { width: 8 },
});

export default ScanInputModal;
