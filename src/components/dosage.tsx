import React from 'react'
import { GetStateDataObject } from 'procon-ip/lib/get-state-data-object'
import { t } from 'services/appi18n'
import { Util } from '../util'

interface DosageProps {
  data: GetStateDataObject
  canister: GetStateDataObject
  consumption: GetStateDataObject
}

function handleClick() {
  // TODO open temperature menu
}

export function Dosage(props: DosageProps) {
  const value = props.data.value as number
  const canister = props.canister.value as number
  const consumption = props.consumption.value as number
  const color = canister > 20 ? "green" : "red"
  return (
    <div className="visual dosage" key={props.data.id} onClick={handleClick}>
      <div className="sensor">
        <div className="label">{props.data.label}</div>
        <div className="display">
          <div className="value">{Util.roundSignificant(props.data.value, 3)}</div>
          <div className="unit">{props.data.unit}</div>
        </div>
      </div>
      <div className="consumption">
        <div className="label">{t("today")}</div>
        <div className="display">
          <div className="value">{Util.formatFixed(consumption, 1)}</div>
          <div className="unit">{props.consumption.unit}</div>
        </div>
      </div>
    </div>
  )
}
