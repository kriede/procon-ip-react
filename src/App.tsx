import React, {useState, useEffect} from 'react'
import { currentUser } from './services/login'
import { GetHistoryService } from './services/procon-ip/get-history.service'
import { GetHistoryData } from './services/procon-ip/get-history-data'
import { GetStateService } from 'procon-ip/lib/get-state.service'
import { GetStateData } from 'procon-ip/lib/get-state-data'
import { GETSTATE } from 'procon-ip/lib/mock-state'
import { Logger, LogLevel } from 'procon-ip/lib/logger'
import { setLanguage } from './services/appi18n'
import { UsrcfgCgiService } from 'procon-ip/lib/usrcfg-cgi.service'
import { RelayDataInterpreter } from 'procon-ip/lib/relay-data-interpreter'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import { Overview } from './pages/overview'
import { Temperatures } from './pages/temperatures'
import { Controller, GetControllerService } from './services/procon-ip/get-controller-service' 
import './App.scss'
import { GetDosage } from 'services/procon-ip/get-dosage'

setLanguage('de')

const logger = new Logger(LogLevel.DEBUG)

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
    document.title = (((Date.now() - date.getTime()) < 10000 ) ? "" : "⚠ ") + "Pool Controller"
  })

  // Provide current state of the controller
  const [state, setState] = useState(new GetStateData(GETSTATE) as GetStateData)
  const [date, setDate] = useState(new Date())
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
        phMinus: (await controllerService.getPhMinusControl()).data,
        phPlus: (await controllerService.getPhPlusControl()).data
      })
    })
    return () => {
      historyService.stop()
    }
  }, [historyService])

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Overview state={state} history={history} controller={controller} dosage={dosage}/>
          </Route>
          <Route path="/temperatures">
            <Temperatures state={state} history={history}/>
          </Route>
        </Switch>
      </Router>
    </div>
  )
}
