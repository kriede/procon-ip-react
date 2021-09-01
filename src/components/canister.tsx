import React from 'react'
import { GetStateDataObject } from 'procon-ip/lib/get-state-data-object'
import { GetStateDataSysInfo } from 'procon-ip/lib/get-state-data-sys-info'
import { t } from '../services/appi18n'
import { Util } from '../util'
import './canister.scss'

function handleClick() {
  // TODO 
}

export function Canister(props: {
  data: GetStateDataObject
  sysInfo: GetStateDataSysInfo
}) {
  const value = props.data.value as number
  const color = value > 20 ? "green" : "red"
  return (
    <div className="canister" key={props.data.id} onClick={handleClick}>
      <div className="label">{t("Rest")} {t(props.data.label+"-1")}</div>
      <div className="display" key={props.data.id}>
        <div className={"level " + color} style={{ height: value + "%"}} />
        <div className="value">{Util.formatFixed(value, 0)}%</div>
      </div>
    </div>
  )
}
