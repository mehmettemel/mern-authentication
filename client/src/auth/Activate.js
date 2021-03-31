import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
const Activate = ({ match }) => {
  const [values, setValues] = useState({
    name: '',
    token: '',
    show: true,
  })

  useEffect(() => {
    let token = match.params.token
    let { name } = jwt.decode(token)
    if (token) {
      setValues({ ...values, name, token })
    }
  }, [])

  const { name, token, show } = values

  const clickSubmit = (event) => {
    event.preventDefault()

    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_API}/account-activation`,
      data: { token },
    })
      .then((response) => {
        console.log('account activation', response)
        setValues({
          ...values,
          show: false,
        })
        toast.success(response.data.message)
      })
      .catch((err) => {
        console.log('account activation', err.response.data.error)
        toast.error(err.response.data.error)
      })
  }

  const activationLink = () => {
    return (
      <div className='text-center'>
        <h1 className='p-5 '>Hey {name},You can activate your account</h1>
        <button className='btn btn-outline-primary ' onClick={clickSubmit}>
          Activate Account
        </button>
      </div>
    )
  }

  return (
    <Layout>
      <ToastContainer />
      {/* {JSON.stringify({ name, email, password })} */}
      {activationLink()}
    </Layout>
  )
}

export default Activate
