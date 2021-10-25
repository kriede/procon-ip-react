import React, { MouseEventHandler, ReactNode } from 'react'
import "./card.scss"

export const Card = ({
  id,
  width,
  height,
  children,
  onclick
}: {
  id: string
  width: string
  height?: string
  children?: ReactNode
  onclick?: MouseEventHandler<HTMLDivElement>
}) => {

  return (
    <div className={"card " + width + (height ? " " + height : "")}
      onClick={onclick} id={""+id}>
      {children}
    </div>
  )
}