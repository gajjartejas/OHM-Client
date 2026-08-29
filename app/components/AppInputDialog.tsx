import React, { memo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInputProps,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Pressable,
  Platform,
} from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { Text, Button, useTheme } from 'react-native-paper';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';

interface IAppInputDialogProps extends TextInputProps {
  modalVisible: boolean;
  header: string;
  hint: string;
  onPressClose: () => void;
  onPressSave: () => void;
  onBackButtonPress?: () => void;
}

const AppInputDialog = React.forwardRef(
  (props: IAppInputDialogProps, ref: any) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const largeScreenMode = useLargeScreenMode();

    const {
      modalVisible,
      header,
      hint,
      onPressClose,
      onPressSave,
      onBackButtonPress,
      style,
      ...textInputProps
    } = props;

    const handleDismiss = onBackButtonPress || onPressClose;

    useEffect(() => {
      if (!modalVisible) {
        return;
      }
      const timer = setTimeout(() => {
        if (ref && 'current' in ref && ref.current) {
          ref.current.focus();
        }
      }, 150);

      return () => {
        clearTimeout(timer);
      };
    }, [modalVisible, ref]);

    return (
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={handleDismiss}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          style={styles.keyboardAvoidingView}
        >
          <Pressable style={styles.backdrop} onPress={handleDismiss} />
          <View
            style={[
              styles.modalContainer,
              largeScreenMode && styles.cardTablet,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <Text style={[styles.headerText, { color: theme.colors.primary }]}>
              {header}
            </Text>

            <TextInput
              ref={ref}
              autoCapitalize="none"
              style={[
                styles.inputStyle,
                {
                  borderBottomColor: theme.colors.primary,
                  color: theme.colors.onBackground,
                },
                style,
              ]}
              placeholderTextColor={`${theme.colors.onSurface}88`}
              {...textInputProps}
            />

            {!!hint && (
              <Text
                style={[styles.hintText, { color: theme.colors.onSurface }]}
              >
                {hint}
              </Text>
            )}

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                style={styles.button}
                onPress={onPressClose}
              >
                {t('general.close')}
              </Button>

              <View style={styles.spacing} />

              <Button
                mode="contained"
                style={styles.button}
                onPress={onPressSave}
              >
                {t('general.save')}
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContainer: {
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 20,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 12,
  },
  inputStyle: {
    borderBottomWidth: 1,
    width: '100%',
    height: 48,
    fontSize: 16,
  },
  hintText: {
    fontSize: 12,
    marginVertical: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  button: {
    flex: 1,
  },
  spacing: {
    width: 12,
  },
  cardTablet: {
    width: '70%',
    alignSelf: 'center',
    borderRadius: 20,
    marginBottom: 20,
  },
});

AppInputDialog.displayName = 'AppInputDialog';
export default memo(AppInputDialog);
