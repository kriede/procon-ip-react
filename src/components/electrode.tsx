import React from 'react'
import { GetStateDataObject } from 'procon-ip/lib/get-state-data-object'
import { t } from 'services/appi18n'
import { Util } from '../util'

function handleClick() {
  // TODO 
}

export function Electrode(props: {
  data: GetStateDataObject
}) {
  const value = props.data.value as number
  return (
    <div className="electrode" key={props.data.id} onClick={handleClick}>
      <div className="label">{props.data.label}</div>
      <div className="display">
        <div className="value">{Util.roundSignificant(props.data.value, 3)}</div>
        <div className="unit">{props.data.unit}</div>
      </div>
    </div>
  )
}
