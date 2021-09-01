import React, {useState, useEffect} from 'react'
import { currentUser } from './services/login'
import { GetStateService } from 'procon-ip/lib/get-state.service'
import { GetStateData } from 'procon-ip/lib/get-state-data'
import { Logger, LogLevel } from 'procon-ip/lib/logger'
import { Dashboard } from './components/dashboard'
import { setLanguage } from 'services/appi18n'
import { UsrcfgCgiService } from 'procon-ip/lib/usrcfg-cgi.service'
import { RelayDataInterpreter } from 'procon-ip/lib/relay-data-interpreter'
import './App.scss'

setLanguage('de')

const logger = new Logger(LogLevel.DEBUG)

var stateService: GetStateService
var interpreter: RelayDataInterpreter
export var relaySwitcher: UsrcfgCgiService

export function reconnect(url: string, username: string, password: string) {
  const config = {
    "controllerUrl": url,
    "basicAuth": username !== '' && password !== '',
    "username": username,
    "password": password,
    "updateInterval": 5000,
    "timeout": 2000,
    "errorTolerance": 3
  }
  stateService = new GetStateService(config, logger)
  interpreter = new RelayDataInterpreter(logger)
  relaySwitcher = new UsrcfgCgiService(config, logger, stateService, interpreter)
}

reconnect(window.location.origin.indexOf("localhost") >= 0 ? "http://pool.fritz.box:80" : window.location.origin, currentUser.username, currentUser.password)

export default function App() {
  const [stateData, setStateData] = useState({} as GetStateData)
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    document.title = (((Date.now() - date.getTime()) < 10000 ) ? "" : "⚠ ") + "Pool Controller"
  })

  useEffect(() => {
    stateService.start((data: GetStateData) => {
      setStateData(data)
      setDate(new Date())
    })
    return () => {
      stateService.stop()
    }
  }, [stateService])

  return (
    <div className="App">
      { !stateData.active &&
        <div className="nodata">Keine Daten verfügbar</div>
      }
      { stateData.active  && ((Date.now() - date.getTime()) > 10000)  &&
        <div className="fetchtime">Datenstand vom {date.toLocaleDateString()} um {date.toLocaleTimeString()} Uhr</div>
      }
      { stateData && stateData.active && stateData.sysInfo &&
        <Dashboard data={stateData}></Dashboard>
      }
    </div>
  )
}
