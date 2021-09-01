import React, { useState } from 'react'
import { GetStateDataObject } from 'procon-ip/lib/get-state-data-object'
import { t } from '../services/appi18n'
import { relaySwitcher } from 'App'
import { isLoggedIn } from '../services/login'
import './relais.scss'

export function Relais(props: {
  relay: GetStateDataObject
}) {
  const [busy, setBusy] = useState(false)

  const value = props.relay.value as number

  const switchOn = () => {
    if (!isLoggedIn())
      setBusy(true)
    try {
      relaySwitcher.setOn(props.relay).then(r => {
        setBusy(false)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const switchOff = () => {
    setBusy(true)
    relaySwitcher.setOff(props.relay).then(r => {
      setBusy(false)
    })
  }

  const switchAuto = () => {
    setBusy(true)
    relaySwitcher.setAuto(props.relay).then(r => {
      setBusy(false)
    })
  }
  
  return (
    <div className="relais" key={props.relay.id}>
      <div className="label">{props.relay.label}</div>
      <div className={["control", value%2 == 1 ? "relais-on" : "relais-off", value>>1 == 1 ? "manual" : "automatic"].join(' ')}>
        <div className={"switch on"} onClick={switchOn}>{t("on")}</div>
        <div className={"switch auto"} onClick={switchAuto}>{value>>1 == 1 ? t("manual-2") : t("automatic-2")}</div>
        <div className={"switch off"} onClick={switchOff}>{t("off")}</div>
      </div>
      <div className={"overlay" + (busy ? " busy" : "")} />
    </div>
  )
}
