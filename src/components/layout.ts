import { COLOR_DIRTY_100, COLOR_WARM_090, COLOR_WARM_100, COLOR_CLEAN_100, COLOR_CLEAN_090, COLOR_AIR_070, COLOR_AIR_090, COLOR_DIRTY_090, COLOR_CLEAN_070 } from './colors'

export interface CardLayout {
  domain: {
    min: number,
    max: number,
  },
  precision: number
  criticals?: Array<number>,
  target?: number,
  cutoff?: {
    threshold: number,
    value: number
  },
  color?: string,
  /**
   * Making [[`GetStateDataObject`]] objects extensible, also allows accessing
   * object keys using string variables.
   */
  [key: string]: any;
}

const PreferencesDummy: CardLayout = {
  domain: { min: 0, max: 0 },
  precision: 1,
  target: 0
}

const PreferencesChlor: CardLayout = {
  domain: { min: 0, max: 4 },
  precision: 0.1,
  target: 750
}

const PreferencesElectrolysis: CardLayout = {
  domain: { min: 0, max: 10 },
  precision: 0.1,
  cutoff: { threshold: 0.1, value: 0 }
}

const PreferencesFilterPressure = {
  domain: { min: 0, max: 1.5 },
  precision: 0.01,
  criticals: [1.4]
}

const PreferencesTank: CardLayout = {
  domain: { min: 0, max: 600 },
  precision: 1
}

const PreferencesCpuTemp: CardLayout = {
  domain: { min: 0, max: 80 },
  precision: 0.1,
  criticals: [65]
}

const PreferencesRedox = {
  domain: { min: 0, max: 1000 },
  precision: 100,
  target: 750
}

const PreferencesPH = {
  domain: { min: 6.8, max: 7.8 },
  precision: 0.1,
  criticals: [7.0, 7.4]
}

const PreferencesTemperature = {
  domain: { min: 0, max: 35 },
  precision: 0.1
}

const PreferencesConsumption = {
  domain: { min: 0, max: 20 },
  precision: 0.1,
  color: "rgba(128,128,128,0.5)"
}

const PreferencesFlowSensor = {
  domain: { min: 0, max: 20 },
  precision: 0.1,
  criticals: [8.0, 16],
  color: COLOR_CLEAN_070
}

export const TemperaturesLayout: CardLayout = {
  domain: { min: 0, max: 35 },
  precision: 0.1
}

export const DashboardLayout: Array<CardLayout> = [
  {domain:{min: 0, max: 0}, precision: 0},
  {...PreferencesChlor, color: "purple" },
  {...PreferencesElectrolysis, color: "yellow" },
  {...PreferencesFilterPressure, color: "white" },
  {...PreferencesTank, color: "blue" },
  {...PreferencesCpuTemp, color: "orange" },
  {...PreferencesRedox, color: "rgba(255, 0, 128, 1)" },
  {...PreferencesPH, color: "rgba(255, 128, 0, 1)" },
  {...PreferencesTemperature, color: COLOR_DIRTY_100 },
  {...PreferencesTemperature, color: COLOR_DIRTY_090 },
  {...PreferencesTemperature, color: COLOR_WARM_100  },
  {...PreferencesTemperature, color: COLOR_CLEAN_100 },
  {...PreferencesTemperature, color: COLOR_CLEAN_090 },
  {...PreferencesTemperature, color: COLOR_AIR_070   },
  {...PreferencesTemperature, color: COLOR_AIR_090   },
  {...PreferencesTemperature, color: COLOR_CLEAN_100 },
  // relays: [[16, 23]],
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  // digitalInput: [[24, 27]],
  PreferencesFlowSensor,
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  // externalRelays: [[28, 35]],
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  // canister: [[36, 38]],
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  // canisterConsumptions: [[39, 41]],
  PreferencesConsumption,
  PreferencesConsumption,
  PreferencesConsumption,
]
