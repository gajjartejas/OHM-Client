import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native';

//ThirdParty
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Button, List, useTheme } from 'react-native-paper';

//App modules
import Config from 'app/config';
import styles from './styles';
import Components from 'app/components';
import { LoggedInTabNavigatorParams } from 'app/navigation/types';
import Utils from 'app/utils';
import { AppTheme } from 'app/models/theme';
import AppHeader from 'app/components/AppHeader';

//Interfaces
interface ITranslator {
  id: number;
  icon: any;
  language: string;
  translators: string[];
}

//Params
type Props = NativeStackScreenProps<LoggedInTabNavigatorParams, 'Translators'>;

const Translators = ({ navigation }: Props) => {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme<AppTheme>();

  //States
  let [finalLicense, setFinalLicense] = useState<ITranslator[]>([]);

  useEffect(() => {
    let languages = [
      { id: 0, icon: Config.Images.icons.flag_ar, translators: [], language: 'العربية' },
      { id: 1, icon: Config.Images.icons.flag_cs, translators: [], language: 'čeština' },
      { id: 2, icon: Config.Images.icons.flag_da, translators: [], language: 'dansk' },
      { id: 3, icon: Config.Images.icons.flag_de, translators: [], language: 'Deutsch' },
      { id: 4, icon: Config.Images.icons.flag_el, translators: [], language: 'Ελληνικά' },
      { id: 6, icon: Config.Images.icons.flag_es, translators: [], language: 'Español' },
      { id: 7, icon: Config.Images.icons.flag_et, translators: [], language: 'eesti' },
      { id: 8, icon: Config.Images.icons.flag_fa, translators: [], language: 'فارسی' },
      { id: 9, icon: Config.Images.icons.flag_he, translators: [], language: 'עברית' },
      { id: 10, icon: Config.Images.icons.flag_hi, translators: [], language: 'हिन्दी' },
      { id: 11, icon: Config.Images.icons.flag_hu, translators: [], language: 'magyar' },
      { id: 12, icon: Config.Images.icons.flag_id, translators: [], language: 'Bahasa Indonesia' },
      { id: 13, icon: Config.Images.icons.flag_it, translators: [], language: 'Italiano' },
      { id: 14, icon: Config.Images.icons.flag_ja, translators: [], language: '日本語 (にほんご)' },
      { id: 15, icon: Config.Images.icons.flag_ko, translators: [], language: '한국어' },
      { id: 16, icon: Config.Images.icons.flag_ms, translators: [], language: 'Bahasa Melayu' },
      { id: 17, icon: Config.Images.icons.flag_nl, translators: [], language: 'Nederlands' },
      { id: 18, icon: Config.Images.icons.flag_no, translators: [], language: 'Norsk' },
      { id: 19, icon: Config.Images.icons.flag_pl, translators: [], language: 'język polski' },
      { id: 20, icon: Config.Images.icons.flag_pt_pt, translators: [], language: 'Português' },
      { id: 21, icon: Config.Images.icons.flag_pt_br, translators: [], language: 'Português (Brasil)' },
      { id: 22, icon: Config.Images.icons.flag_ro, translators: [], language: 'Română' },
      { id: 23, icon: Config.Images.icons.flag_ru, translators: [], language: 'русский' },
      { id: 24, icon: Config.Images.icons.flag_sk, translators: [], language: 'slovenčina' },
      { id: 25, icon: Config.Images.icons.flag_tr, translators: [], language: 'Türkçe' },
      { id: 26, icon: Config.Images.icons.flag_uk, translators: [], language: 'Українська' },
      { id: 27, icon: Config.Images.icons.flag_vi, translators: [], language: 'Tiếng Việt' },
      { id: 28, icon: Config.Images.icons.flag_zh_cn, translators: [], language: '中文' },
    ].filter(v => v.translators.length > 0);

    setFinalLicense(languages);
  }, []);

  const onGoBack = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const renderItem = ({ item, index }: { item: ITranslator; index: number }) => {
    return (
      <List.Item
        style={[styles.listItemContainer, { backgroundColor: colors.surface }]}
        titleStyle={{ color: colors.onSurface }}
        descriptionStyle={{ color: `${colors.onSurface}88` }}
        onPress={() => onPressItem(item, index)}
        title={item.language}
        description={item.translators.join(', ')}
        left={() => <Image source={item.icon} style={styles.listItemImage} />}
      />
    );
  };

  const onPressItem = (_item: ITranslator, _index: number) => {};

  const onPressContribute = async () => {
    await Utils.openInAppBrowser(Config.Constants.TRANSLATE_APP);
  };

  const EmptyListComponent = (
    <View style={styles.emptyListContainer}>
      <Text style={[styles.titleTextStyle, { color: `${colors.onBackground}${colors.opacity}` }]}>
        {t('translatorsScreen.emptyList')}
      </Text>
      <Button icon="web" mode="text" onPress={onPressContribute}>
        {t('translatorsScreen.emptyListAction')}
      </Button>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        showBackButton={true}
        onPressBackButton={onGoBack}
        title={t('translatorsScreen.title')}
        style={{ backgroundColor: colors.background }}
      />

      <Components.AppBaseView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
        <FlatList
          contentContainerStyle={styles.cardTablet}
          style={styles.flatlist}
          keyboardShouldPersistTaps={'handled'}
          data={finalLicense}
          renderItem={renderItem}
          keyExtractor={(item, _index) => item.id.toString()}
          ListEmptyComponent={EmptyListComponent}
        />
      </Components.AppBaseView>
    </View>
  );
};

export default Translators;
