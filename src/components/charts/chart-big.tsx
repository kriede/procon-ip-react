import React, { FC, useRef } from 'react'
import { GetStateDataObject } from 'procon-ip'
import { GetHistoryData } from '../../services/procon-ip/get-history-data'
import { AppLayout, StateLayout } from '../layout'
import { UPlot } from './uplot-react'
import uPlot, { Hooks } from 'uplot'
import { wheelZoomPlugin } from './uplot-wheel-zoom-plugin'
import { touchZoomPlugin } from './uplot-touch-zoom-plugin'
import './chart-big.scss'

interface Props {
  states: Array<GetStateDataObject>
  history: GetHistoryData
  layout: AppLayout
  axes:  Array<{}>
  setLegend:  (self: uPlot) => void
}

export const BigLineChart: FC<Props> = ({
  states,
  history,
  layout,
  axes,
  setLegend
}: Props) => {
  
  if (!history || !history.min) {
    return <></>
  }

  const targetRef = useRef<HTMLDivElement>(null)
  
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
        stroke: StateLayout[state.id].color ?? 'white',
        dash: StateLayout[state.id].dash ?? [],
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

  // https://github.com/leeoniya/uPlot/issues/474
  // https://github.com/leeoniya/uPlot/blob/cf90a6fa423bb6d0edb17dabe08b75a3f3aa87ca/src/opts.js

  const NL = "\n"

  const yyyy    = "{YYYY}"
  const NLyyyy  = NL + yyyy
  const md      = "{D}.{M}"
  const NLmd    = NL + md
  const NLmdyy  = NLmd + ".{YY}"

  const aa      = "" //"{aa}"
  const hh     = "{H}"
  const hmm     = hh + ":{mm}"
  const hmmaa   = hmm + aa
  const NLhmmaa = NL + hmmaa
  const ss      = ":{ss}"

  const _ = null

  let ms = 1,
    s  = ms * 1e3,
    m  = s  * 60,
    h  = m  * 60,
    d  = h  * 24,
    mo = d  * 30,
    y  = d  * 365

  const _timeAxisStamps = [
    //   tick incr    default          year                    month   day                   hour    min       sec   mode
    [y,           yyyy,            _,                      _,      _,                    _,      _,        _,       1],
    [d * 28,      "{MMM}",         NLyyyy,                 _,      _,                    _,      _,        _,       1],
    [d,           md,              NLyyyy,                 _,      _,                    _,      _,        _,       1],
    [h,           hh + aa,         NLmdyy,                 _,      NLmd,                 _,      _,        _,       1],
    [m,           hmmaa,           NLmdyy,                 _,      NLmd,                 _,      _,        _,       1],
    [s,           ss,              NLmdyy + " " + hmmaa,   _,      NLmd + " " + hmmaa,   _,      NLhmmaa,  _,       1],
    [ms,          ss + ".{fff}",   NLmdyy + " " + hmmaa,   _,      NLmd + " " + hmmaa,   _,      NLhmmaa,  _,       1],
  ]

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
          values: _timeAxisStamps,
          grid: {
            stroke: 'grey',
            width: 0.25,
            dash: [6, 6],
          }
        },
        ...axes],
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
        },
        chlorine: {
          auto: false,
          range: [0, 3],
        },
        percent: {
          auto: false,
          range: [0, 100],
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
    />
  )
}
