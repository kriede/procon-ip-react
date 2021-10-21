import React, { MouseEventHandler, useState } from 'react'
import { GetStateCategory, GetStateData } from 'procon-ip/lib/get-state-data'
import { GetHistoryData } from '../services/procon-ip/get-history-data'
import { Canister } from '../components/objects/canister'
import { Consumption } from '../components/objects/consumption'
import { Card } from '../components/card'
import { Electrode } from '../components/objects/electrode'
import { Analog } from '../components/objects/analog'
import { Relais } from '../components/objects/relais'
import { Temperature } from '../components/objects/temperature'
import { DashboardLayout } from '../components/layout'
import { useHistory } from 'react-router-dom'
import { Header } from '../components/header'
import './overview.scss'
import { Controller } from 'services/procon-ip/get-controller-service'

const HUGE1_CATEGORY_DEFAULT = GetStateCategory.TEMPERATURES
const HUGE2_CATEGORY_DEFAULT = GetStateCategory.TEMPERATURES
const HUGE1_INDEX_DEFAULT = 0
const HUGE2_INDEX_DEFAULT = 6
const BIG1_CATEGORY_DEFAULT = GetStateCategory.ELECTRODES
const BIG2_CATEGORY_DEFAULT = GetStateCategory.ELECTRODES
const BIG1_INDEX_DEFAULT = 0
const BIG2_INDEX_DEFAULT = 1

export const NOTHING_SELECTED = ""

export function Overview({
  state,
  history,
  controller
}: {
  state: GetStateData,
  history: GetHistoryData,
  controller: Controller
}) {

  if (!state || !state.active || !state.sysInfo) {
    return (
      <div className="nodata">Keine Daten verfügbar</div>
    )
  }

  const huge1 = state.getDataObjectsByCategory(HUGE1_CATEGORY_DEFAULT)[HUGE1_INDEX_DEFAULT]
  const huge2 = state.getDataObjectsByCategory(HUGE2_CATEGORY_DEFAULT)[HUGE2_INDEX_DEFAULT]
  const big1 = state.getDataObjectsByCategory(BIG1_CATEGORY_DEFAULT)[BIG1_INDEX_DEFAULT]
  const big2 = state.getDataObjectsByCategory(BIG2_CATEGORY_DEFAULT)[BIG2_INDEX_DEFAULT]

  const browserHistory = useHistory()

  const navigateTo = (url: string) => {
    browserHistory.push(url)
  }
  const showTemperatures: MouseEventHandler<HTMLDivElement>  = () => {
    navigateTo(GetStateCategory.TEMPERATURES)
  }

  const showElectrodes: MouseEventHandler<HTMLDivElement> = () => {
    // navigateTo(GetStateCategory.ELECTRODES)
  }

  const showConsumption: MouseEventHandler<HTMLDivElement> = () => {
    // navigateTo(GetStateCategory.CANISTER_CONSUMPTION)
  }

  const showCanisters: MouseEventHandler<HTMLDivElement> = () => {
    // navigateTo(GetStateCategory.CANISTER)
  }

  const showAnalogs: MouseEventHandler<HTMLDivElement> = () => {
    // navigateTo(GetStateCategory.ANALOG)
  }

  const showDigitals: MouseEventHandler<HTMLDivElement> = () => {
    // navigateTo(GetStateCategory.DIGITAL_INPUT)
  }

  const showRelays: MouseEventHandler<HTMLDivElement> = () => {
    // navigateTo(GetStateCategory.RELAYS)
  }

  const showDashboard: MouseEventHandler<HTMLDivElement> = () => {
    navigateTo('')
  }

  return (
    <div className="grid grid-12">
      <Header title="Pool Steuerung"/>
      <Card width="huge" onclick={showTemperatures} id={"huge-"+huge1.id}>
        <Temperature state={huge1}
          history={history}
          layout={DashboardLayout[huge1.id]}
          key={huge1.id} />
      </Card>
      <Card width="huge" onclick={showTemperatures} id={"huge-"+huge2.id}>
        <Temperature state={huge2}
          history={history}
          layout={DashboardLayout[huge2.id]}
          key={huge2.id} />
      </Card>
      <Card width="big" onclick={showElectrodes} id={"big-"+big1.id}>
        <Electrode state={big1}
          history={history}
          layout={DashboardLayout[big1.id]}
          key={big1.id} />
      </Card>
      <Card width="big" onclick={showElectrodes} id={"big-"+big2.id}>
        <Electrode state={big2}
          history={history}
          layout={DashboardLayout[big2.id]}
          key={big2.id} />
      </Card>
      {
        state.getDataObjectsByCategory(GetStateCategory.ANALOG, true).map((dataObject, index) => {
          return (
            <Card width="normal" key={dataObject.id} onclick={showAnalogs} id={""+dataObject.id}>
              <Analog state={dataObject}
                history={history}
                layout={DashboardLayout[dataObject.id]}
                key={dataObject.id}/>
            </Card>
          )
        })
      }
      {
        state.getDataObjectsByCategory(GetStateCategory.DIGITAL_INPUT, true).map((dataObject) => {
          return ( state.sysInfo.isDosageEnabled(dataObject) &&
            <Card width="normal" key={dataObject.id} onclick={showDigitals} id={""+dataObject.id}>
              <Consumption state={dataObject} history={history} key={dataObject.id} />
            </Card>
          )
        })
      }
      {
        state.getDataObjectsByCategory(GetStateCategory.CANISTER_CONSUMPTION, true).map((dataObject) => {
          return ( state.sysInfo.isDosageEnabled(dataObject) &&
            <Card width="normal" key={dataObject.id} onclick={showConsumption} id={""+dataObject.id}>
              <Consumption state={dataObject} history={history} key={dataObject.id} />
            </Card>
          )
        })
      }
      {
        state.getDataObjectsByCategory(GetStateCategory.CANISTER, true).map((dataObject) => {
          return ( state.sysInfo.isDosageEnabled(dataObject) && 
            <Card width="normal" height="span-2" key={dataObject.id} onclick={showCanisters} id={""+dataObject.id}>
              <Canister state={dataObject} phControl={controller.phMinus} key="canister" />
            </Card>
          )
        })
      }
      {
        state.getDataObjectsByCategory(GetStateCategory.RELAYS, true).map((dataObject) => {
          return (
            <Card width="normal" key={dataObject.id} onclick={showRelays} id={""+dataObject.id}>
              <Relais state={dataObject} key={dataObject.id}/>
            </Card>
          )
        })
      }
      {
        state.getDataObjectsByCategory(GetStateCategory.TEMPERATURES, true).map((dataObject, index) => {
          return (
            <Card width="normal" key={dataObject.id} onclick={showTemperatures} id={""+dataObject.id}>
              <Temperature
                state={dataObject}
                history={history}
                layout={DashboardLayout[dataObject.id]} />
            </Card>
          )
        })
      }
    </div>
  )
}
