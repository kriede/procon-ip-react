import React from 'react'
import { GetStateDataObject } from 'procon-ip/lib/get-state-data-object'
import { t } from '../../services/appi18n'
import { SmallBarChart } from '../charts/chart-small-bar'
import { GetHistoryData } from 'services/procon-ip/get-history-data'
import { DashboardLayout, StateLayout } from '../layout'
import { Value } from './value'
import './consumption.scss'

export function Consumption({
  state,
  history
}: {
  state: GetStateDataObject
  history: GetHistoryData
}) {
  return (
    <div className="consumption" key={state.id}>
      <div className="content">
        <div className="label">{t(state.label)}</div>
        <div className="display">
          <Value value={state.value} precision={1} />
          <div className="unit">{state.unit}</div>
        </div>
        <SmallBarChart state={state} history={history} layout={StateLayout[state.id]}></SmallBarChart>
      </div>
    </div>
  )
}
