import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Layout from '../core/Layout'
import axios from 'axios'
import { authenticate, isAuth } from './helpers'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
const Signin = ({ history }) => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    buttonText: 'Submit',
  })
  const { email, password, buttonText } = values

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value })
  }

  const clickSubmit = (event) => {
    event.preventDefault()
    setValues({ ...values, buttonText: 'Submitting' })
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/signin`,
      data: { email, password },
    })
      .then((response) => {
        console.log('SIGNIN SUCCESS', response)
        // save the response (user, token) localstorage/cookie
        authenticate(response, () => {
          setValues({
            ...values,
            name: '',
            email: '',
            password: '',
            buttonText: 'Submitted',
          })
          // toast.success(`Hey ${response.data.user.name}, Welcome back!`);
          isAuth() && isAuth().role === 'admin'
            ? history.push('/admin')
            : history.push('/private')
        })
      })
      .catch((error) => {
        console.log('SIGNIN ERROR', error.response.data)
        setValues({ ...values, buttonText: 'Submit' })
        toast.error(error.response.data.error)
      })
  }
  const signinForm = () => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Email</label>
        <input
          value={email}
          type='email'
          className='form-control'
          onChange={handleChange('email')}
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Password</label>
        <input
          value={password}
          type='password'
          className='form-control'
          onChange={handleChange('password')}
        />
      </div>
      <div>
        <button className='btn btn-primary mt-4' onClick={clickSubmit}>
          {buttonText}
        </button>
      </div>
    </form>
  )
  return (
    <Layout>
      {/* {JSON.stringify(isAuth())} */}
      {/* {JSON.stringify({ name, email, password })} */}
      <ToastContainer />
      {isAuth() ? <Redirect to='/' /> : null}
      <h1 className='p-5'>Sign In</h1>
      {signinForm()}
    </Layout>
  )
}

export default Signin
