import React, { memo } from 'react';
import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AppTheme } from 'app/models/theme';
import useAppConfigStore from 'app/store/appConfig';
import CommonIcon, { IconType } from './CommonIcon';
import { IFlatGridMetric } from 'app/utils/sensorFilter';
import { ICardViewModel } from 'app/models/viewModels/cardValueViewModel';

interface IconConfig {
  name: string;
  type: IconType;
  color: string;
  bgColor: string;
}

const getCategoryIconConfig = (title: string, dark: boolean): IconConfig => {
  const lower = title.toLowerCase();
  if (lower.includes('temp')) {
    return {
      name: 'thermometer',
      type: 'material',
      color: dark ? '#F87171' : '#EF4444',
      bgColor: dark ? 'rgba(248, 113, 113, 0.18)' : 'rgba(239, 68, 68, 0.12)',
    };
  }
  if (lower.includes('volt')) {
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
  if (lower.includes('clock') || lower.includes('freq')) {
    return {
      name: 'speedometer',
      type: 'material',
      color: dark ? '#60A5FA' : '#3B82F6',
      bgColor: dark ? 'rgba(96, 165, 250, 0.18)' : 'rgba(59, 130, 246, 0.12)',
    };
  }
  if (lower.includes('load') || lower.includes('usage') || lower.includes('level')) {
    return {
      name: 'chart-donut',
      type: 'material',
      color: dark ? '#818CF8' : '#6366F1',
      bgColor: dark ? 'rgba(129, 140, 248, 0.18)' : 'rgba(99, 102, 241, 0.12)',
    };
  }
  if (lower.includes('fan') || lower.includes('flow')) {
    return {
      name: 'fan',
      type: 'material',
      color: dark ? '#22D3EE' : '#06B6D4',
      bgColor: dark ? 'rgba(34, 211, 238, 0.18)' : 'rgba(6, 182, 212, 0.12)',
    };
  }
  if (lower.includes('data') || lower.includes('capacity') || lower.includes('memory')) {
    return {
      name: 'database',
      type: 'material',
      color: dark ? '#A78BFA' : '#8B5CF6',
      bgColor: dark ? 'rgba(167, 139, 250, 0.18)' : 'rgba(139, 92, 246, 0.12)',
    };
  }
  return {
    name: 'chip',
    type: 'material',
    color: dark ? '#34D399' : '#10B981',
    bgColor: dark ? 'rgba(52, 211, 153, 0.18)' : 'rgba(16, 185, 129, 0.12)',
  };
};

const GridTile = memo(
  (props: {
    item: IFlatGridMetric;
    showMin: boolean;
    showMax: boolean;
    dark: boolean;
  }) => {
    const { item, showMin, showMax, dark } = props;
    const { colors } = useTheme<AppTheme>();
    const iconConfig = getCategoryIconConfig(item.categoryTitle, dark);

    return (
      <View
        style={[
          styles.gridTile,
          {
            backgroundColor: dark ? '#1E1E1E' : '#FFFFFF',
            borderColor: dark
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.08)',
            shadowColor: colors.shadow || '#000',
          },
        ]}
      >
        {/* Tile Header */}
        <View style={styles.tileHeader}>
          <View
            style={[
              styles.iconBadge,
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
          <View style={styles.headerTitles}>
            <Text
              numberOfLines={1}
              style={[styles.sensorName, { color: colors.onSurface }]}
            >
              {item.sensor.name}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.categorySubText,
                { color: dark ? '#94A3B8' : '#64748B' },
              ]}
            >
              {item.categoryTitle}
            </Text>
          </View>
        </View>

        {/* Prominent Current Value */}
        <View style={styles.valueContainer}>
          <Text
            numberOfLines={1}
            style={[
              styles.currentValueText,
              { color: iconConfig.color },
            ]}
          >
            {item.sensor.currentValue}
          </Text>
        </View>

        {/* Optional Min / Max Row */}
        {(showMin || showMax) && (
          <View
            style={[
              styles.minMaxRow,
              {
                borderTopColor: dark
                  ? 'rgba(255, 255, 255, 0.06)'
                  : 'rgba(0, 0, 0, 0.05)',
              },
            ]}
          >
            {showMin && (
              <View style={styles.minMaxItem}>
                <Text
                  style={[
                    styles.minMaxLabel,
                    { color: dark ? '#64748B' : '#94A3B8' },
                  ]}
                >
                  MIN
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.minMaxValue,
                    { color: dark ? '#CBD5E1' : '#475569' },
                  ]}
                >
                  {item.sensor.minValue}
                </Text>
              </View>
            )}
            {showMax && (
              <View style={styles.minMaxItem}>
                <Text
                  style={[
                    styles.minMaxLabel,
                    { color: dark ? '#64748B' : '#94A3B8' },
                  ]}
                >
                  MAX
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.minMaxValue,
                    { color: dark ? '#CBD5E1' : '#475569' },
                  ]}
                >
                  {item.sensor.maxValue}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  },
);
GridTile.displayName = 'GridTile';

interface GridCardViewProps {
  deviceInfos: ICardViewModel[];
}

const GridCardView = (props: GridCardViewProps) => {
  const { deviceInfos } = props;
  const { colors, dark } = useTheme<AppTheme>();
  const showMinValue = useAppConfigStore(state => state.showMinValue);
  const showMaxValue = useAppConfigStore(state => state.showMaxValue);

  return (
    <View style={styles.container}>
      {deviceInfos.map(hardware => {
        // Collect metrics for this hardware
        const metrics: IFlatGridMetric[] = [];
        if (hardware.values && hardware.values.length > 0) {
          for (const val of hardware.values) {
            metrics.push({
              id: `${hardware.id}_${val.id}`,
              hardwareTitle: hardware.title,
              categoryTitle: hardware.title,
              sensor: val,
            });
          }
        }
        if (hardware.sections && hardware.sections.length > 0) {
          for (const cat of hardware.sections) {
            if (cat.values && cat.values.length > 0) {
              for (const val of cat.values) {
                metrics.push({
                  id: `${hardware.id}_${cat.id}_${val.id}`,
                  hardwareTitle: hardware.title,
                  categoryTitle: cat.title,
                  sensor: val,
                });
              }
            }
            if (cat.sections && cat.sections.length > 0) {
              for (const sub of cat.sections) {
                if (sub.values && sub.values.length > 0) {
                  for (const val of sub.values) {
                    metrics.push({
                      id: `${hardware.id}_${cat.id}_${sub.id}_${val.id}`,
                      hardwareTitle: hardware.title,
                      categoryTitle: `${cat.title} - ${sub.title}`,
                      sensor: val,
                    });
                  }
                }
              }
            }
          }
        }

        if (metrics.length === 0) {
          return null;
        }

        return (
          <View key={hardware.id.toString()} style={styles.sectionBlock}>
            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <Text
                variant="titleSmall"
                numberOfLines={1}
                style={[styles.sectionTitle, { color: colors.onSurface }]}
              >
                {hardware.title}
              </Text>
            </View>

            {/* 2-Column Grid */}
            <View style={styles.gridRow}>
              {metrics.map(metric => (
                <GridTile
                  key={metric.id}
                  item={metric}
                  showMin={showMinValue}
                  showMax={showMaxValue}
                  dark={dark}
                />
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  sectionBlock: {
    marginBottom: 12,
  },
  sectionHeader: {
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  gridTile: {
    width: '48.5%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconBadge: {
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitles: {
    flex: 1,
  },
  sensorName: {
    fontWeight: '700',
    fontSize: 12,
  },
  categorySubText: {
    fontSize: 10,
    fontWeight: '500',
  },
  valueContainer: {
    paddingVertical: 4,
  },
  currentValueText: {
    fontSize: 16,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.2,
  },
  minMaxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 5,
    marginTop: 4,
  },
  minMaxItem: {
    flex: 1,
  },
  minMaxLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  minMaxValue: {
    fontSize: 11,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});

export default memo(GridCardView);
