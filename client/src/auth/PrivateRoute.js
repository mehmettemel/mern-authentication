import React, { Component } from 'react'
import { Redirect, Route } from 'react-router'
import { isAuth } from './helpers'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuth() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: '/signin', state: { from: props.location } }}
        />
      )
    }
  ></Route>
)

export default PrivateRoute
