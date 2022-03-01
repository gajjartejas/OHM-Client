import React from 'react';
import { View } from 'react-native';

//App modules
import styles from './styles';

export type Props = {
  children: JSX.Element[] | JSX.Element;
};

const AppManager = ({ children }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.container}>{children}</View>
    </View>
  );
};

export default AppManager;
