import React from 'react'
import { GetStateDataObject } from 'procon-ip'
import { Value } from './value'
import { t } from '../../services/appi18n'

interface DosageProps {
  data: GetStateDataObject
  canister: GetStateDataObject
  consumption: GetStateDataObject
}

export function Dosage({
  data,
  canister,
  consumption
}: DosageProps) {

  const color = canister.value > 20 ? "green" : "red"

  return (
    <div className="dosage" key={data.id}>
      <div className="content">
        <div className="sensor">
          <div className="label">{data.label}</div>
          <div className="display">
            <Value value={data.value} precision={3} />
            <div className="unit">{data.unit}</div>
          </div>
        </div>
        <div className="consumption">
          <div className="label">{t("today")}</div>
          <div className="display">
            <Value value={consumption.value} precision={1} />
            <div className="unit">{consumption.unit}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
