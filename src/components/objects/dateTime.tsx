import React from 'react'

export function DateTime
({
  dateTime
}: {
  dateTime?: Date
}) {
  
  return (
    <div className="temperature">
      <div className="content">
        <div className="label">Time</div>
        <div className="display">
          <div className="value">{dateTime ? dateTime.toLocaleDateString('de') : '--.--.----'}</div>
        </div>
        <div className="display small">
          <div className="value">{dateTime ? dateTime.toLocaleTimeString('de') : '--:--:--'}</div>
        </div>
      </div>
    </div>
  )
}
