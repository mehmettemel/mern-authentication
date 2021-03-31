import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Layout from '../core/Layout'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { isAuth } from './helpers'
const Signup = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    buttonText: 'Submit',
  })
  const { name, email, password, buttonText } = values

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value })
  }

  const clickSubmit = (event) => {
    event.preventDefault()
    setValues({ ...values, buttonText: 'Submitting' })

    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/signup`,
      data: { name, email, password },
    })
      .then((response) => {
        console.log('signup success', response)
        setValues({
          ...values,
          name: '',
          email: '',
          password: '',
          buttonText: 'Submitted',
        })
        toast.success(response.data.message)
      })
      .catch((err) => {
        console.log('signup error', err.response.data)
        setValues({ ...values, buttonText: 'Submit' })
        toast.error(err.response.data.err)
      })
  }
  const signupForm = () => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input
          value={name}
          type='text'
          className='form-control'
          onChange={handleChange('name')}
        />
      </div>
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
      <ToastContainer />
      {/* {JSON.stringify({ name, email, password })} */}
      {isAuth() ? <Redirect to='/' /> : null}
      <h1 className='p-5'>Signup</h1>
      {signupForm()}
    </Layout>
  )
}

export default Signup
