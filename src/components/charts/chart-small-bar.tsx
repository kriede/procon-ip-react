import React, { FC } from 'react'
import { ResponsiveContainer, YAxis, ReferenceLine, ReferenceDot, BarChart, Bar } from 'recharts'
import { AxisDomain } from 'recharts/types/util/types'
import { GetStateDataObject } from 'procon-ip/lib/get-state-data-object'
import { DATA_KEYS, GetHistoryData, HistoryDataPoint } from '../../services/procon-ip/get-history-data'
import { CardLayout } from '../layout'
import './chart-small.scss'

interface Props {
  state: GetStateDataObject,
  history: GetHistoryData
  layout: CardLayout
}

export const SmallBarChart: FC<Props> = ({
  state,
  history,
  layout 
}: Props) => {

  if (!history || !history.min) {
    return <></>
  }

  const domain: AxisDomain = [layout.domain.min, layout.domain.max]
  // TODO adjust domain to values outside of prefs
  
  return (
    <ResponsiveContainer width="100%" height="100%" className="chart">
      <BarChart width={100} height={100} data={history.values24h} barCategoryGap={0}>
        <Bar dataKey={DATA_KEYS[state.id]} fill={layout.color}  />
        <YAxis domain={domain} tickCount={0} mirror={true} />
        { layout && layout.criticals && layout.criticals.map((value, index) => { return (
          <ReferenceLine y={value} stroke="rgba(170, 68, 68, 0.5)" strokeWidth={1} isFront={false} key={"ref" + index}/>
        )})}
        { layout && layout.target && 
          <ReferenceLine y={layout.target} stroke="rgba(68, 170, 68, 0.5)" isFront={false} strokeWidth={1} key={"target"}/>
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
      </BarChart>
    </ResponsiveContainer>
  )
}
