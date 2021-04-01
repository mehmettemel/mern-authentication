import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Layout from '../core/Layout'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
const Forgot = ({ history }) => {
  const [values, setValues] = useState({
    email: '',
    buttonText: 'Request password reset link',
  })
  const { email, buttonText } = values

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value })
  }

  const clickSubmit = (event) => {
    event.preventDefault()
    setValues({ ...values, buttonText: 'Submitting' })
    axios({
      method: 'PUT',
      url: `${process.env.REACT_APP_API}/forgot-password`,
      data: { email },
    })
      .then((response) => {
        console.log('FORGOT PASSWORD SUCCESS', response)
        toast.success(response.data.message)
        setValues({ ...values, buttonText: 'Requested' })
      })
      .catch((error) => {
        console.log('FORGOT PASSWORD ERROR', error.response.data)

        toast.error(error.response.data.error)
        setValues({ ...values, buttonText: 'Submit' })
      })
  }
  const passwordForgotForm = () => (
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
      <h1 className='p-5'>Forgot your password?</h1>
      <p>Please write your email address</p>
      {passwordForgotForm()}
    </Layout>
  )
}

export default Forgot
