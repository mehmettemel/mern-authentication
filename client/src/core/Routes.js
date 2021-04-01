import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import App from '../App'
import Activate from '../auth/Activate'
import AdminRoute from '../auth/AdminRoute'
import Forgot from '../auth/Forgot'
import PrivateRoute from '../auth/PrivateRoute'
import Reset from '../auth/Reset'
import Signin from '../auth/Signin'
import Signup from '../auth/Signup'
import { Admin } from './Admin'
import { Private } from './Private'
const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path='/' component={App} exact />
        <Route path='/signup' component={Signup} exact />
        <Route path='/signin' component={Signin} exact />
        <Route path='/auth/activate/:token' component={Activate} exact />
        <PrivateRoute path='/private' component={Private} exact />
        <AdminRoute path='/admin' component={Admin} exact />
        <Route path='/auth/password/forgot' component={Forgot} exact />
        <Route path='/auth/password/reset/:token' component={Reset} exact />
      </Switch>
    </Router>
  )
}

export default Routes
