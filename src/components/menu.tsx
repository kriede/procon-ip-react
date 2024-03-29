import React from 'react'
import axios from 'axios'
import './menu.scss'
import { Card } from './card'
import { LinkToOverview, LinkToTemperatures, LinkToWater } from '../App'

function toProcon(name: string, data: any) {
  return data + "&" + name + "=1"
}

var str = "1234567890"
var data = ""

for (let i = 0; i < 65; i++) {
  data = data + str
}

// max data overall per ini file: 2692 bytes
// real data: max 2679 bytes

const onClick = () => {
  for (let i = 0; i < 200; i++) {
    data = data + str
    axios({
      method: 'post',
      url: 'http://pool.fritz.box/usrcfg.cgi',
      data: toProcon("test", "data1=" + data + "&data2=" + data),
      headers: {
        "Accept": 'text/csv,text/plain',
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        "Authorization": "Basic " + localStorage.SPCauth,
      },
    }).then((response) => {
      alert(response.status)
    })
  }
}

export function Menu({
  open
}: {
  open: boolean
}) {

  return (
    <div className={"navigation" + (open? " open": "")}>
      <div className="navigation-layer">
        <Card width="normal" key="navigation" id="navigation">
          <ul>
            <li><LinkToOverview /></li>
            <li><LinkToTemperatures /></li>
            <li><LinkToWater /></li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
