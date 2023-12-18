import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

//ThirdParty
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-easy-icon';
import { IconType } from 'react-native-easy-icon/src/Icon';

//Interface
interface IAppEmptyDataViewProps {
  iconName?: string | null;
  iconType?: IconType;
  header?: string | null;
  subHeader?: string | null;
  style: ViewStyle;
  renderContent?: () => React.JSX.Element;
}

function AppEmptyDataView(props: IAppEmptyDataViewProps) {
  //Const
  const { colors } = useTheme();

  return (
    <View style={[styles.container, props.style]}>
      {props.iconName && props.iconType && (
        <Icon type={props.iconType} name={props.iconName} color={`${colors.onBackground}66`} size={70} />
      )}
      {!!props.header && <Text style={[styles.headerText, { color: `${colors.onBackground}CC` }]}>{props.header}</Text>}
      {!!props.subHeader && (
        <Text style={[styles.subHeaderText, { color: `${colors.onBackground}66` }]}>{props.subHeader}</Text>
      )}
      {props.renderContent ? props.renderContent() : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    marginTop: 16,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 22,
  },
  subHeaderText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default memo(AppEmptyDataView);
