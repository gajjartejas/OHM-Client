import React, { useEffect, useState } from 'react';
import { FlatList, InteractionManager, View } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { Appbar, List, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

//App modules
import Utils from 'app/utils';

//Modals
import styles from './styles';

//Interfaces
export interface ILicense {
  licenses: string;
  repository: string;
  licenseUrl: string;
  parents: string;
}

interface IFinalLicense {
  name: string;
  version: string;
  licenseSpecs: ILicense;
}

//Params
type RootStackParamList = {
  DeviceLists: {};
};
type Props = NativeStackScreenProps<RootStackParamList, 'DeviceLists'>;

const License = ({ navigation }: Props) => {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();

  //States
  let [finalLicense, setFinalLicense] = useState<IFinalLicense[]>([]);

  const onGoBack = () => {
    navigation.pop();
  };

  //npm-license-crawler -onlyDirectDependencies -json licenses.json
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      const licenses: { [id: string]: ILicense } = require('../../../../licenses.json');
      const numberRegex = /\d+(\.\d+)*/;
      const atRegex = /(?:@)/gi;
      let newLicenses: IFinalLicense[] = [];
      for (const licensesKey in licenses) {
        const license = licenses[licensesKey];
        const version = licensesKey.match(numberRegex);
        const nameWithoutVersion = licensesKey.replace(atRegex, '').replace(version ? version[0] : '', '');
        newLicenses.push({ name: nameWithoutVersion, version: version ? version[0] : '', licenseSpecs: license });
      }
      setFinalLicense([...newLicenses]);
    });
  }, []);

  const renderItem = ({ item, index }: { item: IFinalLicense; index: number }) => {
    return (
      <List.Item
        titleStyle={{ color: colors.onSurface }}
        descriptionStyle={{ color: `${colors.onSurface}88` }}
        onPress={() => onPressItem(item, index)}
        title={item.name}
        description={item.version}
        left={props => <List.Icon {...props} color={`${colors.onSurface}88`} icon="web" />}
      />
    );
  };

  const onPressItem = (item: IFinalLicense, _index: number) => {
    Utils.openInAppBrowser(item.licenseSpecs.licenseUrl);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.background }}>
        <Appbar.BackAction onPress={onGoBack} />
        <Appbar.Content title={t('LIBRARIES_TITLE')} subtitle="" />
      </Appbar.Header>
      <View style={styles.subView}>
        <FlatList
          keyboardShouldPersistTaps={'handled'}
          data={finalLicense}
          contentContainerStyle={{}}
          renderItem={renderItem}
          keyExtractor={item => item.name}
        />
      </View>
    </View>
  );
};

export default License;
