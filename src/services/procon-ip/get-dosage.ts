export interface GetBaseDosage {

  /**
   * Reference time for the time and duration attributes
   */
  time: number

  /**
   * State of the water pump
   */
  pump_state: boolean

  /**
   * Number of seconds for that the pump is runnning since the last stop.
   */
  pump_on_time: number

  /**
   * State of the dosage relais
  */
  relais_state: boolean

  /**
   * Remaining dosage time in seconds.
   */
  remaining_time: number

  /**
   * Actual duration of las dosage.
   */
  actual_duration: number

  /**
   * Total duration of dosage on current day.
   */
  total_duration: number

  /**
   * Number of seconds until next dosage cycle.
   */
  next_cycle: number
}

export interface GetPhDosage extends GetBaseDosage {
}

export interface GetChlorineDosage extends GetBaseDosage {

  /**
   * Number of dosage seconds until next pole reversal of electrolysis cell will start.
   */
  pole_reversal: number
}

export interface GetDosage {

  ChlorineDosage: GetChlorineDosage
  PhMinusDosage: GetPhDosage
  PhPlusDosage: GetPhDosage
}
