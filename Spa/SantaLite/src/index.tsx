import React from "react"
import "./index.css"
import App from "./App"
import "bootstrap/dist/css/bootstrap.min.css"
import { msalInstance } from './msalConfig'
import { createRoot } from 'react-dom/client'
import { MsalProvider } from "@azure/msal-react"


const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>
)
