import React from 'react';
import { StyleSheet, View, ViewStyle, Image } from 'react-native';

//ThirdParty
import { Button, Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { AppTheme } from 'app/models/theme';

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
  const { colors } = useTheme<AppTheme>();

  return (
    <View
      style={[styles.container, { backgroundColor: `${colors.card}`, shadowColor: `${colors.shadow}` }, props.style]}>
      <Image source={props.icon} style={styles.icon} />
      <Text style={[styles.titleText, { color: colors.onSurface }]}>{props.title}</Text>
      <Text style={[styles.descriptionText, { color: colors.onSurface }]}>{props.description}</Text>
      {props.showLinks && (
        <>
          <Button style={styles.githubButton} onPress={props.onPressGithub}>
            {t('moreApps.appsGithub')}
          </Button>
          <Button style={styles.playstoreButton} onPress={props.onPressPlayStore}>
            {t('moreApps.appsPlayStore')}
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
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 8,
    shadowOpacity: 0.2,
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
