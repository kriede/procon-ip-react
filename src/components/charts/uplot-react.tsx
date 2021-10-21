import React, { useEffect, useRef } from "react"
import uPlot from "uplot"
import './uplot-react.scss'

export function UPlot({
  options,
  data,
  onDelete = () => {},
  onCreate = () => {}
}: {
  options: uPlot.Options,
  data: uPlot.AlignedData,
  onDelete?: (chart: uPlot) => void
  onCreate?: (chart: uPlot) => void
}) {
  
  const chartRef = useRef<uPlot | null>(null)
  const targetRef = useRef<HTMLDivElement | null>(null)

  function createChart() {
    const newChart = new uPlot(options, data, targetRef.current as HTMLDivElement)
    chartRef.current = newChart
    resize()
    onCreate(newChart)
    window.addEventListener("resize", resize)
  }

  function destroyChart(chart: uPlot | null) {
    if (chart) {
      window.removeEventListener("resize", resize)
      onDelete(chart)
      chart.destroy()
      chartRef.current = null
    }
  }

  const prevProps = useRef({options, data}).current

  function resize() {
    if (!chartRef.current || !targetRef.current) return
    const legend = targetRef.current.querySelector('.u-legend')
    chartRef.current.setSize({
      width: targetRef.current.clientWidth,
      height: targetRef.current.clientHeight /* - (legend?.getBoundingClientRect().height??0) */
    })
  }

  // componentDidMount + componentWillUnmount
  useEffect(() => {
    createChart()
    return () => {
      destroyChart(chartRef.current)
    }
  }, [])

  // componentDidUpdate
  useEffect(() => {
    const chart = chartRef.current
    if (chart) {
      chart.setData(data, prevProps.data.length != data.length)
    }
    return () => {
      prevProps.options = options
      prevProps.data = data
    }
  }, [options, data])

  return <div className="uplot-container" ref={targetRef}></div>
}
