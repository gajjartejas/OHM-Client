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
        return { id: voltageInfo.id, values: voltagesVM, title: IAPISensorType.Voltage, sections: null };
      });
      //Temperatures
      let temperatures = getObjectFromType(chipsetInfo.chipset, IAPISensorType.Temperature) as IDeviceChipset[];
      let temperaturesVMs = temperatures.map(temperatureInfo => {
        let temperaturesVM = convertArrayToVM(temperatureInfo.temperature!);
        return { id: temperatureInfo.id, values: temperaturesVM, title: IAPISensorType.Temperature, sections: null };
      });
      //Fans
      let fans = getObjectFromType(chipsetInfo.chipset, IAPISensorType.Fan) as IDeviceChipset[];
      let fansVMs = fans.map(fanInfo => {
        let fansVM = convertArrayToVM(fanInfo.fan!);
        return { id: fanInfo.id, values: fansVM, title: IAPISensorType.Fan, sections: null };
      });
      //Controls
      let controls = getObjectFromType(chipsetInfo.chipset, IAPISensorType.Control) as IDeviceChipset[];
      let controlsVMs = controls.map(controlInfo => {
        let controlsVM = convertArrayToVM(controlInfo.control!);
        return { id: controlInfo.id, values: controlsVM, title: IAPISensorType.Control, sections: null };
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
    //VLocks
    let vlocks = getObjectFromType(cpuInfo.cpu, IAPISensorType.Clock) as IDeviceCPU[];
    let vlocksVMs = vlocks.map(vlockInfo => {
      let vlocksVM = convertArrayToVM(vlockInfo.vlock!);
      return { id: vlockInfo.id, values: vlocksVM, title: IAPISensorType.Clock, sections: null };
    });
    //Temperatures
    let temperatures = getObjectFromType(cpuInfo.cpu, IAPISensorType.Temperature) as IDeviceCPU[];
    let temperaturesVMs = temperatures.map(temperatureInfo => {
      let controlsVMs = convertArrayToVM(temperatureInfo.temperature!);
      return { id: temperatureInfo.id, values: controlsVMs, title: IAPISensorType.Temperature, sections: null };
    });
    //Loads
    let loads = getObjectFromType(cpuInfo.cpu, IAPISensorType.Load) as IDeviceCPU[];
    let loadsVMs = loads.map(loadInfo => {
      let controlsVMs = convertArrayToVM(loadInfo.load!);
      return { id: loadInfo.id, values: controlsVMs, title: IAPISensorType.Load, sections: null };
    });
    //Powers
    let powers = getObjectFromType(cpuInfo.cpu, IAPISensorType.Power) as IDeviceCPU[];
    let powersVMs = powers.map(power => {
      let powerVMs = convertArrayToVM(power.power!);
      return { id: power.id, values: powerVMs, title: IAPISensorType.Power, sections: null };
    });
    return {
      id: cpuInfo.id,
      title: `${IAPIHardwareType.CPU} - ${cpuInfo.text}`,
      sections: [...vlocksVMs, ...powersVMs, ...temperaturesVMs, ...loadsVMs],
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
      return { id: load.id, values: loadVMs, title: IAPISensorType.Load, sections: null };
    });
    //Data
    let powers = getObjectFromType(ramInfo.ram, IAPISensorType.Power) as IDeviceRAM[];
    let powersVMs = powers.map(power => {
      let powerVMs = convertArrayToVM(power.power!);
      return { id: power.id, values: powerVMs, title: IAPISensorType.Power, sections: null };
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
      return { id: voltage.id, values: controlsVM, title: IAPISensorType.Voltage, sections: null };
    });
    //Clocks
    let clocks = getObjectFromType(gpuAtiInfo.gpuati, IAPISensorType.Clock) as IDeviceGpuati[];
    let clocksVMs = clocks.map(clock => {
      let controlsVM = convertArrayToVM(clock.vlock!);
      return { id: clock.id, values: controlsVM, title: IAPISensorType.Clock, sections: null };
    });
    //Temperatures
    let temperatures = getObjectFromType(gpuAtiInfo.gpuati, IAPISensorType.Temperature) as IDeviceGpuati[];
    let temperaturesVMs = temperatures.map(temperature => {
      let temperaturesVM = convertArrayToVM(temperature.temperature!);
      return { id: temperature.id, values: temperaturesVM, title: IAPISensorType.Temperature, sections: null };
    });
    //Load
    let loads = getObjectFromType(gpuAtiInfo.gpuati, IAPISensorType.Load) as IDeviceGpuati[];
    let loadsVMs = loads.map(load => {
      let loadsVM = convertArrayToVM(load.load!);
      return { id: load.id, values: loadsVM, title: IAPISensorType.Load, sections: null };
    });
    //Fan
    let fans = getObjectFromType(gpuAtiInfo.gpuati, IAPISensorType.Fan) as IDeviceGpuati[];
    let fansVMs = fans.map(fan => {
      let fansVM = convertArrayToVM(fan.fan!);
      return { id: fan.id, values: fansVM, title: IAPISensorType.Fan, sections: null };
    });
    //Controls
    let controls = getObjectFromType(gpuAtiInfo.gpuati, IAPISensorType.Control) as IDeviceGpuati[];
    let controlsVMs = controls.map(control => {
      let controlsVM = convertArrayToVM(control.control!);
      return { id: control.id, values: controlsVM, title: IAPISensorType.Control, sections: null };
    });
    //Power
    let powers = getObjectFromType(gpuAtiInfo.gpuati, IAPISensorType.Power) as IDeviceGpuati[];
    let powersVMs = powers.map(power => {
      let powersVM = convertArrayToVM(power.power!);
      return { id: power.id, values: powersVM, title: IAPISensorType.Power, sections: null };
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
    let voltages = getObjectFromType(gpuNvidiaInfo.gpunvidia, IAPISensorType.Voltage) as IDeviceGpuati[];
    let voltagesVMs = voltages.map(voltage => {
      let controlsVM = convertArrayToVM(voltage.voltage!);
      return { id: voltage.id, values: controlsVM, title: IAPISensorType.Voltage, sections: null };
    });
    //Clocks
    let clocks = getObjectFromType(gpuNvidiaInfo.gpunvidia, IAPISensorType.Clock) as IDeviceGpuati[];
    let clocksVMs = clocks.map(clock => {
      let controlsVM = convertArrayToVM(clock.vlock!);
      return { id: clock.id, values: controlsVM, title: IAPISensorType.Clock, sections: null };
    });
    //Temperatures
    let temperatures = getObjectFromType(gpuNvidiaInfo.gpunvidia, IAPISensorType.Temperature) as IDeviceGpuati[];
    let temperaturesVMs = temperatures.map(temperature => {
      let temperaturesVM = convertArrayToVM(temperature.temperature!);
      return { id: temperature.id, values: temperaturesVM, title: IAPISensorType.Temperature, sections: null };
    });
    //Load
    let loads = getObjectFromType(gpuNvidiaInfo.gpunvidia, IAPISensorType.Load) as IDeviceGpuati[];
    let loadsVMs = loads.map(load => {
      let loadsVM = convertArrayToVM(load.load!);
      return { id: load.id, values: loadsVM, title: IAPISensorType.Load, sections: null };
    });
    //Fan
    let fans = getObjectFromType(gpuNvidiaInfo.gpunvidia, IAPISensorType.Fan) as IDeviceGpuati[];
    let fansVMs = fans.map(fan => {
      let fansVM = convertArrayToVM(fan.fan!);
      return { id: fan.id, values: fansVM, title: IAPISensorType.Fan, sections: null };
    });
    //Controls
    let controls = getObjectFromType(gpuNvidiaInfo.gpunvidia, IAPISensorType.Control) as IDeviceGpuati[];
    let controlsVMs = controls.map(control => {
      let controlsVM = convertArrayToVM(control.control!);
      return { id: control.id, values: controlsVM, title: IAPISensorType.Control, sections: null };
    });
    //Power
    let powers = getObjectFromType(gpuNvidiaInfo.gpunvidia, IAPISensorType.Power) as IDeviceGpuati[];
    let powersVMs = powers.map(power => {
      let powersVM = convertArrayToVM(power.power!);
      return { id: power.id, values: powersVM, title: IAPISensorType.Power, sections: null };
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
      return { id: power.id, values: powersVM, title: IAPISensorType.Power, sections: null };
    });
    return {
      id: hddInfo.id,
      title: IAPIHardwareType.HDD,
      values: null,
      sections: [...temperaturesVMs, ...loadsVMs, ...powersVMs],
    } as ICardViewModel;
  });
  let computerHddViewModelsMapped = computerHddViewModels.filter(v => v).map(v => v!);

  return [
    ...mainboardSectionViewModelsMapped,
    ...computerCpusViewModelsMapped,
    ...ramSectionViewModelsMapped,
    ...gpuAtiSectionViewModelsMapped,
    ...gpuNvidiaSectionViewModelsMapped,
    ...computerHddViewModelsMapped,
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
