import React from 'react'
import { GetStateDataObject } from 'procon-ip/lib/get-state-data-object'
import { Util } from '../util'
import './temperature.scss'

function handleClick() {
  // TODO 
}

export function Temperature(props: {
  data: GetStateDataObject;
}) {
  const value = props.data.value as number
  return (
    <div className="temperature" key={props.data.id} onClick={handleClick}>
      <div className="label">{props.data.label}</div>
      <div className="display">
        <div className="value">{Util.formatFixed(value, 1)}</div>
        <div className="unit">°{props.data.unit}</div>
      </div>
    </div>
  )
}
