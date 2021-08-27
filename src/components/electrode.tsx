import React from 'react'
import { GetStateDataObject } from 'procon-ip/lib/get-state-data-object'
import { t } from 'services/appi18n'
import { Util } from '../util'

interface ElectrodeProps {
  data: GetStateDataObject
}

function handleClick() {
  // TODO open temperature menu
}

export function Electrode(props: ElectrodeProps) {
  const value = props.data.value as number
  return (
    <div className="visual electrode" key={props.data.id} onClick={handleClick}>
      <div className="sensor">
        <div className="label">{props.data.label}</div>
        <div className="display">
          <div className="value">{Util.roundSignificant(props.data.value, 3)}</div>
          <div className="unit">{props.data.unit}</div>
        </div>
      </div>
    </div>
  )
}
