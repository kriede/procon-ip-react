export class OLDGetHistoryDataObject {

  /**
   * Object id aka column index.
   */
  public id!: number

  /**
   * Object label.
   */
  public label!: string
 
  /**
   * Raw object input value.
   */
  public raw!: Array<number>
 
  /**
   * Object value offset.
   */
  public offset!: number
 
  /**
   * Object value gain.
   */
  public gain!: number

  /**
   * key of the values in value array.
   */
  public key!: string

  /**
   * Object unit.
   */
  public unit!: string

  /**
   * Object instance category string.
   */
  public category!: string
 
  /**
   * Sub-index for each category.
   * 
   * Starts counting from `0` at the first object of the instances category.
   * Used to determine e.g. the relay IDs.
   */
  public categoryId!: number
 
  /**
   * Indicates whether the object is considered to be active.
   * 
   * Indeed this only means the name is not '_n.a._'.
   */
  public active!: boolean
 
  /**
   * Passthru all parameters to [[`GetStateDataObject.set`]].
   * 
   * @param index Column id/index
   * @param name Column or data portion name
   * @param unit Column or data portion unit (if applicable in any way)
   * @param offset Column value offset
   * @param gain Column value gain
   * @param measure Column value raw measurement
    */
  public constructor(index: number, name: string, unit: string, offset: string, gain: string, measure: Array<string>) {
    this.set(index, name, unit, offset, gain, measure)
  }

  /**
   * Set object values based on the raw input values.
   * 
   * The input values correspond to the data rows of the represented column 
   * (except the `index` paramter which indeed is the column id/index itself).
   * 
   * @param index Column id/index
   * @param name Column or data portion name
   * @param unit Column or data portion unit (if applicable in any way)
   * @param offset Column value offset
   * @param gain Column value gain
   * @param measure Column value raw measurement
   */
  public set(index: number, name: string, unit: string, offset: string, gain: string, measure: Array<string>): void {
    // Set basic object values.
    this.id = index
    this.label = name
    this.unit = unit
    this.offset = Number(offset)
    this.gain = Number(gain)
    this.raw = measure.map((m) => {
      return Number(m)
    })
    this.key = "v" + index
    this.category = this.category === undefined ? 'none' : this.category
    this.categoryId = this.categoryId === undefined ? 0 : this.categoryId
    this.active = name !== 'n.a.' // Mark object as active if it is not labeled with 'n.a.'.
  }

  /**
   * Iterate all fields of this object.
   * 
   * @param callback A user-defined callback.
   */
  public forFields(callback: (field: string) => any): void {
    Object.keys(this).forEach(callback)
  }  
}
