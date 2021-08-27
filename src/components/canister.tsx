import React from 'react'
import { GetStateDataObject } from 'procon-ip/lib/get-state-data-object'
import { GetStateDataSysInfo } from 'procon-ip/lib/get-state-data-sys-info'
import { t } from '../services/appi18n'
import { Util } from '../util'
import './canister.css'

interface CanisterProps {
  dataArray: GetStateDataObject[]
  sysInfo: GetStateDataSysInfo
}

function handleClick() {
  // TODO open temperature menu
}

export function Canister(props: CanisterProps) {
  return (
    <div className="visual canisters" key="canisters" onClick={handleClick}>
      <div className="label">{t("Rest")}</div>
      {
        props.dataArray.map((data, i) => {
          const value = data.value as number
          const color = value > 20 ? "green" : "red"
          return (data.active && 
            <div className="display">
              <div className="label">{t(data.label+"-1")}</div>
              <div className="canister">
                <div className={"level " + color} style={{ height: value + "%"}} />
                <div className="value">{Util.formatFixed(value, 0)}%</div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}
