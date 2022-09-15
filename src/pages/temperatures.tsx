import React, { useCallback, useState } from 'react'
import { GetStateCategory } from 'procon-ip'
import { GetStateData } from 'procon-ip'
import { GetStateDataObject } from 'procon-ip'
import { GetHistoryData } from '../services/procon-ip/get-history-data'
import { BigLineChart } from '../components/charts/chart-big'
import { getLayout, StateLayout } from '../components/layout'
import { Temperature } from '../components/objects/temperature'
import { DateTime } from 'components/objects/dateTime'
import { Card } from '../components/card'
import { Header } from '../components/header'
import uPlot, { Axis } from "uplot"
import './temperatures.scss'
import { historyService } from '../App'

export function Temperatures({
  state,
  history
}: {
  state?: GetStateData,
  history: GetHistoryData
}) {

  const [currentState, setCurrentState] = useState(state)
  const [currentHistory, setCurrentHistory] = useState(history)

  if (!state || !state.active || !state.sysInfo) {
    return (
      <div className="nodata">Daten werden geladen, bitte warte einen Moment...</div>
    )
  }

  function setLegend(u: uPlot) {
    states.forEach((dataObject, index) => {
      if (u.legend.idx != null)
        dataObject.value = u.data[index + 1][u.legend.idx] ?? ''
    })
    if (u.legend.idx != null && currentState) {
      currentState.objects[0].value = u.data[0][u.legend.idx] ?? ''
    }
    //setCurrentState(Object.create(currentState))
  }

  const states = currentState ? [
    ...currentState.getDataObjectsByCategory(GetStateCategory.TEMPERATURES, true),
  ]: []

  const axes: Axis[] = [
    {
      stroke: 'white',
      scale: "temperature",
      grid: {
        show: true,
        stroke: 'grey',
        width: 0.25,
        dash: [6, 6],
      }
    }
  ]

  return (
    <div className="grid grid-8">
      <Header title="Pool Steuerung"/>
      <Card width="normal" id="date">
        <DateTime dateTime={currentState ? new Date(currentState.objects[0].value) : undefined} />
      </Card>
      {
        currentState && currentState.getDataObjectsByCategory(GetStateCategory.TEMPERATURES, true).map((stateObject: GetStateDataObject) => {
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
              history={history} layout={getLayout(state)} axes={axes} setLegend={(u: uPlot) => {
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
