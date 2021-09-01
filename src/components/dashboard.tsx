import React from 'react'
import { GetStateCategory, GetStateData } from 'procon-ip/lib/get-state-data'
import { Canister } from './canister'
import { Consumption } from './consumption'
import { Card } from './card'
import { Header } from './header'
import { Electrode } from './electrode'
import { Analog } from './analog'
import { Relais } from './relais'
import { Temperature } from './temperature'
import './dashboard.scss'

export function Dashboard(props: {
  data: GetStateData
}) {
  const huge1 = props.data.getDataObjectsByCategory(GetStateCategory.TEMPERATURES)[0]
  const huge2 = props.data.getDataObjectsByCategory(GetStateCategory.TEMPERATURES)[6]
  const big1 = props.data.getDataObjectsByCategory(GetStateCategory.ELECTRODES)[0]
  const big2 = props.data.getDataObjectsByCategory(GetStateCategory.ELECTRODES)[1]
  return (
    <div className="dashboard">
      <Card width="full">
        <Header title="Pool Steuerung" />
      </Card>
      <Card width="huge">
        <Temperature data={huge1} key={huge1.id} />
      </Card>
      <Card width="huge">
        <Temperature data={huge2} key={huge2.id} />
      </Card>
      <Card width="big">
        <Electrode data={big1} key={big1.id} />
      </Card>
      <Card width="big">
        <Electrode data={big2} key={big2.id} />
      </Card>
      {
        props.data.getDataObjectsByCategory(GetStateCategory.TEMPERATURES).map((dataObject) => {
          return (
            <Card width="normal" key={dataObject.id}>
              <Temperature data={dataObject} />
            </Card>
          )
        })
      }
      {
        props.data.getDataObjectsByCategory(GetStateCategory.CANISTER_CONSUMPTION).map((dataObject) => {
          return ( props.data.sysInfo.isDosageEnabled(dataObject) &&
            <Card width="normal" key={dataObject.id}>
              <Consumption data={dataObject} key={dataObject.id} />
            </Card>
          )
        })
      }
      {
        props.data.getDataObjectsByCategory(GetStateCategory.CANISTER).map((dataObject) => {
          return ( props.data.sysInfo.isDosageEnabled(dataObject) &&
            <Card width="normal" height="span-2" key={dataObject.id}>
              <Canister data={dataObject} sysInfo={props.data.sysInfo} key="canister" />
            </Card>
          )
        })
      }
      {
        props.data.getDataObjectsByCategory(GetStateCategory.ANALOG).map((dataObject) => {
          return (
            <Card width="normal" key={dataObject.id}>
              <Analog data={dataObject} key={dataObject.id}/>
            </Card>
          )
        })
      }
      {
        props.data.getDataObjectsByCategory(GetStateCategory.RELAYS).map((dataObject) => {
          return (
            <Card width="normal" key={dataObject.id}>
              <Relais relay={dataObject} key={dataObject.id}/>
            </Card>
          )
        })
      }
    </div>
  )
}

