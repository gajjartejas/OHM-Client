import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image } from 'react-native';

//ThirdParty
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { List, useTheme } from 'react-native-paper';

//App modules
import styles from './styles';
import Components from 'app/components';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import { AppTheme } from 'app/models/theme';
import AppHeader from 'app/components/AppHeader';
import useLargeScreenMode from 'app/hooks/useLargeScreenMode';
import useAppLangConfigStore from 'app/store/appLangConfig';
import i18n, { SUPPORTED_LANGUAGES } from 'app/locales';

//Interfaces
interface IChangeLanguage {
  id: number;
  icon: any;
  language: string;
  translators: string[];
  code: string;
  selected: boolean;
}

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'ChangeLanguage'>;

const ChangeLanguage = ({ navigation }: Props) => {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme<AppTheme>();
  const largeScreenMode = useLargeScreenMode();
  const selectedLanguageCode = useAppLangConfigStore(store => store.selectedLanguageCode);
  const setSelectedLanguageCode = useAppLangConfigStore(store => store.setSelectedLanguageCode);

  //States
  const [finalLicense, setFinalLicense] = useState<IChangeLanguage[]>([]);

  useEffect(() => {
    const languages = SUPPORTED_LANGUAGES.map(v => {
      return {
        ...v,
        selected: v.code === selectedLanguageCode,
      };
    });

    setFinalLicense(languages);
  }, [selectedLanguageCode]);

  const onGoBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const renderItem = ({ item, index }: { item: IChangeLanguage; index: number }) => {
    return (
      <List.Item
        style={[styles.listItemContainer, { backgroundColor: `${colors.onBackground}20` }]}
        titleStyle={{ color: colors.onSurface }}
        descriptionStyle={{ color: `${colors.onSurface}88` }}
        onPress={() => onPressItem(item, index)}
        title={item.language}
        description={item.translators.join(', ')}
        left={() => <Image source={item.icon} style={styles.listItemImage} />}
        right={props => (item.selected ? <List.Icon {...props} icon="check" color={colors.primary} /> : null)}
      />
    );
  };

  const onPressItem = useCallback(
    (item: IChangeLanguage, _index: number) => {
      setSelectedLanguageCode(item.code);
      i18n.changeLanguage(item.code).then(() => {});
      navigation.pop();
    },
    [navigation, setSelectedLanguageCode],
  );

  return (
    <Components.AppBaseView
      edges={['left', 'right', 'top']}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        showBackButton={true}
        onPressBackButton={onGoBack}
        title={t('changeLanguageScreen.title')}
        style={{ backgroundColor: colors.background }}
      />

      <Components.AppBaseView edges={[]} style={styles.safeArea}>
        <FlatList
          contentContainerStyle={[largeScreenMode && styles.cardTablet]}
          style={styles.flatlist}
          keyboardShouldPersistTaps={'handled'}
          data={finalLicense}
          renderItem={renderItem}
          keyExtractor={(item, _index) => item.id.toString()}
        />
      </Components.AppBaseView>
    </Components.AppBaseView>
  );
};

export default ChangeLanguage;
