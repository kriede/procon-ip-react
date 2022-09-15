import React from 'react'
import { GetStateDataObject } from 'procon-ip'
import { GetHistoryData } from '../../services/procon-ip/get-history-data'
import { round } from '../../services/maths'
import './temperature.scss'

export function Value({
  value,
  precision,
  unit
}: {
  value: number | string
  precision: number
  unit?: string
}) {

  if (typeof value === 'string') return (
    <div className="value">{value}</div>
  )

  const roundedValue = round(value as number, precision)

  return (
    <div className="value">{formatValue(roundedValue, precision)}{unit??''}</div>
  )
}

export function MinValue({
  state,
  history,
  precision
}: {
  state: GetStateDataObject
  history: GetHistoryData
  precision: number
}) {
  return (
    <Value value={history.min ? history.min(state.id) : "-.-"} precision={precision} />
  )
}

export function MaxValue({
  state,
  history,
  precision
}: {
  state: GetStateDataObject
  history: GetHistoryData
  precision: number
}) {
  return (
    <Value value={history.max ? history.max(state.id) : "-.-"} precision={precision} />
  )
}

export function Min24Value({
  state,
  history,
  precision
}: {
  state: GetStateDataObject
  history: GetHistoryData
  precision: number
}) {
  return (
    <Value value={history.min24h ? history.min24h(state.id) : "-.-"} precision={precision} />
  )
}

export function Max24Value({
  state,
  history,
  precision
}: {
  state: GetStateDataObject
  history: GetHistoryData
  precision: number
}) {
  return (
    <Value value={history.max24h ? history.max24h(state.id) : "-.-"} precision={precision} />
  )
}

export function formatValue(value: number, precision: number) {
  return value.toFixed(precision < 1 ? (-Math.log10(precision)) : 0)
}