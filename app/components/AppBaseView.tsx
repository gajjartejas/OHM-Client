import React, { memo } from 'react';
import { ScrollView, ViewProps, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

interface iAppBaseViewProps extends ViewProps {
  children: any;
  style: ViewStyle | ViewStyle[];
  edges?: Edge[] | undefined;
  scroll?: boolean | undefined;
}

const AppBaseView = (props: iAppBaseViewProps) => {
  const { children, style, edges, scroll, ...other } = props;
  return (
    <SafeAreaView edges={edges} style={style} {...other}>
      {scroll ? <ScrollView>{children}</ScrollView> : children}
    </SafeAreaView>
  );
};

export default memo(AppBaseView);
