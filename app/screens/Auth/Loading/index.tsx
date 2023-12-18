import React from 'react';

//ThirdParty
import RNBootSplash, { Config } from 'react-native-bootsplash';

//App Modules
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'Loading'>;

const Loading = ({ navigation }: Props) => {
  //Constants

  React.useEffect(() => {
    navigation.replace('HomeTabs', {});
    RNBootSplash.hide({ duration: 500, fade: true } as Config).then(() => {});
  }, [navigation]);

  return null;
};

export default Loading;
