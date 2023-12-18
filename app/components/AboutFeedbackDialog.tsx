import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-easy-icon';
import { Dialog, Paragraph, TouchableRipple, useTheme, Button } from 'react-native-paper';

//App Modules
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';

//Interface
interface IAboutFeedbackDialogProps {
  visible: boolean;
  onPressGithub: () => void;
  onPressEmail: () => void;
  onPressHideDialog: () => void;
}

function AboutFeedbackDialog(props: IAboutFeedbackDialogProps) {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();
  const largeScreenMode = useLargeScreenMode();

  return (
    <Dialog style={[largeScreenMode && styles.cardTablet]} visible={props.visible} onDismiss={props.onPressHideDialog}>
      <Dialog.Title style={{ color: colors.onBackground }}>{t('about.sendFeedback')}</Dialog.Title>
      <Dialog.Content>
        <Paragraph style={[styles.descriptionText, { color: `${colors.onBackground}88` }]}>
          {t('about.sendFeedbackDetail')}
        </Paragraph>
      </Dialog.Content>
      <View style={styles.buttonsContainer}>
        <TouchableRipple
          borderless={true}
          style={[styles.button, { backgroundColor: `${colors.onBackground}33` }]}
          onPress={props.onPressGithub}
          rippleColor="rgba(0, 0, 0, .32)">
          <Icon type="font-awesome-brands" name="github" color={`${colors.onBackground}88`} size={24} />
        </TouchableRipple>
        <TouchableRipple
          borderless={true}
          style={[styles.button, { backgroundColor: `${colors.onBackground}33` }]}
          onPress={props.onPressEmail}
          rippleColor="rgba(0, 0, 0, .32)">
          <Icon type="ionicon" name="mail-outline" color={`${colors.onBackground}88`} size={24} />
        </TouchableRipple>
      </View>
      <Dialog.Actions>
        <Button onPress={props.onPressHideDialog}>{t('general.close')}</Button>
      </Dialog.Actions>
    </Dialog>
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
  buttonsContainer: { flexDirection: 'row', alignSelf: 'center' },
  descriptionText: { fontSize: 16 },
  cardTablet: {
    width: '70%',
    alignSelf: 'center',
  },
});

export default memo(AboutFeedbackDialog);
