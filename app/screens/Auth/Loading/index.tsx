import React from 'react';

//ThirdParty
import RNBootSplash, { Config } from 'react-native-bootsplash';

//Redux
import { useDispatch } from 'react-redux';

//App Modules
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'Loading'>;

const Loading = ({ navigation }: Props) => {
  //Constants
  const dispatch = useDispatch();

  React.useEffect(() => {
    navigation.replace('HomeTabs', {});

    RNBootSplash.hide({ duration: 500, fade: true } as Config).then(() => {});
  }, [dispatch, navigation]);

  return null;
};

export default Loading;
