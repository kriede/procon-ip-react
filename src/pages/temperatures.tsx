import React, { useCallback, useState } from 'react'
import { GetStateCategory } from 'procon-ip/lib/get-state-data'
import { GetStateData } from 'procon-ip/lib/get-state-data'
import { GetStateDataObject } from 'procon-ip/lib/get-state-data-object'
import { GetHistoryData } from '../services/procon-ip/get-history-data'
import { GetHistoryService } from '../services/procon-ip/get-history.service'
import { BigLineChart } from '../components/charts/chart-big'
import { DashboardLayout, getLayout, StateLayout, TemperaturesLayout } from '../components/layout'
import { Temperature } from '../components/objects/temperature'
import { Card } from '../components/card'
import { Header } from '../components/header'
import uPlot from "uplot"
import './temperatures.scss'
import { historyService } from 'App'

export function Temperatures({
  state,
  history
}: {
  state?: GetStateData,
  history: GetHistoryData
}) {

  if (!state || !state.active || !state.sysInfo) {
    return (
      <div className="nodata">Daten werden geladen, bitte warte einen Moment...</div>
    )
  }

  const [currentState, setCurrentState] = useState(state)
  const [currentHistory, setCurrentHistory] = useState(history)

  const fetch = useCallback(
    (date: number): GetHistoryData => {
      historyService.fetchHistorySince(date)
      setCurrentHistory(historyService.data)
      return historyService.data
    }, [historyService]
  )

  function setLegend(u: uPlot) {
    states.forEach((dataObject, index) => {
      if (u.legend.idx !== undefined)
        dataObject.value = u.data[index + 1][u.legend.idx] ?? ''
    })
    if (u.legend.idx !== undefined) {
      currentState.objects[0].value = u.data[0][u.legend.idx] ?? ''
    }
    setCurrentState(Object.create(currentState))
  }

  const states = [
    ...currentState.getDataObjectsByCategory(GetStateCategory.TEMPERATURES, true),
  ]

  return (
    <div className="grid grid-8">
      <Header title="Pool Steuerung"/>
      <Card width="normal" id="date">
        <div className="temperature">
          <div className="content">
            <div className="label">Time</div>
            <div className="display">
              <div className="value">{(new Date(currentState.objects[0].value)).toLocaleDateString('de')}</div>
            </div>
            <div className="display small">
              <div className="value">{(new Date(currentState.objects[0].value)).toLocaleTimeString('de')}</div>
            </div>
          </div>
        </div>
      </Card>
      {
        currentState.getDataObjectsByCategory(GetStateCategory.TEMPERATURES, true).map((stateObject: GetStateDataObject) => {
          return (
            <Card width="normal" key={stateObject.id} id={"" + stateObject.id}>
              <Temperature
                state={stateObject}
                history={currentHistory}
                layout={StateLayout[stateObject.id]}
                key={stateObject.id} />
            </Card>
          )
        })
      }
      <Card width="full"  height="span-4" id="chart">
        <div className="temperatures">
          <div className="content chart-big">
            <BigLineChart states={states}
              history={history} layout={getLayout(state)} fetch={fetch} setLegend={(u: uPlot) => {
                if (u.legend.idx == null) {
                  u.setLegend({idx: u.data[0].length - 1}, false)
                  setLegend(u)
                } else {
                  setLegend(u)
                }
              }}/>
          </div>
        </div>
      </Card>
      <Card width="full"  height="span-4" id="help">
        <div className="content">
          <div className="label">Help</div>
          <p>Use pinch gestures or Ctrl-key with mouse wheel to zoom in and out.</p>
          <p>Use pan gestures or drag with mouse to scroll foreward ad backward in time.</p>
        </div>
      </Card>
    </div>
  )
}
