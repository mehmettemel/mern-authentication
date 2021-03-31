import React, { Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { isAuth, signout } from '../auth/helpers'

const Layout = ({ children, match, history }) => {
  const isActive = (path) => {
    if (match.path === path) {
      return { color: '#000', fontWeight: 'bold' }
    } else {
      return { color: '#fff' }
    }
  }
  const nav = () => {
    return (
      <ul className='nav nav-tabs bg-primary'>
        <li className='nav-item'>
          <Link to='/' className=' nav-link' style={isActive('/')}>
            Home
          </Link>
        </li>
        {!isAuth() ? (
          <Fragment>
            <li className='nav-item'>
              <Link
                to='/signup'
                className='nav-link'
                style={isActive('/signup')}
              >
                Signup
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/signin'
                className=' nav-link'
                style={isActive('/signin')}
              >
                Signin
              </Link>
            </li>
          </Fragment>
        ) : (
          <Fragment>
            <li className='nav-item'>
              <Link
                to='/private'
                className=' nav-link text-light'
                style={isActive('/admin')}
              >
                {isAuth().name}
              </Link>
            </li>
            <li
              className='nav-item'
              onClick={() =>
                signout(() => {
                  history.push('/')
                })
              }
            >
              <span
                className=' nav-link text-light'
                style={{ cursor: 'pointer' }}
              >
                Signout
              </span>
            </li>
          </Fragment>
        )}
      </ul>
    )
  }
  return (
    <Fragment>
      {nav()}
      <div className='container'>{children}</div>
    </Fragment>
  )
}

export default withRouter(Layout)
