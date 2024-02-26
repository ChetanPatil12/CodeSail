import React from 'react'
import Homepage from './pages/Homepage'
import DeployPage from './pages/DeployPage'
import {BrowserRouter, Route, Routes} from 'react-router-dom'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Homepage/>}/>
      <Route path="/deployPage/:repoURL" element={<DeployPage />}/>
</Routes>
    </BrowserRouter>
  )
}

export default App
