import React from 'react'
import { GetStateCategory, GetStateData } from 'procon-ip'
import { GetHistoryData } from '../services/procon-ip/get-history-data'
import { Canister } from '../components/objects/canister'
import { Consumption } from '../components/objects/consumption'
import { Card } from '../components/card'
import { Electrode } from '../components/objects/electrode'
import { Analog } from '../components/objects/analog'
import { Digital } from '../components/objects/digital'
import { getDosage, Relay } from '../components/objects/relay'
import { Temperature } from '../components/objects/temperature'
import { DashboardLayout, StateLayout } from '../components/layout'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/header'
import { Controller } from '../services/procon-ip/get-controller-service'
import { GetDosage } from '../services/procon-ip/get-dosage'
import { LinkToWater, LinkToTemperatures } from '../App'
import './overview.scss'

export const NOTHING_SELECTED = ""

export function Overview({
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

  const navigate = useNavigate()

  if (!state || !state.active || !state.sysInfo) {
    return (
      <div className="nodata">Daten werden geladen, bitte warte einen Moment...</div>
    )
  }

  const huge1 = state.getDataObjectsByCategory(DashboardLayout[0].category)[DashboardLayout[0].index]
  const huge2 = state.getDataObjectsByCategory(DashboardLayout[1].category)[DashboardLayout[1].index]
  const big1 = state.getDataObjectsByCategory(DashboardLayout[2].category)[DashboardLayout[2].index]
  const big2 = state.getDataObjectsByCategory(DashboardLayout[3].category)[DashboardLayout[3].index]

  const navigateTo = (url: string) => {
    navigate(url)
  }

  return (
    <div className="grid grid-12">
      <Header title="Pool Steuerung"/>
      <Card width="huge" id={"huge-"+huge1.id}>
        <LinkToTemperatures>
          <Temperature state={huge1}
            history={history}
            layout={StateLayout[huge1.id]}
            key={huge1.id} />
        </LinkToTemperatures>
      </Card>
      <Card width="huge" id={"huge-"+huge2.id}>
        <LinkToTemperatures>
          <Temperature state={huge2}
            history={history}
            layout={StateLayout[huge2.id]}
            key={huge2.id} />
        </LinkToTemperatures>
      </Card>
      <Card width="big" id={"big-"+big1.id}>
        <LinkToWater>
          <Electrode state={big1}
            history={history}
            layout={StateLayout[big1.id]}
            key={big1.id} />
        </LinkToWater>
      </Card>
      <Card width="big" id={"big-"+big2.id}>
        <LinkToWater>
          <Electrode state={big2}
            history={history}
            layout={StateLayout[big2.id]}
            key={big2.id} />
        </LinkToWater>
      </Card>
      {
        state.getDataObjectsByCategory(GetStateCategory.ANALOG, true).map((dataObject, index) => {
          return (
            <Card width="normal" key={dataObject.id} id={""+dataObject.id}>
              <Analog state={dataObject}
                history={history}
                layout={StateLayout[dataObject.id]}
                key={dataObject.id}/>
            </Card>
          )
        })
      }
      { ((state.sysInfo.configOtherEnable & 64) === 64) &&
        state.getDataObjectsByCategory(GetStateCategory.DIGITAL_INPUT, true).filter((v,index) => index === 0).map((dataObject, index) => {
          return (
            <Card width="normal" key={dataObject.id} id={""+dataObject.id}>
              <Analog state={dataObject}
                history={history}
                layout={StateLayout[dataObject.id]}
                key={dataObject.id}/>
            </Card>
          )
        })
      }
      {
        state.getDataObjectsByCategory(GetStateCategory.DIGITAL_INPUT, true).filter(
          (c, index) => ((state.sysInfo.configOtherEnable & 64) !== 64) || index !== 0
        ).map((dataObject) => {
          return ( state.sysInfo.configOtherEnable &&
            <Card width="normal" key={dataObject.id} id={""+dataObject.id}>
              <Digital state={dataObject}
                history={history}
                layout={StateLayout[dataObject.id]}
                key={dataObject.id} />
            </Card>
          )
        })
      }
      {
        state.getDataObjectsByCategory(GetStateCategory.CANISTER_CONSUMPTION, true).map((dataObject, index) => {
          return ( state.sysInfo.isDosageEnabled(dataObject) &&
            <Card width="normal" key={dataObject.id} id={""+dataObject.id}>
              { index === 0 &&
                <LinkToWater>
                  <Consumption state={dataObject} history={history} key={dataObject.id} />
                </LinkToWater>
              }
              { index === 1 &&
                <LinkToWater>
                  <Consumption state={dataObject} history={history} key={dataObject.id} />
                </LinkToWater>
              }
              { index === 2 &&
                <LinkToWater>
                  <Consumption state={dataObject} history={history} key={dataObject.id} />
                </LinkToWater>
              }
            </Card>
          )
        })
      }
      {
        state.getDataObjectsByCategory(GetStateCategory.CANISTER, true).map((dataObject, index) => {
          return ( state.sysInfo.isDosageEnabled(dataObject) && 
            <Card width="normal" height="span-2" key={dataObject.id} id={""+dataObject.id}>
              { index === 0 &&
                <LinkToWater>
                  <Canister state={dataObject} phControl={controller.phMinus} key="canister" />
                </LinkToWater>
              }
              { index === 1 &&
                <LinkToWater>
                  <Canister state={dataObject} phControl={controller.phMinus} key="canister" />
                </LinkToWater>
              }
              { index === 2 &&
                <LinkToWater>
                  <Canister state={dataObject} phControl={controller.phMinus} key="canister" />
                </LinkToWater>
              }
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
      {
        state.getDataObjectsByCategory(GetStateCategory.TEMPERATURES, true).map((dataObject, index) => {
          return (
            <Card width="normal" id={""+dataObject.id} key={dataObject.id}>
              <LinkToTemperatures >
                <Temperature
                  state={dataObject}
                  history={history}
                  layout={StateLayout[dataObject.id]} />
              </LinkToTemperatures>
            </Card>
          )
        })
      }
    </div>
  )
}
