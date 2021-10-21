import React from 'react'
import { GetStateDataObject } from 'procon-ip/lib/get-state-data-object'
import { GetPhControl } from 'services/procon-ip/get-ph-control'
import { t } from '../../services/appi18n'
import { Value } from './value'
import './canister.scss'

export function Canister({
  state,
  phControl,
}: {
  state: GetStateDataObject
  phControl: GetPhControl
}) {
  const value = state.value as number
  const color = value > 20 ? "green" : "red"
  return (
    <div className="canister" key={state.id}>
      <div className="content">
        <div className="column">
          <div className="label">{t("Rest")} {t(state.label+"-1")}</div>
          <div className="display" key={state.id}>
            <div className={"level " + color} style={{ height: value + "%"}} />
            <Value value={value} precision={1} unit="%"/>
          </div>
          { phControl && 
            <div>
              <Value value={phControl.CANQUANT * value / 100 / 1000} precision={0.1} unit="L" />
              <span> von </span>
              <Value value={phControl.CANQUANT / 1000} precision={0.1} unit="L"/>
              <span> übrig</span>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
