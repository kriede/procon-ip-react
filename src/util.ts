export const Util = {

  // Round to a specified number of significant digits.
  roundSignificant: function(x: number | string, digits = 1) {
    x = x as number
    if (!x) return 0
    if (digits < 1) throw "Significant digits must be 1 or greater"
    const scaleFactor = Math.floor(Math.log10(Math.abs(x)))
    const n = Math.pow(10, digits - scaleFactor - 1)
    return Math.round(x * n) / n
  },

  formatSignificant: function(value: number | string, SignificantDigits: number, FractionDigits: number): string {
    return (value as Number).toLocaleString('de-DE', {
      minimumSignificantDigits: SignificantDigits,
      maximumSignificantDigits: SignificantDigits,
      maximumFractionDigits: FractionDigits,
    })
  },

  formatFixed: function(value: number | string, FractionDigits: number): string {
    return (value as Number).toLocaleString('de-DE', {
      minimumFractionDigits: FractionDigits,
      maximumFractionDigits: FractionDigits,
    })
  }
}