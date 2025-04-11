import React, { MouseEventHandler, useEffect, useState } from 'react'
import { GetStateDataObject } from 'procon-ip'
import { t } from '../../services/appi18n'
import { controllerService, relaySwitcher } from '../../App'
import { isLoggedIn } from '../../services/login'
import './relay.scss'
import { GetStateDataSysInfo } from 'procon-ip'
import { GetBaseDosage, GetDosage } from '../../services/procon-ip/get-dosage'
import { GetStateData } from 'procon-ip'

export function Relay({
  sysInfo,
  state,
  dosage
}: {
  sysInfo: GetStateDataSysInfo
  state: GetStateDataObject
  dosage?: GetBaseDosage
}) {
  
  const [busy, setBusy] = useState(false)

  const [manualDosage, setManualDosage] = useState(false)

  const value = state.value as number
  
  const switchOn: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (!isLoggedIn())
      setBusy(true)
    try {
      const offsetRelay = 16 // TODO get from Math.min(...state.categories.relays)
      const defaultDuration = 15*60 //TODO 15min; read from controler 
      if (state.id === offsetRelay + sysInfo.chlorineDosageRelay) {
        const duration = parseInt("" + window.prompt('duration', "" + defaultDuration))
        controllerService.manualChlorineDosageStart(duration)
      } else if (state.id === offsetRelay + sysInfo.phMinusDosageRelay) {
        const duration = parseInt("" + window.prompt('duration', "" + defaultDuration))
        controllerService.manualPhMinusDosageStart(duration)
      } else if (state.id === offsetRelay + sysInfo.phPlusDosageRelay) {
        const duration = parseInt("" + window.prompt('duration', "" + defaultDuration))
        controllerService.manualPhPlusDosageStart(duration)
      } else {
        relaySwitcher.setOn(state).then(r => {
          setBusy(false)
        })
      }
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
  
  // count down to zero
  const [countdown, setCountdown] = useState(dosage ? dosage.remaining_time : 0)
  useEffect(() => {
    if (countdown && countdown <= 0) return
    const interval = setInterval(() => {
      setCountdown(c => c - 1) // TODO change to date diff
    }, 1000)
    return () => clearInterval(interval)
  }, [countdown, dosage])

  return (
    <div className="relay" key={state.id}>
      <div className="content">
        <div className="label">{state.label}</div>
        <div className={["control", value%2 === 1 ? "relay-on" : "relay-off", value>>1 === 1 ? "manual" : "automatic"].join(' ')}>
          <div className={"switch on"} onClick={switchOn}>{countdown > 0 ? countdown : (dosage ? 
            <svg height='1em' width='1em' fill="#000000" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" enableBackground="new 0 0 100 100" xmlSpace="preserve"><path fill="#ffffff" d="M24.616,60.035L46,47.689V23c0-2.209,1.791-4,4-4s4,1.791,4,4v27h-0.017  c-0.001,1.38-0.701,2.722-1.984,3.463L28.63,66.955c-0.005,0.003-0.009,0.007-0.014,0.01c-1.913,1.104-4.359,0.448-5.465-1.465  C22.047,63.587,22.703,61.141,24.616,60.035z M9.001,46.001C6.79,46.004,5,47.79,5,49.999c-0.002,2.21,1.787,4,3.999,4  c2.209,0,3.999-1.79,4.001-4.003C12.998,47.792,11.21,46.001,9.001,46.001z M16.493,26.038c-1.916-1.103-4.359-0.451-5.464,1.462  c-1.106,1.913-0.452,4.357,1.463,5.463c1.914,1.104,4.359,0.449,5.467-1.466C19.06,29.586,18.406,27.142,16.493,26.038z   M11.029,72.5c0.011,0.019,0.025,0.032,0.036,0.051l-0.012,0.007C18.843,85.977,33.367,95,50,95c24.853,0,45-20.147,45-45  S74.853,5,50,5c-2.209,0-4,1.791-4,4s1.791,4,4,4c0.003,0,0.005-0.001,0.008-0.001c20.429,0.004,36.988,16.568,36.988,37  c0,20.434-16.563,37-36.996,37c-13.732,0-25.717-7.483-32.1-18.595l-0.008,0.005c-1.131-1.838-3.52-2.46-5.4-1.373  C10.58,68.141,9.924,70.588,11.029,72.5z M32.964,12.495c-1.108-1.913-3.55-2.57-5.463-1.466c-1.915,1.103-2.57,3.547-1.465,5.463  c1.104,1.914,3.55,2.569,5.468,1.463C33.412,16.851,34.068,14.408,32.964,12.495z"></path></svg>:
            t("on"))}</div>
          <div className={"switch auto"} onClick={switchAuto}>{t("automatic-2")}</div>
          <div className={"switch off"} onClick={switchOff}>{t("off")}</div>
        </div>
        <div className={"overlay" + (busy ? " busy" : "")} />
      </div>
    </div>
  )
}

export function getDosage(dosage: GetDosage, state: GetStateData, dataObject: GetStateDataObject) {
  if (!dataObject) return undefined
  const offsetRelay = Math.min(...state.categories.relays)
  if (dataObject.id === offsetRelay + state.sysInfo.chlorineDosageRelay) return dosage.ChlorineDosage
  if (dataObject.id === offsetRelay + state.sysInfo.phMinusDosageRelay) return dosage.PhMinusDosage
  if (dataObject.id === offsetRelay + state.sysInfo.phPlusDosageRelay) return dosage.PhPlusDosage
  return undefined
}
