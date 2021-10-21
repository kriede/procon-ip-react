import uPlot from "uplot"

export interface wheelMouseZoomPluginOptions {
  factor: number
  xOnly?: boolean
  yOnly?: boolean
}

export function wheelMouseZoomPlugin(pluginOptions: wheelMouseZoomPluginOptions) {

  let xMin: number, xMax: number, yMin: number, yMax: number, xRange: number, yRange: number
  
  let factor = pluginOptions.factor || 0.75

  function clamp(nRange: number, nMin: number, nMax: number, fRange: number, fMin: number, fMax: number) {
    if (nRange > fRange) {
      nMin = fMin
      nMax = fMax
    }
    else if (nMin < fMin) {
      nMin = fMin
      nMax = fMin + nRange
    }
    else if (nMax > fMax) {
      nMax = fMax
      nMin = fMax - nRange
    }

    return [nMin, nMax]
  }

  const setScales = (u: uPlot) => {
    xMin = u.data[0][0] //scales.x.min!
    xMax = u.data[0][u.data[0].length - 1] //scales.x.max!
    yMin = u.scales.y.min!
    yMax = u.scales.y.max!

    xRange = xMax - xMin
    yRange = yMax - yMin
  }

  return {
    hooks: {
      setData: setScales,

      ready: (u: uPlot) => {
        console.log("setScales wheel")

        setScales(u)

        let over = u.over
        let rect = over.getBoundingClientRect()

        // wheel drag pan
        over.addEventListener("mousedown", (e: MouseEvent) => {
          if (e.button == 1) {
          //	plot.style.cursor = "move";
            e.preventDefault()

            let left0 = e.clientX
            //	let top0 = e.clientY

            let scXMin0 = u.scales.x.min
            let scXMax0 = u.scales.x.max

            let xUnitsPerPx = u.posToVal(1, 'x') - u.posToVal(0, 'x')

            const onmove = function(e: MouseEvent) {
              e.preventDefault()

              let left1 = e.clientX
              //	let top1 = e.clientY

              let dx = xUnitsPerPx * (left1 - left0)

              u.setScale('x', {
                min: scXMin0! - dx,
                max: scXMax0! - dx,
              })
            }

            const onup = function(e: MouseEvent) {
              document.removeEventListener("mousemove", onmove)
              document.removeEventListener("mouseup", onup)
            }

            document.addEventListener("mousemove", onmove)
            document.addEventListener("mouseup", onup)
          }
        })

        // wheel scroll zoom
        over.addEventListener("wheel", e => {
          if (!e.ctrlKey) return
          e.preventDefault()

          let {left, top} = u.cursor

          let leftPct = left!/rect.width
          let btmPct = 1 - top!/rect.height
          let xVal = u.posToVal(left!, "x")
          let yVal = u.posToVal(top!, "y")
          let oxRange = u.scales.x.max! - u.scales.x.min!
          let oyRange = u.scales.y.max! - u.scales.y.min!

          let nxRange = e.deltaY < 0 ? oxRange * factor : oxRange / factor
          let nxMin = xVal - leftPct * nxRange
          let nxMax = nxMin + nxRange;
          [nxMin, nxMax] = clamp(nxRange, nxMin, nxMax, xRange, xMin, xMax)

          let nyRange = e.deltaY < 0 ? oyRange * factor : oyRange / factor
          let nyMin = yVal - btmPct * nyRange
          let nyMax = nyMin + nyRange;
          [nyMin, nyMax] = clamp(nyRange, nyMin, nyMax, yRange, yMin, yMax)

          u.batch(() => {
            if (!pluginOptions.yOnly) u.setScale("x", {
              min: nxMin,
              max: nxMax,
            })

            if (!pluginOptions.xOnly) u.setScale("y", {
              min: nyMin,
              max: nyMax,
            })
          })
        })
      }
    }
  }
}