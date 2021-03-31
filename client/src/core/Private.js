import React, { useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import Layout from '../core/Layout'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { getCookie, isAuth, signout, updateUser } from '../auth/helpers'

export const Private = ({ history }) => {
  const [values, setValues] = useState({
    role: '',
    name: '',
    email: '',
    password: '',
    buttonText: 'Submit',
  })

  const token = getCookie('token')
  const { role, name, email, password, buttonText } = values

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = () => {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log('PRIVATE PROFILE UPDATE', response)
        const { role, name, email } = response.data
        setValues({ ...values, role, name, email })
      })
      .catch((error) => {
        console.log('profile update error', error)
        if (error.response.status === 401) {
          //if token is expires.we said 7 day.then redirect the user to homepage
          signout(() => {
            history.push('/')
          })
        }
      })
  }

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value })
  }

  const clickSubmit = (event) => {
    event.preventDefault()
    setValues({ ...values, buttonText: 'Submitting' })

    axios({
      method: 'PUT',
      url: `${process.env.REACT_APP_API}/user/update`,
      data: { name, password },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log('profile update success', response)
        //updateUser(response,next)>>changing local storage
        updateUser(response, () => {
          setValues({
            ...values,

            buttonText: 'Submitted',
          })
          toast.success('Profile updated successfully')
        })
      })
      .catch((err) => {
        console.log('profile update error', err.response.data)
        setValues({ ...values, buttonText: 'Submit' })
        toast.error(err.response.data.err)
      })
  }
  const updateForm = () => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Role</label>
        <input
          defaultValue={role}
          type='text'
          className='form-control'
          disabled
        />
      </div>
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
          defaultValue={email}
          type='email'
          className='form-control'
          disabled
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
      <h1 className='p-5'>Private</h1>
      <p className='lead text-center'>Profile Update</p>
      {updateForm()}
    </Layout>
  )
}
