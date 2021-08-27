import React, {useState, useEffect} from 'react'
import { GetStateService } from 'procon-ip/lib/get-state.service'
import { GetStateData } from 'procon-ip/lib/get-state-data'
import { Logger } from 'procon-ip/lib/logger'
import { Dashboard } from './components/dashboard'
import { AppState } from './model/appState'
import './App.css'
import { setLanguage } from 'services/appi18n'

const logger = new Logger()

const config = {
  "controllerUrl": "http://kt2avswrpdruu0hr.myfritz.net:81/",
  "basicAuth": false,
  "username": "",
  "password": "",
  "updateInterval": 5000,
  "timeout": 2000,
  "errorTolerance": 3
}

setLanguage('de')

const stateService = new GetStateService(config, logger)

const appState = new AppState()

export default function App() {
  const [state, setState] = useState({} as GetStateData)
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    document.title = (((Date.now() - date.getTime()) < 10000 ) ? "" : "⚠ ") + "Pool Controller"
  })

  useEffect(() => {
    stateService.start((data: GetStateData) => {
      setState(data)
      setDate(new Date())
    })
    return () => stateService.stop()
  }, [])    

  return (
    <div className="App">
      { !state.active &&
        <div className="nodata">Keine Daten verfügbar</div>
      }
      { state.active  && ((Date.now() - date.getTime()) > 10000)  &&
        <div className="fetchtime">Datenstand vom {date.toLocaleDateString()} um {date.toLocaleTimeString()} Uhr</div>
      }
      { state && state.active &&
        <Dashboard data={state} appState={appState}></Dashboard>
      }
    </div>
  )
}
