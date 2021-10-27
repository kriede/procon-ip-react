/**
 * This file exports the [[`GetControllerService`]] as update service for dosage related information.
 * @packageDocumentation
 */

import axios, { Method, AxiosResponse, AxiosRequestConfig, AxiosPromise } from 'axios'
import { AbstractService } from 'procon-ip/lib/abstract-service'
import { IGetStateServiceConfig } from 'procon-ip/lib/get-state.service'
import { ILogger } from 'procon-ip/lib/logger'
import { GetDosage, GetBaseDosage, GetChlorineDosage, GetPhDosage } from './get-dosage'
import { GetPhControl } from './get-ph-control'
import { mockDosage } from './mock-dosage'

export interface Controller {
  phMinus: GetPhControl
  phPlus: GetPhControl
}

/**
 * The [[`GetStateService`]] implements the [[`AbstractService`]] for the
 * `/GetState.csv` endpoint.
 */
export class GetControllerService extends AbstractService {
  /**
   * Specific service endpoint.
   *
   * A path relative to the [[`IServiceConfig.controllerUrl`]].
   */
  public _endpoint = '/usr'
  
  /**
   * HTTP request method for this specific service endpoint.
   * See: `axios/Method`
   */
  public _method: Method = 'get'

  /**
   * The actual service data object with all available history data.
   */
  public data: GetDosage;
   
  /**
   * False until the service retrieved its first data.
   * @internal
   */
  private _hasData = false;

  /**
   * @internal
   */
  private next?: number;

  /**
   * @internal
   */
  private _consecutiveFailsLimit = 10;
 
  /**
   * @internal
   */
  private _consecutiveFails: number;

  /**
   * An optional callback, that can be passed when calling the
   * [[`start`]] method.
   */
  private _updateCallback?: (data: GetDosage) => any;

  /**
   * @internal
   */
  private _errorCallback?: (e: Error) => any;   
  
  /**
   * @internal
   */
  private _recentError: any;

  /**
   * Initialize a new [[`GetStateService`]].
   *
   * @param config Service configuration.
   * @param logger Service logger.
   */
  public constructor(config: IGetStateServiceConfig, logger: ILogger) {
    super(config, logger)
    this._consecutiveFailsLimit = config.errorTolerance
    this._consecutiveFails = 0
    this._requestHeaders.Accept = 'text/csv,text/plain'
    this._hasData = false
    this._updateCallback = () => {
      return
    }
    this.data = {} as GetDosage
  }

  /**
   * Get the update interval [ms].
   * 
   * The next update should happen immediatly after the next dosage action
   * starts, which is after the minimum of all positive remaining-times and
   * next-cycle times.
   */
  public getUpdateInterval(): number {
    if (!this._hasData) return 1
    return 1000 * Math.min(...[
      this.data.ChlorineDosage.remaining_time,
      this.data.PhMinusDosage.remaining_time,
      this.data.PhPlusDosage.remaining_time,
      this.data.ChlorineDosage.next_cycle,
      this.data.PhMinusDosage.next_cycle,
      this.data.PhPlusDosage.next_cycle].filter(d => d > 0))
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
  public start(callable?: (data: GetDosage) => void, errorCallback?: (e: Error) => void): void {
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
        }, this.getUpdateInterval()
        )
      )
    }
  }

  /**
   * Update data by staging a HTTP request to the pool controller.
   *
   * This method will be triggered periodically once the service
   * has been started (see [[`GetStateService.start`]]). It also
   * includes the part responsible for the execution of the
   * [[`_updateCallback`]] (see [[`start`]]).
   */
  public async update(): Promise<GetDosage> {
    try {
      this._consecutiveFails = 0
      this._recentError = null
      // this.data = (await this.GetDosage()).data
      this.data = this.parseDosage(mockDosage)
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

  /**
   * Stage request and return the corresponding `AxiosPromise`.
   */
  public async getRedoxControl(): Promise<AxiosResponse<string>> {
    const requestConfig = this.axiosRequestConfig
    requestConfig.url = 'phcntrl.ini'
    requestConfig.params = {
      a: Date.now()
    }
    return axios.request<string>(requestConfig as AxiosRequestConfig<any>)
  }

  /**
   * Stage request and return the corresponding `AxiosPromise`.
   */
  public async getPhMinusControl(): Promise<AxiosResponse<GetPhControl>> {
    const requestConfig = this.axiosRequestConfig
    requestConfig.url += '/phcntrl.ini?a=' + (Math.random()*1000).toFixed(3) //Date.now()
    requestConfig.transformResponse = (data: any, headers?: any) => {
      return this.parsePhControl(data)
    }
    return axios.request<GetPhControl>(requestConfig as AxiosRequestConfig<any>)
  }

  /**
   * Stage request and return the corresponding `AxiosPromise`.
   */
  public async getPhPlusControl(): Promise<AxiosResponse<GetPhControl>> {
    const requestConfig = this.axiosRequestConfig
    requestConfig.url += '/phcntrl.ini?a=' + Date.now()
    requestConfig.transformResponse = (data: any, headers?: any) => {
      return this.parsePhControl(data)
    }
    return axios.request<GetPhControl>(requestConfig as AxiosRequestConfig<any>)
  }

  /**
   * Starts a manual chlorine dosage for the given duration
   */
  public manualChlorineDosageStart(duration: number) {
    return this.manualDosageSet(0, duration)
  }

  /**
   * Starts a manual Ph-Minus dosage for the given duration
   */
  public manualPhMinusDosageStart(duration: number) {
    return this.manualDosageSet(1, duration)
  }

  /**
   * Starts a manual Ph-Plus dosage for the given duration
   */
  public manualPhPlusDosageStart(duration: number) {
    return this.manualDosageSet(2, duration)
  }

  /**
   * Starts a manual chlorine dosage for the given duration
   */
  public manualChlorineDosageStop() {
    return this.manualDosageSet(0, 0)
  }

  /**
   * Starts a manual Ph-Minus dosage for the given duration
   */
  public manualPhMinusDosageStop() {
    return this.manualDosageSet(1, 0)
  }

  /**
   * Starts a manual Ph-Plus dosage for the given duration
   */
  public manualPhPlusDosageStop() {
    return this.manualDosageSet(2, 0)
  }

  /**
   * Starts a manual dosage for the given dosage id and the given duration.
   * 
   * @param dosageId dosage control (0: Chlor, 1: ph-, 2: pH+)
   * @param duration duration of dosage in seconds
   */
  public manualDosageStart(dosageId: number, duration: number) {
    return this.manualDosageSet(2, duration)
  }

  /**
   * Starts a manual dosage for the given dosage is.
   * 
   * dosageId 0: Chlor, 1: ph-, 2: pH+
   */
  public manualDosageStop(dosageId: number) {
    return this.manualDosageSet(2, 0)
  }

  private async manualDosageSet(dosageId: number, duration: number): Promise<AxiosResponse<string>>{
    const requestConfig = this.axiosRequestConfig
    requestConfig.url = '/Command.htm'
    requestConfig.params = {
      MAN_DOSAGE: dosageId + ',' + duration + ',' + (Date.now()%1000000/1000)
    }
    return axios.request<string>(requestConfig as AxiosRequestConfig<any>)
  }

  public async GetDosage(): Promise<AxiosResponse<GetDosage>> {
    const requestConfig = this.axiosRequestConfig
    requestConfig.url = '/GetDos.csv'
    requestConfig.params = {
      a: Date.now()
    }
    requestConfig.transformResponse = (data: any, headers?: any) => {
      return this.parseDosage(data)
    }
    return axios.request<GetDosage>(requestConfig as AxiosRequestConfig<any>)
  }

  parseDosage: (rawData: string) => GetDosage = (rawData: string) => {
    const result = {} as GetDosage
    rawData.split(/[\r\n]+/).forEach((row, index) => {
      const [
        pump_state,
        pump_on_time,
        relais_state,
        remaining_time,
        actual_duration,
        total_duration,
        next_cycle,
        pole_reversal
      ] = row.split(',')
      const object: GetBaseDosage = {} as GetBaseDosage
      object.time = Date.now()
      object.pump_state = parseInt(pump_state) === 1
      object.pump_on_time = parseInt(pump_on_time)
      object.relais_state = parseInt(relais_state) === 1
      object.remaining_time = parseInt(remaining_time)
      object.actual_duration = parseInt(actual_duration)
      object.total_duration = parseInt(total_duration)
      object.next_cycle = parseInt(next_cycle)
      if (index == 0) {
        (object as GetChlorineDosage).pole_reversal = parseInt(pole_reversal)
        result.ChlorineDosage = object as GetChlorineDosage
      } else if (index == 1) {
        result.PhMinusDosage = object as GetPhDosage
      } else if (index == 2) {
        result.PhPlusDosage = object as GetPhDosage
      }
    })
    return result
  }

  parsePhControl: (rawData: string) => GetPhControl = (rawData: string) => {
    const result = {} as GetPhControl
    rawData.split(/[\r\n]+/).forEach((row) => {
      const [key, rawvalue] = row.split('=')
      if (key === 'FLOW') {
        const [volume, duration] = rawvalue.split(',')
        result[key] = { volume: parseFloat(volume), duration: parseFloat(duration) }
      } else if (key === 'USER') {
        const [volume, change] = rawvalue.split(',')
        result[key] = { volume: parseFloat(volume), change: parseFloat(change) }
      } else if (key === 'TARGET' || key === 'MIN_VAL' || key === 'MAX_VAL') {
        const [raw, value] = rawvalue.split(',')
        result[key] = { raw: parseFloat(raw), value: parseFloat(value) }
      } else {
        result[key] = parseFloat(rawvalue)
      }
    })
    return result
  }

}
