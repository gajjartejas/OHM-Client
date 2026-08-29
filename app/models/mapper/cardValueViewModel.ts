import { ICardValueViewModel, ICardViewModel } from 'app/models/viewModels/cardValueViewModel';
import IDeviceInfo from 'app/models/models/deviceInfo';

export const convertToViewModel = (deviceInfo: IDeviceInfo | null): ICardViewModel[] => {
  if (!deviceInfo) {
    return [];
  }

  // Root might be 'Sensor' or Computer node
  const rootChildren =
    deviceInfo.children && deviceInfo.children.length > 0
      ? deviceInfo.children
      : deviceInfo.sensor && deviceInfo.sensor.length > 0 && deviceInfo.sensor[0].computer
      ? (deviceInfo.sensor[0].computer as unknown as IDeviceInfo[])
      : [deviceInfo];

  // Extract computer nodes
  const computers: IDeviceInfo[] = [];
  for (const node of rootChildren) {
    if (node.text === 'Sensor' && node.children && node.children.length > 0) {
      computers.push(...node.children);
    } else {
      computers.push(node);
    }
  }

  const result: ICardViewModel[] = [];

  for (const computer of computers) {
    const hardwareList =
      computer.children && computer.children.length > 0
        ? computer.children
        : [];

    for (const hardware of hardwareList) {
      if (!hardware.children || hardware.children.length === 0) {
        continue;
      }

      const groupSections: ICardViewModel[] = [];

      for (const group of hardware.children) {
        if (!group.children || group.children.length === 0) {
          // Direct single sensor under hardware
          if (group.value !== undefined && group.value !== null && group.value !== '') {
            groupSections.push({
              id: group.id,
              title: group.text,
              values: [
                {
                  id: group.id,
                  name: group.text,
                  currentValue: group.value || '-',
                  minValue: group.min || '-',
                  maxValue: group.max || '-',
                },
              ],
              sections: null,
            });
          }
          continue;
        }

        const directValues: ICardValueViewModel[] = [];
        const subGroupSections: ICardViewModel[] = [];

        for (const child of group.children) {
          if (child.children && child.children.length > 0) {
            // Nested sub-group (e.g. Motherboard -> Chipset -> Voltages)
            const subValues: ICardValueViewModel[] = child.children
              .filter(s => s.value !== undefined && s.value !== null && s.value !== '')
              .map(s => ({
                id: s.id,
                name: s.text,
                currentValue: s.value || '-',
                minValue: s.min || '-',
                maxValue: s.max || '-',
              }));

            if (subValues.length > 0) {
              subGroupSections.push({
                id: child.id,
                title: child.text,
                values: subValues,
                sections: null,
              });
            }
          } else if (child.value !== undefined && child.value !== null && child.value !== '') {
            directValues.push({
              id: child.id,
              name: child.text,
              currentValue: child.value || '-',
              minValue: child.min || '-',
              maxValue: child.max || '-',
            });
          }
        }

        if (directValues.length > 0) {
          groupSections.push({
            id: group.id,
            title: group.text,
            values: directValues,
            sections: null,
          });
        }

        if (subGroupSections.length > 0) {
          groupSections.push({
            id: group.id,
            title: group.text,
            values: null,
            sections: subGroupSections,
          });
        }
      }

      if (groupSections.length > 0) {
        result.push({
          id: hardware.id,
          title: hardware.type ? `${hardware.type} - ${hardware.text}` : hardware.text,
          values: null,
          sections: groupSections,
        });
      }
    }
  }

  return result;
};

export default convertToViewModel;

