import React from 'react';
import { StyleSheet, View, ViewStyle, Image } from 'react-native';

//ThirdParty
import { Button, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

//Interface
interface IMoreAppCard {
  style?: ViewStyle;
  icon: any;
  title: string;
  description: string;
  onPressGithub: () => void;
  onPressPlayStore: () => void;
  showLinks: boolean;
}

function MoreAppCard(props: IMoreAppCard) {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: `${colors.surface}` }, props.style]}>
      <Image source={props.icon} style={styles.icon} />
      <Text style={[styles.titleText, { color: colors.onSurface }]}>{props.title}</Text>
      <Text style={[styles.descriptionText, { color: colors.onSurface }]}>{props.description}</Text>
      {props.showLinks && (
        <>
          <Button style={styles.githubButton} onPress={props.onPressGithub}>
            {t('MORE_APP_GITHUB')}
          </Button>
          <Button style={styles.playstoreButton} onPress={props.onPressPlayStore}>
            {t('MORE_APP_PLAY_STORE')}
          </Button>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 8,
  },
  icon: { alignSelf: 'center', width: 80, height: 80, borderRadius: 40 },
  titleText: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 12,
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 16,
  },
  descriptionText: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
    marginHorizontal: 16,
  },
  githubButton: { alignSelf: 'center', marginTop: 12 },
  playstoreButton: { alignSelf: 'center' },
});

export default MoreAppCard;
