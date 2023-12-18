import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle, Image } from 'react-native';

//ThirdParty
import { IconButton, Text, useTheme } from 'react-native-paper';

//App Modules
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
  const { colors } = useTheme<AppTheme>();

  return (
    <View
      style={[styles.container, { backgroundColor: `${colors.card}`, shadowColor: `${colors.shadow}` }, props.style]}>
      <Image source={props.icon} style={styles.icon} />
      <Text style={[styles.titleText, { color: colors.onSurface }]}>{props.title}</Text>
      <Text style={[styles.descriptionText, { color: colors.onSurface }]}>{props.description}</Text>
      {props.showLinks && (
        <View style={styles.buttonContainer}>
          <IconButton icon={'github'} style={styles.githubButton} onPress={props.onPressGithub} />
          <IconButton icon={'android'} style={styles.playstoreButton} onPress={props.onPressPlayStore} />
        </View>
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
  icon: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
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
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 12,
  },
  githubButton: {
    alignSelf: 'center',
  },
  playstoreButton: {
    alignSelf: 'center',
  },
});

export default memo(MoreAppCard);
