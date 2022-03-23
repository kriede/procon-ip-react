import React, { FC, useRef } from 'react'
import { GetStateDataObject } from 'procon-ip/lib/get-state-data-object'
import { GetHistoryData } from '../../services/procon-ip/get-history-data'
import { AppLayout, CardLayout, DashboardLayout, StateLayout } from '../layout'
import { UPlot } from './uplot-react'
import uPlot, { Hooks } from 'uplot'
import { wheelZoomPlugin } from './uplot-wheel-zoom-plugin'
import { touchZoomPlugin } from './uplot-touch-zoom-plugin'
import './chart-big.scss'

interface Props {
  states: Array<GetStateDataObject>
  history: GetHistoryData
  layout: AppLayout
  fetch: (date: number) => void
  setLegend:  (self: uPlot) => void
}

export const BigLineChart: FC<Props> = ({
  states,
  history,
  layout,
  fetch,
  setLegend
}: Props) => {
  
  if (!history || !history.min) {
    return <></>
  }

  const targestRef = useRef<HTMLDivElement>(null)
  
  function CustomLegendPlugin() {
    return {
      hooks: {
        setLegend: setLegend
      } as Hooks.ArraysOrFuncs
    }
  }

  const getSeries = (value: GetStateDataObject) => {
    var result
    states.forEach((state) => {
      if (state.id === value.id) result = {
        label: value.label,
        stroke: StateLayout[state.id].color,
        value: (self: any, rawValue: number) => rawValue.toFixed(1) + "°C",
        id: state.id,
        drawStyle: 0,
        paths: uPlot.paths.spline!(),
        lineInterpolation: 4,
        scale: layout.states[state.id].scale
      } as uPlot.Series
    })
    return result || { show: false }
  }

  function getOptions(state: Array<GetStateDataObject>): uPlot.Options {
    return {
      mode: 1,
      width: 500,
      height: 300,

      series: [
        {
          // label: 'Zeit',
          // scale: 'x'
        },
        ...state.map((value) => getSeries(value))
      ],
      ms: 1,
      axes: [
        {
          stroke: 'white',
          // scale: "x",
          grid: {
            stroke: 'grey',
            width: 0.25,
            dash: [3, 3],
          }
        },
        {
          stroke: 'white',
          scale: "temperature",
          grid: {
            show: true,
            stroke: 'grey',
            width: 0.25,
            dash: [3, 3],
          }
        },
        {
          stroke: 'white',
          scale: "redox",
          show: false,
          grid: {
            show: false,
            stroke: 'grey',
            width: 0.25,
            dash: [3, 3],
          }
        },
        {
          stroke: 'white',
          scale: "pH",
          grid: {
            show: false,
            stroke: 'grey',
            width: 0.25,
            dash: [3, 3],
          }
        }
      ],
      scales: {
        x: {
          time: true
        },
        y: {
          auto: false,
          range: [0, 100],
        },
        temperature: {
          auto: false,
          range: [0, 36],
        },
        redox: {
          auto: false,
          range: [0, 1000],
        },
        pH: {
          auto: false,
          range: [6.8, 7.8],
        }
      },
      legend: {
        show: false
      },
      cursor: {
        show: true,
        x: true,
        y: false,
        drag: {
          setScale: false,
          x: true,
          y: false,
          
        },
        lock: true
      },
      plugins: [
        CustomLegendPlugin(),
        wheelZoomPlugin({factor: 0.75, xOnly: true}),
        touchZoomPlugin({uniform: false, xOnly: true})
      ]
    }
  }

  const data: uPlot.AlignedData = [
    history.values.map(v => v[0]),
    ...states.map((state) => history.values.map(v => v[state.id]))
  ]

  const options = getOptions(states)

  return (
    <UPlot
      key="class-key"
      options={options /* lastOptions */}
      data={data}
      // onDelete={() => console.log("Deleted from class")}
      // onCreate={() => console.log("Created from class")}
    />
  )
}
