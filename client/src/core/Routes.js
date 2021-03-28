import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import App from '../App'
const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path='/' component={App} />
      </Switch>
    </Router>
  )
}

export default Routes
