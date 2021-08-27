import React from 'react'
import { GetStateDataObject } from 'procon-ip/lib/get-state-data-object'
import { Util } from '../util'

interface TemperatureProps {
  data: GetStateDataObject;
}

function handleClick() {
  // TODO open temperature menu
}

export function Temperature(props: TemperatureProps) {
  const value = props.data.value as number
  return (
    <div className="visual temperature" key={props.data.id} onClick={handleClick}>
      <div className="label">{props.data.label}</div>
      <div className="display">
        <div className="value">{Util.formatFixed(value, 1)}</div>
        <div className="unit">°{props.data.unit}</div>
      </div>
    </div>
  )
}
