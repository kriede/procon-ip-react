import React, { FC } from 'react'
import { AreaChart, Area, ResponsiveContainer, YAxis, ReferenceLine, ReferenceDot, AxisDomain } from "recharts"
import { GetStateDataObject } from 'procon-ip/lib/get-state-data-object'
import { DATA_KEYS, GetHistoryData, HistoryDataPoint } from '../../services/procon-ip/get-history-data'
import { minMax, roundDown, roundUp } from '../../services/maths'
import { CardLayout } from '../layout'
import './chart-small.scss'

interface Props {
  state: GetStateDataObject,
  history: GetHistoryData
  layout: CardLayout
}

export const SmallLineChart: FC<Props> = ({
  state,
  history,
  layout 
}: Props) => {

  if (!history || !history.min) {
    return <></>
  }

  // adjust domain to values outside of prefs
  const domain: Readonly<[AxisDomain, AxisDomain]> = [layout.domain.min, layout.domain.max]
  
  return (
    <ResponsiveContainer width="100%" height="100%" className="chart">
      <AreaChart width={100} height={100} data={history.values24h}>
        <Area type="monotone" dataKey={DATA_KEYS[state.id]} stroke={layout.color} fill="rgba(0,0,0,0)" strokeWidth="1" />
        <YAxis domain={domain} tickCount={0} mirror={true} />
        { layout && layout.criticals && layout.criticals.map((value, index) => { return (
          <ReferenceLine y={value} isFront={false} key={"ref" + index} stroke="rgba(170, 68, 68, 0.5)" strokeDasharray="3 3" strokeWidth={1} />
        )})}
        { layout && layout.target && 
          <ReferenceLine y={layout.target} isFront={false} key={"target"} stroke="rgba(68, 170, 68, 0.5)" strokeDasharray="3 3" strokeWidth={1} />
        }
        { history.values
          .filter((p: HistoryDataPoint, i, a) => {
            return (p[state.id] === history.min(state.id) || p[state.id] === history.max(state.id)) && (i === 0 || a[i-1][state.id] !== p[state.id])
          }).map((p, index) => {
            return (
              <ReferenceDot x={p.x} y={p.y} r={2} key={index} fill={p.y === history.min(state.id) ? "#222": "#888"} stroke="#888" />
            )
          })
        }
      </AreaChart>
    </ResponsiveContainer>
  )
}
