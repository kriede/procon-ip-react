import React, { ChangeEventHandler, useState } from 'react'
import { GetStateDataObject } from 'procon-ip/lib/get-state-data-object'
import { GetHistoryData, } from '../services/procon-ip/get-history-data'
import { CardLayout } from './layout'
import { GetHistoryService } from 'services/procon-ip/get-history.service'

export function Duration({
  onChange
}: {
  onChange: (date: number) => void
}) {

  const [duration, setDuration] = useState("24h")

  const onDurationChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    setDuration(event.target.value)
    onChange(getDate(event.target.value))
  }

  return (
    <div className="days">
      <div className="content">
        <div className="label">Zeitraum</div>
        <div className="display">
          <select value={duration} onChange={onDurationChange}>
            <option value="1d">24 Stunden</option>
            <option value="3d">3 Tage</option>
            <option value="7d">1 Woche</option>
            <option value="14d">2 Woche</option>
            <option value="28d">4 Woche</option>
            <option value="2m">2 Monate</option>
            <option value="3m">3 Monate</option>
            <option value="6m">6 Monate</option>
            <option value="1y">1 Jahr</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function getDate(duration: string, now?: number): number {
  const value = parseInt(duration.slice(0, -1))
  const unit = duration.slice(-1)
  const date = now ? new Date(now) : new Date()
  switch (unit) {
  case 'd':
    return date.setDate(date.getDate() - value)
  case 'm':
    return date.setMonth(date.getDate() - value)
  case 'y':
    return date.setFullYear(date.getFullYear() - value)
  default:
    return now ? now : date.valueOf()
  }
}