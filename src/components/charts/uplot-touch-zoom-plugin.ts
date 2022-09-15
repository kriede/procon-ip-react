import uPlot, { AlignedData, Options } from "uplot"

export interface touchZoomPluginOptions {
  uniform?: boolean
  xOnly?: boolean
  yOnly?: boolean
}

interface Zoom {
  x: number
  y: number
  dx: number
  dy: number
  d: number
}

export function touchZoomPlugin(pluginOptions: touchZoomPluginOptions) {

  let xMin: number, xMax: number, yMin: number, yMax: number

  function init(u: uPlot, options: Options, data: AlignedData) {
    let over = u.over
    let rect: DOMRect, oxRange: number, oyRange: number, xVal: number, yVal: number
    let fr = { x: 0, y: 0, dx: 0, dy: 0, d: 0 }
    let to = { x: 0, y: 0, dx: 0, dy: 0, d: 0 }

    function storePos(t: Zoom, e: TouchEvent) {
      let ts = e.touches

      let t0 = ts[0]
      let t0x = t0.clientX - rect.left
      let t0y = t0.clientY - rect.top

      if (ts.length === 1) {
        t.x = t0x
        t.y = t0y
        t.d = t.dx = t.dy = 1
      } else {
        let t1 = e.touches[1]
        let t1x = t1.clientX - rect.left
        let t1y = t1.clientY - rect.top

        let xMin = Math.min(t0x, t1x)
        let yMin = Math.min(t0y, t1y)
        let xMax = Math.max(t0x, t1x)
        let yMax = Math.max(t0y, t1y)

        // midpts
        t.y = (yMin + yMax) / 2
        t.x = (xMin + xMax) / 2

        t.dx = xMax - xMin
        t.dy = yMax - yMin

        // dist
        t.d = Math.sqrt(t.dx * t.dx + t.dy * t.dy)
      }
    }

    let rafPending = false

    function zoom() {
      rafPending = false

      let left = to.x
      let top = to.y

      let xFactor = pluginOptions.uniform ? fr.d / to.d : fr.dx / to.dx
      let yFactor = pluginOptions.uniform ? fr.d / to.d : fr.dy / to.dy

      if (pluginOptions.xOnly) yFactor = 1
      if (pluginOptions.yOnly) xFactor = 1

      let leftPct = left/rect.width
      let btmPct = 1 - top/rect.height

      let nxRange = oxRange * xFactor
      let nxMin = xVal - leftPct * nxRange
      let nxMax = nxMin + nxRange

      let nyRange = oyRange * yFactor
      let nyMin = yVal - btmPct * nyRange
      let nyMax = nyMin + nyRange

      u.batch(() => {
        if (!pluginOptions.yOnly) u.setScale("x", {
          min: Math.max(nxMin, xMin),
          max: Math.min(nxMax, xMax)
        })

        if (!pluginOptions.xOnly) u.setScale("y", {
          min: Math.max(nyMin, yMin),
          max: Math.min(nyMax, yMax)
        })
      })
    }

    function touchmove(e: TouchEvent) {
      storePos(to, e)

      if (!rafPending) {
        rafPending = true
        requestAnimationFrame(zoom)
      }
    }

    function mousemove(e: MouseEvent) {
      if (!e.target) return
      storePos(to, new TouchEvent(
        "touchstart", {
          touches: [ new Touch({
            identifier: 0,
            target: e.target,
            clientX: e.x,
            clientY: e.y
          })]
        }
      ))

      if (!rafPending) {
        rafPending = true
        requestAnimationFrame(zoom)
      }
    }

    const onTouchStart = function (e: TouchEvent): void {
      rect = over.getBoundingClientRect()
      storePos(fr, e)

      oxRange = u.scales.x.max! - u.scales.x.min!
      oyRange = u.scales.y.max! - u.scales.y.min!

      let left = fr.x
      let top = fr.y

      xVal = u.posToVal(left, "x")
      yVal = u.posToVal(top, "y")
    }

    over.addEventListener("touchstart", function (e: TouchEvent): void {
      onTouchStart(e)
      document.addEventListener("touchmove", touchmove, { passive: true })
    }, { passive: true })

    over.addEventListener("mousedown", function(e: MouseEvent) {
      if (!e.target) return
      onTouchStart(new TouchEvent(
        "touchstart", {
          touches: [ new Touch({
            identifier: 0,
            target: e.target,
            clientX: e.x,
            clientY: e.y
          })]
        }
      ))
      document.addEventListener("mousemove", mousemove, { passive: true })
    }, { passive: true })

    over.addEventListener("touchend", function(e: TouchEvent) {
      document.removeEventListener("touchmove", touchmove)
    }, { passive: true })

    over.addEventListener("mouseup", function(e: MouseEvent) {
      document.removeEventListener("mousemove", mousemove)
    }, { passive: true })
  }

  const setScales = (u: uPlot) => {
    xMin = u.data[0][0] //scales.x.min!
    xMax = u.data[0][u.data[0].length - 1] //scales.x.max!
    yMin = u.scales.y.min!
    yMax = u.scales.y.max!
  }

  return {
    hooks: {
      init,
      ready: setScales,
      setData: setScales
    }
  }
}