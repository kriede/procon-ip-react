import React from 'react'
import { GetStateDataObject } from 'procon-ip/lib/get-state-data-object'
import { t } from '../services/appi18n'
import './relais.css'

interface RelaisProps {
  data: GetStateDataObject
}

function handleClick() {
  // TODO open relais menu
}

export function Relais(props: RelaisProps) {
  const value = props.data.value as number
  return (
    <div className="visual relais" key={props.data.id} onClick={handleClick}>
      <div className="label">{props.data.label}</div>
      <div className="onoff">{value%2 == 1 ? t("on") : t("off")}</div>
      <div className={value%2 == 1 ? "on" : "off"}>{value>>1 == 1 ? t("manual-2") : t("automatic-2")}</div>
    </div>
  )
}
