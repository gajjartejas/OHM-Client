import * as React from 'react';
import { StyleSheet, View } from 'react-native';

//ThirdParty
import { Text, useTheme } from 'react-native-paper';

//App modules
import { ICardValueViewModel, ICardViewModel } from 'app/models/viewModels/cardValueViewModel';
import { useTranslation } from 'react-i18next';

function CardValueText(props: { text: string; style: any }) {
  //Consts
  const { colors } = useTheme();
  return <Text style={[styles.cardValueText, { color: colors.onSurface }, props.style]}>{props.text}</Text>;
}

function CardValues(props: { value: ICardValueViewModel }) {
  return (
    <View style={styles.cardValuesContainer}>
      <CardValueText style={styles.cardValuesTitle} text={props.value.name} />
      <CardValueText style={styles.cardValuesTitleValue} text={props.value.currentValue} />
      <CardValueText style={styles.cardValuesTitleValue} text={props.value.minValue} />
      <CardValueText style={styles.cardValuesTitleValue} text={props.value.maxValue} />
    </View>
  );
}

function CardTitle(props: { title: string }) {
  //Consts
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.cardValuesContainer}>
      <CardValueText style={[styles.cardValuesTitle, { color: colors.primary }]} text={props.title} />
      <CardValueText style={[styles.cardValuesTitleValue, { color: colors.primary }]} text={t('CURRENT_VALUE')} />
      <CardValueText style={[styles.cardValuesTitleValue, { color: colors.primary }]} text={t('CURRENT_MIN')} />
      <CardValueText style={[styles.cardValuesTitleValue, { color: colors.primary }]} text={t('CURRENT_MAX')} />
    </View>
  );
}

const CardLeftTitle = (props: { value: ICardViewModel }) => {
  //Consts
  const { colors } = useTheme();
  return (
    <View style={[styles.cardLeftTitleContainer, { backgroundColor: colors.surface }]}>
      <CardTitle title={props.value.title} />
      {props.value.values?.map(v => {
        return <CardValues key={v.id.toString()} value={v} />;
      })}
    </View>
  );
};

const CardSection = (props: { value: ICardViewModel; root: boolean }) => {
  const { colors } = useTheme();
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={[styles.cardSectionContainer, { marginTop: props.root ? 12 : 6, paddingBottom: props.root ? 16 : 0 }]}>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <Text style={[styles.cardSectionText, { fontSize: props.root ? 16 : 14, color: colors.primary }]}>
        {props.value.title}
      </Text>
      {props.value.sections?.map(v => {
        return v.sections != null ? (
          <CardSection key={v.id} value={v} root={false} />
        ) : (
          <CardLeftTitle key={v.id.toString()} value={v} />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  cardValueText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardValuesContainer: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  cardValuesTitle: {
    width: '32%',
  },
  cardValuesTitleValue: {
    width: '22%',
  },
  cardLeftTitleContainer: {
    borderRadius: 4,
    marginTop: 8,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  cardLeftTitleText: { fontSize: 12, fontWeight: 'bold' },
  cardSectionContainer: {
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  cardSectionText: { fontWeight: 'bold' },
});

export default CardSection;
