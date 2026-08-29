import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle, Image } from 'react-native';

//ThirdParty
import {
  IconButton,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';

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
    <TouchableRipple
      onPress={props.onPressPlayStore}
      style={[
        styles.container,
        { backgroundColor: `${colors.card}`, shadowColor: `${colors.shadow}` },
        props.style,
      ]}
    >
      <View>
        <View style={styles.titleImageTextContainer}>
          <Image
            source={props.icon}
            style={[styles.icon, { borderColor: colors.backdrop }]}
          />
          <Text style={[styles.titleText, { color: colors.onSurface }]}>
            {props.title}
          </Text>
          {props.showLinks && (
            <View style={styles.buttonContainer}>
              <IconButton
                icon={'github'}
                style={styles.githubButton}
                onPress={props.onPressGithub}
              />
            </View>
          )}
        </View>
        <Text style={[styles.descriptionText, { color: colors.onSurface }]}>
          {props.description}
        </Text>
      </View>
    </TouchableRipple>
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
  titleImageTextContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
  },
  titleText: {
    fontWeight: '600',
    fontSize: 18,
    marginHorizontal: 16,
    flex: 1,
  },
  descriptionText: {
    marginTop: 12,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  githubButton: {
    alignSelf: 'center',
  },
  playstoreButton: {
    alignSelf: 'center',
  },
});

export default memo(MoreAppCard);
