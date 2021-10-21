import { DATA_KEYS, getHistoryDataPoint, HistoryDataPoint } from "./procon-ip/get-history-data"

export function minMax(items: Array<HistoryDataPoint>): { min: HistoryDataPoint, max: HistoryDataPoint} {
  return items.reduce((acc, dataPoint: HistoryDataPoint) => {
    DATA_KEYS.forEach((key) => {
      const val = dataPoint[key]
      if (typeof val === 'string') return acc
      const num = val as number
      acc.min[key] = ( num < acc.min[key] ) ? num : acc.min[key]
      acc.max[key] = ( num > acc.max[key] ) ? num : acc.max[key]
    })
    return acc
  }, {min: getHistoryDataPoint(Number.MAX_VALUE), max: getHistoryDataPoint(Number.MIN_VALUE)})
}

export function round(value: number, precision: number) {
  return Math.round((value + Number.EPSILON) / precision ) * precision
}

export function roundUp(value: number, precision: number) {
  return Math.ceil((value + Number.EPSILON) / precision ) * precision
}

export function roundDown(value: number, precision: number) {
  return Math.floor((value + Number.EPSILON) / precision ) * precision
}
