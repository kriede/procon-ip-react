import React from 'react'
import ReactDOM from "react-dom/client"
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

const originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: console.debug
}

let consoleDiv = document.getElementById('console')
if (!consoleDiv) {
  consoleDiv = document.createElement('div')
  consoleDiv.id = 'console'
  document.body.appendChild(consoleDiv)
}

function appendMessage(type: string, args: any[]) {
  // Convert each argument to string; if it's an object, attempt JSON.stringify
  const message = args.map(arg => {
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg, null, 2)
      } catch (e) {
        return '[object]'
      }
    }
    return String(arg)
  }).join(" ")
  const messageElement = document.createElement('p')
  messageElement.textContent = `[${type.toUpperCase()}] ${message}`
  consoleDiv?.appendChild(messageElement)
}

(['log', 'info', 'warn', 'error', 'debug'] as const).forEach((method) => {
  const originalMethod = console[method];
  (console as any)[method] = (...args: any[]): void => {
    originalMethod.apply(console, args)
    appendMessage(method, args)
  }
})

console.log("Starting...")

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
