import { GetStateCategory, GetStateData } from 'procon-ip/lib/get-state-data'
import { Scales } from 'uplot'
import { COLOR_DIRTY_100, COLOR_WARM_090, COLOR_WARM_100, COLOR_CLEAN_100, COLOR_CLEAN_090, COLOR_AIR_070, COLOR_AIR_090, COLOR_DIRTY_090, COLOR_CLEAN_070 } from './colors'

const SCALES: Scales = {
  temperature: {
    auto: false,
    range: [0, 35],
  },
  redox: {
    auto: false,
    range: [0, 1000],
  },
  pH: {
    auto: false,
    range: [6.8, 7.8],
  },
  canister: {
    auto: false,
    range: [0, 100],
  },
  chlorine: {
    auto: false,
    range: [0, 3],
  },
  pressure: {
    auto: false,
    range: [0, 1.5],
  },
  volume: {
    auto: false,
    range: [0, 600],
  },
  cpuTemerature: {
    auto: false,
    range: [0, 100],
  },
  consumption: {
    auto: false,
    range: [0, 100],
  },
  flow: {
    auto: false,
    range: [0, 50],
  },
}

const AXES = {
  temperature: {
    label: "Temperature",
  },
  redox: {
    label: "redox",
  },
  pH: {
    label: "pH",
  },
  canister: {
    label: "canister",
  },
  chlorine: {
    label: "chlorine",
  },
  electrolysis: {
    label: "electrolysis",
  },
  pressure: {
    label: "pressure",
  },
  volume: {
    label: "volume",
  },
  cpuTemerature: {
    label: "cpuTemerature",
  },
  consumption: {
    label: "consumption",
  },
  flow: {
    label: "flow",
  },
}

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
  scale: string,
  dash?: number[],
  /**
   * Making [[`GetStateDataObject`]] objects extensible, also allows accessing
   * object keys using string variables.
   */
  [key: string]: any;
}

const PreferencesDummy: CardLayout = {
  domain: { min: 0, max: 0 },
  precision: 1,
  target: 0,
  scale: 'redox'
}

const PreferencesChlorine: CardLayout = {
  domain: { min: 0, max: 4 },
  precision: 0.1,
  target: 750,
  scale: 'chlorine'
}

const PreferencesElectrolysis: CardLayout = {
  domain: { min: 0, max: 10 },
  precision: 0.1,
  cutoff: { threshold: 0.1, value: 0 },
  scale: 'electrolysis'
}

const PreferencesFilterPressure = {
  domain: { min: 0, max: 1.5 },
  precision: 0.01,
  criticals: [1.4],
  scale: 'pressure'
}

const PreferencesTank: CardLayout = {
  domain: { min: 0, max: 600 },
  precision: 1,
  scale: 'volume'
}

const PreferencesCpuTemperature: CardLayout = {
  domain: { min: 0, max: 80 },
  precision: 0.1,
  criticals: [65],
  scale: 'cpuTemerature'
}

const PreferencesRedox = {
  domain: { min: 0, max: 1000 },
  precision: 1,
  target: 750,
  criticals: [500, 900],
  scale: 'redox'
}

const PreferencesPH = {
  domain: { min: 6.8, max: 7.8 },
  precision: 0.1,
  criticals: [7.0, 7.4],
  scale: 'pH'
}

const PreferencesTemperature = {
  domain: { min: 0, max: 35 },
  precision: 0.1,
  scale: 'temperature'
}

const PreferencesCanister = {
  domain: { min: 0, max: 100 },
  precision: 1,
  scale: 'canister',
  dash: [12, 12] 
}

const PreferencesConsumption = {
  domain: { min: 0, max: 20 },
  precision: 0.1,
  color: "rgba(128,128,128,0.5)",
  scale: 'consumption'
}

const PreferencesFlowSensor = {
  domain: { min: 0, max: 20 },
  precision: 0.1,
  criticals: [8.0, 16],
  color: COLOR_CLEAN_070,
  scale: 'flow'
}

export const TemperaturesLayout: CardLayout = {
  domain: { min: 0, max: 35 },
  precision: 0.1,
  scale: 'temperature'
}

export const StateLayout: Array<CardLayout> = [
  PreferencesDummy,
  // analog: [1...5]
  {...PreferencesChlorine, color: "lightblue" },
  {...PreferencesElectrolysis, color: "blue" },
  {...PreferencesFilterPressure, color: "orange" },
  {...PreferencesTank, color: "rgba(255, 0, 128, 1)" },
  {...PreferencesCpuTemperature, color: "rgba(255, 128, 0, 1)" },
  // electrodes: [6...7]
  {...PreferencesRedox, color: "purple" },
  {...PreferencesPH, color: "yellow" },
  // termperatures: [8...15]
  {...PreferencesTemperature, color: COLOR_DIRTY_100 },
  {...PreferencesTemperature, color: COLOR_DIRTY_090 },
  {...PreferencesTemperature, color: COLOR_WARM_100  },
  {...PreferencesTemperature, color: COLOR_CLEAN_100 },
  {...PreferencesTemperature, color: COLOR_CLEAN_090 },
  {...PreferencesTemperature, color: COLOR_AIR_070   },
  {...PreferencesTemperature, color: COLOR_AIR_090   },
  {...PreferencesTemperature, color: COLOR_CLEAN_100 },
  // relays: [16...23]
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  // digitalInput: [24...27]
  PreferencesFlowSensor,
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  // externalRelays: [28...35]
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  PreferencesDummy,
  // canister: [36...38]
  {...PreferencesCanister, color: "purple" },
  {...PreferencesCanister, color: "yellow" },
  {...PreferencesCanister, color: "transparent" },
  // canisterConsumptions: [39...41]
  PreferencesConsumption,
  PreferencesConsumption,
  PreferencesConsumption,
]

export const DashboardLayout = [
  {
    category: GetStateCategory.TEMPERATURES,
    index: 0,
    width: 'huge'
  },
  {
    category: GetStateCategory.TEMPERATURES,
    index: 6,
    width: 'huge'
  },
  {
    category: GetStateCategory.ELECTRODES,
    index: 0,
    width: 'big'
  },
  {
    category: GetStateCategory.ELECTRODES,
    index: 1,
    width: 'big'
  },
  {
    category: GetStateCategory.ELECTRODES,
    index: 1,
    width: 'normal'
  }
]

export interface AppLayout {
  pages: {}
  axes: {}
  states: Array<CardLayout>
  scales: {}
}

export const getLayout: (state: GetStateData) => AppLayout = (state) => {
  return {
    pages:{
      temperatures: [
        ...StateLayout.filter((value, index) => index == state.categories.temperatures)
      ],
      water: [
        ...StateLayout.filter((value, index) => index == state.categories.electrodes),
        ...StateLayout.filter((value, index) => index == state.categories.canister),
        ...StateLayout.filter((value, index) => index == state.categories.canisterConsumptions),
        StateLayout[state.sysInfo.chlorineDosageRelais],
        StateLayout[state.sysInfo.phMinusDosageRelais],
        StateLayout[state.sysInfo.phPlusDosageRelais],
        // TODO add electrolysis cleaning relais
      ]
    },
    states: StateLayout,
    axes: {
      temperature: {
        label: "Temperature",
      }
    },
    scales: SCALES
  }
}
