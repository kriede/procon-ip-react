import axios, { Method, AxiosResponse, AxiosRequestConfig } from 'axios'
import { AbstractService, IServiceConfig } from 'procon-ip'
import { ILogger } from 'procon-ip'
import { GetHistoryData, VALUES_PER_DAY } from './get-history-data'
import { E_ALREADY_LOCKED, Mutex, tryAcquire } from 'async-mutex'
import { todayHistory } from './mock-history-today'
import { yesterdayHistory } from './mock-history-yesterday'

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/**
 * Extend common [[`IServiceConfig`]] with special parameters that only apply to
 * the polling characteristics of this service.
 */
export interface IGetHistoryServiceConfig extends IServiceConfig {
  /**
   * Interval [ms] between two webservice polling requests.
   */
  updateInterval: number;

  /**
   * Interval [ms] between two history webservice polling requests.
   */
  historyUpdateInterval: number

  /**
   * Range [days] of history data to load.
   */
  historyRange: number

  /**
   * Define how many HTTP request errors to tolerate before raising an error.
   */
  errorTolerance: number;
}

/**
  * The [[`GetStateService`]] implements the [[`AbstractService`]] for the
  * `/GetState.csv` endpoint.
  */
export class GetHistoryService extends AbstractService {
  /**
    * Specific service endpoint.
    *
    * A path relative to the [[`IServiceConfig.controllerUrl`]].
    */
  public _endpoint_template = '/[year]/[month]/[date].csv'
  
  /**
   * Specific service endpoint.
   *
   * A path relative to the [[`IServiceConfig.controllerUrl`]].
   */
  public _endpoint = '/history'

  /**
   * HTTP request method for this specific service endpoint.
   * See: `axios/Method`
   */
  public _method: Method = 'get'

  /**
   * The actual service data object with all available history data.
   */
  public data: GetHistoryData

  /**
   * The actual service data object with history data od the last 24 hours.
   */
  private _data24h: GetHistoryData

  public get data24h() {
    // TODO maybe better to update on change of data instead of on every access
    if (!this._data24h.values || this._data24h.values[this._data24h.values.length] !== this.data.values[this.data.values.length]) {
      this._data24h.values = this.data.values.slice(-VALUES_PER_DAY)
    }
    return this._data24h
  }

  /**
   * False until the service retrieved its first data.
   * @internal
   */
  private _hasData = false

  /**
   * @internal
   */
  private next?: number

  /**
   * Initially set via [[`IGetStateServiceConfig`]].
   * Can be adjusted using the [[`setUpdateInterval`]] method.
   */
  private _updateInterval: number

  /**
   * Range [days] of history data to load.
   */
  private _historyRange: number

  /**
   * The actual service data object.
   */
  // public data: GetStateData;
 
  /**
   * @internal
   */
  private _consecutiveFailsLimit = 10
 
  /**
   * @internal
   */
  private _consecutiveFails: number
 
  /**
   * An optional callback, that can be passed when calling the
   * [[`start`]] method.
   */
  private _updateCallback?: (data: GetHistoryData) => any

  /**
   * @internal
   */
  private _errorCallback?: (e: Error) => any
  
  /**
   * @internal
   */
  private _recentError: any

  /**
   * Initialize a new [[`GetStateService`]].
   *
   * @param config Service configuration.
   * @param logger Service logger.
   */
  public constructor(config: IGetHistoryServiceConfig, logger: ILogger) {
    super(config, logger)
    this._updateInterval = config.historyUpdateInterval
    this._historyRange = config.historyRange
    this._consecutiveFailsLimit = config.errorTolerance
    this._consecutiveFails = 0
    this._requestHeaders.Accept = 'text/csv,text/plain'
    this._hasData = false
    this._updateCallback = () => {
      return
    }
    this.data = new GetHistoryData(Date.now())
    this._data24h = new GetHistoryData(Date.now())
  }

  /**
   * Get the update interval [ms].
   */
  public getUpdateInterval(): number {
    return this._updateInterval
  }

  /**
   * Start the service.
   *
   * This will periodically update the internal data and invoke the optional
   * `callable` each time new data is received.
   *
   * @param callable Will be set as [[`_updateCallback`]] and triggered
   *  periodically ([[`_updateInterval`]]) and
   */
  public start(callable?: (data: GetHistoryData) => void, errorCallback?: (e: Error) => void): void {
    if (callable !== undefined) {
      this._updateCallback = callable
    }
    if (errorCallback !== undefined) {
      this._errorCallback = errorCallback
    }
    this.autoUpdate()
  }

  /**
   * Stop the service.
   */
  public stop(): void {
    clearTimeout(this.next)
    delete this.next
    delete this._updateCallback
  }

  /**
   * Recursive wrapper for the polling mechanism. The next request/interval
   * starts after the preceding one has ended. That means a big timeout
   * ([[`IGetStateServiceConfig.timeout`]]) could cause an actual higher update
   * interval ([[`IGetStateServiceConfig.updateInterval`]]).
   */
  public autoUpdate(): void {
    this.update().catch((e) => {
      if (this._errorCallback !== undefined) this._errorCallback(e)
    })
    if (this.next === undefined) {
      this.next = Number(
        setTimeout(() => {
          delete this.next
          this.autoUpdate()
        }, this.getUpdateInterval()),
      )
    }
  }

  private fetchMutex = new Mutex()

  /**
   * Update data by staging a HTTP request to the pool controller.
   *
   * This method will be triggered periodically once the service
   * has been started (see [[`GetStateService.start`]]). It also
   * includes the part responsible for the execution of the
   * [[`_updateCallback`]] (see [[`start`]]).
   */
  public async update(): Promise<GetHistoryData> {
    try {
      this._consecutiveFails = 0
      this._recentError = null
      const now = new Date()
      const calendar = new Date()
      const today = calendar.valueOf()
      console.log("historyService.update")
      if (!this._hasData) {
        const yesterday = calendar.setDate(calendar.getDate() - 1)
        this.data = await this.getHistory(yesterday)
        setTimeout(() => {
          this.fetchHistorySince(calendar.setDate(now.getDate() - this._historyRange))
        }, 1000)
      }
      let todayData = await this.getHistory(today)
      this.data.merge(todayData)
      this._hasData = true
      if (this._updateCallback !== undefined) {
        this._updateCallback(this.data)
      }
    } catch (e: any) {
      this._consecutiveFails += 1
      if (this._consecutiveFails % this._consecutiveFailsLimit === 0 && this._recentError === e.response) {
        this.log.warn(`${this._consecutiveFails} consecutive requests failed: ${e.response ? e.response : e}`)
        this._recentError = null
        this._hasData = false
        this._consecutiveFails = 0
        throw new Error(`Unable to request data from ${this.url}`)
      } else {
        if (this._recentError !== e.response) {
          this.log.info(`${this._consecutiveFails} request(s) failed: ${e.response ? e.response : e}`)
          this._recentError = e.response
          this._consecutiveFails = 1
        } else {
          this.log.debug(`${this._consecutiveFails} request(s) failed: ${e.response ? e.response : e}`)
        }
      }
    }
    return this.data
  }

  public async getHistoryData(from: number): Promise<GetHistoryData> {
    while (from < this.data.from) {
      const newData = await this.getHistory(this.data.from)
      this.data.values = newData.values.concat(this.data.values)
    }
    return this.data
  }

  private fetchDate: number = Date.now()

  /**
  * Returns the history data for a given day.
  */
  public async fetchHistorySince(date: number) {
    this.fetchDate = date
    tryAcquire(this.fetchMutex).runExclusive(() => {
      this.fetchHistory()
    }).catch(e => {
      if (e !== E_ALREADY_LOCKED) {
        throw e
      }
    })
  }

  private fetchHistory = async() => {
    while (this.fetchDate < this.data.values[0][0]) {
      const date = new Date(this.data.values[0][0])
      const nextDate = date.setDate(date.getDate() - 1)
      let data = await this.getHistory(nextDate)
      this.data.merge(data)
    }
  }

  /**
  * Returns the history data for a given day.
  */
  public async getHistory(date: number): Promise<GetHistoryData> {
    if (window.location.host.indexOf('localhost') >= 0) {
      if (new Date(date).getDate() == new Date().getDate()) {
        this.log.debug("get mock history today")
        return new GetHistoryData(date, todayHistory)
      } else {
        this.log.debug("get mock history yesterday")
        return new GetHistoryData(date, yesterdayHistory)
      }
    }
    let cachedData = localStorage.getItem("" + date)
    if (cachedData) {
      return new GetHistoryData(date, cachedData)
    }
    const response = await this._getHistory(new Date(date))
    localStorage.setItem("" + date, response.data)
    return new GetHistoryData(date, response.data)
  }

  private delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) )
  }

  /**
  * /history/2021/sep/1may21.csv
  */
  public async _getHistory(date: Date): Promise<AxiosResponse<string>> {
    const requestConfig = this.axiosRequestConfig
    requestConfig.url += this._endpoint_template
      .replace('[year]', date.getFullYear().toString())
      .replace('[month]', months[date.getMonth()])
      .replace('[date]', date.getDate() + months[date.getMonth()] + (date.getFullYear() % 100).toString())
    return axios.request<string>(requestConfig as AxiosRequestConfig<any>)
  }

  /**
   * Tells you whether the service has most recent status information or not.
   *
   * More accurately it tells you whether the most recent request succeeded or
   * not. So it will return `true` if the reuqest succeeded and your data is
   * up to date. It will return `false` until the service retrieved its first
   * data and again if a subsequent request fails.
   */
  public get hasData(): boolean {
    return this.data.values.length > 0
  }
}
