import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-easy-icon';
import { Dialog, Paragraph, TouchableRipple, useTheme, Button } from 'react-native-paper';

//Interface
interface IAboutFeedbackDialogProps {
  visible: boolean;
  onPressTelegram: () => void;
  onPressEmail: () => void;
  onPressHideDialog: () => void;
}

function AboutFeedbackDialog(props: IAboutFeedbackDialogProps) {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Dialog visible={props.visible} onDismiss={props.onPressHideDialog}>
      <Dialog.Title style={{ color: colors.onBackground }}>{t('ABOUT_SEND_FEEDBACK')}</Dialog.Title>
      <Dialog.Content>
        <Paragraph style={[styles.descriptionText, { color: `${colors.onBackground}88` }]}>
          {t('ABOUT_SEND_FEEDBACK_DETAIL')}
        </Paragraph>
      </Dialog.Content>
      <View style={styles.buttonsContainer}>
        <TouchableRipple
          borderless={true}
          style={[styles.button, { backgroundColor: `${colors.onBackground}33` }]}
          onPress={props.onPressTelegram}
          rippleColor="rgba(0, 0, 0, .32)">
          <Icon type="font-awesome-brands" name="telegram-plane" color={`${colors.onBackground}88`} size={24} />
        </TouchableRipple>
        <TouchableRipple
          borderless={true}
          style={[styles.button, { backgroundColor: `${colors.onBackground}33` }]}
          onPress={props.onPressEmail}
          rippleColor="rgba(0, 0, 0, .32)">
          <Icon type="ionicon" name="mail" color={`${colors.onBackground}88`} size={24} />
        </TouchableRipple>
      </View>

      <Dialog.Actions>
        <Button onPress={props.onPressHideDialog}>{t('CLOSE')}</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

export default AboutFeedbackDialog;

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
  buttonsContainer: { flexDirection: 'row', alignSelf: 'center' },
  descriptionText: { fontSize: 16 },
});
