import React, { useCallback, useState } from 'react'
import { GetStateCategory } from 'procon-ip/lib/get-state-data'
import { GetStateData } from 'procon-ip/lib/get-state-data'
import { GetHistoryData } from '../services/procon-ip/get-history-data'
import { BigLineChart } from '../components/charts/chart-big'
import { DashboardLayout, getLayout, StateLayout } from '../components/layout'
import { Card } from '../components/card'
import { Header } from '../components/header'
import uPlot from "uplot"
import { historyService } from '../App'
import { Canister } from '../components/objects/canister'
import { Consumption } from '../components/objects/consumption'
import { Controller } from '../services/procon-ip/get-controller-service'
import { Electrode } from '../components/objects/electrode'
import { getDosage, Relay } from '../components/objects/relay'
import { GetDosage } from '../services/procon-ip/get-dosage'
import { GetStateDataObject } from 'procon-ip/lib/get-state-data-object'

export function Water({
  state,
  history,
  controller,
  dosage
}: {
  state?: GetStateData
  history: GetHistoryData
  controller: Controller
  dosage: GetDosage
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
    currentState.getDataObjectsByCategory(GetStateCategory.ELECTRODES, true)[0],
    currentState.getDataObjectsByCategory(GetStateCategory.CANISTER, true)[0],
    currentState.getDataObjectsByCategory(GetStateCategory.CANISTER_CONSUMPTION, true)[0]
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
        currentState.getDataObjectsByCategory(GetStateCategory.ELECTRODES, true).map((stateObject: GetStateDataObject, index) => {
          return (
            <Card width="normal" key={stateObject.id} id={"" + stateObject.id}>
              <Electrode
                state={stateObject}
                history={currentHistory}
                layout={StateLayout[stateObject.id]} />
            </Card>
          )
        })
      }
      {
        state.getDataObjectsByCategory(GetStateCategory.CANISTER_CONSUMPTION, true).map((dataObject, index) => {
          return ( state.sysInfo.isDosageEnabled(dataObject) && index == 0 && 
            <Card width="normal" key={dataObject.id} id={""+dataObject.id}>
              <Consumption state={dataObject} history={history} key={dataObject.id} />
            </Card>
          )
        })
      }
      {
        state.getDataObjectsByCategory(GetStateCategory.CANISTER, true).map((dataObject, index) => {
          return ( state.sysInfo.isDosageEnabled(dataObject) && index == 0 && 
            <Card width="normal" height="span-2" key={dataObject.id} id={""+dataObject.id}>
              <Canister state={dataObject} phControl={controller.phMinus} key="canister" />
            </Card>// TODO invalid hard coded phMinusControl
          )
        })
      }
      {
        state.getDataObjectsByCategory(GetStateCategory.RELAYS, true).map((dataObject) => {
          return (
            <Card width="normal" key={dataObject.id} id={""+dataObject.id}>
              <Relay sysInfo={state.sysInfo} state={dataObject} key={dataObject.id} dosage={
                getDosage(dosage, state, dataObject)}/>
            </Card>
          )
        })
      }
      <Card width="full"  height="span-4" id="chart">
        <div className="dosages">
          <div className="content chart-big">
            <BigLineChart states={states}
              history={currentHistory} layout={getLayout(state)} fetch={fetch} setLegend={(u: uPlot) => {
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
