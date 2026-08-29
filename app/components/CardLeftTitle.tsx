import React, { memo, useCallback, useRef } from 'react';
import {
  LayoutChangeEvent,
  Platform,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';

// ThirdParty
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

// App modules
import {
  ICardValueViewModel,
  ICardViewModel,
} from 'app/models/viewModels/cardValueViewModel';
import { AppTheme } from 'app/models/theme';
import useAppConfigStore from 'app/store/appConfig';
import CommonIcon, { IconType } from './CommonIcon';

// Smooth, natural easing curve
const ACCORDION_EASING = Easing.inOut(Easing.ease);
const ANIMATION_DURATION = 260;

interface IconConfig {
  name: string;
  type: IconType;
  color: string;
  bgColor: string;
}

const getHardwareIconConfig = (title: string, dark: boolean): IconConfig => {
  const lower = title.toLowerCase();
  if (
    lower.startsWith('cpu') ||
    lower.includes('intel core') ||
    lower.includes('ryzen') ||
    lower.includes('xeon') ||
    lower.includes('processor')
  ) {
    return {
      name: 'cpu-64-bit',
      type: 'material',
      color: dark ? '#60A5FA' : '#2563EB',
      bgColor: dark ? 'rgba(96, 165, 250, 0.18)' : 'rgba(37, 99, 235, 0.12)',
    };
  }
  if (
    lower.startsWith('memory') ||
    lower.startsWith('ram') ||
    lower.includes('dimm') ||
    lower.includes('memory')
  ) {
    return {
      name: 'memory',
      type: 'material',
      color: dark ? '#34D399' : '#059669',
      bgColor: dark ? 'rgba(52, 211, 153, 0.18)' : 'rgba(5, 150, 105, 0.12)',
    };
  }
  if (
    lower.startsWith('gpu') ||
    lower.includes('graphics') ||
    lower.includes('nvidia') ||
    lower.includes('geforce') ||
    lower.includes('radeon') ||
    lower.includes('uhd graphics')
  ) {
    return {
      name: 'expansion-card',
      type: 'material',
      color: dark ? '#A78BFA' : '#7C3AED',
      bgColor: dark ? 'rgba(167, 139, 250, 0.18)' : 'rgba(124, 58, 237, 0.12)',
    };
  }
  if (
    lower.startsWith('storage') ||
    lower.startsWith('hdd') ||
    lower.includes('nvme') ||
    lower.includes('ssd') ||
    lower.includes('wd_black') ||
    lower.includes('disk')
  ) {
    return {
      name: 'harddisk',
      type: 'material',
      color: dark ? '#F472B6' : '#DB2777',
      bgColor: dark ? 'rgba(244, 114, 182, 0.18)' : 'rgba(219, 39, 119, 0.12)',
    };
  }
  if (
    lower.startsWith('network') ||
    lower.startsWith('nic') ||
    lower.includes('wi-fi') ||
    lower.includes('wifi') ||
    lower.includes('ethernet') ||
    lower.includes('connection')
  ) {
    return {
      name: 'wifi',
      type: 'material',
      color: dark ? '#22D3EE' : '#0891B2',
      bgColor: dark ? 'rgba(34, 211, 238, 0.18)' : 'rgba(8, 145, 178, 0.12)',
    };
  }
  if (lower.startsWith('battery') || lower.includes('battery')) {
    return {
      name: 'battery-charging-100',
      type: 'material',
      color: dark ? '#4ADE80' : '#16A34A',
      bgColor: dark ? 'rgba(74, 222, 128, 0.18)' : 'rgba(22, 163, 74, 0.12)',
    };
  }
  if (
    lower.startsWith('motherboard') ||
    lower.startsWith('mainboard') ||
    lower.includes('superio') ||
    lower.includes('chipset')
  ) {
    return {
      name: 'developer-board',
      type: 'material',
      color: dark ? '#FBBF24' : '#D97706',
      bgColor: dark ? 'rgba(251, 191, 36, 0.18)' : 'rgba(217, 119, 6, 0.12)',
    };
  }
  if (lower.startsWith('cooler') || lower.includes('fan')) {
    return {
      name: 'fan',
      type: 'material',
      color: dark ? '#38BDF8' : '#0284C7',
      bgColor: dark ? 'rgba(56, 189, 248, 0.18)' : 'rgba(2, 132, 199, 0.12)',
    };
  }
  if (lower.startsWith('psu') || lower.includes('power supply')) {
    return {
      name: 'power-plug',
      type: 'material',
      color: dark ? '#F87171' : '#DC2626',
      bgColor: dark ? 'rgba(248, 113, 113, 0.18)' : 'rgba(220, 38, 38, 0.12)',
    };
  }
  return {
    name: 'chip',
    type: 'material',
    color: dark ? '#818CF8' : '#6366F1',
    bgColor: dark ? 'rgba(129, 140, 248, 0.18)' : 'rgba(99, 102, 241, 0.12)',
  };
};

const getSensorGroupIconConfig = (title: string, dark: boolean): IconConfig => {
  const lower = title.toLowerCase();
  if (lower.includes('temperature')) {
    return {
      name: 'thermometer',
      type: 'material',
      color: dark ? '#F87171' : '#EF4444',
      bgColor: dark ? 'rgba(248, 113, 113, 0.18)' : 'rgba(239, 68, 68, 0.12)',
    };
  }
  if (lower.includes('voltage')) {
    return {
      name: 'flash',
      type: 'material',
      color: dark ? '#FBBF24' : '#F59E0B',
      bgColor: dark ? 'rgba(251, 191, 36, 0.18)' : 'rgba(245, 158, 11, 0.12)',
    };
  }
  if (lower.includes('power')) {
    return {
      name: 'lightning-bolt',
      type: 'material',
      color: dark ? '#FB923C' : '#F97316',
      bgColor: dark ? 'rgba(251, 146, 60, 0.18)' : 'rgba(249, 115, 22, 0.12)',
    };
  }
  if (lower.includes('clock') || lower.includes('frequency')) {
    return {
      name: 'speedometer',
      type: 'material',
      color: dark ? '#60A5FA' : '#3B82F6',
      bgColor: dark ? 'rgba(96, 165, 250, 0.18)' : 'rgba(59, 130, 246, 0.12)',
    };
  }
  if (lower.includes('load')) {
    return {
      name: 'chart-donut',
      type: 'material',
      color: dark ? '#818CF8' : '#6366F1',
      bgColor: dark ? 'rgba(129, 140, 248, 0.18)' : 'rgba(99, 102, 241, 0.12)',
    };
  }
  if (lower.includes('fan')) {
    return {
      name: 'fan',
      type: 'material',
      color: dark ? '#22D3EE' : '#06B6D4',
      bgColor: dark ? 'rgba(34, 211, 238, 0.18)' : 'rgba(6, 182, 212, 0.12)',
    };
  }
  if (lower.includes('flow') || lower.includes('humidity')) {
    return {
      name: 'water-percent',
      type: 'material',
      color: dark ? '#38BDF8' : '#0EA5E9',
      bgColor: dark ? 'rgba(56, 189, 248, 0.18)' : 'rgba(14, 165, 233, 0.12)',
    };
  }
  if (lower.includes('control')) {
    return {
      name: 'tune',
      type: 'material',
      color: dark ? '#C084FC' : '#A855F7',
      bgColor: dark ? 'rgba(192, 132, 252, 0.18)' : 'rgba(168, 85, 247, 0.12)',
    };
  }
  if (lower.includes('level')) {
    return {
      name: 'gauge',
      type: 'material',
      color: dark ? '#2DD4BF' : '#14B8A6',
      bgColor: dark ? 'rgba(45, 212, 191, 0.18)' : 'rgba(20, 184, 166, 0.12)',
    };
  }
  if (lower.includes('data')) {
    return {
      name: 'database',
      type: 'material',
      color: dark ? '#A78BFA' : '#8B5CF6',
      bgColor: dark ? 'rgba(167, 139, 250, 0.18)' : 'rgba(139, 92, 246, 0.12)',
    };
  }
  if (lower.includes('throughput') || lower.includes('speed')) {
    return {
      name: 'swap-vertical',
      type: 'material',
      color: dark ? '#38BDF8' : '#0284C7',
      bgColor: dark ? 'rgba(56, 189, 248, 0.18)' : 'rgba(2, 132, 199, 0.12)',
    };
  }
  if (lower.includes('timing')) {
    return {
      name: 'timer-outline',
      type: 'material',
      color: dark ? '#FB7185' : '#E11D48',
      bgColor: dark ? 'rgba(251, 113, 133, 0.18)' : 'rgba(225, 29, 72, 0.12)',
    };
  }
  if (lower.includes('current')) {
    return {
      name: 'current-ac',
      type: 'material',
      color: dark ? '#FACC15' : '#CA8A04',
      bgColor: dark ? 'rgba(250, 204, 21, 0.18)' : 'rgba(202, 138, 4, 0.12)',
    };
  }
  if (lower.includes('capacit') || lower.includes('energy')) {
    return {
      name: 'battery-arrow-up',
      type: 'material',
      color: dark ? '#34D399' : '#10B981',
      bgColor: dark ? 'rgba(52, 211, 153, 0.18)' : 'rgba(16, 185, 129, 0.12)',
    };
  }
  if (lower.includes('factor')) {
    return {
      name: 'numeric',
      type: 'material',
      color: dark ? '#94A3B8' : '#64748B',
      bgColor: dark ? 'rgba(148, 163, 184, 0.18)' : 'rgba(100, 116, 139, 0.12)',
    };
  }
  return {
    name: 'chip',
    type: 'material',
    color: dark ? '#818CF8' : '#6366F1',
    bgColor: dark ? 'rgba(129, 140, 248, 0.18)' : 'rgba(99, 102, 241, 0.12)',
  };
};

const CardValueText = memo(
  (props: {
    text: string;
    style?: StyleProp<TextStyle>;
    numberOfLines?: number;
  }) => {
    const { colors } = useTheme<AppTheme>();
    return (
      <Text
        numberOfLines={props.numberOfLines ?? 1}
        style={[styles.cardValueText, { color: colors.onSurface }, props.style]}
      >
        {props.text}
      </Text>
    );
  },
);
CardValueText.displayName = 'CardValueText';

const SensorTableRow = memo(
  (props: {
    value: ICardValueViewModel;
    isLast: boolean;
    showMinValue: boolean;
    showMaxValue: boolean;
    dark: boolean;
  }) => {
    const { value, isLast, showMinValue, showMaxValue, dark } = props;
    const currentHighlightColor = dark ? '#60A5FA' : '#0284C7';
    const mutedTextColor = dark ? '#94A3B8' : '#64748B';

    let nameColStyle = styles.colName2;
    let valColStyle = styles.colValue2;

    if (showMinValue && showMaxValue) {
      nameColStyle = styles.colName4;
      valColStyle = styles.colValue4;
    } else if (showMinValue || showMaxValue) {
      nameColStyle = styles.colName3;
      valColStyle = styles.colValue3;
    }

    return (
      <View
        style={[
          styles.tableRow,
          !isLast && {
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: dark
              ? 'rgba(255, 255, 255, 0.07)'
              : 'rgba(0, 0, 0, 0.05)',
          },
        ]}
      >
        <CardValueText
          numberOfLines={1}
          style={nameColStyle}
          text={value.name}
        />
        {showMinValue && (
          <CardValueText
            numberOfLines={1}
            style={[valColStyle, { color: mutedTextColor }]}
            text={value.minValue}
          />
        )}
        <CardValueText
          numberOfLines={1}
          style={[
            valColStyle,
            styles.colHighlight,
            { color: currentHighlightColor },
          ]}
          text={value.currentValue}
        />
        {showMaxValue && (
          <CardValueText
            numberOfLines={1}
            style={[valColStyle, { color: mutedTextColor }]}
            text={value.maxValue}
          />
        )}
      </View>
    );
  },
);
SensorTableRow.displayName = 'SensorTableRow';

const CategoryCard = memo((props: { value: ICardViewModel }) => {
  const { colors, dark } = useTheme<AppTheme>();
  const { t } = useTranslation();
  const showMinValue = useAppConfigStore(state => state.showMinValue);
  const showMaxValue = useAppConfigStore(state => state.showMaxValue);

  const measuredHeight = useSharedValue(0);
  const isExpanded = useRef(true);
  const progress = useSharedValue(1);

  const toggleExpand = useCallback(() => {
    isExpanded.current = !isExpanded.current;
    progress.value = withTiming(isExpanded.current ? 1 : 0, {
      duration: ANIMATION_DURATION,
      easing: ACCORDION_EASING,
    });
  }, [progress]);

  const chevronAnimatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(progress.value, [0, 1], [-180, 0]);
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const collapsibleAnimatedStyle = useAnimatedStyle(() => {
    if (measuredHeight.value === 0) {
      return {
        opacity: progress.value,
      };
    }
    return {
      height: interpolate(progress.value, [0, 1], [0, measuredHeight.value]),
      opacity: interpolate(progress.value, [0, 0.15, 1], [0, 0.5, 1]),
    };
  });

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const h = e.nativeEvent.layout.height;
      if (h > 0 && Math.abs(h - measuredHeight.value) > 0.5) {
        measuredHeight.value = h;
      }
    },
    [measuredHeight],
  );

  const iconConfig = getSensorGroupIconConfig(props.value.title, dark);
  const currentHeaderColor = dark ? '#60A5FA' : '#0284C7';
  const tableHeaderTextColor = dark ? '#CBD5E1' : '#64748B';

  let headerNameStyle = styles.colName2;
  let headerValStyle = styles.colValue2;

  if (showMinValue && showMaxValue) {
    headerNameStyle = styles.colName4;
    headerValStyle = styles.colValue4;
  } else if (showMinValue || showMaxValue) {
    headerNameStyle = styles.colName3;
    headerValStyle = styles.colValue3;
  }

  return (
    <View
      style={[
        styles.categoryContainer,
        {
          backgroundColor: dark ? '#282828' : '#F1F5F9',
          borderColor: dark
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.06)',
        },
      ]}
    >
      {/* Category Header */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleExpand}
        style={styles.categoryHeader}
      >
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.categoryIconBadge,
              { backgroundColor: iconConfig.bgColor },
            ]}
          >
            <CommonIcon
              type={iconConfig.type}
              name={iconConfig.name}
              size={15}
              color={iconConfig.color}
            />
          </View>
          <Text
            variant="titleSmall"
            numberOfLines={1}
            style={[styles.categoryTitleText, { color: colors.onSurface }]}
          >
            {props.value.title}
          </Text>
        </View>

        <Animated.View style={chevronAnimatedStyle}>
          <CommonIcon
            type="material"
            name="chevron-down"
            size={20}
            color={colors.onSurfaceVariant || (dark ? '#94A3B8' : '#64748B')}
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Collapsible Animated Table Content */}
      <Animated.View
        style={[
          { overflow: 'hidden' },
          collapsibleAnimatedStyle,
        ]}
      >
        <View onLayout={onLayout} style={styles.tableContainer}>
          {/* Table Header */}
          <View
            style={[
              styles.tableHeaderRow,
              {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: dark
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.08)',
              },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                headerNameStyle,
                styles.tableHeaderCol,
                { color: tableHeaderTextColor },
              ]}
            >
              {t('deviceInfo.card.name') || 'SENSOR'}
            </Text>
            {showMinValue && (
              <Text
                numberOfLines={1}
                style={[
                  headerValStyle,
                  styles.tableHeaderCol,
                  styles.tableHeaderRight,
                  { color: tableHeaderTextColor },
                ]}
              >
                {t('deviceInfo.card.min')}
              </Text>
            )}
            <Text
              numberOfLines={1}
              style={[
                headerValStyle,
                styles.tableHeaderCol,
                styles.tableHeaderRight,
                styles.tableHeaderHighlight,
                { color: currentHeaderColor },
              ]}
            >
              {t('deviceInfo.card.current')}
            </Text>
            {showMaxValue && (
              <Text
                numberOfLines={1}
                style={[
                  headerValStyle,
                  styles.tableHeaderCol,
                  styles.tableHeaderRight,
                  { color: tableHeaderTextColor },
                ]}
              >
                {t('deviceInfo.card.max')}
              </Text>
            )}
          </View>

          {/* Sensor Rows */}
          {props.value.values?.map((v, idx) => (
            <SensorTableRow
              key={v.id.toString()}
              value={v}
              showMinValue={showMinValue}
              showMaxValue={showMaxValue}
              dark={dark}
              isLast={idx === (props.value.values?.length ?? 0) - 1}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
});
CategoryCard.displayName = 'CategoryCard';

const CardSection = (props: { value: ICardViewModel; root: boolean }) => {
  const { colors, dark } = useTheme<AppTheme>();
  const measuredHeight = useSharedValue(0);
  const isExpanded = useRef(true);
  const progress = useSharedValue(1);

  const toggleExpand = useCallback(() => {
    isExpanded.current = !isExpanded.current;
    progress.value = withTiming(isExpanded.current ? 1 : 0, {
      duration: ANIMATION_DURATION,
      easing: ACCORDION_EASING,
    });
  }, [progress]);

  const chevronAnimatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(progress.value, [0, 1], [-180, 0]);
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const collapsibleAnimatedStyle = useAnimatedStyle(() => {
    if (measuredHeight.value === 0) {
      return {
        opacity: progress.value,
      };
    }
    return {
      height: interpolate(progress.value, [0, 1], [0, measuredHeight.value]),
      opacity: interpolate(progress.value, [0, 0.15, 1], [0, 0.5, 1]),
    };
  });

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const h = e.nativeEvent.layout.height;
      if (h > 0 && Math.abs(h - measuredHeight.value) > 0.5) {
        measuredHeight.value = h;
      }
    },
    [measuredHeight],
  );

  // If this node has direct values without sections, render as CategoryCard
  if (
    props.value.values &&
    props.value.values.length > 0 &&
    !props.value.sections
  ) {
    return <CategoryCard value={props.value} />;
  }

  const iconConfig = getHardwareIconConfig(props.value.title, dark);

  return (
    <View
      style={[
        styles.hardwareCardContainer,
        {
          backgroundColor: dark ? '#1E1E1E' : '#FFFFFF',
          borderColor: dark
            ? 'rgba(255, 255, 255, 0.12)'
            : 'rgba(0, 0, 0, 0.08)',
          shadowColor: colors.shadow || '#000',
        },
      ]}
    >
      {/* Hardware Card Header */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleExpand}
        style={styles.hardwareHeader}
      >
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.hardwareIconBadge,
              { backgroundColor: iconConfig.bgColor },
            ]}
          >
            <CommonIcon
              type={iconConfig.type}
              name={iconConfig.name}
              size={20}
              color={iconConfig.color}
            />
          </View>
          <View style={styles.hardwareTitleContainer}>
            <Text
              variant="titleMedium"
              numberOfLines={1}
              style={[styles.hardwareTitleText, { color: colors.onSurface }]}
            >
              {props.value.title}
            </Text>
          </View>
        </View>

        <Animated.View
          style={[styles.chevronContainer, chevronAnimatedStyle]}
        >
          <CommonIcon
            type="material"
            name="chevron-down"
            size={24}
            color={colors.onSurfaceVariant || (dark ? '#94A3B8' : '#64748B')}
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Collapsible Animated Hardware Content */}
      <Animated.View
        style={[
          { overflow: 'hidden' },
          collapsibleAnimatedStyle,
        ]}
      >
        <View onLayout={onLayout} style={styles.hardwareContent}>
          {props.value.sections?.map(v => {
            return v.sections != null ? (
              <CardSection key={v.id.toString()} value={v} root={false} />
            ) : (
              <CategoryCard key={v.id.toString()} value={v} />
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  hardwareCardContainer: {
    borderRadius: 14,
    marginHorizontal: 4,
    marginTop: 10,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  hardwareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 6,
  },
  hardwareIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  hardwareTitleContainer: {
    flex: 1,
  },
  hardwareTitleText: {
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.15,
  },
  chevronContainer: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hardwareContent: {
    paddingHorizontal: 6,
    paddingBottom: 8,
    gap: 6,
  },
  categoryContainer: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  categoryIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  categoryTitleText: {
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 0.1,
  },
  tableContainer: {
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  tableHeaderCol: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableHeaderRight: {
    textAlign: 'right',
  },
  tableHeaderHighlight: {
    fontWeight: '800',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 2,
  },
  // 4-Column Layout (Both Min & Max): 34% / 22% / 22% / 22%
  colName4: {
    width: '34%',
    fontSize: 11.5,
    fontWeight: '500',
    paddingRight: 4,
  },
  colValue4: {
    width: '22%',
    fontSize: 11.5,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  // 3-Column Layout (Either Min or Max): 52% / 24% / 24%
  colName3: {
    width: '52%',
    fontSize: 12,
    fontWeight: '500',
    paddingRight: 6,
  },
  colValue3: {
    width: '24%',
    fontSize: 12,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  // 2-Column Layout (Current only): 65% / 35%
  colName2: {
    width: '65%',
    fontSize: 12.5,
    fontWeight: '500',
    paddingRight: 8,
  },
  colValue2: {
    width: '35%',
    fontSize: 12.5,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  colHighlight: {
    fontWeight: '700',
  },
  cardValueText: {
    fontSize: 12,
  },
});

export default memo(CardSection);
