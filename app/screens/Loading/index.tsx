import React from 'react';

//App Modules
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'Loading'>;

const Loading = ({ navigation }: Props) => {
  //Constants

  React.useEffect(() => {
    navigation.replace('HomeTabs', {});
  }, [navigation]);

  return null;
};

export default Loading;
