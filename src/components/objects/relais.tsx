import React, { MouseEventHandler, useState } from 'react'
import { GetStateDataObject } from 'procon-ip/lib/get-state-data-object'
import { t } from '../../services/appi18n'
import { relaySwitcher } from 'App'
import { isLoggedIn } from '../../services/login'
import './relais.scss'

export function Relais({
  state,
}: {
  state: GetStateDataObject
}) {
  
  const [busy, setBusy] = useState(false)

  const value = state.value as number

  const switchOn: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (!isLoggedIn())
      setBusy(true)
    try {
      relaySwitcher.setOn(state).then(r => {
        setBusy(false)
      })
    } catch (e) {
      console.log(e)
    }
  }

  const switchOff: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setBusy(true)
    relaySwitcher.setOff(state).then(r => {
      setBusy(false)
    })
  }

  const switchAuto: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setBusy(true)
    relaySwitcher.setAuto(state).then(r => {
      setBusy(false)
    })
  }
  
  return (
    <div className="relais" key={state.id}>
      <div className="content">
        <div className="label">{state.label}</div>
        <div className={["control", value%2 == 1 ? "relais-on" : "relais-off", value>>1 == 1 ? "manual" : "automatic"].join(' ')}>
          <div className={"switch on"} onClick={switchOn}>{t("on")}</div>
          <div className={"switch auto"} onClick={switchAuto}>{t("automatic-2")}</div>
          <div className={"switch off"} onClick={switchOff}>{t("off")}</div>
        </div>
        <div className={"overlay" + (busy ? " busy" : "")} />
      </div>
    </div>
  )
}
