import React, {useState, useEffect, ReactNode } from 'react'
import { currentUser } from './services/login'
import { GetHistoryService } from './services/procon-ip/get-history.service'
import { GetHistoryData } from './services/procon-ip/get-history-data'
import { GetStateService } from 'procon-ip'
import { GetStateData } from 'procon-ip'
import { Logger, LogLevel } from 'procon-ip'
import { setLanguage } from './services/appi18n'
import { UsrcfgCgiService } from 'procon-ip'
import { RelayDataInterpreter } from 'procon-ip'
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Overview } from './pages/overview'
import { Temperatures } from './pages/temperatures'
import { Water } from './pages/water'
import { Controller, GetControllerService } from './services/procon-ip/get-controller-service' 
import { GetDosage } from './services/procon-ip/get-dosage'
import './App.scss'

setLanguage('de')

const logger = new Logger(LogLevel.WARN)

var stateService: GetStateService
var interpreter: RelayDataInterpreter

export var historyService: GetHistoryService
export var controllerService: GetControllerService
export var relaySwitcher: UsrcfgCgiService

export function reconnect(username: string, password: string) {
  const config = {
    "controllerUrl": window.location.hostname === 'localhost' ?
      "http://pool.fritz.box:80" :
      window.location.origin,
    "basicAuth": username !== '' && password !== '',
    "username": username,
    "password": password,
    "updateInterval": 1000*3,
    "historyUpdateInterval": 1000*60*5,
    "historyRange": 7*4,
    "timeout": 2000,
    "errorTolerance": 3
  }

  stateService = new GetStateService(config, logger)
  historyService = new GetHistoryService(config, logger)
  controllerService = new GetControllerService(config, logger)
  interpreter = new RelayDataInterpreter(logger)
  relaySwitcher = new UsrcfgCgiService(config, logger, stateService, interpreter)
}

reconnect(currentUser.username, currentUser.password)

export default function App() {

  // Put a warning in the window titel if anything goes wrong
  useEffect(() => {
    document.title = (date && (((Date.now() - date.getTime()) < 10000 )) ? "" : "⚠ ") + "Pool Controller"
  })

  // Provide current state of the controller
  const [state, setState] = useState(undefined as GetStateData | undefined)
  const [date, setDate] = useState(undefined as Date | undefined)
  useEffect(() => {
    stateService.start(async (state: GetStateData) => {
      setState(state)
      setDate(new Date())
    })
    return () => {
      stateService.stop()
    }
  }, [stateService])

  // Provide current dosage state of the controller
  const [dosage, setDosage] = useState({} as GetDosage)
  useEffect(() => {
    controllerService.start(async (dosage: GetDosage) => {
      setDosage(dosage)
    })
    return () => {
      controllerService.stop()
    }
  }, [controllerService])

  // Provide history data of the controller
  const [history, setHistory] = useState({} as GetHistoryData)
  const [controller, setController] = useState({} as Controller)
  useEffect(() => {
    historyService.start(async (historyData: GetHistoryData) => {
      if (!history || !history.min || history.min(0) != historyData.min(0) || history.max(0) != historyData.max(0)) {
        setHistory(Object.create(historyData))
      }
      setController({
        // TODO redox:  (await controllerService.getRedoxControl()).data,
        phMinus: (await controllerService.getPhMinusControl()).data,
        phPlus: (await controllerService.getPhPlusControl()).data
      })
    })
    return () => {
      historyService.stop()
    }
  }, [historyService])

  const clearLocalStorage = () => {
    localStorage.clear()
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={
            <Overview state={state} history={history} controller={controller} dosage={dosage}/>
          }></Route>
          <Route path="/temperatures" element={
            <Temperatures state={state} history={history}/>
          }></Route>
          <Route path="/water" element={
            <Water state={state} history={history} controller={controller} dosage={dosage}/>
          }></Route>
        </Routes>
      </Router>
      <button type="button" onClick={clearLocalStorage} >Clear localStorage</button>
    </div>
  )
}

export function LinkToOverview({children}: {children?: ReactNode}) {
  return <Link to={'/'}>{children ?? 'Overview'}</Link>
}

export function LinkToTemperatures({children}: {children?: ReactNode}) {
  return <Link to={'/temperatures'}>{children ?? 'Temeratures'}</Link>
}

export function LinkToWater({children}: {children?: ReactNode}) {
  return <Link to={'/water'}>{children ?? 'Water'}</Link>
}
