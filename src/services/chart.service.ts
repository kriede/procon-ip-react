import React from 'react'
import { GetHistoryService } from '../services/procon-ip/get-history.service'
import { GetStateData } from 'procon-ip/lib/get-state-data'
import { GetHistoryData } from './procon-ip/get-history-data'

// export interface ChartData {
//   values: number[]
// }

// export interface ChartDataSource {
//   date: Date
//   dates: Date[]
//   values: Map<string, ChartData>
// }

// const VALUES_PER_DAY = 24 * 4
// const VALUES_INDEX0 = 4

// export async function getChartData24h(getHistoryService: GetHistoryService, getStateData: GetStateData) {
//   const now = new Date()
//   const yesterday = new Date(new Date().setDate(now.getDate()-1))
//   const yesterdayHistory = await getHistoryService.getHistory(getStateData, yesterday)
//   const todayHistory = await getHistoryService.getHistory(getStateData, now)
//   return getChartData24hDataSource(yesterdayHistory, todayHistory, now)
// }

// export async function getChartData24hDataSource(yesterdayHistory: GetHistoryData, todayHistory: GetHistoryData, now: Date): Promise<ChartDataSource> {
//   const len2 = todayHistory.getDataObject(0).raw.length
//   const len1 = VALUES_PER_DAY - len2
//   const start1 = VALUES_PER_DAY - len1
//   const result = {
//     date: now,
//     dates: new Array<Date>(VALUES_PER_DAY),
//     values: new Map<string, ChartData>()
//   }
//   yesterdayHistory.objects[0].value.forEach((value, i) => {
//     if (i > VALUES_INDEX0)
//       result.dates[i - VALUES_INDEX0] = toDateTime(result.date, value)
//   })
//   yesterdayHistory.objects.forEach((object, i) => {
//     const chartData = {
//       values: new Array<number>(VALUES_PER_DAY)
//     }
//     result.values.set(object.label, chartData)
//     object.value.forEach((value, i) => {
//       if (i > VALUES_PER_DAY - len1)
//         chartData.values[i] = value as number
//     })
//   })
//   return result
// }

// function toDateTime(date: Date, time: string | number) {
//   return new Date(date.setHours(
//     Number(time) >> 8,
//     Number(time) & 0xff,
//     0,
//     0
//   ))
// }

