import { GetStateData } from "procon-ip/lib/get-state-data"

export class AppState {

  /** The latest available state. */
  private _StateData: GetStateData | undefined

  /** Fetch date of [_lastStateData]. */
  private _StateDataUpdate: Date | undefined

  get StateData(): GetStateData | undefined {
    return this._StateData
  }

  /** Updates  last available state and set fetch time. */
  set StateData(data: GetStateData | undefined) {
    this._StateData = data
    this._StateDataUpdate = new Date(Date.now())
  }

  /** If current view is in edit mode. */
  public editMode = false
}
