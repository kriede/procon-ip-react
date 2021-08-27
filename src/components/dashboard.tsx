import React from 'react'
import { GetStateCategory, GetStateData } from 'procon-ip/lib/get-state-data'
import { Canister } from './canister'
import { Consumption } from './consumption'
import { Electrode } from './electrode'
import { Analog } from './analog'
import { Relais } from './relais'
import { Temperature } from './temperature'
import './dashboard.css'

interface DashboardProps {
  data: GetStateData
  appState: any
}

export function Dashboard(props: DashboardProps) {
  const huge1 = props.data.getDataObjectsByCategory(GetStateCategory.TEMPERATURES)[0]
  const huge2 = props.data.getDataObjectsByCategory(GetStateCategory.TEMPERATURES)[6]
  const big1 = props.data.getDataObjectsByCategory(GetStateCategory.ELECTRODES)[0]
  const big2 = props.data.getDataObjectsByCategory(GetStateCategory.ELECTRODES)[1]
  return (
    <div className="canvas">
      <div className="container">
        <div className="block hugevalues">
          <Temperature data={huge1} key={huge1.id} />
          <Temperature data={huge2} key={huge2.id} />
        </div>
      </div>
      <div className="container">
        <div className="block bigvalues">
          <Electrode data={big1} key={big1.id} />
          <Electrode data={big2} key={big2.id} />
        </div>
      </div>
      <div className="container">
        <div className="block temperatures">
          <div className="title">Temperaturen</div>
          {
            props.data.getDataObjectsByCategory(GetStateCategory.TEMPERATURES).map((dataObject) => {
              return (
                <Temperature data={dataObject} key={dataObject.id} />
              )
            })
          }
        </div>
        <div className="block water">
          <div className="title">Wasserwerte</div>
          {
            props.data.getDataObjectsByCategory(GetStateCategory.CANISTER_CONSUMPTION).map((dataObject, i) => {
              return ( props.data.sysInfo.isDosageEnabled(dataObject) &&
                <Consumption data={dataObject} key={dataObject.id} />
              )
            })
          }
          <Canister dataArray={props.data.getDataObjectsByCategory(GetStateCategory.CANISTER)} sysInfo={props.data.sysInfo} key="canister" />
          {
            props.data.getDataObjectsByCategory(GetStateCategory.ANALOG).map((dataObject) => {
              return (
                <Analog data={dataObject} key={dataObject.id}/>
              )
            })
          }
        </div>
        <div className="block relais">
          <div className="title">Relais</div>
          {
            props.data.getDataObjectsByCategory(GetStateCategory.RELAYS).map((dataObject) => {
              return (
                <Relais data={dataObject} key={dataObject.id}/>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

