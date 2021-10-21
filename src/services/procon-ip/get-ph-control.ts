export interface GetPhControl {

  [index: string]: number | object

  /**
   * 0 = off
   * 1 = automatic
   */
  TYPE: number
  
  FILTER: number

  /**
   * Relais number of ph dosage pump
   */
  PHPUMP: number

  /**
   * Flow parameters of the dosage pump:
   * volume is a volume in ml (milli liters)
   * duration is the time in seconds for the volume to pass the pump
   */
  FLOW: { volume: number, duration: number }

  /**
   * concentration of ph-minus solution:
   * The given volume is needed to change pH by the given change. 
   */
  USER: { volume: number, change: number }

  KP_PARM: number

  /**
   * Maximum quantity per day
   */
  MAXQUANT: number

  /**
   * Delay to start dosage after pump started
   */
  DELAY: number

  /**
   * Target value of dosage control
   */
  TARGET: { raw: number, value: number }

  /**
   * minimum value of dosage control to operate
   */
  MIN_VAL: {raw: number, value: number }

  /**
   * maximum value of dosage control to operate
   */
  MAX_VAL: { raw: number, value: number }

  /**
   * Minimum dosage time
   */
  MIN_T: number

  /**
   * Maximum dosage time
   */
  MAX_T: number

  KP: number

  /**
   * Capacity of canister
   */
  CANQUANT: number

  /**
   * Last reset of canister level
   */
  LASTRST: number

  /**
   * Duration of a manually started dosage.
   */
  MDOSTIME: number
}
