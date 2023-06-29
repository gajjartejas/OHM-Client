import React from 'react';
import { ScrollView, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

interface iAppBaseViewProps {
  children: any;
  style: ViewStyle | ViewStyle[];
  edges?: Edge[] | undefined;
  scroll?: boolean | undefined;
}

const AppBaseView = (props: iAppBaseViewProps) => {
  const { children, style, edges, scroll } = props;
  return (
    <SafeAreaView edges={edges} style={style}>
      {scroll ? <ScrollView>{children}</ScrollView> : children}
    </SafeAreaView>
  );
};

export default AppBaseView;
