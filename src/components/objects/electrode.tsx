import React from 'react'
import { GetStateDataObject } from 'procon-ip/lib/get-state-data-object'
import { GetHistoryData } from '../../services/procon-ip/get-history-data'
import { CardLayout, DashboardLayout } from '../layout'
import { SmallLineChart } from '../charts/chart-small'
import { Min24Value, Max24Value, Value } from './value'
import './electrode.scss'

export function Electrode({
  state,
  history,
  layout,
}: {
  state: GetStateDataObject
  history: GetHistoryData
  layout: CardLayout
}) {

  return (
    <div className="electrode" key={state.id}>
      <div className="content">
        <div className="label">{state.label}</div>
        <div className="display">
          <Value value={state.value} precision={layout.precision} />
          <div className="unit">{state.unit}</div>
        </div>
        <div className="row">
          <div className="display small">
            <div className="label">min: </div>
            <Min24Value state={state} history={history} precision={layout.precision} />
            <div className="unit">{state.unit}</div>
          </div>
          <div className="display small">
            <div className="value">max: </div>
            <Max24Value state={state} history={history} precision={layout.precision} />
            <div className="unit">{state.unit}</div>
          </div>
        </div>
        <SmallLineChart state={state} history={history} layout={DashboardLayout.stateLayout[state.id]}></SmallLineChart>
      </div>
    </div>
  )
}
