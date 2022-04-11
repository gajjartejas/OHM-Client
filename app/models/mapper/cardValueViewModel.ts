import { ICardValueViewModel, ICardViewModel } from 'app/models/viewModels/cardValueViewModel';
import IDevice from 'app/models/models/device';
import {
  IDeviceComputer,
  IDeviceCPU,
  IDeviceGpuati,
  IDeviceHDD,
  IDeviceRAM,
  IDeviceSensorData,
  IDeviceChipset,
  IDeviceNIC,
  IDeviceGpuintel,
  IDeviceBattery,
  IDeviceGpunvidia,
} from 'app/models/models/deviceInfo';
import { IAPIHardwareType, IAPISensorType, IAPISystemType } from 'app/models/api/deviceInfo';

export const convertToViewModel = (device: IDevice | null): ICardViewModel[] => {
  if (
    !device ||
    !device.deviceInfo ||
    !device.deviceInfo.sensor ||
    device.deviceInfo.sensor.length < 1 ||
    !device.deviceInfo.sensor[0].computer ||
    device.deviceInfo.sensor[0].computer.length < 1
  ) {
    return [];
  }
  let computers = device.deviceInfo.sensor[0].computer;

  //MAINBOARD
  let computerMainboards = getObjectFromType(computers, IAPIHardwareType.Mainboard) as IDeviceComputer[];
  let mainboardSectionViewModels = computerMainboards.map(mainBoardInfo => {
    if (!mainBoardInfo.mainboard) {
      return null;
    }
    let chipsetVMs = mainBoardInfo.mainboard.map(chipsetInfo => {
      //Voltages
      let voltages = getObjectFromType(chipsetInfo.chipset, IAPISensorType.Voltage) as IDeviceChipset[];
      let voltagesVMs = voltages.map(voltageInfo => {
        let voltagesVM = convertArrayToVM(voltageInfo.voltage!);
        return { id: voltageInfo.id, values: voltagesVM, title: voltageInfo.text, sections: null };
      });
      //Temperatures
      let temperatures = getObjectFromType(chipsetInfo.chipset, IAPISensorType.Temperature) as IDeviceChipset[];
      let temperaturesVMs = temperatures.map(temperatureInfo => {
        let temperaturesVM = convertArrayToVM(temperatureInfo.temperature!);
        return { id: temperatureInfo.id, values: temperaturesVM, title: temperatureInfo.text, sections: null };
      });
      //Fans
      let fans = getObjectFromType(chipsetInfo.chipset, IAPISensorType.Fan) as IDeviceChipset[];
      let fansVMs = fans.map(fanInfo => {
        let fansVM = convertArrayToVM(fanInfo.fan!);
        return { id: fanInfo.id, values: fansVM, title: fanInfo.text, sections: null };
      });
      //Controls
      let controls = getObjectFromType(chipsetInfo.chipset, IAPISensorType.Control) as IDeviceChipset[];
      let controlsVMs = controls.map(controlInfo => {
        let controlsVM = convertArrayToVM(controlInfo.control!);
        return { id: controlInfo.id, values: controlsVM, title: controlInfo.text, sections: null };
      });
      return {
        id: chipsetInfo.id,
        title: `${IAPIHardwareType.Chipset} - ${chipsetInfo.text}`,
        sections: [...voltagesVMs, ...temperaturesVMs, ...fansVMs, ...controlsVMs],
        values: null,
      } as ICardViewModel;
    });
    return {
      id: mainBoardInfo.id,
      title: `${IAPIHardwareType.Mainboard} - ${mainBoardInfo.text}`,
      sections: chipsetVMs,
      values: null,
    } as ICardViewModel;
  });
  let mainboardSectionViewModelsMapped = mainboardSectionViewModels.filter(v => v).map(v => v!);

  //CPU
  let computerCpus = getObjectFromType(computers, IAPIHardwareType.CPU) as IDeviceComputer[];
  let computerCpusViewModels = computerCpus.map(cpuInfo => {
    if (!cpuInfo.cpu) {
      return null;
    }
    //Voltages
    let voltages = getObjectFromType(cpuInfo.cpu, IAPISensorType.Voltage) as IDeviceChipset[];
    let voltagesVMs = voltages.map(voltageInfo => {
      let voltagesVM = convertArrayToVM(voltageInfo.voltage!);
      return { id: voltageInfo.id, values: voltagesVM, title: voltageInfo.text, sections: null };
    });
    //Cocks
    let clocks = getObjectFromType(cpuInfo.cpu, IAPISensorType.Clock) as IDeviceCPU[];
    let clocksVMs = clocks.map(clockInfo => {
      let clocksVM = convertArrayToVM(clockInfo.clock!);
      return { id: clockInfo.id, values: clocksVM, title: clockInfo.text, sections: null };
    });
    //Temperatures
    let temperatures = getObjectFromType(cpuInfo.cpu, IAPISensorType.Temperature) as IDeviceCPU[];
    let temperaturesVMs = temperatures.map(temperatureInfo => {
      let controlsVMs = convertArrayToVM(temperatureInfo.temperature!);
      return { id: temperatureInfo.id, values: controlsVMs, title: temperatureInfo.text, sections: null };
    });
    //Loads
    let loads = getObjectFromType(cpuInfo.cpu, IAPISensorType.Load) as IDeviceCPU[];
    let loadsVMs = loads.map(loadInfo => {
      let controlsVMs = convertArrayToVM(loadInfo.load!);
      return { id: loadInfo.id, values: controlsVMs, title: loadInfo.text, sections: null };
    });
    //Powers
    let powers = getObjectFromType(cpuInfo.cpu, IAPISensorType.Power) as IDeviceCPU[];
    let powersVMs = powers.map(power => {
      let powerVMs = convertArrayToVM(power.power!);
      return { id: power.id, values: powerVMs, title: power.text, sections: null };
    });
    return {
      id: cpuInfo.id,
      title: `${IAPIHardwareType.CPU} - ${cpuInfo.text}`,
      sections: [...voltagesVMs, ...clocksVMs, ...powersVMs, ...temperaturesVMs, ...loadsVMs],
      values: null,
    } as ICardViewModel;
  });
  let computerCpusViewModelsMapped = computerCpusViewModels.filter(v => v).map(v => v!);

  //RAM
  let computerRams = getObjectFromType(computers, IAPIHardwareType.RAM) as IDeviceComputer[];
  let ramSectionViewModels = computerRams.map(ramInfo => {
    if (!ramInfo.ram) {
      return null;
    }
    //Load
    let loads = getObjectFromType(ramInfo.ram, IAPISensorType.Load) as IDeviceRAM[];
    let loadsVMs = loads.map(load => {
      let loadVMs = convertArrayToVM(load.load!);
      return { id: load.id, values: loadVMs, title: load.text, sections: null };
    });
    //Data
    let powers = getObjectFromType(ramInfo.ram, IAPISensorType.Power) as IDeviceRAM[];
    let powersVMs = powers.map(power => {
      let powerVMs = convertArrayToVM(power.power!);
      return { id: power.id, values: powerVMs, title: power.text, sections: null };
    });
    return {
      id: ramInfo.id,
      title: `${IAPIHardwareType.RAM} - ${ramInfo.text}`,
      sections: [...loadsVMs, ...powersVMs],
      values: null,
    } as ICardViewModel;
  });
  let ramSectionViewModelsMapped = ramSectionViewModels.filter(v => v).map(v => v!);

  //CARD
  let computerGpus = getObjectFromType(computers, IAPIHardwareType.GpuAti) as IDeviceComputer[];
  let gpuAtiSectionViewModels = computerGpus.map(gpuAtiInfo => {
    if (!gpuAtiInfo.gpuati) {
      return null;
    }
    //Voltages
    let voltages = getObjectFromType(gpuAtiInfo.gpuati, IAPISensorType.Voltage) as IDeviceGpuati[];
    let voltagesVMs = voltages.map(voltage => {
      let controlsVM = convertArrayToVM(voltage.voltage!);
      return { id: voltage.id, values: controlsVM, title: voltage.text, sections: null };
    });
    //Clocks
    let clocks = getObjectFromType(gpuAtiInfo.gpuati, IAPISensorType.Clock) as IDeviceGpuati[];
    let clocksVMs = clocks.map(clock => {
      let controlsVM = convertArrayToVM(clock.clock!);
      return { id: clock.id, values: controlsVM, title: clock.text, sections: null };
    });
    //Temperatures
    let temperatures = getObjectFromType(gpuAtiInfo.gpuati, IAPISensorType.Temperature) as IDeviceGpuati[];
    let temperaturesVMs = temperatures.map(temperature => {
      let temperaturesVM = convertArrayToVM(temperature.temperature!);
      return { id: temperature.id, values: temperaturesVM, title: temperature.text, sections: null };
    });
    //Load
    let loads = getObjectFromType(gpuAtiInfo.gpuati, IAPISensorType.Load) as IDeviceGpuati[];
    let loadsVMs = loads.map(load => {
      let loadsVM = convertArrayToVM(load.load!);
      return { id: load.id, values: loadsVM, title: load.text, sections: null };
    });
    //Fan
    let fans = getObjectFromType(gpuAtiInfo.gpuati, IAPISensorType.Fan) as IDeviceGpuati[];
    let fansVMs = fans.map(fan => {
      let fansVM = convertArrayToVM(fan.fan!);
      return { id: fan.id, values: fansVM, title: fan.text, sections: null };
    });
    //Controls
    let controls = getObjectFromType(gpuAtiInfo.gpuati, IAPISensorType.Control) as IDeviceGpuati[];
    let controlsVMs = controls.map(control => {
      let controlsVM = convertArrayToVM(control.control!);
      return { id: control.id, values: controlsVM, title: control.text, sections: null };
    });
    //Power
    let powers = getObjectFromType(gpuAtiInfo.gpuati, IAPISensorType.Power) as IDeviceGpuati[];
    let powersVMs = powers.map(power => {
      let powersVM = convertArrayToVM(power.power!);
      return { id: power.id, values: powersVM, title: power.text, sections: null };
    });
    return {
      id: gpuAtiInfo.id,
      title: `${IAPIHardwareType.GpuAti} - ${gpuAtiInfo.text}`,
      sections: [
        ...voltagesVMs,
        ...clocksVMs,
        ...temperaturesVMs,
        ...loadsVMs,
        ...fansVMs,
        ...controlsVMs,
        ...powersVMs,
      ],
      values: null,
    } as ICardViewModel;
  });
  let gpuAtiSectionViewModelsMapped = gpuAtiSectionViewModels.filter(v => v).map(v => v!);

  //CARD
  let computerGpusNvidia = getObjectFromType(computers, IAPIHardwareType.GpuNvidia) as IDeviceComputer[];
  let gpuNvidiaSectionViewModels = computerGpusNvidia.map(gpuNvidiaInfo => {
    if (!gpuNvidiaInfo.gpunvidia) {
      return null;
    }
    //Voltages
    let voltages = getObjectFromType(gpuNvidiaInfo.gpunvidia, IAPISensorType.Voltage) as IDeviceGpunvidia[];
    let voltagesVMs = voltages.map(voltage => {
      let controlsVM = convertArrayToVM(voltage.voltage!);
      return { id: voltage.id, values: controlsVM, title: voltage.text, sections: null };
    });
    //Clocks
    let clocks = getObjectFromType(gpuNvidiaInfo.gpunvidia, IAPISensorType.Clock) as IDeviceGpunvidia[];
    let clocksVMs = clocks.map(clock => {
      let controlsVM = convertArrayToVM(clock.clock!);
      return { id: clock.id, values: controlsVM, title: clock.text, sections: null };
    });
    //Temperatures
    let temperatures = getObjectFromType(gpuNvidiaInfo.gpunvidia, IAPISensorType.Temperature) as IDeviceGpunvidia[];
    let temperaturesVMs = temperatures.map(temperature => {
      let temperaturesVM = convertArrayToVM(temperature.temperature!);
      return { id: temperature.id, values: temperaturesVM, title: temperature.text, sections: null };
    });
    //Load
    let loads = getObjectFromType(gpuNvidiaInfo.gpunvidia, IAPISensorType.Load) as IDeviceGpunvidia[];
    let loadsVMs = loads.map(load => {
      let loadsVM = convertArrayToVM(load.load!);
      return { id: load.id, values: loadsVM, title: load.text, sections: null };
    });
    //Fan
    let fans = getObjectFromType(gpuNvidiaInfo.gpunvidia, IAPISensorType.Fan) as IDeviceGpunvidia[];
    let fansVMs = fans.map(fan => {
      let fansVM = convertArrayToVM(fan.fan!);
      return { id: fan.id, values: fansVM, title: fan.text, sections: null };
    });
    //Controls
    let controls = getObjectFromType(gpuNvidiaInfo.gpunvidia, IAPISensorType.Control) as IDeviceGpunvidia[];
    let controlsVMs = controls.map(control => {
      let controlsVM = convertArrayToVM(control.control!);
      return { id: control.id, values: controlsVM, title: control.text, sections: null };
    });
    //Power
    let powers = getObjectFromType(gpuNvidiaInfo.gpunvidia, IAPISensorType.Power) as IDeviceGpunvidia[];
    let powersVMs = powers.map(power => {
      let powersVM = convertArrayToVM(power.power!);
      return { id: power.id, values: powersVM, title: power.text, sections: null };
    });
    return {
      id: gpuNvidiaInfo.id,
      title: `${IAPIHardwareType.GpuNvidia} - ${gpuNvidiaInfo.text}`,
      sections: [
        ...voltagesVMs,
        ...clocksVMs,
        ...temperaturesVMs,
        ...loadsVMs,
        ...fansVMs,
        ...controlsVMs,
        ...powersVMs,
      ],
      values: null,
    } as ICardViewModel;
  });
  let gpuNvidiaSectionViewModelsMapped = gpuNvidiaSectionViewModels.filter(v => v).map(v => v!);

  //CARD
  let computerGpusIntel = getObjectFromType(computers, IAPIHardwareType.GpuIntel) as IDeviceComputer[];

  let gpuIntelSectionViewModels = computerGpusIntel.map(gpuIntelInfo => {
    if (!gpuIntelInfo.gpuintel) {
      return null;
    }
    //Power
    let powers = getObjectFromType(gpuIntelInfo.gpuintel, IAPISensorType.Power) as IDeviceGpuintel[];
    let powersVMs = powers.map(power => {
      let powersVM = convertArrayToVM(power.power!);
      return { id: power.id, values: powersVM, title: power.text, sections: null };
    });
    //Load
    let loads = getObjectFromType(gpuIntelInfo.gpuintel, IAPISensorType.Load) as IDeviceGpuintel[];
    let loadsVMs = loads.map(load => {
      let loadsVM = convertArrayToVM(load.load!);
      return { id: load.id, values: loadsVM, title: load.text, sections: null };
    });
    return {
      id: gpuIntelInfo.id,
      title: `${IAPIHardwareType.GpuIntel} - ${gpuIntelInfo.text}`,
      sections: [...loadsVMs, ...powersVMs],
      values: null,
    } as ICardViewModel;
  });
  let gpuIntelSectionViewModelsMapped = gpuIntelSectionViewModels.filter(v => v).map(v => v!);

  //HDD
  let computerHdds = getObjectFromType(computers, IAPIHardwareType.HDD) as IDeviceComputer[];
  let computerHddViewModels = computerHdds.map(hddInfo => {
    if (!hddInfo.hdd) {
      return null;
    }
    //Temperatures
    let temperatures = getObjectFromType(hddInfo.hdd, IAPISensorType.Temperature) as IDeviceHDD[];
    let temperaturesVMs = temperatures.map(temperature => {
      let controlsVM = convertArrayToVM(temperature.temperature!);
      return {
        id: temperature.id,
        values: controlsVM,
        title: IAPISensorType.Temperature,
        sections: null,
      };
    });
    //Load
    let loads = getObjectFromType(hddInfo.hdd, IAPISensorType.Load) as IDeviceHDD[];
    let loadsVMs = loads.map(load => {
      let loadsVM = convertArrayToVM(load.load!);
      return { id: load.id, values: loadsVM, title: IAPISensorType.Load, sections: null };
    });
    //Power
    let powers = getObjectFromType(hddInfo.hdd, IAPISensorType.Power) as IDeviceHDD[];
    let powersVMs = powers.map(power => {
      let powersVM = convertArrayToVM(power.power!);
      return { id: power.id, values: powersVM, title: power.text, sections: null };
    });
    //Throughput
    let throughputs = getObjectFromType(hddInfo.hdd, IAPISensorType.Throughput) as IDeviceHDD[];
    let throughputsVMs = throughputs.map(throughput => {
      let throughputsVM = convertArrayToVM(throughput.throughput!);
      return { id: throughput.id, values: throughputsVM, title: throughput.text, sections: null };
    });
    return {
      id: hddInfo.id,
      title: `${IAPIHardwareType.HDD} - ${hddInfo.text}`,
      values: null,
      sections: [...temperaturesVMs, ...loadsVMs, ...powersVMs, ...throughputsVMs],
    } as ICardViewModel;
  });
  let computerHddViewModelsMapped = computerHddViewModels.filter(v => v).map(v => v!);

  //NIC
  let computerNICs = getObjectFromType(computers, IAPIHardwareType.NIC) as IDeviceComputer[];
  let computerNicViewModels = computerNICs.map(nicInfo => {
    if (!nicInfo.nic) {
      return null;
    }
    //Load
    let loads = getObjectFromType(nicInfo.nic, IAPISensorType.Load) as IDeviceNIC[];
    let loadsVMs = loads.map(load => {
      let loadsVM = convertArrayToVM(load.load!);
      return { id: load.id, values: loadsVM, title: load.text, sections: null };
    });
    //Data
    let powers = getObjectFromType(nicInfo.nic, IAPISensorType.Power) as IDeviceNIC[];
    let powersVMs = powers.map(power => {
      let powerVMs = convertArrayToVM(power.power!);
      return { id: power.id, values: powerVMs, title: power.text, sections: null };
    });
    //Throughput
    let throughputs = getObjectFromType(nicInfo.nic, IAPISensorType.Throughput) as IDeviceNIC[];
    let throughputsVMs = throughputs.map(throughput => {
      let throughputsVM = convertArrayToVM(throughput.throughput!);
      return { id: throughput.id, values: throughputsVM, title: throughput.text, sections: null };
    });
    return {
      id: nicInfo.id,
      title: `${IAPIHardwareType.NIC} - ${nicInfo.text}`,
      values: null,
      sections: [...loadsVMs, ...powersVMs, ...throughputsVMs],
    } as ICardViewModel;
  });
  let computerNicViewModelsMapped = computerNicViewModels.filter(v => v).map(v => v!);

  //BATTERY
  let computerBatteries = getObjectFromType(computers, IAPIHardwareType.Battery) as IDeviceComputer[];
  let batterySectionViewModels = computerBatteries.map(batteryInfo => {
    if (!batteryInfo.battery) {
      return null;
    }
    //Voltages
    let voltages = getObjectFromType(batteryInfo.battery, IAPISensorType.Voltage) as IDeviceBattery[];
    let voltagesVMs = voltages.map(voltage => {
      let controlsVM = convertArrayToVM(voltage.voltage!);
      return { id: voltage.id, values: controlsVM, title: voltage.text, sections: null };
    });
    //Currents
    let currents = getObjectFromType(batteryInfo.battery, IAPISensorType.Clock) as IDeviceBattery[];
    let currentsVMs = currents.map(current => {
      let controlsVM = convertArrayToVM(current.current!);
      return { id: current.id, values: controlsVM, title: current.text, sections: null };
    });
    //Power
    let powers = getObjectFromType(batteryInfo.battery, IAPISensorType.Power) as IDeviceBattery[];
    let powersVMs = powers.map(power => {
      let powersVM = convertArrayToVM(power.power!);
      return { id: power.id, values: powersVM, title: power.text, sections: null };
    });
    //Level
    let levels = getObjectFromType(batteryInfo.battery, IAPISensorType.Level) as IDeviceBattery[];
    let levelsVMs = levels.map(level => {
      let levelsVM = convertArrayToVM(level.level!);
      return { id: level.id, values: levelsVM, title: level.text, sections: null };
    });
    //Capacities
    let capacities = getObjectFromType(batteryInfo.battery, IAPISensorType.Capacity) as IDeviceBattery[];
    let capacitiesVMs = capacities.map(capacity => {
      let capacitiesVM = convertArrayToVM(capacity.capacity!);
      return { id: capacity.id, values: capacitiesVM, title: capacity.text, sections: null };
    });
    return {
      id: batteryInfo.id,
      title: `${IAPIHardwareType.Battery} - ${batteryInfo.text}`,
      sections: [...voltagesVMs, ...currentsVMs, ...powersVMs, ...levelsVMs, ...capacitiesVMs],
      values: null,
    } as ICardViewModel;
  });
  let batterySectionViewModelsMapped = batterySectionViewModels.filter(v => v).map(v => v!);

  return [
    ...mainboardSectionViewModelsMapped,
    ...computerCpusViewModelsMapped,
    ...ramSectionViewModelsMapped,
    ...gpuIntelSectionViewModelsMapped,
    ...gpuAtiSectionViewModelsMapped,
    ...gpuNvidiaSectionViewModelsMapped,
    ...computerHddViewModelsMapped,
    ...computerNicViewModelsMapped,
    ...batterySectionViewModelsMapped,
  ];
};

const getObjectFromType = (
  array: (IDeviceChipset | IDeviceComputer | IDeviceSensorData | IDeviceGpuati | IDeviceRAM)[],
  type: IAPISensorType | IAPIHardwareType | IAPISystemType,
) => {
  return array.filter(v => v.type === type);
};

const convertArrayToVM = (array: IDeviceChipset[]): ICardValueViewModel[] => {
  return array.map(v => {
    return {
      id: v.id,
      name: v.text,
      currentValue: v.value,
      minValue: v.min,
      maxValue: v.max,
    };
  }) as ICardValueViewModel[];
};
