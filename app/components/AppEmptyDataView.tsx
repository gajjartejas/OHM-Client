import React from 'react';
import { StyleSheet, View } from 'react-native';

//ThirdParty
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-easy-icon';
import { IconType } from 'react-native-easy-icon/src/Icon';

//Interface
interface IAppEmptyDataViewProps {
  iconName: string;
  iconType: IconType;
  header: string;
  subHeader: string;
  style: any;
  renderContent?: () => JSX.Element;
}

function AppEmptyDataView(props: IAppEmptyDataViewProps) {
  //Consts
  const { colors } = useTheme();

  return (
    <View style={[styles.container, props.style]}>
      <Icon type={props.iconType} name={props.iconName} color={`${colors.onBackground}66`} size={100} />
      <Text style={[styles.headerText, { color: `${colors.onBackground}CC` }]}>{props.header}</Text>
      {!!props.subHeader && (
        <Text style={[styles.subhHeaderText, { color: `${colors.onBackground}66` }]}>{props.subHeader}</Text>
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
    marginTop: 8,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
  subhHeaderText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default AppEmptyDataView;
