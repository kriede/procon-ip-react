import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { GETSTATE } from 'procon-ip'
import { todayHistory } from './mock-history-today'
import { yesterdayHistory } from './mock-history-yesterday'
import { GetHistoryData, VALUES_PER_DAY } from './get-history-data'
import { GetStateData } from 'procon-ip'

test('renders learn react link', () => {

  const now = new Date()
  const yesterday = new Date(new Date().setDate(now.getDate()-1))
  
  const getStateData = new GetStateData(GETSTATE)
  const historyToday = new GetHistoryData(Date.now(), todayHistory)
  const history = new GetHistoryData(yesterday.valueOf(), yesterdayHistory)
  
  expect(history.values.length).toBe(VALUES_PER_DAY)
  // expect(historyYesterday.values[1].label).toBe('Chlor')
  expect(historyToday.values[0].v0).toBeGreaterThan(0)
  expect(historyToday.values[1].v0).toBeGreaterThan(0)
  expect(history.values[0].v0).toBeGreaterThan(0)
  expect(history.values[1].v0).toBeGreaterThan(0)
  
  expect(history.values[history.values.length-1].v0).toBeGreaterThan(0)
  expect(history.values[history.values.length-2].v0).toBeGreaterThan(0)
  expect(history.values[history.values.length-3].v0).toBeGreaterThan(0)

  expect(historyToday.values.length).toBe(19)
  history.merge(historyToday)

  history.values.forEach((v) => {
    expect(v.v0).toBeGreaterThan(0)
    expect(v.v3).toBeGreaterThan(0)
    expect(v.v4).toBeGreaterThan(0)
  })
  expect(history.values.length).toBe(VALUES_PER_DAY + historyToday.values.length)
  expect(history.min(0)).toBe(1631743200000)
  expect(history.max(0)).toBe(1631845800000)

})
