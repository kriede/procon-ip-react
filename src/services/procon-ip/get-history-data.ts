/**
 * The [[`GetHistoryData`]] class is parser and access helper for the CSV response
 * data of the `/GetState.csv` endpoint (see {@linkcode GetStateService}). The
 * [[`GetStateCategory`]] enum can be used to retrieve data objects categorized
 * according to the endpoint description (see [ProCon.IP manual](http://www.pooldigital.de/trm/TRM_ProConIP.pdf)).
 * @packageDocumentation
 */

import { GetStateCategory, GetStateData } from "procon-ip/lib/get-state-data"
import { runInThisContext } from "vm"

export const DATA_KEYS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41"
]

export interface HistoryDataPoint {
  [index: string]: number
  0: number // date value
  1: number
  2: number
  3: number
  4: number
  5: number
  6: number
  7: number
  8: number
  9: number
  10: number
  11: number
  12: number
  13: number
  14: number
  15: number
  16: number
  17: number
  18: number
  19: number
  20: number
  21: number
  22: number
  23: number
  24: number
  25: number
  26: number
  27: number
  28: number
  29: number
  30: number
  31: number
  32: number
  33: number
  34: number
  35: number
  36: number
  37: number
  38: number
  39: number
  40: number
  41: number
}

/**
 * Category for canister consumptions.
 *
 * _Read from **column 39 to 41** of the CSV._
 */
const canisterConsumptions = [39, 40, 41]

const ROW_LABEL = 0
const ROW_UNIT = 1
const ROW_OFFSET = 2
const ROW_GAIN = 3
const ROW_RAWS_START = 4

export const VALUES_PER_DAY = 24 * 4 // every 15min
export const TIME_PER_TICK  = 15 * 60 * 1000 // every 15min

export const getHistoryDataPoint = (initialValue: number) => {
  let result = {} as HistoryDataPoint
  DATA_KEYS.forEach((key) => {
    result[key] = initialValue
  })
  return result
} 
export const getHistoryDataPointMAX = () => getHistoryDataPoint(Number.MAX_VALUE)
export const getHistoryDataPointMIN = () => getHistoryDataPoint(Number.MIN_VALUE)

/**
 * This class is parser and access helper at once with integrated object 
 * representation for the response CSV of the [[`GetHistoryService`]].
 * (_This might be changed/split in seperate classes in a future refactoring_)
 */
export class GetHistoryData {

  /**
   * Extend the data object instances as you like.
   */
  // [key: string]: any;

  /**
   * data array for all historical values 
   */
   public values: HistoryDataPoint[]


  /**
   * data array for all historical values 
   */
  public values24h: HistoryDataPoint[]

  /**
   * date value of oldest value
   */
  public get from() {
    return this.values  && this.values.length > 0 ? this.values[0][0] : Number.MAX_SAFE_INTEGER
  }

  /**
   * date value of the newest value
   */
  public get to() {
    return this.values && this.values.length > 0 ? this.values[this.values.length-1][0] + TIME_PER_TICK : -Number.MAX_SAFE_INTEGER
  }

  public get days() {
    return this.values.length / VALUES_PER_DAY
  }

  private _minMax = {
    min: getHistoryDataPointMIN(),
    max:getHistoryDataPointMAX()
  }

  private _minMax24h = {
    min: getHistoryDataPointMIN(),
    max:getHistoryDataPointMAX()
  }

  public min(id: number): number {
    return this._minMax.min[typeof id == 'number'? DATA_KEYS[id]: (id as string)]
  }

  public max(id: number): number {
    return this._minMax.max[typeof id === 'number'? DATA_KEYS[id]: id]
  }

  public mins(id?: number): HistoryDataPoint {
    return this._minMax.min
  }

  public maxs(id?: number | undefined): HistoryDataPoint {
    return this._minMax.max
  }

  public min24h(id: number): number {
    return this._minMax24h.min[typeof id === 'number'? DATA_KEYS[id]: id]
  }

  public max24h(id: number): number {
    return this._minMax24h.max[typeof id === 'number'? DATA_KEYS[id]: id]
  }

  /**
   * Initialize new [[`GetHistoryData`]] instance.
   * 
   * @param rawData Plain response string of the [[`GetHistoryService`]] or the 
   *                `/GetState.csv` API endpoint.
   */
  public constructor(date: number, rawData?: string) {
    this.values = []
    this.values24h = []
    var parsed: string[][]
    if (!rawData) return
    parsed = rawData
      .split(/[\r\n]+/) // split rows
      .map((row) => row.split(/[,]/)) // split columns
      .filter((row) => row.length > 1 || (row.length === 1 && row[0].trim().length > 1)) // remove blank lines
    this.resolveObjects(date, parsed)
    this.adjustConsumptions()
    this.resolveDependencies()
  }

  /**
   * @internal
   */
  private resolveObjects(date: number, parsed: string[][]): void {
    this.values = new Array<HistoryDataPoint>(parsed.length - ROW_RAWS_START)
    for (let i = 0; i < parsed.length - ROW_RAWS_START; i++) {
      this.values[i] = getHistoryDataPoint(0)
    }
    const valueRows = parsed.slice(ROW_RAWS_START - parsed.length)
    parsed[ROW_LABEL].map((name, index) => {
      const
        unit = parsed[ROW_UNIT][index],
        offset = parseFloat(parsed[ROW_OFFSET][index]),
        gain = parseFloat(parsed[ROW_GAIN][index]),
        raws = valueRows.map(row => parseFloat(row[index]))
      raws.forEach((raw, timeIndex) => {
        this.values[timeIndex][index] = offset + gain * raw
      })
    })
    this.values.forEach((value) => {
      value[0] = new Date(date).setHours(value[0] >> 8, value[0] & 0xff, 0, 0)
    })
  }

  /**
   * Consumptions are recorded as accumulated values. To visualize consumption over time,
   * we need to compute the differential values. 
   * @internal
   */
  private adjustConsumptions(): void {
    for (let timeIndex = this.values.length - 1; timeIndex > 0; --timeIndex) {
      canisterConsumptions.forEach((index) => {
        this.values[timeIndex][index] -= this.values[timeIndex - 1][index]
      })
    }
  }

  public merge(newData: GetHistoryData) {
    if (newData.to <= this.from) { // add historical data
      this.values = newData.values.concat(this.values)
    } else if (this.to <= newData.from) { // add new day
      this.values = this.values.concat(newData.values)
    } else { // replace last day
      let i = 0
      this.values.map(value => value[0] <= newData.from || value[0] >= newData.to ? value : newData.values[i++])
    }
    this.values.sort((a, b) => a[0] - b[0]) // TODO check if really needed to sort here
    this.resolveDependencies()
  }
 
  private resolveDependencies() {
    this.values24h = this.values.slice(-VALUES_PER_DAY)
    this._minMax = GetHistoryData.calcMinMax(this.values)
    this._minMax24h = GetHistoryData.calcMinMax(this.values24h)
  }

  /**
   * Returns an object with min and max values of all data series
   * within the specified date range
   * 
   * @param from from date value
   * @param to to date value
   * @returns object with min and max values
   */
  private static calcMinMax(values: Array<HistoryDataPoint>, from?: number, to?: number): { min: HistoryDataPoint, max: HistoryDataPoint } {
    return values.reduce((acc, dataPoint: HistoryDataPoint) => {
      if (from && dataPoint.v0 < from || to && dataPoint.v0 > to) return acc
      DATA_KEYS.forEach((key) => {
        const val = dataPoint[key]
        if (typeof val === 'string') return acc
        const num = val as number
        acc.min[key] = ( num < acc.min[key] ) ? num : acc.min[key]
        acc.max[key] = ( num > acc.max[key] ) ? num : acc.max[key]
      })
      return acc
    }, {
      min: getHistoryDataPointMAX(),
      max:getHistoryDataPointMIN()
    })
  }
}