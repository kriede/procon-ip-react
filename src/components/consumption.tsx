import React from 'react'
import { GetStateDataObject } from 'procon-ip/lib/get-state-data-object'
import { t } from '../services/appi18n'
import { Util } from '../util'
import './consumption.scss'

function handleClick() {
  // TODO 
}

export function Consumption(props: {
  data: GetStateDataObject
}) {
  const value = props.data.value as number
  return (
    <div className="consumption" key={props.data.id} onClick={handleClick}>
      <div className="label">{t(props.data.label)}</div>
      <div className="display">
        <div className="value">{Util.formatFixed(value, 1)}</div>
        <div className="unit">{props.data.unit}</div>
      </div>
    </div>
  )
}
