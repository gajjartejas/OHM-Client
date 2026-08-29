import {
  ICardValueViewModel,
  ICardViewModel,
} from 'app/models/viewModels/cardValueViewModel';

/**
 * Checks whether a sensor value is considered "essential / required" info
 * for its category and hardware.
 */
export const isEssentialSensor = (
  sensorName: string,
  categoryTitle: string,
): boolean => {
  const sLower = sensorName.toLowerCase().trim();
  const cLower = categoryTitle.toLowerCase().trim();

  if (cLower.includes('temp')) {
    // Keep: Package, Core Max, Core Average, GPU Core, GPU Hot Spot, Storage / Drive
    if (
      sLower.includes('package') ||
      sLower.includes('core max') ||
      sLower.includes('max') ||
      sLower.includes('average') ||
      sLower.includes('avg') ||
      sLower.includes('hot spot') ||
      sLower.includes('hotspot') ||
      sLower.includes('gpu') ||
      sLower.includes('storage') ||
      sLower.includes('drive') ||
      sLower.includes('system')
    ) {
      return true;
    }
    // Exclude per-core temps (Core #1, Core #2...) when Package/Max exists
    if (
      sLower.includes('core #') ||
      sLower.includes('core 0') ||
      sLower.includes('distance')
    ) {
      return false;
    }
    return true;
  }

  if (cLower.includes('volt')) {
    // Keep: primary CPU Core, VCore, GPU Core, Battery, main rails
    if (
      sLower === 'cpu core' ||
      sLower === 'vcore' ||
      sLower === 'cpu vcore' ||
      sLower === 'gpu core' ||
      sLower === 'gpu' ||
      sLower === 'battery' ||
      sLower === '+12v' ||
      sLower === '+5v' ||
      sLower === '+3.3v'
    ) {
      return true;
    }
    // Exclude per-core VID (e.g. CPU Core #1, CPU Core #2)
    if (
      sLower.includes('#') ||
      sLower.includes('vid') ||
      sLower.includes('aux')
    ) {
      return false;
    }
    return false;
  }

  if (cLower.includes('power')) {
    // Keep: CPU Package, Total, GPU Power / Board Power
    if (
      sLower === 'cpu package' ||
      sLower === 'cpu total' ||
      sLower === 'total' ||
      sLower === 'gpu power' ||
      sLower === 'gpu board power' ||
      sLower === 'gpu' ||
      sLower === 'package'
    ) {
      return true;
    }
    // Exclude secondary sub-rails (CPU Cores, CPU Memory, CPU Platform, DRAM)
    if (
      sLower.includes('memory') ||
      sLower.includes('platform') ||
      sLower.includes('cores') ||
      sLower.includes('dram') ||
      sLower.includes('#')
    ) {
      return false;
    }
    return false;
  }

  if (cLower.includes('clock') || cLower.includes('freq')) {
    // Keep: Bus Speed, Max Clock, Core #1, GPU Core, GPU Memory
    if (
      sLower.includes('bus') ||
      sLower.includes('max') ||
      sLower.includes('average') ||
      sLower === 'cpu core #1' ||
      sLower === 'gpu core' ||
      sLower === 'gpu memory' ||
      sLower === 'gpu'
    ) {
      return true;
    }
    // Exclude other individual thread clocks
    if (sLower.includes('#') && sLower !== 'cpu core #1') {
      return false;
    }
    return false;
  }

  if (
    cLower.includes('load') ||
    cLower.includes('usage') ||
    cLower.includes('level')
  ) {
    // Keep: CPU Total, Total, GPU Core, GPU Memory, Memory
    if (
      sLower === 'cpu total' ||
      sLower === 'total' ||
      sLower === 'total load' ||
      sLower === 'memory' ||
      sLower === 'gpu core' ||
      sLower === 'gpu memory'
    ) {
      return true;
    }
    // Exclude individual core loads
    if (sLower.includes('core #') || sLower.includes('thread #')) {
      return false;
    }
    return false;
  }

  if (
    cLower.includes('data') ||
    cLower.includes('capacity') ||
    cLower.includes('energy')
  ) {
    // Keep: Memory Used, Memory Available, Used Space
    if (
      sLower.includes('used') ||
      sLower.includes('available') ||
      sLower.includes('remaining') ||
      sLower.includes('free')
    ) {
      return true;
    }
    return false;
  }

  if (cLower.includes('fan') || cLower.includes('flow')) {
    if (
      sLower.includes('cpu') ||
      sLower.includes('gpu') ||
      sLower.includes('fan #1') ||
      sLower === 'fan'
    ) {
      return true;
    }
    return false;
  }

  return true;
};

export interface IFlatGridMetric {
  id: string;
  hardwareTitle: string;
  categoryTitle: string;
  sensor: ICardValueViewModel;
}

/**
 * Flattens the hierarchical ICardViewModel tree into an array of grid tile items.
 */
export const flattenToGridMetrics = (
  items: ICardViewModel[],
): IFlatGridMetric[] => {
  const result: IFlatGridMetric[] = [];

  for (const hw of items) {
    const hwTitle = hw.title;

    if (hw.values && hw.values.length > 0) {
      for (const val of hw.values) {
        result.push({
          id: `${hw.id}_${val.id}`,
          hardwareTitle: hwTitle,
          categoryTitle: hw.title,
          sensor: val,
        });
      }
    }

    if (hw.sections && hw.sections.length > 0) {
      for (const cat of hw.sections) {
        if (cat.values && cat.values.length > 0) {
          for (const val of cat.values) {
            result.push({
              id: `${hw.id}_${cat.id}_${val.id}`,
              hardwareTitle: hwTitle,
              categoryTitle: cat.title,
              sensor: val,
            });
          }
        }

        if (cat.sections && cat.sections.length > 0) {
          for (const sub of cat.sections) {
            if (sub.values && sub.values.length > 0) {
              for (const val of sub.values) {
                result.push({
                  id: `${hw.id}_${cat.id}_${sub.id}_${val.id}`,
                  hardwareTitle: hwTitle,
                  categoryTitle: `${cat.title} - ${sub.title}`,
                  sensor: val,
                });
              }
            }
          }
        }
      }
    }
  }

  return result;
};

/**
 * Recursively filters an ICardViewModel tree to only contain essential sensors.
 */
export const filterEssentialViewModel = (
  items: ICardViewModel[],
): ICardViewModel[] => {
  return items
    .map(card => {
      // If card has direct values
      if (card.values && card.values.length > 0) {
        let filteredValues = card.values.filter(v =>
          isEssentialSensor(v.name, card.title),
        );
        if (filteredValues.length === 0 && card.values.length > 0) {
          filteredValues = card.values.slice(0, 2);
        }
        return {
          ...card,
          values: filteredValues,
        };
      }

      // If card has child sections
      if (card.sections && card.sections.length > 0) {
        const filteredSections: ICardViewModel[] = card.sections
          .map(sec => {
            if (sec.values && sec.values.length > 0) {
              let filtered = sec.values.filter(v =>
                isEssentialSensor(v.name, sec.title),
              );
              if (filtered.length === 0 && sec.values.length > 0) {
                filtered = sec.values.slice(0, 2);
              }
              return {
                ...sec,
                values: filtered,
              };
            }
            if (sec.sections && sec.sections.length > 0) {
              return filterEssentialViewModel([sec])[0];
            }
            return sec;
          })
          .filter(
            sec =>
              (sec.values && sec.values.length > 0) ||
              (sec.sections && sec.sections.length > 0),
          );

        return {
          ...card,
          sections: filteredSections,
        };
      }

      return card;
    })
    .filter(
      card =>
        (card.values && card.values.length > 0) ||
        (card.sections && card.sections.length > 0),
    );
};
