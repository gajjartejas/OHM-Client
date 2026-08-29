import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  TouchableRipple,
  useTheme,
  Button,
  Portal,
  Text,
} from 'react-native-paper';

//App Modules
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';
import CommonIcon from 'app/components/CommonIcon';

//Interface
interface IAboutFeedbackDialogProps {
  visible: boolean;
  onPressGithub: () => void;
  onPressGithubDiscussion: () => void;
  onPressHideDialog: () => void;
}

function AboutFeedbackDialog(props: IAboutFeedbackDialogProps) {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();
  const largeScreenMode = useLargeScreenMode();

  return (
    <Portal>
      <Dialog
        style={[largeScreenMode && styles.cardTablet]}
        visible={props.visible}
        onDismiss={props.onPressHideDialog}
      >
        <Dialog.Title style={{ color: colors.onBackground }}>
          {t('about.sendFeedback')}
        </Dialog.Title>
        <Dialog.Content>
          <Text
            variant={'bodySmall'}
            style={[
              styles.descriptionText,
              { color: `${colors.onBackground}88` },
            ]}
          >
            {t('about.sendFeedbackDetail')}
          </Text>
        </Dialog.Content>
        <View style={styles.buttonsContainer}>
          <TouchableRipple
            borderless={true}
            style={[
              styles.button,
              { backgroundColor: `${colors.onBackground}33` },
            ]}
            onPress={props.onPressGithub}
            rippleColor="rgba(0, 0, 0, .32)"
          >
            <CommonIcon
              type="material"
              name="code-tags"
              color={`${colors.onBackground}88`}
              size={24}
            />
          </TouchableRipple>
          <TouchableRipple
            borderless={true}
            style={[
              styles.button,
              { backgroundColor: `${colors.onBackground}33` },
            ]}
            onPress={props.onPressGithubDiscussion}
            rippleColor="rgba(0, 0, 0, .32)"
          >
            <CommonIcon
              type="material"
              name="forum"
              color={`${colors.onBackground}88`}
              size={24}
            />
          </TouchableRipple>
        </View>
        <Dialog.Actions>
          <Button onPress={props.onPressHideDialog}>
            {t('general.close')}
          </Button>
        </Dialog.Actions>
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
});

export default memo(AboutFeedbackDialog);
