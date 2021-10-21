/**
 * This file exports the [[`GetControllerService`]] as central status update service
 * and the corresponding [[`IGetStateServiceConfig`]].
 * @packageDocumentation
 */

import axios, { Method, AxiosResponse, AxiosRequestConfig } from 'axios'
import { AbstractService } from 'procon-ip/lib/abstract-service'
import { IGetStateServiceConfig } from 'procon-ip/lib/get-state.service'
import { ILogger } from 'procon-ip/lib/logger'
import { GetPhControl } from './get-ph-control'

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
   * Initialize a new [[`GetStateService`]].
   *
   * @param config Service configuration.
   * @param logger Service logger.
   */
  public constructor(config: IGetStateServiceConfig, logger: ILogger) {
    super(config, logger)
    this._requestHeaders.Accept = 'text/csv,text/plain'
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
   * Stage request and return the corresponding `AxiosPromise`.
   */
  public async getRedoxControl(): Promise<AxiosResponse<string>> {
    const requestConfig = this.axiosRequestConfig
    requestConfig.url = 'phcntrl.ini?a=' + Date.now()
    return axios.request<string>(requestConfig as AxiosRequestConfig<any>)
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