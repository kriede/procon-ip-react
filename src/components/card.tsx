import React, { ReactNode } from 'react'
import "./card.scss"

export function Card(props: {
  width: string
  height?: string
  children: ReactNode
}) {
  return (
    <div className={"card " + props.width + " " + props.height}>
      {props.children}
    </div>
  )
}